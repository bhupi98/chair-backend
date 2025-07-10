"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth.service");
const common_2 = require("@nestjs/common");
const chat_dto_1 = require("./chat.dto");
const utility_1 = require("../utility");
const STATUS = {
    ONLINE: 'online',
    OFFLINE: 'offline',
    SENT: 'sent',
    DELIVERED: 'delivered',
    READ: 'read',
};
let ChatGateway = ChatGateway_1 = class ChatGateway {
    constructor(authService) {
        this.authService = authService;
        this.logger = new common_2.Logger(ChatGateway_1.name);
    }
    parseData(data) {
        try {
            return typeof data === 'string' ? JSON.parse(data) : data;
        }
        catch {
            throw new common_1.BadRequestException('Invalid data format');
        }
    }
    async handleMessage(data, client) {
        const parsedData = this.parseData(data);
        const { senderId, receiverId, msgId } = parsedData;
        if (!senderId || !receiverId || !msgId) {
            throw new common_1.BadRequestException('Missing required message fields');
        }
        const messagePayload = {
            ...parsedData,
            senderPhoneNumber: client.data.phoneNumber,
            status: STATUS.SENT,
        };
        this.server
            .to(senderId)
            .emit('messageSent', { ...messagePayload, status: STATUS.SENT });
    }
    async handleTyping(data, client) {
        const { senderId, receiverId } = this.parseData(data);
        const payload = {
            senderId,
            receiverId,
            phoneNumber: client.data.phoneNumber,
        };
        this.server.to([senderId, receiverId]).emit('typing-client', payload);
    }
    async updateMessageStatus(event, status, data, client) {
        const parsedData = this.parseData(data);
        const { receiverId, msgId } = parsedData;
        const payload = { ...parsedData, status };
    }
    markReadMessage(data, client) {
        return this.updateMessageStatus('messageReadStatus', STATUS.READ, data, client);
    }
    markDeliveredMessage(data, client) {
        return this.updateMessageStatus('messageDeliveredStatus', STATUS.DELIVERED, data, client);
    }
    async handleConnection(client) {
        try {
            const user = await this.validateClient(client);
            if (!user) {
                client.disconnect();
                return;
            }
            client.data = { userId: user.userId, phoneNumber: user.phoneNumber };
            client.join(user.userId);
            await this.handleUserContact(user.userId, user.phoneNumber, STATUS.ONLINE);
            await this.deliverOfflineMessages(`offline:${user.userId}`, user.userId);
            this.logger.log(`User connected: ${user.userId}`);
        }
        catch (error) {
            this.logger.error('Connection error:', error);
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        const userId = client.data.userId;
        const phoneNumber = client.data.phoneNumber;
        if (!userId)
            return;
        await this.handleUserContact(userId, phoneNumber, STATUS.OFFLINE);
        this.logger.log(`User disconnected: ${userId}`);
    }
    async handleUserContact(userId, phoneNumber, status) {
        const lastSeen = status === STATUS.ONLINE ? null : (0, utility_1.getTodayDate)();
    }
    async validateClient(client) {
        const token = client.handshake.headers.authorization?.split(' ')[1];
        if (!token)
            throw new Error('Unauthorized');
        return this.authService.validateUser(token);
    }
    async deliverOfflineMessages(streamKey, userId) {
    }
    msgAck(data, client) {
        const { ackType } = data;
    }
    sortClient(senderId, receiverId) {
        const chatId = [senderId, receiverId].sort().join("_");
        return chatId;
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.SendMessageDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing-indicator'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.SendMessageDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markReadMessage'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.SendMessageDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "markReadMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markDeliveredMessage'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.SendMessageDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "markDeliveredMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('msgAck'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "msgAck", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/chat',
        cors: { origin: '*' },
        transports: ['websocket'],
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map