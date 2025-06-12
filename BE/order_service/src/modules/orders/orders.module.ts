import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderService } from './orders.service';
import { OrderController } from './orders.controller';
import { UserClient } from './clients/user.client';
import { ProductClient } from './clients/product.client';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    HttpModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, UserClient, ProductClient],
  exports: [OrderService],
})
export class OrdersModule {} 