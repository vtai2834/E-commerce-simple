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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStore = exports.EventStoreSchema = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
exports.EventStoreSchema = new mongoose_2.Schema({
    aggregateId: { type: String, required: true, index: true },
    eventType: { type: String, required: true },
    eventData: { type: mongoose_2.Schema.Types.Mixed, required: true },
    timestamp: { type: Date, required: true },
    version: { type: Number, required: true },
});
let EventStore = class EventStore {
    constructor(eventModel) {
        this.eventModel = eventModel;
    }
    async saveEvents(aggregateId, new_events) {
        const currentCount = await this.eventModel.countDocuments({ aggregateId });
        const docs = new_events.map((event, idx) => ({
            aggregateId,
            eventType: event.eventType,
            eventData: event,
            timestamp: event.timestamp || new Date(),
            version: currentCount + idx + 1,
        }));
        await this.eventModel.insertMany(docs);
        console.log(`Saved ${new_events.length} events for aggregate ${aggregateId}`);
    }
    async getEvents(aggregateId) {
        const docs = await this.eventModel.find({ aggregateId }).sort({ version: 1 });
        return docs.map(doc => doc.eventData);
    }
    async getAllEvents() {
        const docs = await this.eventModel.find({}).sort({ aggregateId: 1, version: 1 });
        return docs.map(doc => doc.eventData);
    }
};
exports.EventStore = EventStore;
exports.EventStore = EventStore = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('EventStore')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], EventStore);
//# sourceMappingURL=event-store.js.map