"use client";

import { TICKET_STATUSES, TicketStatus } from "@/src/lib/types";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  status: TicketStatus | "";
  onStatusChange: (value: TicketStatus | "") => void;
}

export function SearchFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Input
          id="search"
          placeholder="Search by name, email, ID, or keyword…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-48">
        <Select
          id="status-filter"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as TicketStatus | "")}
        >
          <option value="">All statuses</option>
          {TICKET_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
