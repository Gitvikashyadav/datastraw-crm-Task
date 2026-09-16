import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TicketStatus } from '../enums/ticket-status.enum';
import { Note, NoteSchema } from './note.schema';

export type TicketDocument = Ticket & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'tickets',
})
export class Ticket {
  @Prop({ required: true, unique: true, index: true })
  ticket_id: string; // e.g. TKT-000001, human-facing ID (see counter.schema.ts)

  @Prop({ required: true, trim: true })
  customer_name: string;

  @Prop({ required: true, trim: true, lowercase: true })
  customer_email: string;

  @Prop({ required: true, trim: true })
  subject: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({
    required: true,
    enum: Object.values(TicketStatus),
    default: TicketStatus.OPEN,
    index: true,
  })
  status: TicketStatus;

  @Prop({ type: [NoteSchema], default: [] })
  notes: Note[];

  // created_at / updated_at are added automatically by the timestamps option above
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

// Compound text index powers the "search across name / email / subject / description" requirement.
TicketSchema.index({
  customer_name: 'text',
  customer_email: 'text',
  subject: 'text',
  description: 'text',
  ticket_id: 'text',
});