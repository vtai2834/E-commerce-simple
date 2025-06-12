import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

// Define inline schemas for embedded documents
@Schema({ _id: false })
export class OrderUserInfo {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  fullName: string;
}

@Schema({ _id: false })
export class OrderProductInfo {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop()
  imageUrl: string;
}

export const OrderUserInfoSchema = SchemaFactory.createForClass(OrderUserInfo);
export const OrderProductInfoSchema = SchemaFactory.createForClass(OrderProductInfo);

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userEmail: string;

  @Prop([{
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    name: { type: String, required: true }
  }])
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }>;

  @Prop({ required: true, default: 0 })
  totalAmount: number;

  @Prop({ required: true, enum: ['pending', 'completed', 'cancelled'], default: 'pending' })
  status: string;

  @Prop({ type: OrderUserInfoSchema })
  userInfo?: OrderUserInfo;

  @Prop({ type: [OrderProductInfoSchema] })
  productsInfo?: OrderProductInfo[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);