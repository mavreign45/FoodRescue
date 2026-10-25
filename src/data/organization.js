import { minutesAgo, daysAgo } from "./helpers";
import { sampleListings } from "./listings";

const listingById = (id) => {
  const listing = sampleListings.find((item) => item.id === id);
  if (!listing) {
    throw new Error(`Sample listing ${id} not found`);
  }
  return listing;
};

const produceListing = listingById("lst_1002");
const soupListing = listingById("lst_1006");

export const organizationProfile = {
  id: "org_501",
  name: "Harbor Kitchen",
  contact_name: "Maya Chen",
  organization_type: "community_kitchen",
  neighborhood: "Riverside East",
  email: "maya@harborkitchen.example",
  verification_status: "verified",
};

/**
 * Match scores and reasons below are sample output from the backend matching
 * service. The frontend only displays them; it never calculates a score.
 */
export const organizationRecommendations = [
  {
    match_id: "mat_9001",
    match_score: 96,
    match_reasons: [
      "Fits tonight's dinner service",
      "No nuts — suits your kitchen's allergy plan",
      "Handover window after your prep shift",
    ],
    generated_at: minutesAgo(6),
    listing: listingById("lst_1003"),
  },
  {
    match_id: "mat_9002",
    match_score: 93,
    match_reasons: [
      "Bakery surplus your volunteers collect regularly",
      "Pickup window fits the afternoon run",
      "14 portions cover tomorrow's breakfast",
    ],
    generated_at: minutesAgo(6),
    listing: listingById("lst_1001"),
  },
  {
    match_id: "mat_9003",
    match_score: 87,
    match_reasons: [
      "32 portions support tomorrow's pantry service",
      "Ready after 4pm, close to your van route",
      "All produce is suitable for cold storage",
    ],
    generated_at: minutesAgo(6),
    listing: listingById("lst_1002"),
  },
  {
    match_id: "mat_9004",
    match_score: 82,
    match_reasons: [
      "Your kitchen has cold storage available",
      "Collection fits tomorrow's opening hours",
      "Use-by dates allow a next-day pickup",
    ],
    generated_at: minutesAgo(6),
    listing: listingById("lst_1008"),
  },
];

export const organizationRequests = [
  {
    id: "req_5101",
    listing_id: "lst_1002",
    listing_title: "Seasonal vegetable crates",
    donor_id: "dnr_102",
    donor_name: "Greenway Grocers",
    portions_requested: 20,
    status: "pending",
    requested_at: minutesAgo(25),
    pickup_window_start: produceListing.pickup_window_start,
    pickup_window_end: produceListing.pickup_window_end,
    message:
      "We can collect at 4:30 with the kitchen van. Twenty portions would cover our pantry table.",
  },
  {
    id: "req_5102",
    listing_id: "lst_1006",
    listing_title: "Tomato & basil soup",
    donor_id: "dnr_103",
    donor_name: "The Copper Pot",
    portions_requested: 20,
    status: "approved",
    requested_at: minutesAgo(180),
    pickup_window_start: soupListing.pickup_window_start,
    pickup_window_end: soupListing.pickup_window_end,
    message: "Approved for tomorrow morning. Bring the large cool boxes.",
    decided_at: minutesAgo(90),
  },
];

export const collectionHistory = [
  {
    id: "col_7001",
    reservation_id: "req_5088",
    listing_id: "lst_1001",
    listing_title: "Sourdough & seeded loaves",
    donor_name: "Maple & Crumb Bakery",
    portions: 12,
    collected_at: daysAgo(1, 17, 10),
    status: "collected",
    estimated_waste_diverted_kg: 6,
  },
  {
    id: "col_7002",
    reservation_id: "req_5081",
    listing_id: "lst_1004",
    listing_title: "Morning pastry assortment",
    donor_name: "Juniper Coffee House",
    portions: 18,
    collected_at: daysAgo(2, 11, 30),
    status: "collected",
    estimated_waste_diverted_kg: 5.4,
  },
  {
    id: "col_7003",
    reservation_id: "req_5074",
    listing_id: "lst_1005",
    listing_title: "Ripe stone fruit & berries",
    donor_name: "Riverside Market",
    portions: 22,
    collected_at: daysAgo(3, 15, 45),
    status: "collected",
    estimated_waste_diverted_kg: 8.4,
  },
  {
    id: "col_7004",
    reservation_id: "req_5062",
    listing_id: "lst_1002",
    listing_title: "Seasonal vegetable crates",
    donor_name: "Greenway Grocers",
    portions: 24,
    collected_at: daysAgo(4, 16, 20),
    status: "collected",
    estimated_waste_diverted_kg: 11.2,
  },
  {
    id: "col_7005",
    reservation_id: "req_5051",
    listing_id: "lst_1007",
    listing_title: "Assorted deli sandwich platters",
    donor_name: "Lark & Larder",
    portions: 16,
    collected_at: daysAgo(6, 17, 5),
    status: "collected",
    estimated_waste_diverted_kg: 4.8,
  },
  {
    id: "col_7006",
    reservation_id: "req_5039",
    listing_id: "lst_1006",
    listing_title: "Tomato & basil soup",
    donor_name: "The Copper Pot",
    portions: 20,
    collected_at: daysAgo(8, 9, 40),
    status: "collected",
    estimated_waste_diverted_kg: 9.6,
  },
];
