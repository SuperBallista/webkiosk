import { PhotoService } from './photo.service';
export declare class PhotoController {
    private readonly photoService;
    constructor(photoService: PhotoService);
    getPhotos(id: string): Promise<import("./photo.entity").Photo[]>;
    uploadPhotos(files: Express.Multer.File[], authorization: string, fileTitle: string): Promise<{
        message: string;
        fileUrl: string;
    }[]>;
    deletePhoto(body: {
        id: string;
    }, authorization: string): Promise<{
        message: string;
    }>;
}
