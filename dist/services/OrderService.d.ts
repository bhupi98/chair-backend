import { Model } from 'mongoose';
import { OrderDTO, OrderResponseDTO, UpdateOrderDTO, UpdateBidDTO } from 'src/dto/OrderDTO';
import { OrderDocument } from 'src/schemas/Order';
export declare class OrderService {
    private readonly orderModel;
    private readonly logger;
    private lngDetector;
    constructor(orderModel: Model<OrderDocument>);
    private toOrderResponseDTO;
    private detectLanguage;
    private translateText;
    private processText;
    create(createOrderDto: OrderDTO): Promise<OrderResponseDTO>;
    findAll(): Promise<OrderResponseDTO[]>;
    findOne(id: string): Promise<OrderResponseDTO>;
    update(id: string, updateOrderDto: UpdateOrderDTO, customerId: string): Promise<OrderResponseDTO>;
    delete(id: string, customerId: string): Promise<OrderResponseDTO>;
    addBid(id: string, repairmanId: string, amount: number, timeEstimate: string): Promise<OrderResponseDTO>;
    findByCustomer(id: string): Promise<any>;
    updateBid(orderId: string, bidId: string, repairmanId: string, updateBidDto: UpdateBidDTO): Promise<OrderResponseDTO>;
}
