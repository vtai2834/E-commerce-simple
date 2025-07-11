// user-service/src/auth/auth.module.ts
// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { JwtStrategy } from './jwt.strategy';
// import { DatabaseModule } from '../database/database.module';
// import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from '../users/schemas/user.schema';
// import { UserRepository } from '../users/schemas/user.repository';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { DatabaseModule } from '../database/database.module';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UserEventRepository } from './event_sourcing/repositories/user.repository';
import { UserProjection } from './event_sourcing/projection/user.projection';
import { EventStore, EventStoreSchema } from './event_sourcing/infrastructure/event-store';

import { UserRepository } from '../users/schemas/user.repository';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: EventStore.name, schema: EventStoreSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserEventRepository, UserProjection, EventStore, UserRepository],
  exports: [AuthService],
})
export class AuthModule {}