import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { OrderService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      return await this.orderService.create(createOrderDto);
    } catch (error) {
      console.error('Error in create order controller:', error);
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
      return await this.orderService.findAll();
    } catch (error) {
      console.error('Error in findAll orders:', error);
      throw new HttpException(
        'Error fetching orders',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    try {
      return await this.orderService.findByUserId(userId);
    } catch (error) {
      console.error('Error in findByUserId:', error);
      throw new HttpException(
        'Error fetching user orders',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.orderService.findOne(id);
    } catch (error) {
      console.error('Error in findOne order:', error);
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
      return await this.orderService.update(id, updateOrderDto);
    } catch (error) {
      console.error('Error in update order:', error);
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
      return await this.orderService.remove(id);
    } catch (error) {
      console.error('Error in remove order:', error);
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