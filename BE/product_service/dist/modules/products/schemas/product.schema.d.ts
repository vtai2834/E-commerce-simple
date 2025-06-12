import { HydratedDocument } from 'mongoose';
export type ProductDocument = HydratedDocument<Product>;
export declare class Product {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, import("mongoose").Document<unknown, any, Product> & Product & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Product>> & import("mongoose").FlatRecord<Product> & {
    _id: import("mongoose").Types.ObjectId;
}>;
