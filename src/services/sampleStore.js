import { sampleReservations } from "@/data/reservations";
import { cloneValue } from "@/utils/clone";

/**
 * In-memory store used by the sample services so that reservations created
 * in one screen (discovery, food details) can be opened in another (tracking).
 * It is replaced by the API in the integration phase.
 */
const reservations = new Map();
let seeded = false;

function ensureSeed() {
  if (seeded) return;
  for (const reservation of sampleReservations) {
    reservations.set(reservation.id, cloneValue(reservation));
  }
  seeded = true;
}

function eventForStatus(status, at) {
  const labels = {
    approved: "Approved by donor",
    declined: "Declined by donor",
    cancelled: "Cancelled",
    collected: "Pickup verified",
    expired: "Pickup window passed",
  };

  return {
    code: status,
    label: labels[status] ?? "Status updated",
    at,
  };
}

export const sampleStore = {
  get(id) {
    ensureSeed();
    const reservation = reservations.get(id);
    return reservation ? cloneValue(reservation) : null;
  },

  list() {
    ensureSeed();
    return [...reservations.values()].map((item) => cloneValue(item));
  },

  add(reservation) {
    ensureSeed();
    reservations.set(reservation.id, cloneValue(reservation));
    return this.get(reservation.id);
  },

  updateStatus(id, status, extra = {}) {
    ensureSeed();
    const existing = reservations.get(id);
    if (!existing) return null;

    const at = extra.at ?? new Date().toISOString();
    const updated = {
      ...existing,
      status,
      decided_at: ["approved", "declined"].includes(status)
        ? at
        : existing.decided_at,
      collected_at: status === "collected" ? at : existing.collected_at,
      ...extra,
      timeline: [...(existing.timeline ?? []), eventForStatus(status, at)],
    };

    reservations.set(id, updated);
    return cloneValue(updated);
  },
};
