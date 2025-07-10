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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const JwtAuthGuard_1 = require("../JwtAuthGuard");
const UploadService_1 = require("../services/UploadService");
let UploadController = class UploadController {
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async uploadImage(file) {
        try {
            return await this.uploadService.upload(file, 'image');
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async uploadVideo(file) {
        try {
            return await this.uploadService.upload(file, 'video');
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)('video'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadVideo", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.UseGuards)(JwtAuthGuard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/uploads'),
    __metadata("design:paramtypes", [UploadService_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map