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
var OrderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const Order_1 = require("../schemas/Order");
const google_translate_api_x_1 = require("google-translate-api-x");
const LanguageDetect = require('languagedetect');
let OrderService = OrderService_1 = class OrderService {
    constructor(orderModel) {
        this.orderModel = orderModel;
        this.logger = new common_1.Logger(OrderService_1.name);
        this.lngDetector = new LanguageDetect();
    }
    toOrderResponseDTO(order) {
        const orderObj = order.toObject();
        return {
            ...orderObj,
            bids: orderObj.bids.map((bid) => ({
                repairmanId: bid.repairmanId,
                amount: bid.amount,
                timeEstimate: bid.timeEstimate,
                bidAt: bid.bidAt.toISOString(),
            })),
            createdAt: orderObj.createdAt,
            updatedAt: orderObj.updatedAt,
        };
    }
    detectLanguage(text) {
        const detectedLanguages = this.lngDetector.detect(text, 1).map(result => result[0]);
        if (detectedLanguages.length === 0) {
            return "eng";
        }
        return detectedLanguages[0] === 'english' ? 'eng' : detectedLanguages[0];
    }
    async translateText(text, toLang) {
        try {
            const fromLang = this.detectLanguage(text) === 'eng' ? 'en' : 'hi';
            if (fromLang === toLang)
                return text;
            const result = await (0, google_translate_api_x_1.translate)(text, { from: fromLang, to: toLang });
            return result.text;
        }
        catch (error) {
            this.logger.error(`Translation failed: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to translate text to ${toLang}`);
        }
    }
    async processText(input) {
        const detectedLang = this.detectLanguage(input.text);
        const isEnglish = detectedLang === 'eng';
        const enText = isEnglish ? input.text : await this.translateText(input.text, 'en');
        const hiText = !isEnglish ? input.text : await this.translateText(input.text, 'hi');
        return { en: enText, hi: hiText };
    }
    async create(createOrderDto) {
        try {
            if (!createOrderDto.customerId) {
                throw new common_1.BadRequestException('Customer ID is required');
            }
            const title = await this.processText(createOrderDto.title);
            const description = await this.processText(createOrderDto.description);
            const newOrder = new this.orderModel({
                ...createOrderDto,
                title,
                description,
                createdAt: new Date(),
                status: createOrderDto.status || 'Pending',
                bids: [],
                acceptedBidRepairmanId: null,
            });
            const savedOrder = await newOrder.save();
            this.logger.log(`Order created successfully with ID: ${savedOrder._id}`);
            return this.toOrderResponseDTO(savedOrder);
        }
        catch (error) {
            this.logger.error(`Failed to create order: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.BadRequestException('Failed to create order');
        }
    }
    async findAll() {
        try {
            const orders = await this.orderModel.find().exec();
            this.logger.debug(`Retrieved ${orders.length} orders`);
            return orders.map((order) => this.toOrderResponseDTO(order));
        }
        catch (error) {
            this.logger.error(`Failed to fetch orders: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to retrieve orders');
        }
    }
    async findOne(id) {
        try {
            if (!id || typeof id !== 'string') {
                throw new common_1.BadRequestException('Invalid order ID');
            }
            const order = await this.orderModel.findById(id).exec();
            if (!order) {
                this.logger.warn(`Order with ID ${id} not found`);
                throw new common_1.NotFoundException(`Order with ID ${id} not found`);
            }
            this.logger.debug(`Retrieved order with ID: ${id}`);
            return this.toOrderResponseDTO(order);
        }
        catch (error) {
            this.logger.error(`Failed to fetch order ${id}: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to retrieve order');
        }
    }
    async update(id, updateOrderDto, customerId) {
        try {
            if (!id || typeof id !== 'string') {
                throw new common_1.BadRequestException('Invalid order ID');
            }
            const existingOrder = await this.orderModel.findById(id).exec();
            if (!existingOrder) {
                throw new common_1.NotFoundException(`Order with ID ${id} not found`);
            }
            if (existingOrder.customerId === customerId) {
                if (existingOrder.acceptedBidRepairmanId) {
                    throw new common_1.ForbiddenException('Customers cannot edit an order after a bid is accepted');
                }
                if (existingOrder.status !== 'Pending') {
                    throw new common_1.ForbiddenException('Customers can only edit orders with status "Pending"');
                }
            }
            if (updateOrderDto.title) {
                updateOrderDto.title = await this.processText(updateOrderDto.title);
            }
            if (updateOrderDto.description) {
                updateOrderDto.description = await this.processText(updateOrderDto.description);
            }
            if (updateOrderDto.acceptedBidRepairmanId) {
                const bidExists = existingOrder.bids.some((bid) => bid.repairmanId === updateOrderDto.acceptedBidRepairmanId);
                if (!bidExists) {
                    throw new common_1.BadRequestException('Accepted bid repairman ID does not match any existing bids');
                }
            }
            const updatedOrder = await this.orderModel
                .findByIdAndUpdate(id, { ...updateOrderDto, updatedAt: new Date() }, { new: true, runValidators: true })
                .exec();
            if (!updatedOrder) {
                throw new common_1.NotFoundException(`Order with ID ${id} not found`);
            }
            this.logger.log(`Order with ID ${id} updated successfully`);
            return this.toOrderResponseDTO(updatedOrder);
        }
        catch (error) {
            this.logger.error(`Failed to update order ${id}: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to update order');
        }
    }
    async delete(id, customerId) {
        try {
            if (!id || typeof id !== 'string') {
                throw new common_1.BadRequestException('Invalid order ID');
            }
            const existingOrder = await this.orderModel.findById(id).exec();
            if (!existingOrder) {
                throw new common_1.NotFoundException(`Order with ID ${id} not found`);
            }
            if (existingOrder.customerId === customerId) {
                if (existingOrder.acceptedBidRepairmanId) {
                    throw new common_1.ForbiddenException('Customers cannot delete an order after a bid is accepted');
                }
                if (existingOrder.status !== 'Pending') {
                    throw new common_1.ForbiddenException('Customers can only delete orders with status "Pending"');
                }
            }
            const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
            if (!deletedOrder) {
                throw new common_1.NotFoundException(`Order with ID ${id} not found`);
            }
            this.logger.log(`Order with ID ${id} deleted successfully`);
            return this.toOrderResponseDTO(deletedOrder);
        }
        catch (error) {
            this.logger.error(`Failed to delete order ${id}: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to delete order');
        }
    }
    async addBid(id, repairmanId, amount, timeEstimate) {
        try {
            if (!id || typeof id !== 'string') {
                throw new common_1.BadRequestException('Invalid order ID');
            }
            const order = await this.orderModel.findById(id).exec();
            if (!order) {
                throw new common_1.NotFoundException(`Order with ID ${id} not found`);
            }
            if (!order.allowBidding) {
                throw new common_1.ForbiddenException('Bidding is not allowed for this order');
            }
            if (order.acceptedBidRepairmanId) {
                throw new common_1.ForbiddenException('A bid has already been accepted for this order');
            }
            order.bids.push({ repairmanId, amount, timeEstimate, bidAt: new Date() });
            const updatedOrder = await order.save();
            this.logger.log(`Bid added to order with ID ${id} by repairman ${repairmanId}`);
            return this.toOrderResponseDTO(updatedOrder);
        }
        catch (error) {
            this.logger.error(`Failed to add bid to order ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findByCustomer(id) {
        try {
            if (!id || typeof id !== 'string') {
                throw new common_1.BadRequestException('Invalid order ID');
            }
            const orders = await this.orderModel.find({
                customerId: id,
            }).exec();
            if (!orders) {
                this.logger.warn(`Order with ID ${id} not found`);
                throw new common_1.NotFoundException(`Order with ID ${id} not found`);
            }
            this.logger.debug(`Retrieved order with ID: ${id}`);
            return orders;
        }
        catch (error) {
            this.logger.error(`Failed to fetch order ${id}: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to retrieve order');
        }
    }
    async updateBid(orderId, bidId, repairmanId, updateBidDto) {
        try {
            if (!orderId || typeof orderId !== 'string') {
                throw new common_1.BadRequestException('Invalid order ID');
            }
            if (!bidId || typeof bidId !== 'string') {
                throw new common_1.BadRequestException('Invalid bid ID');
            }
            if (!repairmanId) {
                throw new common_1.BadRequestException('Repairman ID is required');
            }
            const order = await this.orderModel.findById(orderId).exec();
            if (!order) {
                throw new common_1.NotFoundException(`Order with ID ${orderId} not found`);
            }
            if (!order.allowBidding || order.status !== 'Open') {
                throw new common_1.ForbiddenException('Cannot update bid; order is not open for bidding');
            }
            if (order.acceptedBidRepairmanId) {
                throw new common_1.ForbiddenException('Cannot update bid; a bid has already been accepted');
            }
            const bidIndex = order.bids.findIndex((bid) => bid._id.toString() === bidId && bid.repairmanId === repairmanId);
            if (bidIndex === -1) {
                throw new common_1.NotFoundException('Bid not found or you are not authorized to update it');
            }
            order.bids[bidIndex].amount = updateBidDto.amount;
            order.bids[bidIndex].timeEstimate = updateBidDto.timeEstimate;
            order.bids[bidIndex].bidAt = new Date();
            const updatedOrder = await order.save();
            this.logger.log(`Bid ${bidId} updated for order ${orderId} by repairman ${repairmanId}`);
            return this.toOrderResponseDTO(updatedOrder);
        }
        catch (error) {
            this.logger.error(`Failed to update bid ${bidId} for order ${orderId}: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to update bid');
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = OrderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Order_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrderService);
//# sourceMappingURL=OrderService.js.map