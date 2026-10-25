import { apiClient, SAMPLE_DATA_ENABLED } from "./apiClient";
import { sampleApi } from "./sampleApi";

export async function getDonorWorkspace({ signal } = {}) {
  if (SAMPLE_DATA_ENABLED) {
    return sampleApi.getDonorWorkspace({ signal });
  }

  return apiClient.get("/donors/me/workspace", { signal });
}
