// user-service/src/users/controllers/user.controller.ts
import { Body, Controller, Get, Param, Post, Patch, Delete, Query } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Get()
  async getAllUsers(
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1
  ): Promise<User[]> {
    // Thực tế nên triển khai phân trang ở service/repository
    return this.userService.getAllUsers();
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User | null> {
    return this.userService.findUserByEmail(email);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User | null> {
    return this.userService.findUserById(id);
  }

  @Patch(':id/refresh-token')
  async updateUserRefreshToken(
    @Param('id') id: string,
    @Body('refreshToken') refreshToken: string
  ): Promise<void> {
    await this.userService.updateRefreshToken(id, refreshToken);
  }

  @Delete(':id/refresh-token')
  async removeUserRefreshToken(@Param('id') id: string): Promise<void> {
    await this.userService.removeRefreshToken(id);
  }
}