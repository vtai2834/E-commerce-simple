import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../database/database.module';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductRepository } from './schemas/product.repository';
import { ProductEventRepository } from './event_sourcing/repositories/product.repository';
import { ProductProjection } from './event_sourcing/projection/product.projection';
import { EventStore, EventStoreSchema } from './event_sourcing/infrastructure/event-store';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: EventStore.name, schema: EventStoreSchema}]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductEventRepository, ProductProjection, EventStore, ProductRepository],
  exports: [ProductService],
})
export class ProductModule {} 