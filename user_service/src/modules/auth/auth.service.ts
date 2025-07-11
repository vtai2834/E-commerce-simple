import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

import { UserEventRepository } from '../auth/event_sourcing/repositories/user.repository';
import { UserProjection } from '../auth/event_sourcing/projection/user.projection';
import { UserAggregate } from '../auth/event_sourcing/aggregate/user.aggregate';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private userRepository: UserEventRepository,
    private userProjection: UserProjection,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, fullName } = registerDto;

    // Check if user already exists (from projection)
    const existingUser = await this.userProjection.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Create new user aggregate
    const userId = uuidv4();
    const userAggregate = new UserAggregate(userId);
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Register user (this creates the UserRegistered event)
    userAggregate.register(email, fullName, hashedPassword);

    // Generate tokens
    const payload = { email, sub: userId };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Update refresh token (this creates UserRefreshTokenUpdated event)
    userAggregate.updateRefreshToken(email, refreshToken);
    
    // Update projection -> lưu trạng thái cuối cùng vào database
    for (const event of userAggregate.uncommittedEvents) {
      await this.userProjection.handleEvent(event);
    }
    
    // Save aggregate (this saves all events) -> lưu tất cả các sự kiện vào event store
    await this.userRepository.save(userAggregate);


    const userState = userAggregate.state;
    return {
      message: 'User registered successfully',
      user: {
        id: userState.id,
        email: userState.email,
        fullName: userState.fullName,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Get user from projection for password validation
    const user = await this.userProjection.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get user aggregate
    const userAggregate = await this.userRepository.getById(user._id);
    if (!userAggregate) {
      throw new UnauthorizedException('User not found');
    }

    // Generate tokens
    const payload = { email, sub: userAggregate.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Login user (this creates UserLoggedIn event)
    userAggregate.login(email, refreshToken);

    // Save aggregate
    await this.userRepository.save(userAggregate);

    // Update projection
    for (const event of userAggregate.uncommittedEvents) {
      await this.userProjection.handleEvent(event);
    }

    const userState = userAggregate.state;
    return {
      message: 'Login successful',
      user: {
        id: userState.id,
        email: userState.email,
        fullName: userState.fullName,
      },
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    // Get user aggregate
    const userAggregate = await this.userRepository.getById(userId);
    if (!userAggregate) {
      throw new UnauthorizedException('User not found');
    }

    // Logout user (this creates UserLoggedOut event)
    userAggregate.logout(userAggregate.state.email);

    // Save aggregate
    await this.userRepository.save(userAggregate);

    // Update projection
    for (const event of userAggregate.uncommittedEvents) {
      await this.userProjection.handleEvent(event);
    }

    return { message: 'Logout successful' };
  }

  async getProfile(userId: string) {
    const userAggregate = await this.userRepository.getById(userId);
    if (!userAggregate) {
      throw new UnauthorizedException('User not found');
    }
    const user = userAggregate.state;
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };
  }
}