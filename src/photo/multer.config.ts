import { v2 as cloudinary } from 'cloudinary';
import * as multer from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ConfigService } from '@nestjs/config';

export const CloudinaryConfig = (configService: ConfigService) => {
  cloudinary.config({
    cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
    api_key: configService.get<string>('CLOUDINARY_API_KEY'),
    api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
  });
};

export const multerOptions: MulterOptions = {
  storage: multer.memoryStorage(), 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 최대 파일 크기: 5MB
  },
};