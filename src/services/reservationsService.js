import { apiClient, SAMPLE_DATA_ENABLED } from "./apiClient";
import { sampleApi } from "./sampleApi";

export async function createReservation(payload, { signal } = {}) {
  if (SAMPLE_DATA_ENABLED) {
    return sampleApi.createReservation(payload, { signal });
  }

  return apiClient.post("/reservations", payload, { signal });
}

export async function updateRequestStatus(requestId, status, { signal } = {}) {
  if (SAMPLE_DATA_ENABLED) {
    return sampleApi.updateRequestStatus(requestId, status, { signal });
  }

  return apiClient.patch(
    `/reservations/${requestId}`,
    { status },
    { signal },
  );
}
