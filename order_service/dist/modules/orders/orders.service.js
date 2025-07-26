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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const order_repository_1 = require("./event_sourcing/repositories/order.repository");
const order_projection_1 = require("./event_sourcing/projection/order.projection");
const order_aggregate_1 = require("./event_sourcing/aggregate/order.aggregate");
const uuid_1 = require("uuid");
const axios_1 = require("axios");
const axiosWithTimeout = axios_1.default.create({
    timeout: 5000
});
async function retryOperation(operation, maxRetries = 3) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        }
        catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error.message);
            lastError = error;
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }
    throw lastError;
}
let OrderService = class OrderService {
    constructor(orderModel, orderRepository, orderProjection) {
        this.orderModel = orderModel;
        this.orderRepository = orderRepository;
        this.orderProjection = orderProjection;
    }
    async create(createOrderDto) {
        try {
            const { userId, userEmail, items: orderItems } = createOrderDto;
            console.log('[Order Service] Starting order creation for user:', userEmail);
            const userResponse = await retryOperation(async () => {
                console.log('[Order Service] Verifying user existence...');
                const host = process.env.USER_SERVICE_URL || 'http://localhost:8080';
                const response = await axiosWithTimeout.get(`${host}/users/email/${createOrderDto.userEmail}`);
                console.log('[Order Service] User verification response:', response.status);
                return response;
            });
            if (!userResponse.data) {
                throw new common_1.NotFoundException('User not found');
            }
            console.log('[Order Service] Verifying products and stock...');
            const checkedItems = await Promise.all(orderItems.map(async (item) => {
                const productResponse = await retryOperation(async () => {
                    console.log('[Order Service] Checking product:', item.productId);
                    const host = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8081';
                    return await axiosWithTimeout.get(`${host}/products/${item.productId}`);
                });
                if (!productResponse.data) {
                    throw new common_1.NotFoundException(`Product ${item.productId} not found`);
                }
                const product = productResponse.data;
                if (product.stock < item.quantity) {
                    throw new common_1.BadRequestException(`Not enough stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
                }
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price,
                    name: product.name,
                    currentStock: product.stock
                };
            }));
            const totalAmount = checkedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            console.log('[Order Service] Total order amount:', totalAmount);
            const orderId = (0, uuid_1.v4)();
            const orderAggregate = new order_aggregate_1.OrderAggregate(orderId);
            orderAggregate.create(userId, userEmail, checkedItems, totalAmount);
            console.log('[Order Service] Saving order...');
            for (const event of orderAggregate.uncommittedEvents) {
                await this.orderProjection.handleEvent(event);
            }
            const savedOrder = await this.orderRepository.save(orderAggregate);
            console.log('[Order Service] Order saved successfully');
            console.log('[Order Service] Updating product stocks...');
            await Promise.all(checkedItems.map(async (item) => {
                const newStock = item.currentStock - item.quantity;
                await retryOperation(async () => {
                    console.log('Updating stock for product:', item.productId);
                    const host = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8081';
                    return await axiosWithTimeout.patch(`${host}/products/${item.productId}`, {
                        stock: newStock
                    });
                });
            }));
            console.log('[Order Service] All product stocks updated successfully');
            return savedOrder;
        }
        catch (error) {
            console.error('[Order Service] Error in order creation:', error);
            throw error;
        }
    }
    async findAll() {
        return this.orderModel.find().exec();
    }
    async findOne(id) {
        const order = await this.orderModel.findById(id).exec();
        if (!order) {
            throw new common_1.NotFoundException(`Order ${id} not found`);
        }
        return order;
    }
    async findByUserId(userId) {
        return this.orderModel.find({ userId }).exec();
    }
    async update(id, updateOrderDto) {
        const { userId, userEmail, items: orderItems } = updateOrderDto;
        const order = await this.orderProjection.findById(id);
        if (!order) {
            throw new common_1.NotFoundException(`Cannot find the order with id ${id}`);
        }
        const orderAggregate = await this.orderRepository.getById(id);
        if (!orderAggregate) {
            throw new common_1.NotFoundException('Order not found');
        }
        const checkedItems = await Promise.all(orderItems.map(async (item) => {
            const productResponse = await retryOperation(async () => {
                const host = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8081';
                return await axiosWithTimeout.get(`${host}/products/${item.productId}`);
            });
            if (!productResponse.data) {
                throw new common_1.NotFoundException(`Product ${item.productId} not found`);
            }
            const product = productResponse.data;
            if (product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Not enough stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
            }
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
                name: product.name,
                currentStock: product.stock
            };
        }));
        const totalAmount = checkedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        updateOrderDto['totalAmount'] = totalAmount;
        updateOrderDto['items'] = checkedItems;
        orderAggregate.update(userId, userEmail, orderItems, totalAmount);
        for (const event of orderAggregate.uncommittedEvents) {
            await this.orderProjection.handleEvent(event);
        }
        await this.orderRepository.save(orderAggregate);
        const orderState = orderAggregate.state;
        return {
            message: 'Order updated successfully',
            order: {
                id: orderState.id,
                userId: orderState.userId,
                userEmail: orderState.userEmail,
                items: orderState.items,
                totalAmount: orderState.totalAmount,
            },
        };
    }
    async remove(id) {
        const orderAggregate = await this.orderRepository.getById(id);
        if (!orderAggregate) {
            throw new common_1.NotFoundException('Order not found');
        }
        orderAggregate.delete(id);
        for (const event of orderAggregate.uncommittedEvents) {
            await this.orderProjection.handleEvent(event);
        }
        await this.orderRepository.save(orderAggregate);
        return { message: 'Order deleted successfully' };
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        order_repository_1.OrderEventRepository,
        order_projection_1.OrderProjection])
], OrderService);
//# sourceMappingURL=orders.service.js.map