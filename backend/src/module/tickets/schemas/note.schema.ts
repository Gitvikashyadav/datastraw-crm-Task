import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Notes are embedded inside a Ticket document rather than stored in a
 * separate collection with a ticket_id foreign key. Design tradeoff:
 *  - Pro: a ticket + all its notes load in a single query (no join),
 *    which matches the access pattern (notes are always viewed with
 *    their parent ticket, and a ticket rarely has more than a handful
 *    of notes).
 *  - Con: if notes ever needed to be queried independently across
 *    tickets at scale (e.g. "search all notes company-wide"), a
 *    top-level collection with indexes would be a better fit. That's
 *    an easy migration later since the shape stays the same.
 */
@Schema({ _id: true, timestamps: { createdAt: true, updatedAt: false } })
export class Note {
  @Prop({ required: true, trim: true })
  note_text: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);