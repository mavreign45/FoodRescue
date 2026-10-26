import { apiClient, SAMPLE_DATA_ENABLED } from "./apiClient";
import { sampleApi } from "./sampleApi";
import { cloneValue } from "@/utils/clone";
import { impactData } from "@/data/impact";
import { wait } from "./sampleApi";

export async function getImpactSummary({ signal } = {}) {
  if (SAMPLE_DATA_ENABLED) {
    await wait(600, signal);
    return cloneValue(impactData);
  }

  return apiClient.get("/impact/summary", { signal });
}
