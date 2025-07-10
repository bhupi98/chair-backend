import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type RosterDocument = Roster & Document;
export declare class Roster {
    userId: string;
    contactUserId: string | null;
    contactNumber: string;
    isRegistered: boolean;
    name: string;
    isMutual: boolean;
    presenceStatus: 'online' | 'offline' | 'away';
    isBlocked: boolean;
    isMuted: boolean;
    lastSeen: Date | null;
}
export declare const RosterSchema: mongoose.Schema<Roster, mongoose.Model<Roster, any, any, any, Document<unknown, any, Roster> & Roster & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Roster, Document<unknown, {}, mongoose.FlatRecord<Roster>> & mongoose.FlatRecord<Roster> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
