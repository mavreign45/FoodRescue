/**
 * Landing page sample content.
 * Impact figures are illustrative only and must stay clearly labelled in the UI.
 */

export const sampleImpactStats = [
  {
    id: "portions",
    value: "1,284",
    label: "portions shared",
    detail: "with local community kitchens",
  },
  {
    id: "food",
    value: "512 kg",
    label: "good food rescued",
    detail: "kept out of the waste stream",
  },
  {
    id: "partners",
    value: "36",
    label: "community partners",
    detail: "kitchens, fridges and clubs",
  },
  {
    id: "pickups",
    value: "92%",
    label: "pickups completed",
    detail: "within the agreed window",
  },
];

export const sampleImpactDisclaimer =
  "Illustrative prototype figures — not live impact metrics.";

export const howItWorksSteps = [
  {
    id: "list",
    number: "01",
    title: "List what's left",
    description:
      "Donors add portions, allergens and a pickup window in a couple of minutes. No spreadsheets, no phone-around.",
    highlight: "About 2 minutes",
  },
  {
    id: "match",
    number: "02",
    title: "We find the fit",
    description:
      "Nearby organizations see recommendations ranked by our backend for distance, capacity and timing — not by guesswork.",
    highlight: "Backend-ranked matches",
  },
  {
    id: "collect",
    number: "03",
    title: "Collect and share",
    description:
      "Coordinate the handover, confirm collection, and keep a clear record of every portion that reaches a plate.",
    highlight: "One shared record",
  },
];

export const sampleAudiences = {
  donors: {
    eyebrow: "For donors",
    title: "Surplus shouldn't be a chore.",
    description:
      "Turn the end of service into someone's next meal. Post in minutes, approve the right request, and know exactly where your food went.",
    points: [
      "Post surplus morning, noon or night",
      "Share allergens and clear pickup instructions",
      "See which organization is collecting",
    ],
    cta: "Explore the donor demo",
    to: "/donor",
    image: "/images/pastries.jpg",
    imageAlt: "Fresh pastries on a bakery counter",
  },
  organizations: {
    eyebrow: "For community organizations",
    title: "Good food, matched to your kitchen.",
    description:
      "Find nearby surplus that fits your capacity, service times and the people you feed — with match scores calculated by the backend.",
    points: [
      "Recommendations ranked by the backend",
      "Reservations and collection history in one place",
      "Allergen and handling details up front",
    ],
    cta: "Explore the organization demo",
    to: "/organization",
    image: "/images/produce-box.jpg",
    imageAlt: "A colourful crate of seasonal vegetables",
  },
};

export const heroProofPoints = [
  "Built for local food businesses",
  "Pickup windows that fit service",
  "Designed with community kitchens",
];

export const heroBenefits = [
  "Allergens shared on every listing",
  "Distance and deadline up front",
  "Pickup details before you commit",
];
