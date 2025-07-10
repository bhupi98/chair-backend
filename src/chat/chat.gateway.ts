import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  Inject,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';

import { Logger } from '@nestjs/common';
import { SendMessageDto } from './chat.dto';

import { getTodayDate } from 'src/utility';

const STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
} as const;

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: '*' },
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() private server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
 
    private readonly authService: AuthService,
  ) {}



  private parseData(data: any): any {
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      throw new BadRequestException('Invalid data format');
    }
  }

  @SubscribeMessage('sendMessage')
  @UsePipes(new ValidationPipe())
  async handleMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const parsedData = this.parseData(data);
    const { senderId, receiverId, msgId } = parsedData;

    if (!senderId || !receiverId || !msgId) {
      throw new BadRequestException('Missing required message fields');
    }

    const messagePayload = {
      ...parsedData,
      senderPhoneNumber: client.data.phoneNumber,
      status: STATUS.SENT,
    };
    // const isReceiverOnline = await this.redisService.isUserOnline(receiverId);
    
    
    // if (isReceiverOnline) {
    //   this.server.to(receiverId).emit('receiveMessage-client', messagePayload);
    // } else {
    //   await this.redisService.addToStream(
    //     `offline:${receiverId}`,
    //     messagePayload,
    //   );
    // }

    this.server
      .to(senderId)
      .emit('messageSent', { ...messagePayload, status: STATUS.SENT });
  }

  @SubscribeMessage('typing-indicator')
  @UsePipes(new ValidationPipe())
  async handleTyping(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { senderId, receiverId } = this.parseData(data);
    const payload = {
      senderId,
      receiverId,
      phoneNumber: client.data.phoneNumber,
    };

    this.server.to([senderId, receiverId]).emit('typing-client', payload);
  }

  private async updateMessageStatus(
    event: string,
    status: string,
    data: SendMessageDto,
    client: Socket,
  ): Promise<void> {
    const parsedData = this.parseData(data);
    const { receiverId, msgId } = parsedData;

    const payload = { ...parsedData, status };
    // const isReceiverOnline = await this.redisService.isUserOnline(receiverId);
    // if (isReceiverOnline) {
    //   this.server.to(receiverId).emit('messageStatus-client', payload);
    // } else {
    //   await this.redisService.addToStream(`${event}:${receiverId}`, payload);
    // }
  }
  // New group chat handlers

  @SubscribeMessage('markReadMessage')
  @UsePipes(new ValidationPipe())
  markReadMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.updateMessageStatus(
      'messageReadStatus',
      STATUS.READ,
      data,
      client,
    );
  }

  @SubscribeMessage('markDeliveredMessage')
  @UsePipes(new ValidationPipe())
  markDeliveredMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.updateMessageStatus(
      'messageDeliveredStatus',
      STATUS.DELIVERED,
      data,
      client,
    );
  }

  async handleConnection(client: Socket): Promise<void> {
    try {
      const user = await this.validateClient(client);
      if (!user) {
        client.disconnect();
        return;
      }

      client.data = { userId: user.userId, phoneNumber: user.phoneNumber };
      client.join(user.userId);
     
      await this.handleUserContact(
        user.userId,
        user.phoneNumber,
        STATUS.ONLINE,
      );
      await this.deliverOfflineMessages(`offline:${user.userId}`, user.userId);
     
      this.logger.log(`User connected: ${user.userId}`);
    } catch (error) {
      this.logger.error('Connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const userId = client.data.userId;
    const phoneNumber = client.data.phoneNumber;
    if (!userId) return;

    await this.handleUserContact(userId, phoneNumber, STATUS.OFFLINE);
    this.logger.log(`User disconnected: ${userId}`);
  }

  private async handleUserContact(
    userId: string,
    phoneNumber,
    status: string,
  ): Promise<void> {
    const lastSeen = status === STATUS.ONLINE ? null : getTodayDate();

    //this.redisService.setUserStatus(userId, status, lastSeen),
   
  }

  private async validateClient(client: Socket) {
    const token = client.handshake.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Unauthorized');
    return this.authService.validateUser(token);
  }

  private async deliverOfflineMessages(
    streamKey: string,
    userId: string,
  ): Promise<void> {
    // const messages = await this.redisService.readStream(streamKey);
    // // console.log('messages', messages);
    // for (const message of messages) {
    //   this.server.to(userId).emit('receiveMessage-client', message);
    // }
  }

  @SubscribeMessage('msgAck')
  @UsePipes(new ValidationPipe())
  msgAck(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const { ackType } = data;
  }
  sortClient(senderId:string,receiverId:string){
    const chatId = [senderId,receiverId].sort().join("_");
    return chatId
  }
}

