import { ProductAggregate } from '../aggregate/product.aggregate';
import { EventStore } from '../infrastructure/event-store';
export declare class ProductEventRepository {
    private eventStore;
    constructor(eventStore: EventStore);
    getById(id: string): Promise<ProductAggregate | null>;
    save(aggregate: ProductAggregate): Promise<void>;
    findByName(name: string): Promise<ProductAggregate | null>;
}
