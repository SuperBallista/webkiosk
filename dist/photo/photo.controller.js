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
exports.PhotoController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const photo_service_1 = require("./photo.service");
const multer_config_1 = require("./multer.config");
const jwt = require("jsonwebtoken");
let PhotoController = class PhotoController {
    constructor(photoService) {
        this.photoService = photoService;
    }
    async getPhotos(id) {
        console.log(id);
        return await this.photoService.loadPhotos(id);
    }
    async uploadPhotos(files, authorization, fileTitle) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('Files are required');
        }
        const decodedFileName = decodeURIComponent(fileTitle);
        if (!authorization) {
            throw new common_1.BadRequestException('Authorization header is required');
        }
        const token = authorization.replace('Bearer ', '');
        const decoded = jwt.decode(token);
        if (!decoded?.id) {
            throw new common_1.BadRequestException('Invalid token');
        }
        console.log(`Uploading photos for user ID: ${decoded.id}`);
        return await Promise.all(files.map(async (file) => {
            const result = await this.photoService.uploadPhoto(decoded.id, file, decodedFileName);
            return {
                message: 'File uploaded successfully',
                fileUrl: result.src,
            };
        }));
    }
    async deletePhoto(body, authorization) {
        if (!body.id) {
            throw new common_1.BadRequestException('Photo ID is required');
        }
        if (!authorization) {
            throw new common_1.BadRequestException('Authorization header is required');
        }
        const token = authorization.replace('Bearer ', '');
        const decoded = jwt.decode(token);
        if (!decoded?.id) {
            throw new common_1.BadRequestException('Invalid token');
        }
        console.log(`Deleting photo for user ID: ${decoded.id}`);
        return await this.photoService.deletePhoto(body.id);
    }
};
exports.PhotoController = PhotoController;
__decorate([
    (0, common_1.Get)('/load'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "getPhotos", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)(multer_config_1.multerOptions)),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Headers)('Authorization')),
    __param(2, (0, common_1.Headers)('FileTitle')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, String]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "uploadPhotos", null);
__decorate([
    (0, common_1.Post)('delete'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('Authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "deletePhoto", null);
exports.PhotoController = PhotoController = __decorate([
    (0, common_1.Controller)('photo'),
    __metadata("design:paramtypes", [photo_service_1.PhotoService])
], PhotoController);
//# sourceMappingURL=photo.controller.js.map