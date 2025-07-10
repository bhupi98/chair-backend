import { HttpService } from '@nestjs/axios';
import { UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { VerifyOtpBody } from 'src/dto/VerifyOtpBody';
import { User, UserDocument } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as mongoose from 'mongoose';
import { DeviceValidationService } from './device-validation.service';
import { ResendOtpBody } from 'src/dto/ResendOtpBody';
import { ProfileUpdateDto } from 'src/dto/ProfileUpdateDto';
export declare class AuthService {
    private jwtService;
    private httpService;
    private readonly deviceValidationService;
    private userModel;
    private client;
    private verifySid;
    constructor(jwtService: JwtService, httpService: HttpService, deviceValidationService: DeviceValidationService, userModel: Model<UserDocument>);
    verifyOtp(verifyOtpBody: VerifyOtpBody): Promise<any>;
    generateAccessToken(payload: any): Promise<string>;
    refreshAccessToken(userId: any): Promise<string | UnauthorizedException>;
    sendOtp(loginBody: ResendOtpBody): Promise<any>;
    validateUser(token: string): Promise<any>;
    updateLastActive(userId: string): Promise<void>;
    updateUser(id: string, updateData: Record<string, any>): Promise<User>;
    updateAndGetUser(userId: string, updateData: Record<string, any>): Promise<User>;
    getUsersById(userId: any, userType: any): Promise<{
        isProfileComplete: boolean;
        phoneNumber: string;
        otp?: string;
        otpExpires?: Date;
        jwtToken?: string;
        refreshToken?: string;
        password?: string;
        status: "online" | "offline" | "away";
        lastSeen: string;
        avatarUrl?: string;
        isVerified: boolean;
        about: string;
        name: string;
        deviceToken: string;
        deviceType: string;
        deviceId: string;
        socketId: string;
        attemptCount?: number;
        blockedUntil?: Date;
        email?: string;
        skills?: string[];
        experience?: string;
        portfolioImages?: string[];
        idProofImages?: string[];
        websiteUrl?: string;
        userType: string;
        _id: unknown;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: mongoose.Collection;
        db: mongoose.Connection;
        errors?: mongoose.Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: mongoose.Schema;
    }>;
    notifyNewDevice(user: any): Promise<void>;
    updateProfile(userId: string, profileUpdateDto: ProfileUpdateDto): Promise<mongoose.Document<unknown, {}, UserDocument> & User & mongoose.Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllRepairsMen(userType: string): Promise<(mongoose.Document<unknown, {}, UserDocument> & User & mongoose.Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
