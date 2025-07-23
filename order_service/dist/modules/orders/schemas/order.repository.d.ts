import { Model } from "mongoose";
import { Order, OrderDocument } from "../schemas/order.schema";
export declare class OrderRepository {
    private orderModel;
    constructor(orderModel: Model<OrderDocument>);
    create(orderData: Partial<Order>): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    findByUserId(userId: string): Promise<Order[] | null>;
    findAll(): Promise<Order[]>;
}
