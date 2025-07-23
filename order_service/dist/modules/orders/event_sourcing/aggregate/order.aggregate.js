"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderAggregate = void 0;
class OrderAggregate {
    constructor(id) {
        this._events = [];
        this._uncommittedEvents = [];
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
    create(userId, userEmail, items, totalAmount) {
        const event = {
            orderId: this._id,
            eventType: 'OrderCreated',
            userId,
            userEmail,
            items,
            totalAmount,
            timestamp: new Date(),
        };
        this.addEvent(event);
    }
    update(userId, userEmail, items, totalAmount) {
        if (this._state.deletedAt) {
            throw new Error('Order is already deleted');
        }
        const event = {
            orderId: this._id,
            eventType: 'OrderUpdated',
            userId,
            userEmail,
            items,
            totalAmount,
            timestamp: new Date(),
        };
        this.addEvent(event);
    }
    delete(id) {
        if (this._state.deletedAt) {
            throw new Error('Order is already deleted');
        }
        const event = {
            orderId: this._id,
            eventType: 'OrderDeleted',
            timestamp: new Date(),
        };
    }
    addEvent(event) {
        this.applyEvent(event);
        this._uncommittedEvents.push(event);
    }
    applyEvent(event) {
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
    applyOrderCreated(event) {
        this._state.userId = event.userId;
        this._state.userEmail = event.userEmail;
        this._state.items = event.items;
        this._state.totalAmount = event.totalAmount;
        this._state.createdAt = event.timestamp;
    }
    applyOrderUpdated(event) {
        this._state.userId = event.userId;
        this._state.userEmail = event.userEmail;
        this._state.items = event.items;
        this._state.totalAmount = event.totalAmount;
        this._state.lastUpdatedAt = event.timestamp;
    }
    applyOrderDeleted(event) {
        this._state.deletedAt = event.timestamp;
    }
    get id() {
        return this._id;
    }
    get state() {
        return Object.assign({}, this._state);
    }
    get events() {
        return [...this._events];
    }
    get uncommittedEvents() {
        return [...this._uncommittedEvents];
    }
    markEventsAsCommitted() {
        this._uncommittedEvents = [];
    }
}
exports.OrderAggregate = OrderAggregate;
//# sourceMappingURL=order.aggregate.js.map