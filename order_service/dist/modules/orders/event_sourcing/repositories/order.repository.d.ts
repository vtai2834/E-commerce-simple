import { OrderAggregate } from '../aggregate/order.aggregate';
import { EventStore } from '../infrastructure/event-store';
export declare class OrderEventRepository {
    private eventStore;
    constructor(eventStore: EventStore);
    getById(id: string): Promise<OrderAggregate | null>;
    save(aggregate: OrderAggregate): Promise<void>;
    findByUserId(userId: string): Promise<OrderAggregate[] | null>;
}
