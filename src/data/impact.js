import { daysAgo } from "./helpers";

/**
 * Sample impact data. Every figure is illustrative and is labelled as sample
 * data in the UI — the real numbers will come from GET /impact/summary.
 */
export const impactData = {
  summary: {
    completed_collections: 128,
    portions_redistributed: 1864,
    estimated_waste_diverted_kg: 824,
    partner_organizations: 36,
    active_donors: 22,
    period_label: "Recent sample period",
  },
  weekly_series: [
    { label: "Wk 1", portions: 402, collections: 27 },
    { label: "Wk 2", portions: 388, collections: 26 },
    { label: "Wk 3", portions: 421, collections: 29 },
    { label: "Wk 4", portions: 356, collections: 24 },
    { label: "Wk 5", portions: 447, collections: 31 },
    { label: "Wk 6", portions: 398, collections: 27 },
    { label: "Wk 7", portions: 452, collections: 32 },
    { label: "Wk 8", portions: 464, collections: 33 },
  ],
  category_breakdown: [
    { category: "bakery", portions: 512, collections: 41, kg: 210 },
    { category: "produce", portions: 428, collections: 36, kg: 246 },
    { category: "prepared_meals", portions: 396, collections: 24, kg: 171 },
    { category: "dairy", portions: 218, collections: 14, kg: 118 },
    { category: "pantry", portions: 190, collections: 9, kg: 58 },
    { category: "beverages", portions: 120, collections: 4, kg: 21 },
  ],
  recent_collections: [
    {
      id: "imp_col_01",
      reservation_id: "req_5121",
      listing_title: "Sourdough & seeded loaves",
      donor_name: "Maple & Crumb Bakery",
      portions: 12,
      collected_at: daysAgo(1, 17, 10),
      status: "collected",
      estimated_waste_diverted_kg: 6,
    },
    {
      id: "imp_col_02",
      reservation_id: "req_5119",
      listing_title: "Morning pastry assortment",
      donor_name: "Juniper Coffee House",
      portions: 18,
      collected_at: daysAgo(2, 11, 30),
      status: "collected",
      estimated_waste_diverted_kg: 5.4,
    },
    {
      id: "imp_col_03",
      reservation_id: "req_5112",
      listing_title: "Ripe stone fruit & berries",
      donor_name: "Riverside Market",
      portions: 22,
      collected_at: daysAgo(3, 15, 45),
      status: "collected",
      estimated_waste_diverted_kg: 8.4,
    },
    {
      id: "imp_col_04",
      reservation_id: "req_5107",
      listing_title: "Seasonal vegetable crates",
      donor_name: "Greenway Grocers",
      portions: 24,
      collected_at: daysAgo(4, 16, 20),
      status: "collected",
      estimated_waste_diverted_kg: 11.2,
    },
    {
      id: "imp_col_05",
      reservation_id: "req_5099",
      listing_title: "Assorted deli sandwich platters",
      donor_name: "Lark & Larder",
      portions: 16,
      collected_at: daysAgo(5, 17, 5),
      status: "collected",
      estimated_waste_diverted_kg: 4.8,
    },
    {
      id: "imp_col_06",
      reservation_id: "req_5088",
      listing_title: "Tomato & basil soup",
      donor_name: "The Copper Pot",
      portions: 20,
      collected_at: daysAgo(6, 9, 40),
      status: "collected",
      estimated_waste_diverted_kg: 9.6,
    },
    {
      id: "imp_col_07",
      reservation_id: "req_5080",
      listing_title: "Yoghurt & fresh dairy overstock",
      donor_name: "Greenway Grocers",
      portions: 18,
      collected_at: daysAgo(7, 10, 15),
      status: "collected",
      estimated_waste_diverted_kg: 10.4,
    },
    {
      id: "imp_col_08",
      reservation_id: "req_5069",
      listing_title: "Pantry staples & canned goods",
      donor_name: "Lark & Larder",
      portions: 30,
      collected_at: daysAgo(8, 12, 30),
      status: "collected",
      estimated_waste_diverted_kg: 7.9,
    },
  ],
  top_donors: [
    { name: "Maple & Crumb Bakery", portions: 386, collections: 34 },
    { name: "Greenway Grocers", portions: 312, collections: 22 },
    { name: "The Copper Pot", portions: 264, collections: 18 },
    { name: "Juniper Coffee House", portions: 208, collections: 16 },
    { name: "Lark & Larder", portions: 176, collections: 14 },
  ],
  methodology: [
    {
      title: "Verified pickups only",
      description:
        "Portions count toward impact after the donor confirms the handover during pickup verification.",
    },
    {
      title: "Backend weight estimates",
      description:
        "Waste diverted is estimated by the backend using weight factors per food category — never calculated in the browser.",
    },
    {
      title: "One record per handover",
      description:
        "Every completed reservation leaves a single, auditable collection record shared by donor and organization.",
    },
  ],
};
