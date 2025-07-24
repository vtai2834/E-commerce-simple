import { Document } from 'mongoose';
export type OrderDocument = Order & Document;
export declare class OrderUserInfo {
    email: string;
    fullName: string;
}
export declare class OrderProductInfo {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
}
export declare const OrderUserInfoSchema: import("mongoose").Schema<OrderUserInfo, import("mongoose").Model<OrderUserInfo, any, any, any, Document<unknown, any, OrderUserInfo> & OrderUserInfo & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OrderUserInfo, Document<unknown, {}, import("mongoose").FlatRecord<OrderUserInfo>> & import("mongoose").FlatRecord<OrderUserInfo> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export declare const OrderProductInfoSchema: import("mongoose").Schema<OrderProductInfo, import("mongoose").Model<OrderProductInfo, any, any, any, Document<unknown, any, OrderProductInfo> & OrderProductInfo & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OrderProductInfo, Document<unknown, {}, import("mongoose").FlatRecord<OrderProductInfo>> & import("mongoose").FlatRecord<OrderProductInfo> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export declare class Order {
    _id: string;
    userId: string;
    userEmail: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
        name: string;
    }>;
    totalAmount: number;
    status: string;
    userInfo?: OrderUserInfo;
    productsInfo?: OrderProductInfo[];
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order> & Order & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>> & import("mongoose").FlatRecord<Order> & Required<{
    _id: string;
}>>;
