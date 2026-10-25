import { apiClient, SAMPLE_DATA_ENABLED } from "./apiClient";
import { sampleApi } from "./sampleApi";

export async function getOrganizationWorkspace({ signal } = {}) {
  if (SAMPLE_DATA_ENABLED) {
    return sampleApi.getOrganizationWorkspace({ signal });
  }

  return apiClient.get("/organizations/me/workspace", { signal });
}
