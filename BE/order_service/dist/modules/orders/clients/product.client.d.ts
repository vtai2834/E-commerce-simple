import { HttpService } from '@nestjs/axios';
export declare class ProductClient {
    private httpService;
    constructor(httpService: HttpService);
    getProductsInfo(items: {
        productId: string;
        quantity: number;
    }[]): Promise<any>;
}
