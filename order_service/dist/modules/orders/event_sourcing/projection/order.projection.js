"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderProjection = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("../../../orders/schemas/order.schema");
let OrderProjection = class OrderProjection {
    constructor(orderModel) {
        this.orderModel = orderModel;
    }
    async handleEvent(event) {
        switch (event.eventType) {
            case 'OrderCreated':
                await this.handleOrderCreated(event);
                break;
            case 'OrderUpdated':
                await this.handleOrderUpdated(event);
                break;
            case 'OrderDeleted':
                await this.handleOrderDeleted(event);
                break;
        }
    }
    async handleOrderCreated(event) {
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
    async handleOrderUpdated(event) {
        await this.orderModel.findByIdAndUpdate(event.orderId, {
            userId: event.userId,
            userEmail: event.userEmail,
            items: event.items,
            totalAmount: event.totalAmount,
            lastUpdatedAt: event.timestamp,
        });
    }
    async handleOrderDeleted(event) {
        await this.orderModel.findByIdAndUpdate(event.orderId);
    }
    async findById(id) {
        return this.orderModel.findById(id);
    }
    async findByUserId(userId) {
        return this.orderModel.find({ userId });
    }
    async findAll() {
        return this.orderModel.find();
    }
};
exports.OrderProjection = OrderProjection;
exports.OrderProjection = OrderProjection = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrderProjection);
//# sourceMappingURL=order.projection.js.map