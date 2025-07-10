import { Model } from 'mongoose';
import { Message } from 'src/schemas/Messages';
export declare class MessageService {
    private messageModel;
    private readonly logger;
    constructor(messageModel: Model<Message>);
    saveMessage(message: any): Promise<void>;
    getPendingMessages(userId: string, daysAgo?: number): Promise<any[]>;
    markMessageAsDelivered(messageId: string, status: string): Promise<void>;
}
