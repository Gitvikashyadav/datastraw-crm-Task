"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/src/lib/api";
import {
  Note,
  TicketDetail,
  TicketStatus,
  TICKET_STATUSES,
} from "@/src/lib/types";
import { StatusBadge } from "@/src/components/status-badge";
import { Select } from "@/src/components/ui/select";
import { NotesTimeline } from "@/src/components/notes-timeline";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function TicketDetailPage({
  params,
}: {
  params: { ticket_id: string };
}) {
  const { ticket_id } = params;
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .getTicket(ticket_id)
      .then((data) => {
        if (!cancelled) setTicket(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Could not load this ticket.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ticket_id]);

  async function handleStatusChange(status: TicketStatus) {
    if (!ticket) return;
    setStatusUpdating(true);
    try {
      const updated = await api.updateTicket(ticket_id, { status });
      setTicket(updated);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not update the status.",
      );
    } finally {
      setStatusUpdating(false);
    }
  }

  function handleNoteAdded(notes: Note[]) {
    setTicket((prev) => (prev ? { ...prev, notes } : prev));
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading ticket…</p>;
  }

  if (error && !ticket) {
    return (
      <div className="flex flex-col gap-3">
        <p className="rounded-sm border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
          {error}
        </p>
        <Link href="/" className="text-sm text-accent underline">
          Back to all tickets
        </Link>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/" className="text-sm text-muted hover:text-ink">
          ← All tickets
        </Link>
      </div>

      <div className="flex flex-col gap-4 rounded-sm border border-hairline bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-muted">{ticket.ticket_id}</p>
            <h1 className="mt-1 text-lg font-semibold text-ink">
              {ticket.subject}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={ticket.status} />
            <Select
              aria-label="Change status"
              value={ticket.status}
              disabled={statusUpdating}
              onChange={(e) =>
                handleStatusChange(e.target.value as TicketStatus)
              }
              className="w-40"
            >
              {TICKET_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid gap-4 border-t border-hairline pt-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">
              Customer
            </p>
            <p className="mt-1 text-ink">{ticket.customer_name}</p>
            <p className="text-muted">{ticket.customer_email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Opened</p>
            <p className="mt-1 font-mono text-xs text-ink">
              {formatDateTime(ticket.created_at)}
            </p>
            <p className="text-xs uppercase tracking-wide text-muted mt-2">
              Last updated
            </p>
            <p className="mt-1 font-mono text-xs text-ink">
              {formatDateTime(ticket.updated_at)}
            </p>
          </div>
        </div>

        <div className="border-t border-hairline pt-4">
          <p className="text-xs uppercase tracking-wide text-muted">
            Description
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-ink">
            {ticket.description}
          </p>
        </div>
      </div>

      {error && (
        <p className="rounded-sm border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="rounded-sm border border-hairline bg-white p-6">
        <NotesTimeline
          ticketId={ticket.ticket_id}
          notes={ticket.notes}
          onNoteAdded={handleNoteAdded}
        />
      </div>
    </div>
  );
}
