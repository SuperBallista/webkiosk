import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';
import { v2 as cloudinary} from 'cloudinary';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>, // PhotoRepository 주입
  ) {  }

  // 1. 특정 user_id로 사진 조회
  async loadPhotos(userId: string): Promise<Photo[]> {

    const results = await this.photoRepository.find({
      where: { user_id: userId }, // user_id가 일치하는 조건
    });

    return results;
  }

  async uploadToCloudinary(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'uploads' }, // Cloudinary 폴더 설정
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        },
      ).end(file.buffer); // 메모리에 저장된 파일 데이터를 전송
    });
  }
  async uploadPhoto(userId: string, file: Express.Multer.File, fileTitle: string): Promise<Photo> {
   
    try {
      // Cloudinary에 파일 업로드
      const uploadResult = await this.uploadToCloudinary(file);
  
      // DB에 파일 정보 저장
      const newPhoto = this.photoRepository.create({
        img_id: uploadResult.public_id,
        user_id: userId,
        src: uploadResult.secure_url, // Cloudinary URL
        title: fileTitle, // 파일 이름
      });
  
      const savedPhoto = await this.photoRepository.save(newPhoto);
      console.log('Photo saved to database:', savedPhoto);
  
      return savedPhoto;
    } catch (error) {
      console.error('Error during photo upload or DB save:', error);
      throw new Error('Failed to upload and save photo');
    }
  }
    

  // 파일 삭제 메서드
  async deletePhoto(photoId: string): Promise<{ message: string }> {
    // 데이터베이스에서 사진 조회
    const photo = await this.photoRepository.findOne({ where: { img_id: photoId } });

    if (!photo) {
      throw new Error('Photo not found');
    }

    // Cloudinary에서 파일 삭제
    if (!photo.img_id) {
      throw new Error('Invalid photo URL');
    }

    await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(photo.img_id, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });

    // 데이터베이스에서 사진 삭제
    await this.photoRepository.delete({ img_id: photoId });

    return { message: 'Photo deleted successfully' };
  }


}
