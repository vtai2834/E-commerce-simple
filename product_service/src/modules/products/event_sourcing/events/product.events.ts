export interface IProductEvent {
    productId: string;
    timestamp: Date;
    eventType: string;
}

export interface ProductCreatedEvent extends IProductEvent {
    eventType: 'ProductCreated';
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
}

export interface ProductUpdatedEvent extends IProductEvent {
    eventType: 'ProductUpdated'
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
}

export interface ProductDeletedEvent extends IProductEvent {
    eventType: 'ProductDeleted';
}

export type ProductEvent = 
    | ProductCreatedEvent
    | ProductUpdatedEvent
    | ProductDeletedEvent;