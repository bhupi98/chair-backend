import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true }) // Adds createdAt & updatedAt fields
export class Message {
  
  @Prop({ required: true,unique: true })
  _id: string;
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  offlineUserId: string;

  @Prop({ type: Date, default: Date.now, expires: '30d' }) // <-- Expire messages after 30 days
  timestamp: Date;
  
  @Prop({ default: false })
  status: 'sent' | 'delivered' | 'read'; // Message status
  @Prop({ required: true,type:Object })
  offlineRecords: Object; // Array to store multiple offline entries

  @Prop({ default: false })
  isSyncedOfflineUser: boolean;

  @Prop({ default: false })
  isSyncedSenderUser: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ offlineUserId: 1 });
MessageSchema.index({ senderId: 1 });

MessageSchema.index({ isSyncedOfflineUser: 1 });
MessageSchema.index({ isSyncedSenderUser: 1 });