export type TicketStatus = 'Open' | 'In Progress' | 'Closed';

export const TICKET_STATUSES: TicketStatus[] = ['Open', 'In Progress', 'Closed'];

export interface Note {
  _id: string;
  note_text: string;
  createdAt: string;
}

export interface TicketSummary {
  ticket_id: string;
  customer_name: string;
  subject: string;
  status: TicketStatus;
  created_at: string;
}

export interface TicketDetail extends TicketSummary {
  customer_email: string;
  description: string;
  notes: Note[];
  updated_at: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TicketListResult {
  items: TicketSummary[];
  meta: PaginationMeta;
}

/** Matches the backend's global response envelope (TransformInterceptor). */
export interface ApiSuccessEnvelope<T> {
  success: true;
  statusCode: number;
  data: T;
}

export interface ApiErrorEnvelope {
  success: false;
  statusCode: number;
  path: string;
  timestamp: string;
  message: string | string[];
  error: string;
}