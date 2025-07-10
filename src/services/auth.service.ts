import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as config from 'config';
import { Model } from 'mongoose';
import { VerifyOtpBody } from 'src/dto/VerifyOtpBody';
import { handleErrors } from 'src/handleErrors';
import { User, UserDocument } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as mongoose from 'mongoose';
import {
  DeviceIdType,
  DeviceValidationService,
} from './device-validation.service';
import { ResendOtpBody } from 'src/dto/ResendOtpBody';
import { handleMongoOperation } from 'src/mongo-utils';
import { Twilio } from 'twilio';
import { ProfileUpdateDto } from 'src/dto/ProfileUpdateDto';
// const TwilioConfig = config.get('twilio');
//const jwtConfig = config.get('jwt');
const BLOCK_DURATION_HOURS = 24;
const MAX_ATTEMPTS = 5;
@Injectable()
export class AuthService {
  private client: Twilio;
  private verifySid: string;
  constructor(
    private jwtService: JwtService,
    private httpService: HttpService,
    private readonly deviceValidationService: DeviceValidationService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
    this.verifySid = process.env.TWILIO_VERIFY_SID;
  }
  async verifyOtp(verifyOtpBody: VerifyOtpBody): Promise<any> {
    const user = await this.userModel.findOne({
      phoneNumber: verifyOtpBody.phone,
    });

    if (!user || user.otpExpires < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const verificationCheck={
      status:"approved"
    } 
    // = await this.client.verify.v2
    //   .services(this.verifySid)
    //   //@ts-ignore
    //   .verificationChecks.create({
    //     to: verifyOtpBody.phone,
    //     code: verifyOtpBody.otp,
    //   });

    if (verificationCheck.status !== 'approved') {
      throw new Error('Invalid OTP');
     
    }

    user.otp = null;
    user.attemptCount = 0;

    user.otpExpires = null;
    user.isVerified = true;
    user.phoneNumber = verifyOtpBody.phone;
    user.deviceId = verifyOtpBody.deviceId;
    user.deviceType = verifyOtpBody.deviceType;
    user.userType = verifyOtpBody.userType;
    const payload = {
      phoneNumber: user.phoneNumber,
      userId: user._id,
      deviceId: user.deviceId,
      userType:verifyOtpBody.userType
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    }); // Short-lived
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '365d', // Long-lived refresh token
    });
    user.jwtToken = accessToken;
    user.refreshToken = refreshToken;

    await user.save();
    const userDetails=await this.getUsersById(user.id,verifyOtpBody.userType)
    console.log('user@@@@@@####', user);

    return {
      success: true,
      accessToken,
      userId: user.id,
      phoneNumber: user.phoneNumber,
      ...userDetails
    };
  }
  async generateAccessToken(payload) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
  }
  async refreshAccessToken(userId: any) {
    try {
      console.log('userId', userId);
      const user = (
        await this.userModel.findById(userId).select('refreshToken')
      ).toObject();
     
      const payload = await this.jwtService.verifyAsync(user.refreshToken, {
        secret: process.env.JWT_SECRET,
      });
     
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const accessToken = await this.generateAccessToken(payload);
      return accessToken;
    } catch (error) {
      console.log('error', error);
      return new UnauthorizedException('Invalid refresh token');
    }
  }
  //Msg91 APIs
 

  async sendOtp(loginBody: ResendOtpBody): Promise<any> {
    const now = new Date();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    if (!loginBody.phone) {
      throw new HttpException(
        'Phone number is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log('Received phone number:', loginBody.phone);

    
    // Find or initialize user record
    let otpAttempt: any = await this.userModel.findOne({
      phoneNumber: loginBody.phone,
    });
    if (!otpAttempt) {
      otpAttempt = {
        phoneNumber: loginBody.phone,
        attemptCount: 0,
        blockedUntil: null,
        deviceId: null,
        deviceType: null,
      };
    }

    console.log('otpAttempt:', otpAttempt);

    // Check if user is blocked
    if (otpAttempt.blockedUntil && otpAttempt.blockedUntil > now) {
      const remainingTime = Math.ceil(
        (otpAttempt.blockedUntil.getTime() - now.getTime()) / 3600000,
      );

      throw new HttpException(
        `Blocked. Try again in ${remainingTime} hours`,
        HttpStatus.FORBIDDEN,
      );
    }

    // Increment attempt count
    otpAttempt.attemptCount += 1;

    // Block user if max attempts reached
    if (otpAttempt.attemptCount > MAX_ATTEMPTS) {
      const blockedUntil = new Date(
        now.getTime() + BLOCK_DURATION_HOURS * 3600000,
      );

      await this.userModel.updateOne(
        { phoneNumber: loginBody.phone },
        {
          blockedUntil,
          attemptCount: MAX_ATTEMPTS,
        },
        { upsert: true }, // Ensure the record is created if it doesn't exist
      );

      throw new HttpException(
        `Too many attempts. You are blocked for ${BLOCK_DURATION_HOURS} hours.`,
        HttpStatus.FORBIDDEN,
      );
    }

    // If the device is new, handle it
    if (!otpAttempt.deviceId || otpAttempt.deviceId !== loginBody.deviceId) {
      await this.notifyNewDevice(otpAttempt); // Notify about unregistered device
      // Optionally, restrict access or require additional verification
    }
    
    // let verification;
    // try {
    //   // Send OTP request

    //   verification = await this.client.verify.v2
    //     .services(this.verifySid)
    //     .verifications.create({ to: loginBody.phone, channel: 'sms' });
    // } catch (error) {
    //   console.log("error",error)
    //   throw new HttpException(
    //     'Failed to send OTP. Please try again later.',
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }

    // Update OTP expiration and device info
    await this.userModel.updateOne(
      { phoneNumber: loginBody.phone },
      {
        otpExpires,
        deviceId: loginBody.deviceId,
        deviceType: loginBody.deviceType,
        attemptCount: otpAttempt.attemptCount, // Save updated attempt count
      },
      { upsert: true }, // Ensure the record is created if it doesn't exist
    );
    return {
      success: true,
      message: 'OTP sent',
      otpExpires,
      //sid: verification?.sid,
    };
  }

  async validateUser(token: string): Promise<any> {
    try {
      console.log('token', token);
      const user = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return user;
    } catch (error) {
      console.log('error', error);
      return null;
    }
  }
  async updateLastActive(userId: string) {
    const now = new Date();
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { lastActive: now } },
    );
  }
  async updateUser(id: string, updateData: Record<string, any>): Promise<User> {
    const oprations = this.userModel
      .findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) }, // Filter by user ID
        { $set: updateData }, // Dynamically update fields
        { new: true }, // Return the updated document
      )
      .exec();
    const updatedUser = await handleMongoOperation(oprations, 'updatedUser');
    console.log('updatedUser', updateData);
    return updatedUser;
  }
  async updateAndGetUser(
    userId: string,
    updateData: Record<string, any>,
  ): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true, // ensures schema validation
      })
      .select('_id phoneNumber isVerified lastSeen name avatarUrl about status skills experience websiteUrl portfolioImages idProofImages email')
      .exec();
  
    if (!updatedUser) {
      throw new Error('User not found or update failed');
    }
  
    return updatedUser;
  }
  async getUsersById(userId,userType) {
    const user = await this.userModel
      .findById(userId)
      .select('_id phoneNumber userType websiteUrl isVerified skills name avatarUrl email idProofImages portfolioImages')
      .exec();
      let requiredFields = ['phoneNumber', 'userType', 'isVerified', 'name',"skills","idProofImages","portfolioImages" ];
      if(userType=="Customer"){
        requiredFields = ['phoneNumber', 'userType', 'isVerified', 'name' ];
      }
     
      const isProfileComplete = requiredFields.every(field => user[field] && user[field] !== '');
      return {
        ...user.toObject(), // Convert Mongoose document to plain object
        isProfileComplete
      };
   
  }

  async notifyNewDevice(user: any): Promise<void> {
    // Send notification logic (e.g., email, SMS)
    console.log(`Notify user of new device`);
  }
  async updateProfile(userId: string, profileUpdateDto: ProfileUpdateDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Merge the updated fields from the DTO
    Object.assign(user, profileUpdateDto);

    await user.save();
    return user;
  }
  async getAllRepairsMen (userType:string){
   return  await this.userModel.find({
      userType:userType || "Customer"
    })  .select('_id phoneNumber userType websiteUrl isVerified skills name avatarUrl email idProofImages portfolioImages').exec();
  }
}
