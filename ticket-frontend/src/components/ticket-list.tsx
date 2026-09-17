"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { TicketStatus, TicketSummary } from "@/src/lib/types";
import { SearchFilterBar } from "./search-filter-bar";
import { TicketRow } from "./ticket-row";
import { Button } from "./ui/button";
import { useDebounce } from "../hooks/use-debounce";

export function TicketList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TicketStatus | "">("");
  const [page, setPage] = useState(1);
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  // Reset to page 1 whenever the filters change.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .listTickets({
        search: debouncedSearch || undefined,
        status: status || undefined,
        page,
        limit: 15,
      })
      .then((result) => {
        if (cancelled) return;
        setTickets(result.items);
        setTotalPages(result.meta.totalPages);
        setTotal(result.meta.total);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message ?? "Could not load tickets.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, status, page]);

  return (
    <div className="flex flex-col gap-4">
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      {error && (
        <p className="rounded-sm border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-sm border border-hairline">
        <div className="grid grid-cols-[7rem_1fr_8rem_7rem] gap-4 border-b border-hairline bg-paper px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted">
          <span>ID</span>
          <span>Ticket</span>
          <span>Status</span>
          <span className="text-right">Created</span>
        </div>

        {loading ? (
          <p className="px-4 py-8 text-center text-sm text-muted">
            Loading tickets…
          </p>
        ) : tickets.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm text-ink">No tickets match this view.</p>
            <p className="mt-1 text-sm text-muted">
              Try clearing the search or status filter, or create a new ticket.
            </p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <TicketRow key={ticket.ticket_id} ticket={ticket} />
          ))
        )}
      </div>

      {!loading && tickets.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted">
          <span>
            {total} ticket{total === 1 ? "" : "s"} · page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
