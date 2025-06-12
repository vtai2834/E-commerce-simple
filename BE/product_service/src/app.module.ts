import { Module } from '@nestjs/common';
import { ProductModule } from './modules/products/products.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [DatabaseModule, ProductModule],
})
export class AppModule {} 