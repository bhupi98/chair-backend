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
exports.RosterSchema = exports.Roster = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
let Roster = class Roster {
};
exports.Roster = Roster;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], Roster.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }),
    __metadata("design:type", String)
], Roster.prototype, "contactUserId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Roster.prototype, "contactNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Roster.prototype, "isRegistered", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Roster.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Roster.prototype, "isMutual", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['online', 'offline', 'away'],
        default: 'offline',
    }),
    __metadata("design:type", String)
], Roster.prototype, "presenceStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Roster.prototype, "isBlocked", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Roster.prototype, "isMuted", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Date)
], Roster.prototype, "lastSeen", void 0);
exports.Roster = Roster = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Roster);
exports.RosterSchema = mongoose_1.SchemaFactory.createForClass(Roster);
exports.RosterSchema.index({ userId: 1, contactNumber: 1, contactUserId: 1 });
//# sourceMappingURL=Roster.js.map