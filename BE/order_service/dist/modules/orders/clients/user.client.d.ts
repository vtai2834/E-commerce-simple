import { HttpService } from '@nestjs/axios';
export declare class UserClient {
    private httpService;
    constructor(httpService: HttpService);
    getUser(userId: string): Promise<any>;
}
