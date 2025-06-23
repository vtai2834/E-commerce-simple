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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = exports.Order = exports.OrderProductInfoSchema = exports.OrderUserInfoSchema = exports.OrderProductInfo = exports.OrderUserInfo = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let OrderUserInfo = class OrderUserInfo {
};
exports.OrderUserInfo = OrderUserInfo;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OrderUserInfo.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OrderUserInfo.prototype, "fullName", void 0);
exports.OrderUserInfo = OrderUserInfo = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], OrderUserInfo);
let OrderProductInfo = class OrderProductInfo {
};
exports.OrderProductInfo = OrderProductInfo;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OrderProductInfo.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], OrderProductInfo.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], OrderProductInfo.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], OrderProductInfo.prototype, "stock", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], OrderProductInfo.prototype, "imageUrl", void 0);
exports.OrderProductInfo = OrderProductInfo = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], OrderProductInfo);
exports.OrderUserInfoSchema = mongoose_1.SchemaFactory.createForClass(OrderUserInfo);
exports.OrderProductInfoSchema = mongoose_1.SchemaFactory.createForClass(OrderProductInfo);
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Order.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Order.prototype, "userEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            productId: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            name: { type: String, required: true }
        }]),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['pending', 'completed', 'cancelled'], default: 'pending' }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.OrderUserInfoSchema }),
    __metadata("design:type", OrderUserInfo)
], Order.prototype, "userInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.OrderProductInfoSchema] }),
    __metadata("design:type", Array)
], Order.prototype, "productsInfo", void 0);
exports.Order = Order = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Order);
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(Order);
//# sourceMappingURL=order.schema.js.map