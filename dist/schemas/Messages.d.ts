import { Document } from 'mongoose';
export type MessageDocument = Message & Document;
export declare class Message {
    _id: string;
    senderId: string;
    offlineUserId: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
    offlineRecords: Object;
    isSyncedOfflineUser: boolean;
    isSyncedSenderUser: boolean;
}
export declare const MessageSchema: import("mongoose").Schema<Message, import("mongoose").Model<Message, any, any, any, Document<unknown, any, Message> & Message & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, Document<unknown, {}, import("mongoose").FlatRecord<Message>> & import("mongoose").FlatRecord<Message> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
