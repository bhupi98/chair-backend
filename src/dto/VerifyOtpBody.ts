import {IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Max, Min} from "class-validator";


export class VerifyOtpBody {

   
    @IsString()
    @IsPhoneNumber(null)
    @IsNotEmpty()
    phone: string;

  
    @IsNumber()
    @IsNotEmpty()
    @Min(100000, { message: 'OTP must be a 6-digit number.' }) // Minimum 6-digit value
    @Max(999999, { message: 'OTP must be a 6-digit number.' }) // Maximum 6-digit value
    otp: number;
    
    @IsString()
    @IsNotEmpty()
    deviceType:string

    @IsString()
    @IsNotEmpty()
    deviceId:string

    @IsString()
    @IsNotEmpty()
    userType:string
}
