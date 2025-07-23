import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    console.log('[Product service] Product creating request received:', createProductDto.name);
    try {
      const result = await this.productService.create(createProductDto);
      console.log('[Product Service] Create product successful for:', createProductDto.name);
      return result;
    } catch (error) {
      console.error('[Product Service] Create product failed for:', createProductDto.name);
      throw error;
    }
  }

  @Get()
  async findAll() {
    console.log('[Product service] All product finding request received');
    try {
      const result = await this.productService.findAll();
      console.log('[Product service] Find all products successful');
      return result;
    } catch (error) {
      console.error('[Product service] Find all products failed' );
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log('[Proudct service] Product finding request received for id:', id);
    try {
      const result = this.productService.findOne(id);
      console.log('[Product service] Product finding successful for id:', id);
      return result;
    } catch (error) {
      console.error('[Product service] Product finding failed for id:', id);
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    console.log('[Product service] Product updating request received for:', updateProductDto.name);
    try {
      const result = this.productService.update(id, updateProductDto);
      console.log('[Product service] Product updating successful for:', updateProductDto.name);
      return result;
    } catch (error) {
      console.error('[Product service] Product updating failed for:', updateProductDto.name);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    console.log('[Product service] Product deleting request received for id:', id);
    try {
      const result = this.productService.remove(id);
      console.log('[Product service] Product deleting successful for id:', id);
      return result;
    } catch (error) {
      console.error('[Product service] Product deleting failed for id:', id);
      throw error;
    }
  }
} 