import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter, Model } from 'mongoose';
import { generateTicketId } from '../../common/utils/generate-ticket-id.util.js';
import { AddNoteDto } from './dto/add-note.dto.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { QueryTicketDto } from './dto/query-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { Counter } from './schemas/counter.schema.js';
import { Ticket, TicketDocument } from './schemas/ticket.schema.js';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);
  private static readonly TICKET_COUNTER_NAME = 'ticket_id';

  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<TicketDocument>,
    @InjectModel(Counter.name) private readonly counterModel: Model<Counter>,
  ) {}

  /**
   * Atomically increments and returns the next sequence number for ticket
   * IDs. Using findOneAndUpdate with $inc + upsert means two concurrent
   * ticket-creation requests can never receive the same number.
   */
  private async getNextSequence(): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { name: TicketsService.TICKET_COUNTER_NAME },
      { $inc: { value: 1 } },
      { new: true, upsert: true },
    );
    return counter.value;
  }

  async create(dto: CreateTicketDto): Promise<Ticket> {
    const sequence = await this.getNextSequence();
    const ticket_id = generateTicketId(sequence);

    const created = new this.ticketModel({
      ticket_id,
      ...dto,
    });

    const saved = await created.save();
    this.logger.log(`Created ticket ${saved.ticket_id}`);
    return saved;
  }

  async findAll(query: QueryTicketDto) {
    const { status, search, page = 1, limit = 20 } = query;

    const filter: QueryFilter<TicketDocument> = {};
    if (status) {
      filter.status = status;
    }
    if (search && search.trim().length > 0) {
      // Regex OR-search across fields so partial "as you type" search works.
      // (A $text index also exists on the schema for whole-word search if
      // the dataset grows large enough that regex scans become slow.)
      const regex = new RegExp(this.escapeRegex(search.trim()), 'i');
      filter.$or = [
        { customer_name: regex },
        { customer_email: regex },
        { subject: regex },
        { description: regex },
        { ticket_id: regex },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.ticketModel
        .find(filter)
        .select('ticket_id customer_name subject status created_at')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.ticketModel.countDocuments(filter),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(ticket_id: string): Promise<Ticket> {
    const ticket = await this.ticketModel.findOne({ ticket_id }).lean();
    if (!ticket) {
      throw new NotFoundException(`Ticket ${ticket_id} not found`);
    }
    return ticket;
  }

  async update(ticket_id: string, dto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.ticketModel.findOne({ ticket_id });
    if (!ticket) {
      throw new NotFoundException(`Ticket ${ticket_id} not found`);
    }

    if (dto.status) {
      ticket.status = dto.status;
    }
    if (dto.notes) {
      ticket.notes.push({ note_text: dto.notes } as any);
    }

    const saved = await ticket.save();
    this.logger.log(`Updated ticket ${ticket_id}`);
    return saved;
  }

  async addNote(ticket_id: string, dto: AddNoteDto): Promise<Ticket> {
    const ticket = await this.ticketModel.findOne({ ticket_id });
    if (!ticket) {
      throw new NotFoundException(`Ticket ${ticket_id} not found`);
    }
    ticket.notes.push({ note_text: dto.note_text } as any);
    return ticket.save();
  }

  /** Escapes user input before dropping it into a RegExp constructor. */
  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}