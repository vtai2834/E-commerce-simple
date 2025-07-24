import { ProductClient } from '../../clients/product.client';
import {
    OrderEvent,
    OrderItem,
    OrderCreatedEvent,
    OrderUpdatedEvent,
    OrderDeletedEvent,
} from '../events/order.events';

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

export class OrderAggregate {
    private _id: string;
    private _events: OrderEvent[] = [];
    private _uncommittedEvents: OrderEvent[] = [];
    private _state: OrderState;

    constructor(id: string) {
        this._id = id;
        this._state = {
            id,
            userId: '',
            userEmail: '',
            items: null,
            totalAmount: 0,
            createdAt: new Date(),
            lastUpdatedAt: null,
            deletedAt: null
        };
    }

    // Business logic methods
    create(userId: string, userEmail: string, items: OrderItem[], totalAmount: number ): void {
        const event: OrderCreatedEvent = {
            orderId: this._id,
            eventType: 'OrderCreated',
            userId,
            userEmail,
            items, 
            totalAmount,
            timestamp: new Date(),
        }

        this.addEvent(event);
    }

    update(userId: string, userEmail: string, items: OrderItem[], totalAmount: number): void {
        if (this._state.deletedAt) {
            throw new Error('Order is already deleted');
        }
        
        const event: OrderUpdatedEvent = {
            orderId: this._id,
            eventType: 'OrderUpdated',
            userId, 
            userEmail,
            items,
            totalAmount,
            timestamp: new Date(),
        }

        this.addEvent(event);
    }

    delete(id: string): void {
        if (this._state.deletedAt) {
            throw new Error('Order is already deleted');
        }

        const event: OrderDeletedEvent = {
            orderId: this._id,
            eventType: 'OrderDeleted',
            timestamp: new Date(),
        };
    }

    // Event handling
    private addEvent(event: OrderEvent): void {
        this.applyEvent(event);
        this._uncommittedEvents.push(event);
    }

    applyEvent(event: OrderEvent): void {
        switch (event.eventType) { 
            case 'OrderCreated':
                this.applyOrderCreated(event);
                break;
            case 'OrderUpdated':
                this.applyOrderUpdated(event);
                break;
            case 'OrderDeleted':
                this.applyOrderDeleted(event);
                break;
        }

        this._events.push(event);
    }

    private applyOrderCreated(event: OrderCreatedEvent): void {
        this._state.userId = event.userId;
        this._state.userEmail = event.userEmail;
        this._state.items = event.items;
        this._state.totalAmount = event.totalAmount;
        this._state.createdAt = event.timestamp;
    }

    private applyOrderUpdated(event: OrderUpdatedEvent): void {
        this._state.userId = event.userId;
        this._state.userEmail = event.userEmail;
        this._state.items = event.items;
        this._state.totalAmount = event.totalAmount;
        this._state.lastUpdatedAt = event.timestamp;
    }

    private applyOrderDeleted(event: OrderDeletedEvent): void {
        this._state.deletedAt = event.timestamp
    }

    // Getters
    get id(): string {
        return this._id;
    }

    get state(): OrderState {
        return {...this._state};
    }

    get events(): OrderEvent[] {
        return [...this._events];
    }

    get uncommittedEvents(): OrderEvent[] {
        return [...this._uncommittedEvents];
    }

    // Mark events as committed
    markEventsAsCommitted(): void {
        this._uncommittedEvents = [];
    }
}
