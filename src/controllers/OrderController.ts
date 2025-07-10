// src/controllers/OrderController.ts
import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { OrderDTO, OrderResponseDTO, UpdateOrderDTO, UpdateBidDTO } from 'src/dto/OrderDTO';
import { GetUser } from 'src/get-user.decorator';
import { JwtAuthGuard } from 'src/JwtAuthGuard';
import { OrderService } from 'src/services/OrderService';

@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: OrderDTO): Promise<OrderResponseDTO> {
    return this.orderService.create(createOrderDto);
  }

  @Get("getAllOrders")
  async getAllOrders(): Promise<OrderResponseDTO[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrderResponseDTO> {
    return this.orderService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDTO,
    @GetUser() user,
  ): Promise<OrderResponseDTO> {
    const customerId = user?.userId;
    if (!customerId) throw new BadRequestException('Customer ID is required');
    return this.orderService.update(id, updateOrderDto, customerId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id') id: string,
    @GetUser() user,
  ): Promise<OrderResponseDTO> {
    const customerId = user?.userId;
    if (!customerId) throw new BadRequestException('Customer ID is required');
    return this.orderService.delete(id, customerId);
  }

  @Get('findByCustomer/:id')
  async findByCustomer(@Param('id') id: string): Promise<OrderResponseDTO[]> {
    return this.orderService.findByCustomer(id);
  }

  @Post(':id/bids')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async addBid(
    @Param('id') id: string,
    @Body('repairmanId') repairmanId: string,
    @Body('amount') amount: number,
    @Body('timeEstimate') timeEstimate: string,
  ): Promise<OrderResponseDTO> {
    const userId = repairmanId;
    console.log("repairmanId", repairmanId, amount);
    if (!userId) throw new BadRequestException('User ID is required');
    return this.orderService.addBid(id, userId, amount, timeEstimate);
  }

  @Put(':orderId/bids/:bidId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateBid(
    @Param('orderId') orderId: string,
    @Param('bidId') bidId: string,
    @Body() updateBidDto: UpdateBidDTO,
    @GetUser() user,
  ): Promise<OrderResponseDTO> {
    const repairmanId = user?.userId;
    if (!repairmanId) throw new BadRequestException('Repairman ID is required');
    return this.orderService.updateBid(orderId, bidId, repairmanId, updateBidDto);
  }
}