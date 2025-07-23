import { Injectable } from '@nestjs/common';
import { ProductAggregate } from '../aggregate/product.aggregate';
import { EventStore } from '../infrastructure/event-store';

@Injectable()
export class ProductEventRepository {
    constructor(private eventStore: EventStore) {}

    async getById(id: string): Promise<ProductAggregate | null> {
        const events = await this.eventStore.getEvents(id);

        if (events.length === 0) {
            return null;
        }

        const aggregate = new ProductAggregate(id);

        // Replay events to rebuild state
        events.forEach(event => {
            aggregate.applyEvent(event);
        });

        return aggregate;
    }

    async save(aggregate: ProductAggregate): Promise<void> {
        const uncommittedEvents = aggregate.uncommittedEvents;

        if (uncommittedEvents.length === 0) {
            return;
        }

        await this.eventStore.saveEvents(aggregate.id, uncommittedEvents);
        aggregate.markEventsAsCommitted();
    }

    async findByName(name: string): Promise<ProductAggregate | null> {
        const allEvents = await this.eventStore.getAllEvents();

        // Find product by name from events
        const productCreatedEvent = allEvents.find(
            event => event.eventType === 'ProductCreated' &&
            (event as any).name === name
        );

        if (!productCreatedEvent) {
            return null;
        }

        return this.getById(productCreatedEvent.productId);
    }
}