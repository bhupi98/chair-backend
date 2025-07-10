import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';

@Schema()
export class Chatlist {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  senderId: string; // User who owns this roster entry

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  receiverId: string | null; // For one-to-one chats, null for groups

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  participants: User[]; // List of participants for group chats or single recipient

  @Prop({ type: Boolean, default: false })
  isGroup: boolean; // Flag to differentiate between individual and group chat

  @Prop({ type: String, default: '' })
  groupName: string; // Group name, only applicable for group chats

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  createdBy: string | null; // User who created the group

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  admins: User[]; // Group chat admins
}

export const ChatlistSchema = SchemaFactory.createForClass(Chatlist);
