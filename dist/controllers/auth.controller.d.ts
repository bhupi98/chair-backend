import { ProfileUpdateDto } from 'src/dto/ProfileUpdateDto';
import { ResendOtpBody } from 'src/dto/ResendOtpBody';
import { VerifyOtpBody } from 'src/dto/VerifyOtpBody';
import { AuthService } from 'src/services/auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    sendOtp(loginBody: ResendOtpBody): Promise<any>;
    verifyOtp(verifyOtpBody: VerifyOtpBody): Promise<any>;
    resendOtp(resendBody: ResendOtpBody): Promise<any>;
    userDetails(user: any): Promise<{
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
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
    }>;
    profileUpdate(user: any, profileUpdateDto: ProfileUpdateDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/user.schema").UserDocument> & import("../schemas/user.schema").User & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateProfile(user: any, profileUpdateDto: ProfileUpdateDto): Promise<import("../schemas/user.schema").User>;
    updateUserProfile(user: any, profileUpdateDto: ProfileUpdateDto): Promise<import("../schemas/user.schema").User>;
    getUserDetails(user: any, userType: string): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/user.schema").UserDocument> & import("../schemas/user.schema").User & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
