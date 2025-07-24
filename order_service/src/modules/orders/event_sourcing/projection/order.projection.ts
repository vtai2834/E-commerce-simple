import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../../../orders/schemas/order.schema';
import { OrderEvent } from '../events/order.events';

@Injectable()
export class OrderProjection {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    ) {}

    async handleEvent(event: OrderEvent): Promise<void> {
        switch (event.eventType) {
            case 'OrderCreated':
                await this.handleOrderCreated(event as any);
                break;
            case 'OrderUpdated':
                await this.handleOrderUpdated(event as any);
                break;
            case 'OrderDeleted':
                await this.handleOrderDeleted(event as any);
                break;
        }
    }

    private async handleOrderCreated(event: any): Promise<void> {
        const order = new this.orderModel({
            _id: event.orderId,
            userId: event.userId,
            userEmail: event.userEmail,
            items: event.items,
            totalAmount: event.totalAmount,
            createdAt: event.timestamp,
        });
        await order.save();
    }

    private async handleOrderUpdated(event: any): Promise<void> {
        await this.orderModel.findByIdAndUpdate(event.orderId, {
            userId: event.userId,
            userEmail: event.userEmail,
            items: event.items,
            totalAmount: event.totalAmount,
            lastUpdatedAt: event.timestamp,
        });
    }

    private async handleOrderDeleted(event: any): Promise<void> {
        await this.orderModel.findByIdAndUpdate(event.orderId);
    }

    // Query methods
    async findById(id: string): Promise<Order | null> {
        return this.orderModel.findById(id);
    }

    async findByUserId(userId: string): Promise<Order[] | null> {
        return this.orderModel.find({ userId });
    }

    async findAll(): Promise<Order[] | null> {
        return this.orderModel.find();
    }
}