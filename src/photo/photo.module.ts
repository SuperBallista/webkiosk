// photo.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './photo.entity';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { CloudinaryProvider } from './cloudinary.provider';


@Module({
  imports: [TypeOrmModule.forFeature([Photo])], // Photo 엔티티 등록
  controllers: [PhotoController],
  providers: [PhotoService, CloudinaryProvider],
})
export class PhotoModule {}
