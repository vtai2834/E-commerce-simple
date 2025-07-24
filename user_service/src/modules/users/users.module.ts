import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { DatabaseModule } from '../database/database.module';
import { UserRepository } from './schemas/user.repository';

// Event Sourcing Components
import { UserEventRepository } from './event_sourcing/repositories/user.repository';
import { UserProjection } from './event_sourcing/projection/user.projection';
import { EventStore, EventStoreSchema } from '../auth/event_sourcing/infrastructure/event-store';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: EventStore.name, schema: EventStoreSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserEventRepository,
    UserProjection,
    EventStore,
    UserRepository, // Keep for compatibility if needed
  ],
  exports: [UserService, UserEventRepository, UserProjection],
})
export class UserModule { }