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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineDataService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const OfflineData_1 = require("../schemas/OfflineData");
let OfflineDataService = class OfflineDataService {
    constructor(offlineDataModel) {
        this.offlineDataModel = offlineDataModel;
    }
    async saveOfflineData(offlineUserId, senderUserId, offlineData) {
        if (offlineData.type === 'statusUpdate') {
            return this.offlineDataModel
                .findOneAndUpdate({ offlineUserId, type: offlineData.type }, {
                isSynced: false,
                type: offlineData.type,
                offlineUserId: offlineUserId,
                senderUserId: senderUserId,
                $set: {
                    lastSeen: new Date(),
                    offlineRecords: offlineData,
                },
            }, { upsert: true })
                .exec();
        }
        if (offlineData.type === 'profileUpdate') {
        }
    }
    async updateLastSeen(offlineUserId, lastSeen) {
        await this.offlineDataModel
            .updateOne({ offlineUserId }, { $set: { lastSeen: new Date(lastSeen) } })
            .exec();
    }
    async getOfflineData(offlineUserId) {
        const offlineData = await this.offlineDataModel
            .find({ offlineUserId })
            .exec();
        return offlineData ? offlineData : [];
    }
    async getOfflineDataByType(offlineUserId, type) {
        const offlineData = await this.offlineDataModel
            .find({ offlineUserId, type: type })
            .exec();
        return offlineData;
    }
    async markDataAsSynced(offlineUserId) {
        await this.offlineDataModel
            .updateOne({ offlineUserId }, { isSynced: true })
            .exec();
    }
    async deleteSyncedData(offlineUserId) {
        await this.offlineDataModel.deleteOne({ offlineUserId }).exec();
    }
    async deleteOfflineDataByType(offlineUserId, type) {
        await this.offlineDataModel
            .updateOne({ offlineUserId }, { $pull: { offlineRecords: { type } } })
            .exec();
    }
    async saveUpdateUserStatus(offlineUserId, type, data) {
        return await this.offlineDataModel
            .findOneAndUpdate({ offlineUserId, type }, {
            isSynced: false,
            type: type,
            offlineUserId: offlineUserId,
            senderUserId: data.userId,
            offlineRecords: data,
        }, { upsert: true })
            .exec();
    }
    async deleteAllOfflineDataByUserId(userId) {
        try {
            const result = await this.offlineDataModel.deleteMany({ offlineUserId: userId });
            console.log(`${result.deletedCount} records deleted for userId: ${userId}`);
        }
        catch (error) {
            console.error(`Error deleting data for userId ${userId}:`, error);
        }
    }
};
exports.OfflineDataService = OfflineDataService;
exports.OfflineDataService = OfflineDataService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(OfflineData_1.OfflineData.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OfflineDataService);
//# sourceMappingURL=offline-data.service.js.map