import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type UserDocument = User & Document;
export interface IUser extends Document {
    phoneNumber: string;
    otp?: string;
    otpExpires?: Date;
    jwtToken?: string;
    refreshToken?: string;
    password?: string;
    status: 'online' | 'offline' | 'away';
    lastSeen: Date;
    avatarUrl?: string;
    deviceToken?: string;
    userType: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    deviceId: string;
    deviceType?: string;
    attemptCount?: number;
    blockedUntil?: Date;
}
export interface ISession {
    deviceId: string;
    refreshToken: string;
    refreshTokenExpires: Date;
    deviceType?: string;
    createdAt: Date;
}
export declare class User {
    phoneNumber: string;
    otp?: string;
    otpExpires?: Date;
    jwtToken?: string;
    refreshToken?: string;
    password?: string;
    status: 'online' | 'offline' | 'away';
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
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, Document<unknown, {}, mongoose.FlatRecord<User>> & mongoose.FlatRecord<User> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
