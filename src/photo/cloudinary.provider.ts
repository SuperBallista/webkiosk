import { v2 as cloudinary } from 'cloudinary';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider: Provider = {
  provide: 'CLOUDINARY',
  useFactory: (configService: ConfigService) => {
    cloudinary.config({
      cloud_name: configService.get<string>('CLOUD_NAME'),
      api_key: configService.get<string>('CLOUD_API_KEY'),
      api_secret: configService.get<string>('CLOUD_API_SECRET'),
    });
    return cloudinary;
  },
  inject: [ConfigService],
};