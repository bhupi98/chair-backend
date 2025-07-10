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
var MessageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const Messages_1 = require("../schemas/Messages");
let MessageService = MessageService_1 = class MessageService {
    constructor(messageModel) {
        this.messageModel = messageModel;
        this.logger = new common_1.Logger(MessageService_1.name);
    }
    async saveMessage(message) {
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
    async getPendingMessages(userId, daysAgo) {
        try {
            const query = {
                $or: [
                    { offlineUserId: userId, status: { $eq: 'sent' } },
                    { senderId: userId, status: { $in: ['delivered', 'read'] } },
                ],
            };
            return await this.messageModel.find(query).exec();
        }
        catch (error) {
            this.logger.error(`Failed to fetch pending messages for user ${userId}:`, error);
            return [];
        }
    }
    async markMessageAsDelivered(messageId, status) {
        await this.messageModel.updateOne({ _id: messageId }, { status: status });
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = MessageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Messages_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MessageService);
//# sourceMappingURL=MessageService.js.map