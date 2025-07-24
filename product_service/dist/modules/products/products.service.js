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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
const product_repository_1 = require("./event_sourcing/repositories/product.repository");
const product_projection_1 = require("./event_sourcing/projection/product.projection");
const product_aggregate_1 = require("./event_sourcing/aggregate/product.aggregate");
const uuid_1 = require("uuid");
let ProductService = class ProductService {
    constructor(productModel, productRepository, productProjection) {
        this.productModel = productModel;
        this.productRepository = productRepository;
        this.productProjection = productProjection;
    }
    async create(createProductDto) {
        const { name, description, stock, price, imageUrl } = createProductDto;
        const existingProduct = await this.productProjection.findByName(name);
        if (existingProduct) {
            throw new common_1.ConflictException('Product already exists');
        }
        const productId = (0, uuid_1.v4)();
        const productAggregate = new product_aggregate_1.ProductAggregate(productId);
        productAggregate.create(name, description, price, stock, imageUrl);
        for (const event of productAggregate.uncommittedEvents) {
            await this.productProjection.handleEvent(event);
        }
        await this.productRepository.save(productAggregate);
        const productState = productAggregate.state;
        return {
            message: 'Product created successfully',
            product: {
                id: productState.id,
                name: productState.name,
                description: productState.description,
                price: productState.price,
                stock: productState.stock,
            }
        };
    }
    async update(id, updateProductDto) {
        const { name, description, price, stock, imageUrl } = updateProductDto;
        const product = await this.productProjection.findById(id);
        if (!product) {
            throw new common_1.NotFoundException(`Cannot find the product with id ${id}`);
        }
        const productAggregate = await this.productRepository.getById(product._id);
        if (!productAggregate) {
            throw new common_1.NotFoundException('Product not found');
        }
        productAggregate.update(name, description, price, stock, imageUrl);
        for (const event of productAggregate.uncommittedEvents) {
            await this.productProjection.handleEvent(event);
        }
        await this.productRepository.save(productAggregate);
        const productState = productAggregate.state;
        return {
            message: 'Product updated successfully',
            product: {
                id: productState.id,
                name: productState.name,
                description: productState.description,
                price: productState.price,
                stock: product.stock,
                imageUrl: product.imageUrl,
            },
        };
    }
    async remove(id) {
        const productAggregate = await this.productRepository.getById(id);
        if (!productAggregate) {
            throw new common_1.NotFoundException('Product not found');
        }
        productAggregate.delete(id);
        for (const event of productAggregate.uncommittedEvents) {
            await this.productProjection.handleEvent(event);
        }
        await this.productRepository.save(productAggregate);
        return { message: 'Product deleted successfully' };
    }
    async findAll() {
        return this.productModel.find();
    }
    async findOne(id) {
        const product = await this.productModel.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        product_repository_1.ProductEventRepository,
        product_projection_1.ProductProjection])
], ProductService);
//# sourceMappingURL=products.service.js.map