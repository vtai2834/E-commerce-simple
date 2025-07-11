import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../../users/schemas/user.schema';
import { UserEvent } from '../events/user.events';

@Injectable()
export class UserProjection {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async handleEvent(event: UserEvent): Promise<void> {
    switch (event.eventType) {
      case 'UserRegistered':
        await this.handleUserRegistered(event as any);
        break;
      case 'UserLoggedIn':
        await this.handleUserLoggedIn(event as any);
        break;
      case 'UserLoggedOut':
        await this.handleUserLoggedOut(event as any);
        break;
      case 'UserRefreshTokenUpdated':
        await this.handleUserRefreshTokenUpdated(event as any);
        break;
    }
  }

  private async handleUserRegistered(event: any): Promise<void> {
    const user = new this.userModel({
      _id: event.userId,
      email: event.email,
      fullName: event.fullName,
      password: event.hashedPassword,
    });
    await user.save();
  }

  private async handleUserLoggedIn(event: any): Promise<void> {
    await this.userModel.findByIdAndUpdate(event.userId, {
      refreshToken: event.refreshToken,
    });
  }

  private async handleUserLoggedOut(event: any): Promise<void> {
    await this.userModel.findByIdAndUpdate(event.userId, {
      refreshToken: null,
    });
  }

  private async handleUserRefreshTokenUpdated(event: any): Promise<void> {
    await this.userModel.findByIdAndUpdate(event.userId, {
      refreshToken: event.refreshToken,
    });
  }

  // Query methods
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }
}