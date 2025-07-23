import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';

@Injectable()
export class ProductRepository {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    ) {}
    
    async create(productData: Partial<Product>): Promise<Product> {
        const product = new this.productModel(productData);
        return product.save();
    }

    async findByName(name: string): Promise<Product | null> {
        return this.productModel.findOne({ name }).exec();
    }

    async findById(id: string): Promise<Product | null> {
        return this.productModel.findOne({ id }).exec();
    }
    
    async findAll(): Promise<Product[]> {
        return this.productModel.find().exec();
    }
}