import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order, OrderDocument } from "../schemas/order.schema";

@Injectable()
export class OrderRepository {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    ) {}

    async create(orderData: Partial<Order>): Promise<Order> {
        const order = new this.orderModel(orderData);
        return order.save();
    }

    async findById(id: string): Promise<Order | null> {
        return this.orderModel.findById(id).exec();
    }

    async findByUserId(userId: string): Promise<Order[] | null> {
        return this.orderModel.find({ userId }).exec();
    }

    async findAll(): Promise<Order[]> {
        return this.orderModel.find().exec();
    }
}