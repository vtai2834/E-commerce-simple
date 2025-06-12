import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UserClient {
  constructor(private httpService: HttpService) {}

  async getUser(userId: string) {
    const { data } = await this.httpService.get(`http://user-service:8080/users/${userId}`).toPromise();
    return data;
  }
} 