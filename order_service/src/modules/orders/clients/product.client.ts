import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ProductClient {
  constructor(private httpService: HttpService) {}

  async getProductsInfo(items: { productId: string; quantity: number }[]) {
    const productIds = items.map(i => i.productId).join(',');
    const { data } = await this.httpService.get(`http://product-service:8081/products?ids=${productIds}`).toPromise();
    return data;
  }
} 