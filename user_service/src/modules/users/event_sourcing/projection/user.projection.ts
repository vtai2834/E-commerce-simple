import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { UserEvent } from '../../../auth/event_sourcing/events/user.events';

@Injectable()
export class UserProjection {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async handleEvent(event: UserEvent): Promise<void> {
        switch (event.eventType) {
            case 'UserCreated':
                await this.handleUserCreated(event as any);
                break;
            case 'UserUpdated':
                await this.handleUserUpdated(event as any);
                break;
            case 'UserDeleted':
                await this.handleUserDeleted(event as any);
                break;
            case 'UserRefreshTokenUpdated':
                await this.handleUserRefreshTokenUpdated(event as any);
                break;
            case 'UserRefreshTokenRemoved':
                await this.handleUserRefreshTokenRemoved(event as any);
                break;
            case 'UserProfileUpdated':
                await this.handleUserProfileUpdated(event as any);
                break;
        }
    }

    private async handleUserCreated(event: any): Promise<void> {
        const user = new this.userModel({
            _id: event.userId,
            email: event.email,
            fullName: event.fullName,
            password: event.hashedPassword,
        });
        await user.save();
    }

    private async handleUserUpdated(event: any): Promise<void> {
        const updateData: any = {};
        if (event.email) updateData.email = event.email;
        if (event.fullName) updateData.fullName = event.fullName;
        if (event.hashedPassword) updateData.password = event.hashedPassword;

        await this.userModel.findByIdAndUpdate(event.userId, updateData);
    }

    private async handleUserProfileUpdated(event: any): Promise<void> {
        const updateData: any = {};
        if (event.fullName) updateData.fullName = event.fullName;
        if (event.email) updateData.email = event.email;

        await this.userModel.findByIdAndUpdate(event.userId, updateData);
    }

    private async handleUserDeleted(event: any): Promise<void> {
        await this.userModel.findByIdAndDelete(event.userId);
    }

    private async handleUserRefreshTokenUpdated(event: any): Promise<void> {
        await this.userModel.findByIdAndUpdate(event.userId, {
            refreshToken: event.refreshToken,
        });
    }

    private async handleUserRefreshTokenRemoved(event: any): Promise<void> {
        await this.userModel.findByIdAndUpdate(event.userId, {
            refreshToken: null,
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