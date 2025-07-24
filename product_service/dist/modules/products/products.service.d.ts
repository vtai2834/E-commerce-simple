import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEventRepository } from './event_sourcing/repositories/product.repository';
import { ProductProjection } from './event_sourcing/projection/product.projection';
export declare class ProductService {
    private productModel;
    private productRepository;
    private productProjection;
    constructor(productModel: Model<ProductDocument>, productRepository: ProductEventRepository, productProjection: ProductProjection);
    create(createProductDto: CreateProductDto): Promise<{
        message: string;
        product: {
            id: string;
            name: string;
            description: string;
            price: number;
            stock: number;
        };
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        message: string;
        product: {
            id: string;
            name: string;
            description: string;
            price: number;
            stock: number;
            imageUrl: string;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findAll(): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
}
