import { Injectable } from '@nestjs/common';
import { UserAggregate } from '../aggregate/user.aggregate';
import { EventStore } from '../infrastructure/event-store';

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
    const userRegisteredEvent = allEvents.find(
      event => event.eventType === 'UserRegistered' && 
      (event as any).email === email
    );

    if (!userRegisteredEvent) {
      return null;
    }

    return this.getById(userRegisteredEvent.userId);
  }
}