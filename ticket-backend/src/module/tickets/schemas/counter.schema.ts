import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * A tiny "counters" collection used to atomically generate sequential
 * ticket numbers (TKT-000001, TKT-000002, ...) via findOneAndUpdate +
 * $inc. This avoids race conditions that a naive "count documents + 1"
 * approach would have under concurrent requests.
 */
@Schema({ collection: 'counters' })
export class Counter extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, default: 0 })
  value: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);