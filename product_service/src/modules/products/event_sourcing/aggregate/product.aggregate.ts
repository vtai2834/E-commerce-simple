import {
    ProductEvent,
    ProductCreatedEvent,
    ProductUpdatedEvent,
    ProductDeletedEvent
} from '../events/product.events';

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

export class ProductAggregate {
    private _id: string;
    private _events: ProductEvent[] = [];
    private _uncommittedEvents: ProductEvent[] = [];
    private _state: ProductState;

    constructor(id: string) {
        this._id = id;
        this._state = {
            id,
            name: '',
            description: '',
            price: 0,
            stock: 0,
            imageUrl: '',
            createdAt: new Date(),
            lastUpdatedAt: null,
            deletedAt: null,
        };
    } 

    // Business logic methods
    create(name: string, description: string, price: number, stock: number, imageUrl: string) : void {
        const event: ProductCreatedEvent = {
            productId: this._id,
            eventType: 'ProductCreated',
            name,
            description,
            price,
            stock,
            imageUrl,
            timestamp: new Date(),
        };

        this.addEvent(event);
    }

    update(name: string, description: string, price: number, stock: number, imageUrl: string) : void {
        if (this._state.deletedAt) {
            throw new Error('Product is already deleted');
        }

        const event: ProductUpdatedEvent = {
            productId: this._id,
            eventType: 'ProductUpdated',
            name,
            description,
            price,
            stock,
            imageUrl,
            timestamp: new Date(),
        };

        this.addEvent(event);
    }

    delete(id: string): void {
        if (this._state.deletedAt) {
            throw new Error('Product is already deleted');
        }

        const event: ProductDeletedEvent = {
            productId: id,
            eventType: 'ProductDeleted',
            timestamp: new Date(),
        };

        this.addEvent(event);
    }

    // Event handling
    private addEvent(event: ProductEvent): void {
        this.applyEvent(event);
        this._uncommittedEvents.push(event);
    }

    applyEvent(event: ProductEvent): void {
        switch (event.eventType) {
            case 'ProductCreated':
                this.applyProductCreated(event);
                break;
            case 'ProductUpdated':
                this.applyProductUpdated(event);
                break;
            case 'ProductDeleted':
                this.applyProductDeleted(event);
                break;
            default:
                throw new Error(`Unknown event type: ${(event as any).eventType}`);
        }
        
        this._events.push(event);
    }

    private applyProductCreated(event: ProductCreatedEvent): void {
        this._state.name = event.name;
        this._state.description = event.description;
        this._state.price = event.price;
        this._state.stock = event.stock;
        this._state.imageUrl = event.imageUrl;
        this._state.createdAt = event.timestamp;
    }

    private applyProductUpdated(event: ProductUpdatedEvent): void {
        this._state.name = event.name;
        this._state.description = event.description;
        this._state.price = event.price;
        this._state.stock = event.stock;
        this._state.imageUrl = event.imageUrl;
        this._state.lastUpdatedAt = event.timestamp;
    }

    private applyProductDeleted(event: ProductDeletedEvent): void {
        this._state.deletedAt = event.timestamp;
    }

    // Getters
    get id(): string {
        return this._id;
    }

    get state(): ProductState {
        return {...this._state};
    }

    get events(): ProductEvent[] {
        return [...this._events];
    }

    get uncommittedEvents(): ProductEvent[] {
        return [...this._uncommittedEvents];
    }

    // Mark events as committed
    markEventsAsCommitted(): void {
        this._uncommittedEvents = [];
    }
}