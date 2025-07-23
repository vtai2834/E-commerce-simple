import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../../../products/schemas/product.schema';
import { ProductEvent } from '../events/product.events';

@Injectable()
export class ProductProjection {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    ) {}

    async handleEvent(event: ProductEvent): Promise<void> {
        switch (event.eventType) {
            case 'ProductCreated':
                await this.handleProductCreated(event as any);
                break;
            case 'ProductUpdated':
                await this.handleProductUpdated(event as any);
                break;
            case 'ProductDeleted':
                await this.handleProductDeleted(event as any);
                break;
        }
    }

    private async handleProductCreated(event: any): Promise<void> {
        const product = new this.productModel({
            _id: event.productId,
            name: event.name,
            description: event.description,
            price: event.price,
            stock: event.stock,
            imageUrl: event.imageUrl,
        });
        await product.save();
    }

    private async handleProductUpdated(event: any): Promise<void> {
        await this.productModel.findByIdAndUpdate(event.productId, {
            name: event.name,
            description: event.description,
            price: event.price,
            stock: event.stock,
            imageUrl: event.imageUrl,
        });
    }

    private async handleProductDeleted(event: any): Promise<void> {
        await this.productModel.findByIdAndDelete(event.productId);
    }

    // Query methods
    async findById(id: string): Promise<Product | null> {
        return this.productModel.findById(id);
    }

    async findByName(name: string): Promise<Product | null> {
        return this.productModel.findOne({ name });
    }

    async findAll(): Promise<Product[]> {
        return this.productModel.find();
    }
} 