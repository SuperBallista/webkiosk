import * as multer from 'multer';
export declare const multerOptions: {
    storage: multer.StorageEngine;
    fileFilter: (req: any, file: any, cb: any) => void;
    limits: {
        fileSize: number;
    };
};
