import { OrderDTO, OrderResponseDTO, UpdateOrderDTO, UpdateBidDTO } from 'src/dto/OrderDTO';
import { OrderService } from 'src/services/OrderService';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(createOrderDto: OrderDTO): Promise<OrderResponseDTO>;
    getAllOrders(): Promise<OrderResponseDTO[]>;
    findOne(id: string): Promise<OrderResponseDTO>;
    update(id: string, updateOrderDto: UpdateOrderDTO, user: any): Promise<OrderResponseDTO>;
    delete(id: string, user: any): Promise<OrderResponseDTO>;
    findByCustomer(id: string): Promise<OrderResponseDTO[]>;
    addBid(id: string, repairmanId: string, amount: number, timeEstimate: string): Promise<OrderResponseDTO>;
    updateBid(orderId: string, bidId: string, updateBidDto: UpdateBidDTO, user: any): Promise<OrderResponseDTO>;
}
