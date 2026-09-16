/**
 * Generates a human-friendly, sequential-looking ticket ID such as
 * TKT-000123. `sequence` should come from an atomic counter (see
 * TicketsService.getNextSequence) so IDs stay unique and gap-free even
 * under concurrent ticket creation.
 */
export function generateTicketId(sequence: number): string {
  return `TKT-${sequence.toString().padStart(6, '0')}`;
}