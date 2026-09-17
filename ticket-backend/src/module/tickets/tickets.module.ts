import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketsController } from './tickets.controller.js';
import { TicketsService } from './tickets.service.js';
import { Counter, CounterSchema } from './schemas/counter.schema.js';
import { Ticket, TicketSchema } from './schemas/ticket.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ticket.name, schema: TicketSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}