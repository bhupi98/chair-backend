import { S3 } from 'aws-sdk';
import UploadFile from 'src/schemas/uploadFile';
export declare class UploadService {
    private readonly logger;
    private readonly allowedImageTypes;
    private readonly allowedVideoTypes;
    private readonly maxFileSize;
    upload(file: Express.Multer.File, type: 'image' | 'video'): Promise<S3.ManagedUpload.SendData>;
    delete(file: UploadFile): Promise<import("aws-sdk/lib/request").PromiseResult<S3.DeleteObjectOutput, import("aws-sdk").AWSError>>;
    private validateFileType;
    private validateFileSize;
    private uploadImage;
    private uploadVideo;
    private uploadToS3;
    static serialize(uploadFile: UploadFile): string | any[];
    private getS3;
}
