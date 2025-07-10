import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
export type OfflineDataDocument = OfflineData & Document;
@Schema({ timestamps: true })
export class OfflineData extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,

    ref: 'User',
    required: true,
  })
  // Ensure one document per user
  offlineUserId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  senderUserId: string;
  @Prop({ required: true })
  type: string;
  
  @Prop({ required: true,type:Object })
  offlineRecords: Object; // Array to store multiple offline entries

  @Prop({ default: false })
  isSynced: boolean; // Indicates if data was successfully synchronized
 
}

export const OfflineDataSchema = SchemaFactory.createForClass(OfflineData);
OfflineDataSchema.index({ offlineUserId: 1 });