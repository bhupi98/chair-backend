// src/controllers/upload.controller.ts
import { Controller, Post, UseInterceptors, UploadedFile, Body, BadRequestException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/JwtAuthGuard';


import { UploadService } from 'src/services/UploadService';
//@UseGuards(JwtAuthGuard) 
@Controller('api/uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file')) // 'file' is the field name in the form-data
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      return await this.uploadService.upload(file, 'image');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    try {
      return await this.uploadService.upload(file, 'video');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
