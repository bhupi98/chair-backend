import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Bid {
  @Prop({ required: true })
  repairmanId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  timeEstimate: string; // e.g., "2 days"

  @Prop({ default: Date.now })
  bidAt: Date;
}

@Schema()
export class Order {

  @Prop({ type: { en: String, hi: String }, required: true })
  title: { en: string; hi: string };

  @Prop({ type: { en: String, hi: String }, required: true })
  description: { en: string; hi: string };

  @Prop({
    type: { city: String, coords: { lat: Number, lon: Number } },
    required: true,
  })
  location: { city: string; coords: { lat: number; lon: number } };

  @Prop({ required: true })
  budget: number;

  @Prop({ required: true })
  status: string;

  @Prop({ default: () => new Date().toISOString() })
  postedAt: string;

  @Prop({ required: true })
  category: string;

@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  customerId: string;

  @Prop({ required: true })
  allowBidding: boolean;

  @Prop({ default: true })
  isEnable: boolean;
  
  @Prop([String])
  images?: string[];

  @Prop({ type: [Bid], default: [] })
  bids: Bid[];

  @Prop({ type: String, default: null }) // ID of the accepted repairman, null if no bid accepted
  acceptedBidRepairmanId: string | null;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt?: Date;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);