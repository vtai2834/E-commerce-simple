"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const database_module_1 = require("../database/database.module");
const order_schema_1 = require("./schemas/order.schema");
const order_repository_1 = require("./schemas/order.repository");
const order_repository_2 = require("./event_sourcing/repositories/order.repository");
const order_projection_1 = require("./event_sourcing/projection/order.projection");
const event_store_1 = require("./event_sourcing/infrastructure/event-store");
const axios_1 = require("@nestjs/axios");
const orders_service_1 = require("./orders.service");
const orders_controller_1 = require("./orders.controller");
const user_client_1 = require("./clients/user.client");
const product_client_1 = require("./clients/product.client");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            mongoose_1.MongooseModule.forFeature([{ name: order_schema_1.Order.name, schema: order_schema_1.OrderSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: event_store_1.EventStore.name, schema: event_store_1.EventStoreSchema }]),
            axios_1.HttpModule,
        ],
        controllers: [orders_controller_1.OrderController],
        providers: [orders_service_1.OrderService, user_client_1.UserClient, product_client_1.ProductClient, order_repository_2.OrderEventRepository, order_projection_1.OrderProjection, event_store_1.EventStore, order_repository_1.OrderRepository],
        exports: [orders_service_1.OrderService],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map