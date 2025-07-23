import { Injectable } from '@nestjs/common';
import { OrderAggregate } from '../aggregate/order.aggregate';
import { EventStore } from '../infrastructure/event-store';

@Injectable()
export class OrderEventRepository {
    constructor(private eventStore: EventStore) {}

    async getById(id: string): Promise<OrderAggregate | null> {
        const events = await this.eventStore.getEvents(id);

        if (events.length === 0) {
            return null;
        }

        const aggregate = new OrderAggregate(id);

        // Replay events to rebuild state
        events.forEach(event => {
            aggregate.applyEvent(event);
        });

        return aggregate;
    }

    async save(aggregate: OrderAggregate): Promise<void> {
        const uncommittedEvents = aggregate.uncommittedEvents;

        if (uncommittedEvents.length === 0) {
            return;
        }

        await this.eventStore.saveEvents(aggregate.id, uncommittedEvents);
        aggregate.markEventsAsCommitted();
    }

    async findByUserId(userId: string): Promise<OrderAggregate[] | null> {
        const allEvents = await this.eventStore.getAllEvents();

        // Find orders by userId from events
        const userOrders = allEvents.filter(
            event => event.eventType === 'OrderCreated' 
            && (event as any).userId === userId
        );

        if (userOrders.length === 0) {
            return null;
        }

        // Rebuild aggregates for each order
        return Promise.all(userOrders.map(event => this.getById(event.orderId)));
    }
}