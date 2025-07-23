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
exports.ProductProjection = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../../../products/schemas/product.schema");
let ProductProjection = class ProductProjection {
    constructor(productModel) {
        this.productModel = productModel;
    }
    async handleEvent(event) {
        switch (event.eventType) {
            case 'ProductCreated':
                await this.handleProductCreated(event);
                break;
            case 'ProductUpdated':
                await this.handleProductUpdated(event);
                break;
            case 'ProductDeleted':
                await this.handleProductDeleted(event);
                break;
        }
    }
    async handleProductCreated(event) {
        const product = new this.productModel({
            _id: event.productId,
            name: event.name,
            description: event.description,
            price: event.price,
            stock: event.stock,
            imageUrl: event.imageUrl,
        });
        await product.save();
    }
    async handleProductUpdated(event) {
        await this.productModel.findByIdAndUpdate(event.productId, {
            name: event.name,
            description: event.description,
            price: event.price,
            stock: event.stock,
            imageUrl: event.imageUrl,
        });
    }
    async handleProductDeleted(event) {
        await this.productModel.findByIdAndDelete(event.productId);
    }
    async findById(id) {
        return this.productModel.findById(id);
    }
    async findByName(name) {
        return this.productModel.findOne({ name });
    }
    async findAll() {
        return this.productModel.find();
    }
};
exports.ProductProjection = ProductProjection;
exports.ProductProjection = ProductProjection = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductProjection);
//# sourceMappingURL=product.projection.js.map