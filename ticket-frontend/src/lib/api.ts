import {
  ApiErrorEnvelope,
  ApiSuccessEnvelope,
  TicketDetail,
  TicketListResult,
  TicketStatus,
} from './types';

// const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Thin fetch wrapper that unwraps the backend's { success, data } /
 * { success: false, message } envelope so callers just get the payload
 * or a thrown ApiError.
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  const body = (await res.json()) as ApiSuccessEnvelope<T> | ApiErrorEnvelope;

  if (!body.success) {
    const message = Array.isArray(body.message)
      ? body.message.join(', ')
      : body.message;
    throw new ApiError(message, body.statusCode);
  }

  return body.data;
}

export interface CreateTicketPayload {
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
}

export interface ListTicketsParams {
  status?: TicketStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export const api = {
  listTickets(params: ListTicketsParams = {}): Promise<TicketListResult> {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return request<TicketListResult>(`/api/tickets${qs ? `?${qs}` : ''}`);
  },

  getTicket(ticketId: string): Promise<TicketDetail> {
    return request<TicketDetail>(`/api/tickets/${ticketId}`);
  },

  createTicket(payload: CreateTicketPayload): Promise<TicketDetail> {
    return request<TicketDetail>('/api/tickets', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateTicket(
    ticketId: string,
    payload: { status?: TicketStatus; notes?: string },
  ): Promise<TicketDetail> {
    return request<TicketDetail>(`/api/tickets/${ticketId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  addNote(ticketId: string, noteText: string): Promise<TicketDetail> {
    return request<TicketDetail>(`/api/tickets/${ticketId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note_text: noteText }),
    });
  },
};