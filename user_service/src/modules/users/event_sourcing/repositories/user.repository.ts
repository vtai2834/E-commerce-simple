// user-service/src/users/event_sourcing/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { UserAggregate } from '../aggregates/user.aggregate';
import { EventStore } from '../../../auth/event_sourcing/infrastructure/event-store';

@Injectable()
export class UserEventRepository {
    constructor(private eventStore: EventStore) {}

    async getById(id: string): Promise<UserAggregate | null> {
        const events = await this.eventStore.getEvents(id);
        
        if (events.length === 0) {
            return null;
        }

        const aggregate = new UserAggregate(id);
        
        // Replay events to rebuild state
        events.forEach(event => {
            aggregate.applyEvent(event);
        });

        return aggregate;
    }

    async save(aggregate: UserAggregate): Promise<void> {
        const uncommittedEvents = aggregate.uncommittedEvents;
        
        if (uncommittedEvents.length === 0) {
            return;
        }

        await this.eventStore.saveEvents(aggregate.id, uncommittedEvents);
        aggregate.markEventsAsCommitted();
    }

    async findByEmail(email: string): Promise<UserAggregate | null> {
        const allEvents = await this.eventStore.getAllEvents();
        
        // Find user by email from events
        const userCreatedEvent = allEvents.find(
            event => event.eventType === 'UserCreated' && 
            (event as any).email === email
        );

        if (!userCreatedEvent) {
            return null;
        }

        return this.getById(userCreatedEvent.userId);
    }

    async findAll(): Promise<UserAggregate[]> {
        const allEvents = await this.eventStore.getAllEvents();
        
        // Group events by userId
        const eventsByUserId = allEvents.reduce((acc, event) => {
            if (!acc[event.userId]) {
                acc[event.userId] = [];
            }
            acc[event.userId].push(event);
            return acc;
        }, {} as { [userId: string]: any[] });

        // Create aggregates for each user
        const aggregates: UserAggregate[] = [];
        for (const userId in eventsByUserId) {
            const aggregate = new UserAggregate(userId);
            eventsByUserId[userId].forEach(event => {
                aggregate.applyEvent(event);
            });
            
            // Only include active users
            if (aggregate.state.isActive && !aggregate.state.isDeleted) {
                aggregates.push(aggregate);
            }
        }

        return aggregates;
    }
}