export const LISTING_STATUS = {
  AVAILABLE: "available",
  RESERVED: "reserved",
  COLLECTED: "collected",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
};

export const LISTING_STATUS_LABELS = {
  available: "Available",
  reserved: "Reserved",
  collected: "Collected",
  expired: "Expired",
  cancelled: "Cancelled",
};

export const RESERVATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  DECLINED: "declined",
  CANCELLED: "cancelled",
  COLLECTED: "collected",
  EXPIRED: "expired",
};

export const RESERVATION_STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  declined: "Declined",
  cancelled: "Cancelled",
  collected: "Collected",
  expired: "Expired",
};

export const VERIFICATION_STATUS = {
  UNVERIFIED: "unverified",
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
};

export const VERIFICATION_STATUS_LABELS = {
  unverified: "Not verified",
  pending: "Verification pending",
  verified: "Verified partner",
  rejected: "Verification declined",
};

export const FOOD_CATEGORIES = [
  { value: "produce", label: "Produce", icon: "Produce" },
  { value: "bakery", label: "Bakery", icon: "Bakery" },
  { value: "prepared_meals", label: "Prepared meals", icon: "Meals" },
  { value: "dairy", label: "Dairy & eggs", icon: "Dairy" },
  { value: "pantry", label: "Pantry", icon: "Pantry" },
  { value: "beverages", label: "Beverages", icon: "Beverages" },
];

export const CATEGORY_LABELS = Object.fromEntries(
  FOOD_CATEGORIES.map((category) => [category.value, category.label]),
);

export const DIETARY_TAGS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "halal", label: "Halal" },
  { value: "gluten_free", label: "Gluten-free" },
  { value: "nut_free", label: "Nut-free" },
  { value: "dairy_free", label: "Dairy-free" },
];

export const DIETARY_LABELS = Object.fromEntries(
  DIETARY_TAGS.map((tag) => [tag.value, tag.label]),
);

export const ALLERGENS = [
  { value: "gluten", label: "Gluten" },
  { value: "milk", label: "Milk" },
  { value: "eggs", label: "Eggs" },
  { value: "peanuts", label: "Peanuts" },
  { value: "tree_nuts", label: "Tree nuts" },
  { value: "soy", label: "Soy" },
  { value: "fish", label: "Fish" },
  { value: "shellfish", label: "Shellfish" },
  { value: "sesame", label: "Sesame" },
];

export const ALLERGEN_LABELS = Object.fromEntries(
  ALLERGENS.map((allergen) => [allergen.value, allergen.label]),
);

export const DISTANCE_OPTIONS = [
  { value: "any", label: "Any distance" },
  { value: "1", label: "Within 1 km" },
  { value: "3", label: "Within 3 km" },
  { value: "5", label: "Within 5 km" },
  { value: "10", label: "Within 10 km" },
];

export const SORT_OPTIONS = [
  { value: "deadline", label: "Soonest pickup" },
  { value: "distance", label: "Closest to me" },
  { value: "portions", label: "Most portions" },
];
