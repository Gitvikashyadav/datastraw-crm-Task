"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/src/lib/api";
import { Button } from "./ui/button";
import { Input, Textarea } from "./ui/input";

interface FormState {
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
}

const emptyForm: FormState = {
  customer_name: "",
  customer_email: "",
  subject: "",
  description: "",
};

export function TicketForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (!form.customer_name.trim())
      next.customer_name = "Enter the customer’s name.";
    if (!/^\S+@\S+\.\S+$/.test(form.customer_email))
      next.customer_email = "Enter a valid email address.";
    if (!form.subject.trim()) next.subject = "Enter a short subject line.";
    if (form.description.trim().length < 5)
      next.description = "Describe the issue in a bit more detail.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const ticket = await api.createTicket(form);
      router.push(`/tickets/${ticket.ticket_id}`);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "Could not create the ticket.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-sm border border-hairline bg-white p-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="customer_name"
          label="Customer name"
          value={form.customer_name}
          onChange={(e) => update("customer_name", e.target.value)}
          error={errors.customer_name}
          placeholder="Jane Cole"
        />
        <Input
          id="customer_email"
          label="Customer email"
          type="email"
          value={form.customer_email}
          onChange={(e) => update("customer_email", e.target.value)}
          error={errors.customer_email}
          placeholder="jane@example.com"
        />
      </div>

      <Input
        id="subject"
        label="Subject"
        value={form.subject}
        onChange={(e) => update("subject", e.target.value)}
        error={errors.subject}
        placeholder="Can’t log in after password reset"
      />

      <Textarea
        id="description"
        label="Description"
        rows={5}
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        error={errors.description}
        placeholder="What’s happening, what did the customer already try, any relevant order or account IDs…"
      />

      {submitError && <p className="text-sm text-danger">{submitError}</p>}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating…" : "Create ticket"}
        </Button>
      </div>
    </form>
  );
}
