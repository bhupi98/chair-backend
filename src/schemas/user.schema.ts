import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { getTodayDate } from 'src/utility';

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
  deviceId: string; // U
  deviceType?: string;
  attemptCount?: number;
  blockedUntil?: Date;
}
// Session Interface
export interface ISession {
  deviceId: string; // Unique identifier for the device
  refreshToken: string; // Token for refreshing access
  refreshTokenExpires: Date; // Expiration of refresh token
  deviceType?: string; // Optional: "Android", "iOS", "Web", etc.
  createdAt: Date; // Session creation date
}

// Session Schema

// User Schema
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true }) // Indexed for fast lookup
  phoneNumber: string;

  @Prop()
  otp?: string;

  @Prop()
  otpExpires?: Date;

  @Prop()
  jwtToken?: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  password?: string;

  @Prop({
    enum: ['online', 'offline', 'away'],
    default: 'offline',
    index: true, // Indexed for presence-related queries
  })
  status: 'online' | 'offline' | 'away';

  @Prop({ default: () => getTodayDate() })
  lastSeen: string;

  @Prop({ default: '' })
  avatarUrl?: string;
  @Prop({ default: false })
  isVerified: boolean; // Indicates whether the user is verified
  @Prop({ default: '' })
  about: string; // User's "About" or "Bio" text

  @Prop({ default: '' })
  name: string;
  @Prop({ default: '' })
  deviceToken: string; // FCM or APNs token for push notifications
  @Prop({ default: '' })
  deviceType: string;
  @Prop({ required: true })
  deviceId: string;

  @Prop({ default: '' })
  socketId: string; // Indicates whether the user is verified

  @Prop({ default: 0 })
  attemptCount?: number; // Indicates whether the user is verified

  @Prop()
  blockedUntil?: Date; // Indicates whether the user is verified
  @Prop() email?: string;
  @Prop({ type: [String], default: [] })
  skills?: string[];
  @Prop() experience?: string;
  @Prop({ type: [String], default: [] })
  portfolioImages?: string[];
  @Prop({ type: [String], default: [] })
  idProofImages?: string[];
  @Prop()
  websiteUrl?: string;
  @Prop({ default: 'Customer' })
  userType: string; // Indicates whether the user is verified
}

export const UserSchema = SchemaFactory.createForClass(User);
