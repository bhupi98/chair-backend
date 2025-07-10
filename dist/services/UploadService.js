"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const path = require("path");
const aws_sdk_1 = require("aws-sdk");
const uuid = require("uuid");
const bucket = process.env.AWS_BUCKET;
let UploadService = UploadService_1 = class UploadService {
    constructor() {
        this.logger = new common_1.Logger(UploadService_1.name);
        this.allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        this.allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mkv'];
        this.maxFileSize = 16 * 1024 * 1024;
    }
    async upload(file, type) {
        this.validateFileType(file, type);
        this.validateFileSize(file);
        switch (type) {
            case 'image':
                return this.uploadImage(file);
            case 'video':
                return this.uploadVideo(file);
            default:
                throw new common_1.BadRequestException('Invalid file type');
        }
    }
    async delete(file) {
        if (file?.path && file?.folder) {
            const Key = file.path;
            const Bucket = file.folder;
            return this.getS3().deleteObject({ Key, Bucket }).promise();
        }
    }
    validateFileType(file, type) {
        const fileType = file.mimetype;
        if (type === 'image' && !this.allowedImageTypes.includes(fileType)) {
            throw new common_1.BadRequestException('Invalid image format. Only JPEG, PNG, and GIF are allowed.');
        }
        if (type === 'video' && !this.allowedVideoTypes.includes(fileType)) {
            throw new common_1.BadRequestException('Invalid video format. Only MP4, AVI, and MKV are allowed.');
        }
    }
    validateFileSize(file) {
        if (file.size > this.maxFileSize) {
            throw new common_1.BadRequestException(`File size exceeds the 16MB limit. Current size: ${file.size / 1024 / 1024}MB`);
        }
    }
    async uploadImage(file) {
        const { originalname, buffer } = file;
        const fileExtension = path.extname(originalname).toLowerCase();
        const uniqueFileName = `${uuid.v4()}${fileExtension}`;
        return this.uploadToS3(buffer, uniqueFileName, 'images');
    }
    async uploadVideo(file) {
        const { originalname, buffer } = file;
        const fileExtension = path.extname(originalname).toLowerCase();
        const uniqueFileName = `${uuid.v4()}${fileExtension}`;
        return this.uploadToS3(buffer, uniqueFileName, 'videos');
    }
    async uploadToS3(fileBuffer, fileName, folder) {
        const s3 = this.getS3();
        const params = {
            Bucket: bucket,
            Key: `${folder}/${fileName}`,
            Body: fileBuffer,
            ACL: 'public-read',
        };
        try {
            const data = await s3.upload(params).promise();
            console.log("data", data);
            return data;
        }
        catch (error) {
            this.logger.error(`Error uploading file to S3: ${error.message}`);
            throw new common_1.BadRequestException('Error uploading file to S3');
        }
    }
    static serialize(uploadFile) {
        if (!uploadFile)
            return null;
        if (typeof uploadFile.path === "string" && uploadFile.folder && uploadFile.path)
            return `https://${uploadFile.folder}.s3.amazonaws.com/${uploadFile.path}`;
        else if (uploadFile.path && uploadFile.path.constructor === Array) {
            const images = [];
            uploadFile.path.forEach((imgPath, index) => {
                images.push(`https://${uploadFile.folder[index]}.s3.amazonaws.com/${imgPath}`);
            });
            return images;
        }
        return null;
    }
    getS3() {
        return new aws_sdk_1.S3({
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
            region: process.env.REGION
        });
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)()
], UploadService);
//# sourceMappingURL=UploadService.js.map