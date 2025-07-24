import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { OrderService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { constrainedMemory } from 'process';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const result = await this.orderService.create(createOrderDto);
      console.log('[Order Service] Create order successful for:', createOrderDto.userId);
      return result;
    } catch (error) {
      console.error('[Order Service] Error in create order controller:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const result = await this.orderService.findAll();
      console.log('[Order Service] Find all orders successful');
      return result;
    } catch (error) {
      console.error('[Order Service] Error in findAll orders:', error);
      throw new HttpException(
        'Error fetching orders',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    try {
      const result = await this.orderService.findByUserId(userId);
      console.log('[Order Service] Find orders successful for userId :', userId);
      return result
    } catch (error) {
      console.error('[Order Service] Error in findByUserId:', error);
      throw new HttpException(
        'Error fetching user orders',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.orderService.findOne(id);
      console.log('[Order Service] Find order successful for id:', id);
      return result;
    } catch (error) {
      console.error('[Order Service] Error in findOne order:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error fetching order',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    try {
      const result = await this.orderService.update(id, updateOrderDto);
      console.log('[Order Service] Update order successful for id:', id);
      return result;
    } catch (error) {
      console.error('[Order Service] Error in update order:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error updating order',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.orderService.remove(id);
      console.log('[Order Service] Remove order successful for id:', id);
      return result;
    } catch (error) {
      console.error('[Order Service] Error in remove order:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error deleting order',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 