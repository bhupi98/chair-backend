import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
export class RefreshTokenBody {
    @IsString()
    @IsPhoneNumber(null)
    @IsNotEmpty()
    refreshToken: string; // Refresh token from client

    @IsString()
    @IsNotEmpty()
    deviceType:string

    @IsString()
    @IsNotEmpty()
    deviceId:string
  }