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
exports.ProductClient = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
let ProductClient = class ProductClient {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async getProductsInfo(items) {
        const productIds = items.map(i => i.productId).join(',');
        const { data } = await this.httpService.get(`http://product-service:8081/products?ids=${productIds}`).toPromise();
        return data;
    }
};
exports.ProductClient = ProductClient;
exports.ProductClient = ProductClient = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ProductClient);
//# sourceMappingURL=product.client.js.map