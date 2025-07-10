import mongoose from 'mongoose';
import { User } from './user.schema';
export declare class Chatlist {
    senderId: string;
    receiverId: string | null;
    participants: User[];
    isGroup: boolean;
    groupName: string;
    createdBy: string | null;
    admins: User[];
}
export declare const ChatlistSchema: mongoose.Schema<Chatlist, mongoose.Model<Chatlist, any, any, any, mongoose.Document<unknown, any, Chatlist> & Chatlist & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Chatlist, mongoose.Document<unknown, {}, mongoose.FlatRecord<Chatlist>> & mongoose.FlatRecord<Chatlist> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
