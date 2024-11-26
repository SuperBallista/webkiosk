// photo.controller.ts
import { Controller, Get, Query, Body, Post, Headers, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { PhotoService } from './photo.service';
import { multerOptions } from './multer.config';
import * as jwt from 'jsonwebtoken';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Get('/load')
  async getPhotos(@Query('id') id: string) {
    console.log(id);
    return await this.photoService.loadPhotos(id);
  }

  @Post('upload')
  @UseInterceptors(AnyFilesInterceptor(multerOptions)) // 모든 필드 처리
  async uploadPhotos(
    @UploadedFiles() files: Express.Multer.File[],
    @Headers('Authorization') authorization: string,
    @Headers('FileTitle') fileTitle: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Files are required');
    }

    const decodedFileName = decodeURIComponent(fileTitle);

    if (!authorization) {
      throw new BadRequestException('Authorization header is required');
    }

    const token = authorization.replace('Bearer ', '');
    const decoded = jwt.decode(token) as { id: string };

    if (!decoded?.id) {
      throw new BadRequestException('Invalid token');
    }

    console.log(`Uploading photos for user ID: ${decoded.id}`);

    // 파일 배열 처리
    return await Promise.all(
      files.map(async (file) => {
        const result = await this.photoService.uploadPhoto(decoded.id, file, decodedFileName);
        return {
          message: 'File uploaded successfully',
          fileUrl: result.src, // 업로드된 파일 URL 반환
        };
      }),
    );
  }

  @Post('delete')
  async deletePhoto(@Body() body: { id: string }, @Headers('Authorization') authorization: string) {
    if (!body.id) {
      throw new BadRequestException('Photo ID is required');
    }

    if (!authorization) {
      throw new BadRequestException('Authorization header is required');
    }

    const token = authorization.replace('Bearer ', '');
    const decoded = jwt.decode(token) as { id: string };

    if (!decoded?.id) {
      throw new BadRequestException('Invalid token');
    }

    console.log(`Deleting photo for user ID: ${decoded.id}`);
    return await this.photoService.deletePhoto(body.id);
  }
}