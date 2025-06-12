import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27019/order-service'),
    OrdersModule
  ],
})
export class AppModule {} 