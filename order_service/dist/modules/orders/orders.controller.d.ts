import { OrderService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(createOrderDto: CreateOrderDto): Promise<void>;
    findAll(): Promise<import("./schemas/order.schema").Order[]>;
    findByUserId(userId: string): Promise<import("./schemas/order.schema").Order[]>;
    findOne(id: string): Promise<import("./schemas/order.schema").Order>;
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
