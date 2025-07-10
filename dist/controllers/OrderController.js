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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const OrderDTO_1 = require("../dto/OrderDTO");
const get_user_decorator_1 = require("../get-user.decorator");
const JwtAuthGuard_1 = require("../JwtAuthGuard");
const OrderService_1 = require("../services/OrderService");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async create(createOrderDto) {
        return this.orderService.create(createOrderDto);
    }
    async getAllOrders() {
        return this.orderService.findAll();
    }
    async findOne(id) {
        return this.orderService.findOne(id);
    }
    async update(id, updateOrderDto, user) {
        const customerId = user?.userId;
        if (!customerId)
            throw new common_1.BadRequestException('Customer ID is required');
        return this.orderService.update(id, updateOrderDto, customerId);
    }
    async delete(id, user) {
        const customerId = user?.userId;
        if (!customerId)
            throw new common_1.BadRequestException('Customer ID is required');
        return this.orderService.delete(id, customerId);
    }
    async findByCustomer(id) {
        return this.orderService.findByCustomer(id);
    }
    async addBid(id, repairmanId, amount, timeEstimate) {
        const userId = repairmanId;
        console.log("repairmanId", repairmanId, amount);
        if (!userId)
            throw new common_1.BadRequestException('User ID is required');
        return this.orderService.addBid(id, userId, amount, timeEstimate);
    }
    async updateBid(orderId, bidId, updateBidDto, user) {
        const repairmanId = user?.userId;
        if (!repairmanId)
            throw new common_1.BadRequestException('Repairman ID is required');
        return this.orderService.updateBid(orderId, bidId, repairmanId, updateBidDto);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [OrderDTO_1.OrderDTO]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("getAllOrders"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(JwtAuthGuard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, OrderDTO_1.UpdateOrderDTO, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(JwtAuthGuard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('findByCustomer/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findByCustomer", null);
__decorate([
    (0, common_1.Post)(':id/bids'),
    (0, common_1.UseGuards)(JwtAuthGuard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('repairmanId')),
    __param(2, (0, common_1.Body)('amount')),
    __param(3, (0, common_1.Body)('timeEstimate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "addBid", null);
__decorate([
    (0, common_1.Put)(':orderId/bids/:bidId'),
    (0, common_1.UseGuards)(JwtAuthGuard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Param)('bidId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, OrderDTO_1.UpdateBidDTO, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updateBid", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('api/orders'),
    __metadata("design:paramtypes", [OrderService_1.OrderService])
], OrderController);
//# sourceMappingURL=OrderController.js.map