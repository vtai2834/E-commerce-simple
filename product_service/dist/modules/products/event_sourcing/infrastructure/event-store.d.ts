import { Model, Schema, Document } from 'mongoose';
import { ProductEvent } from '../events/product.events';
export interface EventStoreDocument extends Document {
    aggregateId: string;
    eventType: string;
    eventData: any;
    timestamp: Date;
    version: number;
}
export declare const EventStoreSchema: Schema<EventStoreDocument, Model<EventStoreDocument, any, any, any, Document<unknown, any, EventStoreDocument> & EventStoreDocument & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EventStoreDocument, Document<unknown, {}, import("mongoose").FlatRecord<EventStoreDocument>> & import("mongoose").FlatRecord<EventStoreDocument> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export declare class EventStore {
    private eventModel;
    constructor(eventModel: Model<EventStoreDocument>);
    saveEvents(aggregateId: string, new_events: ProductEvent[]): Promise<void>;
    getEvents(aggregateId: string): Promise<ProductEvent[]>;
    getAllEvents(): Promise<ProductEvent[]>;
}
