// src/dto/update-profile.dto.ts
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateProfileDTO {
  @IsOptional() // Make it optional if not provided
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string; // This will store the URL of the uploaded avatar
}
