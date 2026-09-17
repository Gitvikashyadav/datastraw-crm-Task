import Link from "next/link";
import { TicketSummary } from "@/src/lib/types";
import { StatusBadge, statusBarColor } from "./status-badge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TicketRow({ ticket }: { ticket: TicketSummary }) {
  return (
    <Link
      href={`/tickets/${ticket.ticket_id}`}
      className={`grid grid-cols-[7rem_1fr_8rem_7rem] items-center gap-4 border-b border-l-2 border-hairline bg-white px-4 py-3 text-sm transition-colors hover:bg-paper ${statusBarColor[ticket.status]}`}
    >
      <span className="font-mono text-xs text-muted">{ticket.ticket_id}</span>
      <span className="min-w-0">
        <span className="block truncate text-ink">{ticket.subject}</span>
        <span className="block truncate text-xs text-muted">
          {ticket.customer_name}
        </span>
      </span>
      <StatusBadge status={ticket.status} />
      <span className="text-right font-mono text-xs text-muted">
        {formatDate(ticket.created_at)}
      </span>
    </Link>
  );
}
