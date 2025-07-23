import { Model } from 'mongoose';
import { Order, OrderDocument } from '../../../orders/schemas/order.schema';
import { OrderEvent } from '../events/order.events';
export declare class OrderProjection {
    private orderModel;
    constructor(orderModel: Model<OrderDocument>);
    handleEvent(event: OrderEvent): Promise<void>;
    private handleOrderCreated;
    private handleOrderUpdated;
    private handleOrderDeleted;
    findById(id: string): Promise<Order | null>;
    findByUserId(userId: string): Promise<Order[] | null>;
    findAll(): Promise<Order[] | null>;
}
