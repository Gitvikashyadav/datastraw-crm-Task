import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AddNoteDto } from './dto/add-note.dto.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { QueryTicketDto } from './dto/query-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { TicketsService } from './tickets.service.js';

@Controller('api/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // POST /api/tickets
  @Post()
  create(@Body() CreateTicketDto: CreateTicketDto) {
    return this.ticketsService.create(CreateTicketDto);
  }

  // GET /api/tickets?status=Open&search=jane&page=1&limit=20
  @Get()
  findAll(@Query() query: QueryTicketDto) {
    return this.ticketsService.findAll(query);
  }

  // GET /api/tickets/:ticket_id
  @Get(':ticket_id')
  findOne(@Param('ticket_id') ticket_id: string) {
    return this.ticketsService.findOne(ticket_id);
  }

  // PUT /api/tickets/:ticket_id  Body: { status?, notes? }
  @Put(':ticket_id')
  update(
    @Param('ticket_id') ticket_id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketsService.update(ticket_id, updateTicketDto);
  }

  // POST /api/tickets/:ticket_id/notes  (stand-out extra: dedicated notes endpoint)
  @Post(':ticket_id/notes')
  addNote(
    @Param('ticket_id') ticket_id: string,
    @Body() addNoteDto: AddNoteDto,
  ) {
    return this.ticketsService.addNote(ticket_id, addNoteDto);
  }
}