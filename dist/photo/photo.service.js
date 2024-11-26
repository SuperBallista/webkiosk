"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const photo_entity_1 = require("./photo.entity");
const cloudinary_1 = require("cloudinary");
let PhotoService = class PhotoService {
    constructor(photoRepository) {
        this.photoRepository = photoRepository;
    }
    async loadPhotos(userId) {
        console.log('Fetching photos for user_id:', userId);
        const results = await this.photoRepository.find({
            where: { user_id: userId },
        });
        console.log('Query Results:', results);
        return results;
    }
    async uploadToCloudinary(file) {
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.upload_stream({ folder: 'uploads' }, (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(error);
                }
                else {
                    console.log('Cloudinary upload result:', result);
                    resolve(result);
                }
            }).end(file.buffer);
        });
    }
    async uploadPhoto(userId, file, fileTitle) {
        try {
            const uploadResult = await this.uploadToCloudinary(file);
            console.log('Cloudinary upload result:', uploadResult);
            const newPhoto = this.photoRepository.create({
                img_id: uploadResult.public_id,
                user_id: userId,
                src: uploadResult.secure_url,
                title: fileTitle,
            });
            console.log('Creating photo record in DB:', newPhoto);
            const savedPhoto = await this.photoRepository.save(newPhoto);
            console.log('Photo saved to database:', savedPhoto);
            return savedPhoto;
        }
        catch (error) {
            console.error('Error during photo upload or DB save:', error);
            throw new Error('Failed to upload and save photo');
        }
    }
    async deletePhoto(photoId) {
        const photo = await this.photoRepository.findOne({ where: { img_id: photoId } });
        if (!photo) {
            throw new Error('Photo not found');
        }
        if (!photo.img_id) {
            throw new Error('Invalid photo URL');
        }
        await new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.destroy(photo.img_id, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
        });
        await this.photoRepository.delete({ img_id: photoId });
        return { message: 'Photo deleted successfully' };
    }
};
exports.PhotoService = PhotoService;
exports.PhotoService = PhotoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(photo_entity_1.Photo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PhotoService);
//# sourceMappingURL=photo.service.js.map