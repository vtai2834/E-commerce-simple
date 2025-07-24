import { ProductEvent } from '../events/product.events';
export interface ProductState {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl?: string;
    createdAt: Date;
    lastUpdatedAt?: Date;
    deletedAt?: Date;
}
export declare class ProductAggregate {
    private _id;
    private _events;
    private _uncommittedEvents;
    private _state;
    constructor(id: string);
    create(name: string, description: string, price: number, stock: number, imageUrl: string): void;
    update(name: string, description: string, price: number, stock: number, imageUrl: string): void;
    delete(id: string): void;
    private addEvent;
    applyEvent(event: ProductEvent): void;
    private applyProductCreated;
    private applyProductUpdated;
    private applyProductDeleted;
    get id(): string;
    get state(): ProductState;
    get events(): ProductEvent[];
    get uncommittedEvents(): ProductEvent[];
    markEventsAsCommitted(): void;
}
