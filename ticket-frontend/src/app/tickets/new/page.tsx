import { TicketForm } from '@/src/components/ticket-form';

export default function NewTicketPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-ink">New ticket</h1>
        <p className="text-sm text-muted">Log a new customer support request.</p>
      </div>
      <div className="max-w-2xl">
        <TicketForm />
      </div>
    </div>
  );
}