import { donorListings, donorProfile, donorRequests, donorSummary } from "@/data/donor";
import { sampleListings } from "@/data/listings";
import {
  collectionHistory,
  organizationProfile,
  organizationRecommendations,
  organizationRequests,
} from "@/data/organization";

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

function clone(value) {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

export const sampleApi = {
  async getListings({ signal } = {}) {
    await wait(NETWORK_DELAY, signal);
    return { items: clone(sampleListings), source: "sample" };
  },

  async getDonorWorkspace({ signal } = {}) {
    await wait(NETWORK_DELAY, signal);
    return {
      profile: clone(donorProfile),
      listings: clone(donorListings),
      requests: clone(donorRequests),
      summary: clone(donorSummary),
      source: "sample",
    };
  },

  async getOrganizationWorkspace({ signal } = {}) {
    await wait(NETWORK_DELAY, signal);
    return {
      profile: clone(organizationProfile),
      recommendations: clone(organizationRecommendations),
      requests: clone(organizationRequests),
      collection_history: clone(collectionHistory),
      source: "sample",
    };
  },

  async createListing(payload, { signal } = {}) {
    await wait(650, signal);
    const timestamp = new Date().toISOString();

    return {
      ...clone(payload),
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

  async createReservation(payload, { signal } = {}) {
    await wait(650, signal);
    const timestamp = new Date().toISOString();

    return {
      ...clone(payload),
      id: `req_sample_${Date.now()}`,
      organization_id: organizationProfile.id,
      organization_name: organizationProfile.name,
      contact_name: organizationProfile.contact_name,
      status: "pending",
      requested_at: timestamp,
      source: "sample",
    };
  },

  async updateRequestStatus(requestId, status, { signal } = {}) {
    await wait(500, signal);
    return {
      id: requestId,
      status,
      decided_at: new Date().toISOString(),
      source: "sample",
    };
  },
};
