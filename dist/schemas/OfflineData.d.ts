import mongoose, { Document } from 'mongoose';
export type OfflineDataDocument = OfflineData & Document;
export declare class OfflineData extends Document {
    offlineUserId: string;
    senderUserId: string;
    type: string;
    offlineRecords: Object;
    isSynced: boolean;
}
export declare const OfflineDataSchema: mongoose.Schema<OfflineData, mongoose.Model<OfflineData, any, any, any, mongoose.Document<unknown, any, OfflineData> & OfflineData & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, OfflineData, mongoose.Document<unknown, {}, mongoose.FlatRecord<OfflineData>> & mongoose.FlatRecord<OfflineData> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
