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
exports.ChatlistSchema = exports.Chatlist = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let Chatlist = class Chatlist {
};
exports.Chatlist = Chatlist;
__decorate([
    (0, mongoose_2.Prop)({ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], Chatlist.prototype, "senderId", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', default: null }),
    __metadata("design:type", String)
], Chatlist.prototype, "receiverId", void 0);
__decorate([
    (0, mongoose_2.Prop)([{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }]),
    __metadata("design:type", Array)
], Chatlist.prototype, "participants", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Chatlist.prototype, "isGroup", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Chatlist.prototype, "groupName", void 0);
__decorate([
    (0, mongoose_2.Prop)({ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', default: null }),
    __metadata("design:type", String)
], Chatlist.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_2.Prop)([{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }]),
    __metadata("design:type", Array)
], Chatlist.prototype, "admins", void 0);
exports.Chatlist = Chatlist = __decorate([
    (0, mongoose_2.Schema)()
], Chatlist);
exports.ChatlistSchema = mongoose_2.SchemaFactory.createForClass(Chatlist);
//# sourceMappingURL=Chatlist.js.map