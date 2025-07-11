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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
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
    constructor(orderModel) {
        this.orderModel = orderModel;
    }
    async create(createOrderDto) {
        try {
            console.log('Starting order creation for user:', createOrderDto.userEmail);
            const userResponse = await retryOperation(async () => {
                console.log('Verifying user existence...');
                const response = await axiosWithTimeout.get(`${process.env.USER_SERVICE_URL}/users/email/${createOrderDto.userEmail}`);
                console.log('User verification response:', response.status);
                return response;
            });
            if (!userResponse.data) {
                throw new common_1.NotFoundException('User not found');
            }
            console.log('Verifying products and stock...');
            const items = await Promise.all(createOrderDto.items.map(async (item) => {
                const productResponse = await retryOperation(async () => {
                    console.log('Checking product:', item.productId);
                    return await axiosWithTimeout.get(`${process.env.PRODUCT_SERVICE_URL}/products/${item.productId}`);
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
            const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            console.log('Total order amount:', totalAmount);
            const order = new this.orderModel(Object.assign(Object.assign({}, createOrderDto), { items: items.map((_a) => {
                    var { currentStock } = _a, item = __rest(_a, ["currentStock"]);
                    return item;
                }), totalAmount, status: 'pending' }));
            console.log('Saving order...');
            const savedOrder = await order.save();
            console.log('Order saved successfully');
            console.log('Updating product stocks...');
            await Promise.all(items.map(async (item) => {
                const newStock = item.currentStock - item.quantity;
                await retryOperation(async () => {
                    console.log('Updating stock for product:', item.productId);
                    return await axiosWithTimeout.patch(`${process.env.PRODUCT_SERVICE_URL}/products/${item.productId}`, {
                        stock: newStock
                    });
                });
            }));
            console.log('All product stocks updated successfully');
            return savedOrder;
        }
        catch (error) {
            console.error('Error in order creation:', error);
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
        const existingOrder = await this.orderModel.findById(id).exec();
        if (!existingOrder) {
            throw new common_1.NotFoundException(`Order ${id} not found`);
        }
        if (updateOrderDto.items) {
            const items = await Promise.all(updateOrderDto.items.map(async (item) => {
                const productResponse = await axios_1.default.get(`${process.env.PRODUCT_SERVICE_URL}/products/${item.productId}`);
                if (!productResponse.data) {
                    throw new common_1.NotFoundException(`Product ${item.productId} not found`);
                }
                const product = productResponse.data;
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price,
                    name: product.name
                };
            }));
            const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            updateOrderDto['totalAmount'] = totalAmount;
            updateOrderDto['items'] = items;
        }
        const updatedOrder = await this.orderModel
            .findByIdAndUpdate(id, updateOrderDto, { new: true })
            .exec();
        return updatedOrder;
    }
    async remove(id) {
        const result = await this.orderModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`Order ${id} not found`);
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrderService);
//# sourceMappingURL=orders.service.js.map