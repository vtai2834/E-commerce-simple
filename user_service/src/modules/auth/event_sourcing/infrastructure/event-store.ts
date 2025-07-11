import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Document } from 'mongoose';
import { UserEvent } from '../events/user.events';

// Event Store Schema
export interface EventStoreDocument extends Document {
  aggregateId: string;
  eventType: string;
  eventData: any;
  timestamp: Date;
  version: number;
}

export const EventStoreSchema = new Schema<EventStoreDocument>({
  aggregateId: { type: String, required: true, index: true },
  eventType: { type: String, required: true },
  eventData: { type: Schema.Types.Mixed, required: true },
  timestamp: { type: Date, required: true },
  version: { type: Number, required: true },
});

@Injectable()
export class EventStore {
  constructor(
    @InjectModel('EventStore') private eventModel: Model<EventStoreDocument>,
  ) {}

  async saveEvents(aggregateId: string, new_events: UserEvent[]): Promise<void> {
    // Get current version
    const currentCount = await this.eventModel.countDocuments({ aggregateId });
    const docs = new_events.map((event, idx) => ({
      aggregateId,
      eventType: event.eventType,
      eventData: event,
      timestamp: (event as any).timestamp || new Date(),
      version: currentCount + idx + 1,
    }));
    await this.eventModel.insertMany(docs);
    console.log(`Saved ${new_events.length} events for aggregate ${aggregateId}`);
  }

  async getEvents(aggregateId: string): Promise<UserEvent[]> {
    const docs = await this.eventModel.find({ aggregateId }).sort({ version: 1 });
    return docs.map(doc => doc.eventData as UserEvent);
  }

  async getAllEvents(): Promise<UserEvent[]> {
    const docs = await this.eventModel.find({}).sort({ aggregateId: 1, version: 1 });
    return docs.map(doc => doc.eventData as UserEvent);
  }
}