import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../database/database.module';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderRepository } from './schemas/order.repository';
import { OrderEventRepository } from './event_sourcing/repositories/order.repository';
import { OrderProjection } from './event_sourcing/projection/order.projection';
import { EventStore, EventStoreSchema } from './event_sourcing/infrastructure/event-store';
import { HttpModule } from '@nestjs/axios';
import { OrderService } from './orders.service';
import { OrderController } from './orders.controller';
import { UserClient } from './clients/user.client';
import { ProductClient } from './clients/product.client';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: EventStore.name, schema: EventStoreSchema }]),
    HttpModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, UserClient, ProductClient, OrderEventRepository, OrderProjection, EventStore, OrderRepository],
  exports: [OrderService],
})
export class OrdersModule {} 