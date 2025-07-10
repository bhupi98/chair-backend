import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/services/auth.service';
import { SendMessageDto } from './chat.dto';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly authService;
    private server;
    private readonly logger;
    constructor(authService: AuthService);
    private parseData;
    handleMessage(data: SendMessageDto, client: Socket): Promise<void>;
    handleTyping(data: SendMessageDto, client: Socket): Promise<void>;
    private updateMessageStatus;
    markReadMessage(data: SendMessageDto, client: Socket): Promise<void>;
    markDeliveredMessage(data: SendMessageDto, client: Socket): Promise<void>;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    private handleUserContact;
    private validateClient;
    private deliverOfflineMessages;
    msgAck(data: any, client: Socket): void;
    sortClient(senderId: string, receiverId: string): string;
}
