import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
export declare class ProductRepository {
    private productModel;
    constructor(productModel: Model<ProductDocument>);
    create(productData: Partial<Product>): Promise<Product>;
    findByName(name: string): Promise<Product | null>;
    findById(id: string): Promise<Product | null>;
    findAll(): Promise<Product[]>;
}
