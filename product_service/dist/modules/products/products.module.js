"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const database_module_1 = require("../database/database.module");
const product_schema_1 = require("./schemas/product.schema");
const product_repository_1 = require("./schemas/product.repository");
const product_repository_2 = require("./event_sourcing/repositories/product.repository");
const product_projection_1 = require("./event_sourcing/projection/product.projection");
const event_store_1 = require("./event_sourcing/infrastructure/event-store");
const products_service_1 = require("./products.service");
const products_controller_1 = require("./products.controller");
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            mongoose_1.MongooseModule.forFeature([{ name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: event_store_1.EventStore.name, schema: event_store_1.EventStoreSchema }]),
        ],
        controllers: [products_controller_1.ProductController],
        providers: [products_service_1.ProductService, product_repository_2.ProductEventRepository, product_projection_1.ProductProjection, event_store_1.EventStore, product_repository_1.ProductRepository],
        exports: [products_service_1.ProductService],
    })
], ProductModule);
//# sourceMappingURL=products.module.js.map