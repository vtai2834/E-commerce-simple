import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEventRepository } from './event_sourcing/repositories/order.repository';
import { OrderProjection } from './event_sourcing/projection/order.projection';
export declare class OrderService {
    private orderModel;
    private orderRepository;
    private orderProjection;
    constructor(orderModel: Model<OrderDocument>, orderRepository: OrderEventRepository, orderProjection: OrderProjection);
    create(createOrderDto: CreateOrderDto): Promise<void>;
    findAll(): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    findByUserId(userId: string): Promise<Order[]>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<{
        message: string;
        order: {
            id: string;
            userId: string;
            userEmail: string;
            items: import("./event_sourcing/events/order.events").OrderItem[];
            totalAmount: number;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
