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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineDataSchema = exports.OfflineData = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let OfflineData = class OfflineData extends mongoose_2.Document {
};
exports.OfflineData = OfflineData;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }),
    __metadata("design:type", String)
], OfflineData.prototype, "offlineUserId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", String)
], OfflineData.prototype, "senderUserId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OfflineData.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Object }),
    __metadata("design:type", Object)
], OfflineData.prototype, "offlineRecords", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], OfflineData.prototype, "isSynced", void 0);
exports.OfflineData = OfflineData = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], OfflineData);
exports.OfflineDataSchema = mongoose_1.SchemaFactory.createForClass(OfflineData);
exports.OfflineDataSchema.index({ offlineUserId: 1 });
//# sourceMappingURL=OfflineData.js.map