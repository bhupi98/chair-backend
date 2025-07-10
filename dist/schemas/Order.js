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
exports.OrderSchema = exports.Order = exports.Bid = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Bid = class Bid {
};
exports.Bid = Bid;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Bid.prototype, "repairmanId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Bid.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Bid.prototype, "timeEstimate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Bid.prototype, "bidAt", void 0);
exports.Bid = Bid = __decorate([
    (0, mongoose_1.Schema)()
], Bid);
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, mongoose_1.Prop)({ type: { en: String, hi: String }, required: true }),
    __metadata("design:type", Object)
], Order.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: { en: String, hi: String }, required: true }),
    __metadata("design:type", Object)
], Order.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: { city: String, coords: { lat: Number, lon: Number } },
        required: true,
    }),
    __metadata("design:type", Object)
], Order.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Order.prototype, "budget", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: () => new Date().toISOString() }),
    __metadata("design:type", String)
], Order.prototype, "postedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Order.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], Order.prototype, "customerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], Order.prototype, "allowBidding", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Order.prototype, "isEnable", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Order.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Bid], default: [] }),
    __metadata("design:type", Array)
], Order.prototype, "bids", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], Order.prototype, "acceptedBidRepairmanId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
exports.Order = Order = __decorate([
    (0, mongoose_1.Schema)()
], Order);
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(Order);
//# sourceMappingURL=Order.js.map