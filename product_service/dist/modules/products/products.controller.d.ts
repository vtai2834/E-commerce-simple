import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(createProductDto: CreateProductDto): Promise<{
        message: string;
        product: {
            id: string;
            name: string;
            description: string;
            price: number;
            stock: number;
        };
    }>;
    findAll(): Promise<import("./schemas/product.schema").Product[]>;
    findOne(id: string): Promise<import("./schemas/product.schema").Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        message: string;
        product: {
            id: string;
            name: string;
            description: string;
            price: number;
            stock: number;
            imageUrl: string;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
