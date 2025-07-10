import { UploadService } from 'src/services/UploadService';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadImage(file: Express.Multer.File): Promise<import("aws-sdk/clients/s3").ManagedUpload.SendData>;
    uploadVideo(file: Express.Multer.File): Promise<import("aws-sdk/clients/s3").ManagedUpload.SendData>;
}
