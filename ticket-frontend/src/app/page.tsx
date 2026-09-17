
import { TicketList } from "../components/ticket-list";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-ink">Tickets</h1>
        <p className="text-sm text-muted">Search, filter, and triage incoming support requests.</p>
      </div>
      <TicketList />
    </div>
  );
}