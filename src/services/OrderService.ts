import { Injectable, NotFoundException, BadRequestException, Logger, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDTO, OrderResponseDTO, TitleDescription, UpdateOrderDTO, UpdateBidDTO } from 'src/dto/OrderDTO';
import { Order, OrderDocument } from 'src/schemas/Order';
import { translate } from 'google-translate-api-x';
const LanguageDetect = require('languagedetect'); // Use CommonJS require

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  private lngDetector: any;

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {
    this.lngDetector = new LanguageDetect();
  }

  /**
   * Transforms an OrderDocument to OrderResponseDTO, converting Date fields to strings.
   */
  private toOrderResponseDTO(order: OrderDocument): OrderResponseDTO {
    const orderObj = order.toObject();
    return {
      ...orderObj,
      bids: orderObj.bids.map((bid) => ({
        repairmanId: bid.repairmanId,
        amount: bid.amount,
        timeEstimate: bid.timeEstimate,
        bidAt: bid.bidAt.toISOString(), // Convert Date to string
      })),
      createdAt: orderObj.createdAt, // Already a Date
      updatedAt: orderObj.updatedAt, // Already a Date or undefined
    };
  }

  private detectLanguage(text: string): string {
    const detectedLanguages = this.lngDetector.detect(text, 1).map(result => result[0]); // Extracting language name
    if (detectedLanguages.length === 0) {
      return "eng"; // Default to English if no language is detected
    }
    return detectedLanguages[0] === 'english' ? 'eng' : detectedLanguages[0];
  }

  private async translateText(text: string, toLang: 'en' | 'hi'): Promise<string> {
    try {
      const fromLang = this.detectLanguage(text) === 'eng' ? 'en' : 'hi';
      if (fromLang === toLang) return text;
      const result = await translate(text, { from: fromLang, to: toLang });
      return result.text;
    } catch (error) {
      this.logger.error(`Translation failed: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to translate text to ${toLang}`);
    }
  }

  private async processText(input: TitleDescription): Promise<{ en: string; hi: string }> {
    const detectedLang = this.detectLanguage(input.text);
    const isEnglish = detectedLang === 'eng';
    
    const enText = isEnglish ? input.text : await this.translateText(input.text, 'en');
    const hiText = !isEnglish ? input.text : await this.translateText(input.text, 'hi');

    return { en: enText, hi: hiText };
  }

  async create(createOrderDto: OrderDTO): Promise<OrderResponseDTO> {
    try {
      if (!createOrderDto.customerId) {
        throw new BadRequestException('Customer ID is required');
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
    } catch (error) {
      this.logger.error(`Failed to create order: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to create order');
    }
  }

  async findAll(): Promise<OrderResponseDTO[]> {
    try {
      const orders = await this.orderModel.find().exec();
      this.logger.debug(`Retrieved ${orders.length} orders`);
      return orders.map((order) => this.toOrderResponseDTO(order));
    } catch (error) {
      this.logger.error(`Failed to fetch orders: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve orders');
    }
  }

  async findOne(id: string): Promise<OrderResponseDTO> {
    try {
      if (!id || typeof id !== 'string') {
        throw new BadRequestException('Invalid order ID');
      }

      const order = await this.orderModel.findById(id).exec();
      if (!order) {
        this.logger.warn(`Order with ID ${id} not found`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      this.logger.debug(`Retrieved order with ID: ${id}`);
      return this.toOrderResponseDTO(order);
    } catch (error) {
      this.logger.error(`Failed to fetch order ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve order');
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDTO, customerId: string): Promise<OrderResponseDTO> {
    try {
      if (!id || typeof id !== 'string') {
        throw new BadRequestException('Invalid order ID');
      }

      const existingOrder = await this.orderModel.findById(id).exec();
      if (!existingOrder) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      if (existingOrder.customerId === customerId) {
        if (existingOrder.acceptedBidRepairmanId) {
          throw new ForbiddenException('Customers cannot edit an order after a bid is accepted');
        }
        if (existingOrder.status !== 'Pending') {
          throw new ForbiddenException('Customers can only edit orders with status "Pending"');
        }
      }

      if (updateOrderDto.title) {
        // @ts-ignore
        updateOrderDto.title = await this.processText(updateOrderDto.title);
      }
      if (updateOrderDto.description) {
        // @ts-ignore
        updateOrderDto.description = await this.processText(updateOrderDto.description);
      }

      if (updateOrderDto.acceptedBidRepairmanId) {
        const bidExists = existingOrder.bids.some(
          (bid) => bid.repairmanId === updateOrderDto.acceptedBidRepairmanId,
        );
        if (!bidExists) {
          throw new BadRequestException('Accepted bid repairman ID does not match any existing bids');
        }
      }

      const updatedOrder = await this.orderModel
        .findByIdAndUpdate(
          id,
          { ...updateOrderDto, updatedAt: new Date() },
          { new: true, runValidators: true },
        )
        .exec();

      if (!updatedOrder) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      this.logger.log(`Order with ID ${id} updated successfully`);
      return this.toOrderResponseDTO(updatedOrder);
    } catch (error) {
      this.logger.error(`Failed to update order ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to update order');
    }
  }

  async delete(id: string, customerId: string): Promise<OrderResponseDTO> {
    try {
      if (!id || typeof id !== 'string') {
        throw new BadRequestException('Invalid order ID');
      }

      const existingOrder = await this.orderModel.findById(id).exec();
      if (!existingOrder) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      if (existingOrder.customerId === customerId) {
        if (existingOrder.acceptedBidRepairmanId) {
          throw new ForbiddenException('Customers cannot delete an order after a bid is accepted');
        }
        if (existingOrder.status !== 'Pending') {
          throw new ForbiddenException('Customers can only delete orders with status "Pending"');
        }
      }

      const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
      if (!deletedOrder) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      this.logger.log(`Order with ID ${id} deleted successfully`);
      return this.toOrderResponseDTO(deletedOrder);
    } catch (error) {
      this.logger.error(`Failed to delete order ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete order');
    }
  }

  async addBid(id: string, repairmanId: string, amount: number, timeEstimate: string): Promise<OrderResponseDTO> {
    try {
      if (!id || typeof id !== 'string') {
        throw new BadRequestException('Invalid order ID');
      }

      const order = await this.orderModel.findById(id).exec();
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      if (!order.allowBidding) {
        throw new ForbiddenException('Bidding is not allowed for this order');
      }

      if (order.acceptedBidRepairmanId) {
        throw new ForbiddenException('A bid has already been accepted for this order');
      }

      order.bids.push({ repairmanId, amount, timeEstimate, bidAt: new Date() });
      const updatedOrder = await order.save();

      this.logger.log(`Bid added to order with ID ${id} by repairman ${repairmanId}`);
      return this.toOrderResponseDTO(updatedOrder);
    } catch (error) {
      this.logger.error(`Failed to add bid to order ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByCustomer(id: string): Promise<any> {
    try {
      if (!id || typeof id !== 'string') {
        throw new BadRequestException('Invalid order ID');
      }

      const orders = await this.orderModel.find({
        customerId: id,
      }).exec();
      if (!orders) {
        this.logger.warn(`Order with ID ${id} not found`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      this.logger.debug(`Retrieved order with ID: ${id}`);
      return orders;
    } catch (error) {
      this.logger.error(`Failed to fetch order ${id}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve order');
    }
  }

  async updateBid(orderId: string, bidId: string, repairmanId: string, updateBidDto: UpdateBidDTO): Promise<OrderResponseDTO> {
    try {
      if (!orderId || typeof orderId !== 'string') {
        throw new BadRequestException('Invalid order ID');
      }
      if (!bidId || typeof bidId !== 'string') {
        throw new BadRequestException('Invalid bid ID');
      }
      if (!repairmanId) {
        throw new BadRequestException('Repairman ID is required');
      }

      const order = await this.orderModel.findById(orderId).exec();
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      // Check if bidding is allowed and order is still open
      if (!order.allowBidding || order.status !== 'Open') {
        throw new ForbiddenException('Cannot update bid; order is not open for bidding');
      }
      if (order.acceptedBidRepairmanId) {
        throw new ForbiddenException('Cannot update bid; a bid has already been accepted');
      }

      // Find the bid by ID and repairmanId
      const bidIndex = order.bids.findIndex(
        //@ts-ignore
        (bid) => bid._id.toString() === bidId && bid.repairmanId === repairmanId
      );
      if (bidIndex === -1) {
        throw new NotFoundException('Bid not found or you are not authorized to update it');
      }

      // Update bid details
      order.bids[bidIndex].amount = updateBidDto.amount;
      order.bids[bidIndex].timeEstimate = updateBidDto.timeEstimate;
      order.bids[bidIndex].bidAt = new Date(); // Update timestamp to reflect the edit

      const updatedOrder = await order.save();
      this.logger.log(`Bid ${bidId} updated for order ${orderId} by repairman ${repairmanId}`);
      return this.toOrderResponseDTO(updatedOrder);
    } catch (error) {
      this.logger.error(`Failed to update bid ${bidId} for order ${orderId}: ${error.message}`, error.stack);
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to update bid');
    }
  }
}