import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'src/schemas/Messages';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async saveMessage(message: any): Promise<void> {
    const payload = {
      _id: message.msgId,
      senderId: message.senderId,
      offlineUserId: message.receiverId,
      delivered: false,
      status: 'sent',
      isSyncedOfflineUser: false,
      isSyncedSenderUser: false,
      offlineRecords: message,
    };
    await this.messageModel.create(payload);
  }
  async getPendingMessages(userId: string, daysAgo?: number): Promise<any[]> {
    try {
      const query: any = {
        $or: [
          { offlineUserId: userId, status: { $eq: 'sent' } },
          { senderId: userId, status: { $in: ['delivered', 'read'] } },
        ],
      };
      // Fetch messages matching the query
      return await this.messageModel.find(query).exec();
    } catch (error) {
      this.logger.error(
        `Failed to fetch pending messages for user ${userId}:`,
        error,
      );
      return [];
    }
  }

  async markMessageAsDelivered(messageId: string,status:string): Promise<void> {
    await this.messageModel.updateOne({ _id: messageId }, { status: status });
  }
}
