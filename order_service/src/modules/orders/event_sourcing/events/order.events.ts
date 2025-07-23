export interface IOrderEvent {
    orderId: string;
    timestamp: Date;
    eventType: string;
}

export interface OrderItem {
    productId: string;
    quantity: number;
}

export interface OrderCreatedEvent extends IOrderEvent {
    eventType: 'OrderCreated';
    userId: string;
    userEmail: string;
    items: OrderItem[];
    totalAmount: number;
}

export interface OrderUpdatedEvent extends IOrderEvent {
    eventType: 'OrderUpdated';
    userId: string;
    userEmail: string;
    items: OrderItem[];
    totalAmount: number;
}

export interface OrderDeletedEvent extends IOrderEvent {
    eventType: 'OrderDeleted'
}

export type OrderEvent =
    | OrderCreatedEvent
    | OrderUpdatedEvent
    | OrderDeletedEvent;