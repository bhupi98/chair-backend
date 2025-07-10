import { IsOptional, IsString, IsArray } from 'class-validator';

export class ProfileUpdateDto {
    @IsOptional() @IsString() name?: string;
    @IsOptional() @IsString() phoneNumber?: string;
    @IsOptional() @IsString() email?: string;
    @IsOptional() @IsArray() skills?: string[];
    @IsOptional() @IsString() experience?: string;
    @IsOptional() @IsString() websiteUrl?: string;
    @IsOptional() @IsString() avatarUrl?: string;
    @IsOptional() @IsArray() portfolioImages?: string[];
    @IsOptional() @IsArray() idProofImages?: string[];
}
