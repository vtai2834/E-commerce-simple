// user-service/src/users/services/user.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UserEventRepository } from './event_sourcing/repositories/user.repository';
import { UserProjection } from './event_sourcing/projection/user.projection';
import { UserAggregate } from './event_sourcing/aggregates/user.aggregate';
import { v4 as uuidv4 } from 'uuid';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserEventRepository,
    private userProjection: UserProjection,
  ) { }

  async createUser(userData: Partial<User>): Promise<User> {
    const { email, fullName, password } = userData;
    if (!email || !fullName || !password) {
      throw new Error('Email, fullName, and password are required');
    }

    // Check if user already exists (from projection)
    const existingUser = await this.userProjection.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Create new user aggregate
    const userId = uuidv4();
    const userAggregate = new UserAggregate(userId);
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user (this creates the UserCreated event)
    userAggregate.createUser(email, fullName, hashedPassword);

    // Update projection -> lưu trạng thái cuối cùng vào database
    for (const event of userAggregate.uncommittedEvents) {
      await this.userProjection.handleEvent(event);
    }

    // Save aggregate (this saves all events) -> lưu tất cả các sự kiện vào event store
    await this.userRepository.save(userAggregate);

    const userState = userAggregate.state;
    return {
      _id: userState.id,
      email: userState.email,
      fullName: userState.fullName,
      password: userState.hashedPassword,
      refreshToken: userState.refreshToken,
    } as User;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userProjection.findByEmail(email);
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await this.userProjection.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    // Get user aggregate
    const userAggregate = await this.userRepository.getById(userId);
    if (!userAggregate) {
        throw new NotFoundException('User not found');
    }

    const email = userAggregate.state.email;

    // Update refresh token (this creates UserRefreshTokenUpdated event)
    userAggregate.updateRefreshToken(email, refreshToken);

    // Update projection
    for (const event of userAggregate.uncommittedEvents) {
        await this.userProjection.handleEvent(event);
    }

    // Save aggregate
    await this.userRepository.save(userAggregate);
  }

  async removeRefreshToken(userId: string): Promise<void> {
    // Get user aggregate
    const userAggregate = await this.userRepository.getById(userId);
    if (!userAggregate) {
        throw new NotFoundException('User not found');
    }

    // Remove refresh token (this creates UserRefreshTokenRemoved event)
    userAggregate.removeRefreshToken();

    // Update projection
    for (const event of userAggregate.uncommittedEvents) {
        await this.userProjection.handleEvent(event);
    }

    // Save aggregate
    await this.userRepository.save(userAggregate);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userProjection.findAll();
  }

  async updateUserProfile(userId: string, updateData: { fullName?: string; email?: string }): Promise<User> {
    // Get user aggregate
    const userAggregate = await this.userRepository.getById(userId);
    if (!userAggregate) {
        throw new NotFoundException('User not found');
    }

    // Update profile (this creates UserProfileUpdated event)
    userAggregate.updateProfile(updateData.fullName, updateData.email);

    // Update projection
    for (const event of userAggregate.uncommittedEvents) {
        await this.userProjection.handleEvent(event);
    }

    // Save aggregate
    await this.userRepository.save(userAggregate);

    const userState = userAggregate.state;
    return {
        _id: userState.id,
        email: userState.email,
        fullName: userState.fullName,
        password: userState.hashedPassword,
        refreshToken: userState.refreshToken,
    } as User;
}

async deleteUser(userId: string): Promise<void> {
    // Get user aggregate
    const userAggregate = await this.userRepository.getById(userId);
    if (!userAggregate) {
        throw new NotFoundException('User not found');
    }

    // Delete user (this creates UserDeleted event)
    userAggregate.deleteUser();

    // Update projection
    for (const event of userAggregate.uncommittedEvents) {
        await this.userProjection.handleEvent(event);
    }

    // Save aggregate
    await this.userRepository.save(userAggregate);
}
}