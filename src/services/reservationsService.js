import { apiClient, SAMPLE_DATA_ENABLED } from "./apiClient";
import { sampleStore } from "./sampleStore";

export async function getReservation(id, { signal } = {}) {
  if (SAMPLE_DATA_ENABLED) {
    const reservation = sampleStore.get(id);
    if (!reservation) {
      throw new Error("That reservation could not be found.");
    }
    return reservation;
  }

  return apiClient.get(`/reservations/${id}`, { signal });
}

export async function createReservation(payload, { signal } = {}) {
  if (SAMPLE_DATA_ENABLED) {
    const timestamp = new Date().toISOString();
    const reservation = sampleStore.add({
      id: `req_sample_${Date.now()}`,
      listing_id: payload.listing_id,
      listing_title: payload.listing_title,
      listing_photo_url: payload.listing_photo_url ?? null,
      listing_category: payload.listing_category ?? null,
      donor_id: payload.donor_id,
      donor_name: payload.donor_name,
      organization_id: "org_501",
      organization_name: "Harbor Kitchen",
      contact_name: "Maya Chen",
      portions_requested: payload.portions_requested,
      status: "pending",
      requested_at: timestamp,
      decided_at: null,
      collected_at: null,
      pickup_window_start: payload.pickup_window_start,
      pickup_window_end: payload.pickup_window_end,
      pickup_address: payload.pickup_address,
      pickup_instructions: payload.pickup_instructions,
      distance_km: payload.distance_km ?? null,
      message: payload.message ?? "",
      verification_code: `FR-${Math.floor(1000 + Math.random() * 9000)}`,
      timeline: [
        {
          code: "requested",
          label: "Request sent",
          at: timestamp,
        },
      ],
    });
    return reservation;
  }

  return apiClient.post("/reservations", payload, { signal });
}

export async function updateRequestStatus(requestId, status, { signal } = {}) {
  if (SAMPLE_DATA_ENABLED) {
    const updated = sampleStore.updateStatus(requestId, status);
    if (!updated) {
      throw new Error("That reservation could not be found.");
    }
    return updated;
  }

  return apiClient.patch(
    `/reservations/${requestId}`,
    { status },
    { signal },
  );
}
