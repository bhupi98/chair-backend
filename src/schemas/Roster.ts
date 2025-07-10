import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type RosterDocument = Roster & Document;

@Schema({ timestamps: true }) // Includes createdAt and updatedAt fields
export class Roster {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string; // User who owns this roster entry

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User',default: null })
  contactUserId: string | null; // Registered contact (null if not registered)

  @Prop({ type: String, required: true })
  contactNumber: string; // Contact's phone number

  @Prop({ type: Boolean, default: false })
  isRegistered: boolean; // Indicates if the contact is registered

  @Prop({ type: String, default: '' })
  name: string; // Optional user-defined nickname

  @Prop({
    type: Boolean,
   
    default: false,
  })
  isMutual : boolean

  @Prop({
    type: String,
    enum: ['online', 'offline', 'away'],
    default: 'offline',
  })
  presenceStatus: 'online' | 'offline' | 'away'; // Presence status

  @Prop({ type: Boolean, default: false })
  isBlocked: boolean; // Indicates if the contact is blocked
   
  @Prop({ type: Boolean, default: false })
  isMuted: boolean; // Indicates if the contact is muted

  @Prop({ type: Date, default: null })
  lastSeen: Date | null; // Last seen timestamp
}

// Schema Factory
export const RosterSchema = SchemaFactory.createForClass(Roster);

// Adding indexes for performance
RosterSchema.index({ userId: 1, contactNumber: 1,contactUserId:1 }); // Ensures unique combination of userId and contact
