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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async create(createProductDto) {
        console.log('[Product service] Product creating request received:', createProductDto.name);
        try {
            const result = await this.productService.create(createProductDto);
            console.log('[Product Service] Create product successful for:', createProductDto.name);
            return result;
        }
        catch (error) {
            console.error('[Product Service] Create product failed for:', createProductDto.name);
            throw error;
        }
    }
    async findAll() {
        console.log('[Product service] All product finding request received');
        try {
            const result = await this.productService.findAll();
            console.log('[Product service] Find all products successful');
            return result;
        }
        catch (error) {
            console.error('[Product service] Find all products failed');
            throw error;
        }
    }
    async findOne(id) {
        console.log('[Proudct service] Product finding request received for id:', id);
        try {
            const result = this.productService.findOne(id);
            console.log('[Product service] Product finding successful for id:', id);
            return result;
        }
        catch (error) {
            console.error('[Product service] Product finding failed for id:', id);
            throw error;
        }
    }
    async update(id, updateProductDto) {
        console.log('[Product service] Product updating request received for:', updateProductDto.name);
        try {
            const result = this.productService.update(id, updateProductDto);
            console.log('[Product service] Product updating successful for:', updateProductDto.name);
            return result;
        }
        catch (error) {
            console.error('[Product service] Product updating failed for:', updateProductDto.name);
            throw error;
        }
    }
    async remove(id) {
        console.log('[Product service] Product deleting request received for id:', id);
        try {
            const result = this.productService.remove(id);
            console.log('[Product service] Product deleting successful for id:', id);
            return result;
        }
        catch (error) {
            console.error('[Product service] Product deleting failed for id:', id);
            throw error;
        }
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "remove", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductService])
], ProductController);
//# sourceMappingURL=products.controller.js.map