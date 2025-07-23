import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEventRepository } from './event_sourcing/repositories/product.repository';
import { ProductProjection } from './event_sourcing/projection/product.projection';
import { ProductAggregate } from './event_sourcing/aggregate/product.aggregate';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private productRepository: ProductEventRepository,
    private productProjection: ProductProjection,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { name, description, stock, price, imageUrl } = createProductDto;

    // Check if the product is already created
    const existingProduct = await this.productProjection.findByName(name);
    if (existingProduct) {
      throw new ConflictException('Product already exists');
    }

    // Create new product aggregate
    const productId = uuidv4();
    const productAggregate = new ProductAggregate(productId);

    // Create product
    productAggregate.create(name, description, price, stock, imageUrl);

    // Update projection
    for (const event of productAggregate.uncommittedEvents) {
      await this.productProjection.handleEvent(event);
    }

    // Save aggregate (this saves all events)
    await this.productRepository.save(productAggregate);

    const productState = productAggregate.state;
    return {
      message: 'Product created successfully',
      product: {
        id: productState.id,
        name: productState.name,
        description: productState.description,
        price: productState.price,
        stock: productState.stock,
      }
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { name, description, price, stock, imageUrl} = updateProductDto;

    // Get product from projection for updating
    const product = await this.productProjection.findById(id);
    if (!product) {
      throw new NotFoundException(`Cannot find the product with id ${id}`);
    }

    // Get product aggregate
    const productAggregate = await this.productRepository.getById(product._id);
    if (!productAggregate) {
      throw new NotFoundException('Product not found');
    }

    // Update product
    productAggregate.update(name, description, price, stock, imageUrl);

    // Update projection
    for (const event of productAggregate.uncommittedEvents) {
      await this.productProjection.handleEvent(event);
    }
    
    // Save aggregate
    await this.productRepository.save(productAggregate);

    const productState = productAggregate.state;
    return {
      message: 'Product updated successfully',
      product: {
        id: productState.id,
        name: productState.name,
        description: productState.description,
        price: productState.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
      },
    };
  }

  async remove(id: string) {
    // Get product aggregate
    const productAggregate = await this.productRepository.getById(id);
    if (!productAggregate) {
      throw new NotFoundException('Product not found');
    }

    // Delete product
    productAggregate.delete(id);
    
    // Update projection
    for (const event of productAggregate.uncommittedEvents) {
      await this.productProjection.handleEvent(event);
    }
    
    // Save aggregate
    await this.productRepository.save(productAggregate);

    return { message: 'Product deleted successfully'};
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
} 