import { Model } from 'mongoose';
import { Product, ProductDocument } from '../../../products/schemas/product.schema';
import { ProductEvent } from '../events/product.events';
export declare class ProductProjection {
    private productModel;
    constructor(productModel: Model<ProductDocument>);
    handleEvent(event: ProductEvent): Promise<void>;
    private handleProductCreated;
    private handleProductUpdated;
    private handleProductDeleted;
    findById(id: string): Promise<Product | null>;
    findByName(name: string): Promise<Product | null>;
    findAll(): Promise<Product[]>;
}
