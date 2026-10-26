import { donorListings, donorProfile, donorRequests, donorSummary } from "@/data/donor";
import { sampleListings } from "@/data/listings";
import {
  collectionHistory,
  organizationProfile,
  organizationRecommendations,
  organizationRequests,
} from "@/data/organization";
import { cloneValue } from "@/utils/clone";

const NETWORK_DELAY = 480;

export function wait(ms = NETWORK_DELAY, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Request aborted", "AbortError"));
      return;
    }

    const timer = window.setTimeout(resolve, ms);

    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        reject(new DOMException("Request aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

export const sampleApi = {
  async getListings({ signal } = {}) {
    await wait(NETWORK_DELAY, signal);
    return { items: cloneValue(sampleListings), source: "sample" };
  },

  async getDonorWorkspace({ signal } = {}) {
    await wait(NETWORK_DELAY, signal);
    return {
      profile: cloneValue(donorProfile),
      listings: cloneValue(donorListings),
      requests: cloneValue(donorRequests),
      summary: cloneValue(donorSummary),
      source: "sample",
    };
  },

  async getOrganizationWorkspace({ signal } = {}) {
    await wait(NETWORK_DELAY, signal);
    return {
      profile: cloneValue(organizationProfile),
      recommendations: cloneValue(organizationRecommendations),
      requests: cloneValue(organizationRequests),
      collection_history: cloneValue(collectionHistory),
      source: "sample",
    };
  },

  async createListing(payload, { signal } = {}) {
    await wait(650, signal);
    const timestamp = new Date().toISOString();

    return {
      ...cloneValue(payload),
      id: `lst_sample_${Date.now()}`,
      donor_id: donorProfile.id,
      donor_name: donorProfile.name,
      donor_type: donorProfile.donor_type,
      portions_reserved: 0,
      status: "available",
      created_at: timestamp,
      updated_at: timestamp,
      source: "sample",
    };
  },
};
