import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { OrderEventRepository } from './event_sourcing/repositories/order.repository';
import { OrderProjection } from './event_sourcing/projection/order.projection';
import { OrderAggregate } from './event_sourcing/aggregate/order.aggregate';
import { v4 as uuidv4 } from 'uuid';
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
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private orderRepository: OrderEventRepository,
    private orderProjection: OrderProjection,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const { userId, userEmail, items: orderItems } = createOrderDto;

      console.log('[Order Service] Starting order creation for user:', userEmail);

      // Verify user exists
      const userResponse = await retryOperation(async () => {
        console.log('[Order Service] Verifying user existence...'); 
        const host = process.env.USER_SERVICE_URL || 'http://localhost:8080';
        const response = await axiosWithTimeout.get(`${host}/users/email/${createOrderDto.userEmail}`);
        console.log('[Order Service] User verification response:', response.status);
        return response;
      });

      if (!userResponse.data) {
        throw new NotFoundException('User not found');
      }

      // Get product details and verify stock
      console.log('[Order Service] Verifying products and stock...');
      const checkedItems = await Promise.all(
        orderItems.map(async (item) => {
          const productResponse = await retryOperation(async () => {
            console.log('[Order Service] Checking product:', item.productId);
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
      const totalAmount = checkedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      console.log('[Order Service] Total order amount:', totalAmount);

      // Create order aggregate
      const orderId = uuidv4();
      const orderAggregate = new OrderAggregate(orderId);

      // Create order
      // const order = new this.orderModel({
      //   ...createOrderDto,
      //   items: checkedItems.map(({ currentStock, ...item }) => item),
      //   totalAmount,
      //   status: 'pending'
      // });
      orderAggregate.create(userId, userEmail, checkedItems, totalAmount);

      console.log('[Order Service] Saving order...');

      // Update projection
      for (const event of orderAggregate.uncommittedEvents) {
        await this.orderProjection.handleEvent(event);
      }

      // Save aggregate (this saves all events)
      const savedOrder = await this.orderRepository.save(orderAggregate);
      
      console.log('[Order Service] Order saved successfully');

      // Update product stocks
      console.log('[Order Service] Updating product stocks...');
      await Promise.all(
        checkedItems.map(async (item) => {
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
      console.log('[Order Service] All product stocks updated successfully');

      return savedOrder;
    } catch (error) {
      console.error('[Order Service] Error in order creation:', error);
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

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const { userId, userEmail, items: orderItems } = updateOrderDto;
    
    // Get order from projection for updating
    const order = await this.orderProjection.findById(id);
    if (!order) {
      throw new NotFoundException(`Cannot find the order with id ${id}`);
    }

    // Get order aggregate
    const orderAggregate = await this.orderRepository.getById(id);
    if (!orderAggregate) {
      throw new NotFoundException('Order not found');
    }

    // Recalculate total if items are updated
    const checkedItems = await Promise.all(
      orderItems.map(async (item) => {
        const productResponse = await retryOperation(async () => {
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

    const totalAmount = checkedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateOrderDto['totalAmount'] = totalAmount;
    updateOrderDto['items'] = checkedItems;

    
    // Update order
    orderAggregate.update(userId, userEmail, orderItems, totalAmount);

    // Update projection
    for (const event of orderAggregate.uncommittedEvents) {
      await this.orderProjection.handleEvent(event);
    }

    // Save aggregate
    await this.orderRepository.save(orderAggregate);
    
    const orderState = orderAggregate.state;
    return {
      message: 'Order updated successfully',
      order: {
        id: orderState.id,
        userId: orderState.userId,
        userEmail: orderState.userEmail,
        items: orderState.items,
        totalAmount: orderState.totalAmount,
      },
    };

    // const existingOrder = await this.orderModel.findById(id).exec();
    // if (!existingOrder) {
    //   throw new NotFoundException(`Order ${id} not found`);
    // }

    // if (updateOrderDto.items) {
    //   // Recalculate total if items are updated
    //   const items = await Promise.all(
    //     updateOrderDto.items.map(async (item) => {
    //       const productResponse = await axios.get(`${process.env.PRODUCT_SERVICE_URL}/products/${item.productId}`);
    //       if (!productResponse.data) {
    //         throw new NotFoundException(`Product ${item.productId} not found`);
    //       }
    //       const product = productResponse.data;
    //       return {
    //         productId: item.productId,
    //         quantity: item.quantity,
    //         price: product.price,
    //         name: product.name
    //       };
    //     })
    //   );

    //   const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    //   updateOrderDto['totalAmount'] = totalAmount;
    //   updateOrderDto['items'] = items;
    // }

    // const updatedOrder = await this.orderModel
    //   .findByIdAndUpdate(id, updateOrderDto, { new: true })
    //   .exec();
    // return updatedOrder;
  }

  async remove(id: string) {
    // const result = await this.orderModel.deleteOne({ _id: id }).exec();
    // if (result.deletedCount === 0) {
    //   throw new NotFoundException(`Order ${id} not found`);
    // }

    // Get order aggregate
    const orderAggregate = await this.orderRepository.getById(id);
    if (!orderAggregate) {
      throw new NotFoundException('Order not found');
    }

    // Delete order
    orderAggregate.delete(id);

    // Update projection
    for (const event of orderAggregate.uncommittedEvents) {
      await this.orderProjection.handleEvent(event);
    }

    // Save aggregate
    await this.orderRepository.save(orderAggregate);

    return { message: 'Order deleted successfully' };
  }
} 