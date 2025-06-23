import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UserClient {
  constructor(private httpService: HttpService) {}

  async getUser(userId: string) {
    const { data } = await this.httpService.get(`${process.env.USER_SERVICE_URL}/users/${userId}`).toPromise();
    return data;
  }
} 