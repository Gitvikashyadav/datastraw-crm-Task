"use client";

import { FormEvent, useState } from "react";
import { api, ApiError } from "@/src/lib/api";
import { Note } from "@/src/lib/types";
import { Button } from "./ui/button";
import { Textarea } from "./ui/input";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface Props {
  ticketId: string;
  notes: Note[];
  onNoteAdded: (notes: Note[]) => void;
}

export function NotesTimeline({ ticketId, notes, onNoteAdded }: Props) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const updated = await api.addNote(ticketId, text.trim());
      onNoteAdded(updated.notes);
      setText("");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not add the note.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-medium text-ink">Notes</h2>

      {notes.length === 0 ? (
        <p className="text-sm text-muted">
          No notes yet. Add the first update below.
        </p>
      ) : (
        <ol className="flex flex-col gap-3 border-l border-hairline pl-4">
          {notes
            .slice()
            .reverse()
            .map((note) => (
              <li key={note._id} className="relative">
                <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-accent" />
                <p className="text-sm text-ink">{note.note_text}</p>
                <p className="mt-0.5 font-mono text-xs text-muted">
                  {formatDateTime(note.createdAt)}
                </p>
              </li>
            ))}
        </ol>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 pt-2">
        <Textarea
          id="new-note"
          placeholder="Add a note for the team…"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="secondary"
            disabled={submitting || !text.trim()}
          >
            {submitting ? "Adding…" : "Add note"}
          </Button>
        </div>
      </form>
    </div>
  );
}
