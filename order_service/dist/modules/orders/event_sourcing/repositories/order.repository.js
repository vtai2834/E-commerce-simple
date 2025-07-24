"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEventRepository = void 0;
const common_1 = require("@nestjs/common");
const order_aggregate_1 = require("../aggregate/order.aggregate");
const event_store_1 = require("../infrastructure/event-store");
let OrderEventRepository = class OrderEventRepository {
    constructor(eventStore) {
        this.eventStore = eventStore;
    }
    async getById(id) {
        const events = await this.eventStore.getEvents(id);
        if (events.length === 0) {
            return null;
        }
        const aggregate = new order_aggregate_1.OrderAggregate(id);
        events.forEach(event => {
            aggregate.applyEvent(event);
        });
        return aggregate;
    }
    async save(aggregate) {
        const uncommittedEvents = aggregate.uncommittedEvents;
        if (uncommittedEvents.length === 0) {
            return;
        }
        await this.eventStore.saveEvents(aggregate.id, uncommittedEvents);
        aggregate.markEventsAsCommitted();
    }
    async findByUserId(userId) {
        const allEvents = await this.eventStore.getAllEvents();
        const userOrders = allEvents.filter(event => event.eventType === 'OrderCreated'
            && event.userId === userId);
        if (userOrders.length === 0) {
            return null;
        }
        return Promise.all(userOrders.map(event => this.getById(event.orderId)));
    }
};
exports.OrderEventRepository = OrderEventRepository;
exports.OrderEventRepository = OrderEventRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_store_1.EventStore])
], OrderEventRepository);
//# sourceMappingURL=order.repository.js.map