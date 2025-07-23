"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAggregate = void 0;
class ProductAggregate {
    constructor(id) {
        this._events = [];
        this._uncommittedEvents = [];
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
    create(name, description, price, stock, imageUrl) {
        const event = {
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
    update(name, description, price, stock, imageUrl) {
        if (this._state.deletedAt) {
            throw new Error('Product is already deleted');
        }
        const event = {
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
    delete(id) {
        if (this._state.deletedAt) {
            throw new Error('Product is already deleted');
        }
        const event = {
            productId: id,
            eventType: 'ProductDeleted',
            timestamp: new Date(),
        };
        this.addEvent(event);
    }
    addEvent(event) {
        this.applyEvent(event);
        this._uncommittedEvents.push(event);
    }
    applyEvent(event) {
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
                throw new Error(`Unknown event type: ${event.eventType}`);
        }
        this._events.push(event);
    }
    applyProductCreated(event) {
        this._state.name = event.name;
        this._state.description = event.description;
        this._state.price = event.price;
        this._state.stock = event.stock;
        this._state.imageUrl = event.imageUrl;
        this._state.createdAt = event.timestamp;
    }
    applyProductUpdated(event) {
        this._state.name = event.name;
        this._state.description = event.description;
        this._state.price = event.price;
        this._state.stock = event.stock;
        this._state.imageUrl = event.imageUrl;
        this._state.lastUpdatedAt = event.timestamp;
    }
    applyProductDeleted(event) {
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
exports.ProductAggregate = ProductAggregate;
//# sourceMappingURL=product.aggregate.js.map