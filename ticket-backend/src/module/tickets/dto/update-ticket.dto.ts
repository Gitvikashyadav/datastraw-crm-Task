import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TicketStatus } from '../enums/ticket-status.enum.js';

/**
 * Matches the spec's PUT /api/tickets/{ticket_id} body: { status, notes }.
 * `notes` here is treated as "add this note text to the ticket" (a single
 * new note string) rather than replacing the whole notes array - that
 * keeps the endpoint simple and matches how a support agent actually
 * works (append a comment, optionally change status in the same action).
 */
export class UpdateTicketDto {
  @IsOptional()
  @IsEnum(TicketStatus, {
    message: `status must be one of: ${Object.values(TicketStatus).join(', ')}`,
  })
  status?: TicketStatus;

  @IsOptional()
  @IsString()
  @MinLength(1)
  notes?: string;
}