import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as config from 'config';
import * as path from 'path';
import { S3 } from 'aws-sdk';
import * as uuid from 'uuid';
import UploadFile from 'src/schemas/uploadFile';


//const s3Config = config.get('aws').get('s3');
const bucket = process.env.AWS_BUCKET

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  // Supported file types for image and video upload
  private readonly allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  private readonly allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mkv'];
  private readonly maxFileSize = 16 * 1024 * 1024; // 16MB file size limit, as per WhatsApp

  async upload(file: Express.Multer.File, type: 'image' | 'video') {
    // Validate file type
    this.validateFileType(file, type);

    // Validate file size
    this.validateFileSize(file);

    // Call specific upload based on type
    switch (type) {
      case 'image':
        return this.uploadImage(file);
      case 'video':
        return this.uploadVideo(file);
      default:
        throw new BadRequestException('Invalid file type');
    }
  }

  async delete(file: UploadFile) {
    if (file?.path && file?.folder) {
      const Key = file.path;
      const Bucket = file.folder;
      //@ts-ignore
      return this.getS3().deleteObject({ Key, Bucket }).promise();
    }
  }

  private validateFileType(file: Express.Multer.File, type: 'image' | 'video') {
    const fileType = file.mimetype;

    if (type === 'image' && !this.allowedImageTypes.includes(fileType)) {
      throw new BadRequestException('Invalid image format. Only JPEG, PNG, and GIF are allowed.');
    }

    if (type === 'video' && !this.allowedVideoTypes.includes(fileType)) {
      throw new BadRequestException('Invalid video format. Only MP4, AVI, and MKV are allowed.');
    }
  }

  private validateFileSize(file: Express.Multer.File) {
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`File size exceeds the 16MB limit. Current size: ${file.size / 1024 / 1024}MB`);
    }
  }

  private async uploadImage(file: Express.Multer.File) {
    const { originalname, buffer } = file;
    const fileExtension = path.extname(originalname).toLowerCase();
    const uniqueFileName = `${uuid.v4()}${fileExtension}`; // Generate unique name using uuid

    return this.uploadToS3(buffer, uniqueFileName, 'images');
  }

  private async uploadVideo(file: Express.Multer.File) {
    const { originalname, buffer } = file;
    const fileExtension = path.extname(originalname).toLowerCase();
    const uniqueFileName = `${uuid.v4()}${fileExtension}`; // Generate unique name using uuid

    return this.uploadToS3(buffer, uniqueFileName, 'videos');
  }

  private async uploadToS3(fileBuffer: Buffer, fileName: string, folder: string) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: `${folder}/${fileName}`,
      Body: fileBuffer,
      ACL: 'public-read', // File will be publicly accessible
    };

    try {
      const data = await s3.upload(params).promise();
      console.log("data",data)
      return data; // Return uploaded file information (e.g., URL)
    } catch (error) {
      this.logger.error(`Error uploading file to S3: ${error.message}`);
      throw new BadRequestException('Error uploading file to S3');
    }
  }
  static serialize(uploadFile: UploadFile) {
    if (!uploadFile) return null;
    if (typeof uploadFile.path === "string" && uploadFile.folder && uploadFile.path) return `https://${uploadFile.folder}.s3.amazonaws.com/${uploadFile.path}`
    else if (uploadFile.path && uploadFile.path.constructor === Array) {
        const images = [];
        uploadFile.path.forEach((imgPath, index) => {
            images.push(`https://${uploadFile.folder[index]}.s3.amazonaws.com/${imgPath}`);
        })
        return images;
    }
    return null;
}
  private getS3() {
    return new S3({
      accessKeyId: process.env.ACCESS_KEY_ID ,
      secretAccessKey: process.env.SECRET_ACCESS_KEY ,
      region: process.env.REGION 
    });
  }
}
