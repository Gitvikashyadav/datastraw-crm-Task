import { TicketStatus } from "@/src/lib/types";

const styles: Record<TicketStatus, string> = {
  Open: "bg-status-openSoft text-status-open",
  "In Progress": "bg-status-progressSoft text-status-progress",
  Closed: "bg-status-closedSoft text-status-closed",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export const statusBarColor: Record<TicketStatus, string> = {
  Open: "border-l-status-open",
  "In Progress": "border-l-status-progress",
  Closed: "border-l-status-closed",
};
