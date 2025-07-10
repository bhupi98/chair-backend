import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
export class LogoutBody {
    @IsString()
  
    @IsNotEmpty()
    refreshToken: string; // Refresh token to invalidate

    @IsString()
    @IsNotEmpty()
    deviceType:string

    @IsString()
    @IsNotEmpty()
    deviceId:string   // Device ID for logout
  }