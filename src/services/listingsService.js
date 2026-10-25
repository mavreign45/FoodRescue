import { apiClient, SAMPLE_DATA_ENABLED } from "./apiClient";
import { sampleApi } from "./sampleApi";

/**
 * Listing endpoints. The service boundary stays stable when sample data is
 * replaced by the FastAPI implementation.
 */
export async function getListings({ signal } = {}) {
  if (SAMPLE_DATA_ENABLED) {
    return sampleApi.getListings({ signal });
  }

  const response = await apiClient.get("/listings", { signal });
  return { items: response.items ?? response, source: "api" };
}

export async function getListing(id, { signal } = {}) {
  if (SAMPLE_DATA_ENABLED) {
    const { items } = await sampleApi.getListings({ signal });
    const listing = items.find((item) => item.id === id);
    if (!listing) {
      throw new Error("That listing could not be found.");
    }
    return listing;
  }

  return apiClient.get(`/listings/${id}`, { signal });
}

export async function createListing(payload, { signal } = {}) {
  if (SAMPLE_DATA_ENABLED) {
    return sampleApi.createListing(payload, { signal });
  }

  return apiClient.post("/listings", payload, { signal });
}
