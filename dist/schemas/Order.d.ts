import mongoose, { Document } from 'mongoose';
export declare class Bid {
    repairmanId: string;
    amount: number;
    timeEstimate: string;
    bidAt: Date;
}
export declare class Order {
    title: {
        en: string;
        hi: string;
    };
    description: {
        en: string;
        hi: string;
    };
    location: {
        city: string;
        coords: {
            lat: number;
            lon: number;
        };
    };
    budget: number;
    status: string;
    postedAt: string;
    category: string;
    customerId: string;
    allowBidding: boolean;
    isEnable: boolean;
    images?: string[];
    bids: Bid[];
    acceptedBidRepairmanId: string | null;
    createdAt: Date;
    updatedAt?: Date;
}
export type OrderDocument = Order & Document;
export declare const OrderSchema: mongoose.Schema<Order, mongoose.Model<Order, any, any, any, mongoose.Document<unknown, any, Order> & Order & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Order, mongoose.Document<unknown, {}, mongoose.FlatRecord<Order>> & mongoose.FlatRecord<Order> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
