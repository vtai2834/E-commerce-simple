import { OrderEvent, OrderItem } from '../events/order.events';
export interface OrderState {
    id: string;
    userId: string;
    userEmail: string;
    items: OrderItem[];
    totalAmount: number;
    createdAt: Date;
    lastUpdatedAt?: Date;
    deletedAt?: Date;
}
export declare class OrderAggregate {
    private _id;
    private _events;
    private _uncommittedEvents;
    private _state;
    constructor(id: string);
    create(userId: string, userEmail: string, items: OrderItem[], totalAmount: number): void;
    update(userId: string, userEmail: string, items: OrderItem[], totalAmount: number): void;
    delete(id: string): void;
    private addEvent;
    applyEvent(event: OrderEvent): void;
    private applyOrderCreated;
    private applyOrderUpdated;
    private applyOrderDeleted;
    get id(): string;
    get state(): OrderState;
    get events(): OrderEvent[];
    get uncommittedEvents(): OrderEvent[];
    markEventsAsCommitted(): void;
}
