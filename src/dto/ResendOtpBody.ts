import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class ResendOtpBody {
    @IsString()
    @IsPhoneNumber(null)
    @IsNotEmpty()
    phone: string; // Phone number

    @IsString()
    @IsNotEmpty()
    deviceType:string

    @IsString()
    @IsNotEmpty()
    deviceId:string
    
  }