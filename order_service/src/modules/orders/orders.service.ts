import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import axios from 'axios';

const axiosWithTimeout = axios.create({
  timeout: 5000 // 5 seconds timeout
});

async function retryOperation<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }
  }
  throw lastError;
}

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      console.log('Starting order creation for user:', createOrderDto.userEmail);
      
      // Verify user exists
      const userResponse = await retryOperation(async () => {
        console.log('Verifying user existence...');

        const host = process.env.USER_SERVICE_URL || 'http://localhost:8080';

        const response = await axiosWithTimeout.get(`${host}/users/email/${createOrderDto.userEmail}`);
        console.log('User verification response:', response.status);
        return response;
      });

      if (!userResponse.data) {
        throw new NotFoundException('User not found');
      }

      // Get product details and verify stock
      console.log('Verifying products and stock...');
      const items = await Promise.all(
        createOrderDto.items.map(async (item) => {
          const productResponse = await retryOperation(async () => {
            console.log('Checking product:', item.productId);

            const host = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8081';

            return await axiosWithTimeout.get(`${host}/products/${item.productId}`);
          });

          if (!productResponse.data) {
            throw new NotFoundException(`Product ${item.productId} not found`);
          }
          const product = productResponse.data;
          
          // Check if there's enough stock
          if (product.stock < item.quantity) {
            throw new BadRequestException(`Not enough stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
          }

          return {
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
            name: product.name,
            currentStock: product.stock
          };
        })
      );

      // Calculate total amount
      const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      console.log('Total order amount:', totalAmount);

      // Create order
      const order = new this.orderModel({
        ...createOrderDto,
        items: items.map(({ currentStock, ...item }) => item),
        totalAmount,
        status: 'pending'
      });

      console.log('Saving order...');
      const savedOrder = await order.save();
      console.log('Order saved successfully');

      // Update product stocks
      console.log('Updating product stocks...');
      await Promise.all(
        items.map(async (item) => {
          const newStock = item.currentStock - item.quantity;
          await retryOperation(async () => {
            console.log('Updating stock for product:', item.productId);

            const host = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8081';

            return await axiosWithTimeout.patch(`${host}/products/${item.productId}`, {
              stock: newStock
            } as UpdateProductDto);
          });
        })
      );
      console.log('All product stocks updated successfully');

      return savedOrder;
    } catch (error) {
      console.error('Error in order creation:', error);
      throw error;
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId }).exec();
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const existingOrder = await this.orderModel.findById(id).exec();
    if (!existingOrder) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    if (updateOrderDto.items) {
      // Recalculate total if items are updated
      const items = await Promise.all(
        updateOrderDto.items.map(async (item) => {
          const host = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8081';

          const productResponse = await axios.get(`${host}/products/${item.productId}`);
          if (!productResponse.data) {
            throw new NotFoundException(`Product ${item.productId} not found`);
          }
          const product = productResponse.data;
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
            name: product.name
          };
        })
      );

      const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      updateOrderDto['totalAmount'] = totalAmount;
      updateOrderDto['items'] = items;
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
    return updatedOrder;
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Order ${id} not found`);
    }
  }
} 