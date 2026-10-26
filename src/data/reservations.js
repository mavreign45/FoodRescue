import { donorListings } from "./donor";
import { sampleListings } from "./listings";
import { daysAgo, minutesAgo } from "./helpers";

/**
 * Seed reservations for the tracking page. These mirror the requests shown
 * on the donor and organization dashboards so the two screens stay coherent.
 */
const listingsById = (id) => {
  const listing =
    sampleListings.find((item) => item.id === id) ??
    donorListings.find((item) => item.id === id);

  if (!listing) {
    throw new Error(`Sample listing ${id} not found for reservation seed`);
  }
  return listing;
};

function seedRequest({
  id,
  listingId,
  portionsRequested,
  status,
  requestedAt,
  decidedAt = null,
  collectedAt = null,
  organizationName = "Harbor Kitchen",
  organizationId = "org_501",
  contactName = "Maya Chen",
  message = "",
  verificationCode,
}) {
  const listing = listingsById(listingId);

  const timeline = [{ code: "requested", label: "Request sent", at: requestedAt }];
  if (decidedAt) {
    timeline.push({
      code: status === "declined" ? "declined" : "approved",
      label:
        status === "declined"
          ? "Declined by donor"
          : `Approved by ${listing.donor_name}`,
      at: decidedAt,
    });
  }
  if (collectedAt) {
    timeline.push({
      code: "pickup",
      label: "Pickup window confirmed",
      at: listing.pickup_window_start,
    });
    timeline.push({
      code: "collected",
      label: "Pickup verified",
      at: collectedAt,
    });
  }

  return {
    id,
    listing_id: listing.id,
    listing_title: listing.title,
    listing_photo_url: listing.photo_url,
    listing_category: listing.category,
    donor_id: listing.donor_id,
    donor_name: listing.donor_name,
    organization_id: organizationId,
    organization_name: organizationName,
    contact_name: contactName,
    portions_requested: portionsRequested,
    status,
    requested_at: requestedAt,
    decided_at: decidedAt,
    collected_at: collectedAt,
    pickup_window_start: listing.pickup_window_start,
    pickup_window_end: listing.pickup_window_end,
    pickup_address: listing.pickup_address,
    pickup_instructions: listing.pickup_instructions,
    distance_km: listing.distance_km ?? null,
    message,
    verification_code: verificationCode,
    timeline,
  };
}

export const sampleReservations = [
  seedRequest({
    id: "req_5101",
    listingId: "lst_1002",
    portionsRequested: 20,
    status: "pending",
    requestedAt: minutesAgo(25),
    message: "We can collect at 4:30 with the kitchen van.",
    verificationCode: "FR-2214",
  }),
  seedRequest({
    id: "req_5102",
    listingId: "lst_1006",
    portionsRequested: 20,
    status: "approved",
    requestedAt: minutesAgo(180),
    decidedAt: minutesAgo(90),
    message: "Approved for tomorrow morning. Bring the large cool boxes.",
    verificationCode: "FR-2208",
  }),
  seedRequest({
    id: "req_4103",
    listingId: "lst_2003",
    portionsRequested: 20,
    status: "approved",
    requestedAt: minutesAgo(190),
    decidedAt: minutesAgo(120),
    message: "Our van can be there at 3. We'll bring two insulated trays.",
    verificationCode: "FR-2195",
  }),
  seedRequest({
    id: "req_col_8001",
    listingId: "lst_1001",
    portionsRequested: 12,
    status: "collected",
    requestedAt: daysAgo(3, 9, 20),
    decidedAt: daysAgo(3, 10, 5),
    collectedAt: daysAgo(2, 17, 10),
    message: "Bread for our breakfast service on Friday.",
    verificationCode: "FR-2152",
  }),
];
