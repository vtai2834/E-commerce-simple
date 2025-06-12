// user-service/src/auth/auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log('[User Service] Register request received:', registerDto.email);
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('[User Service] Login request received:', loginDto.email);
    try {
      const result = await this.authService.login(loginDto);
      console.log('[User Service] Login successful for:', loginDto.email);
      return result;
    } catch (error) {
      console.error('[User Service] Login failed for:', loginDto.email, error.message);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    console.log('[User Service] Logout request received for user:', req.user.sub);
    return this.authService.logout(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    console.log('[User Service] Get profile request received for user:', req.user.sub);
    return this.authService.getProfile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  async verifyToken(@Request() req) {
    console.log('[User Service] Token verification request received for user:', req.user.sub);
    return { valid: true, user: req.user };
  }
}