import { Module } from '@nestjs/common';
import { OrdersModule } from './modules/orders/orders.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [DatabaseModule, OrdersModule]
})
export class AppModule {}