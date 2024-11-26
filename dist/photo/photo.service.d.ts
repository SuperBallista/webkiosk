import { Repository } from 'typeorm';
import { Photo } from './photo.entity';
export declare class PhotoService {
    private readonly photoRepository;
    constructor(photoRepository: Repository<Photo>);
    loadPhotos(userId: string): Promise<Photo[]>;
    uploadToCloudinary(file: Express.Multer.File): Promise<any>;
    uploadPhoto(userId: string, file: Express.Multer.File, fileTitle: string): Promise<Photo>;
    deletePhoto(photoId: string): Promise<{
        message: string;
    }>;
}
