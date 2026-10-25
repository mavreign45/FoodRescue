import {
  Coffee,
  CookingPot,
  Croissant,
  Milk,
  Package,
  Sprout,
} from "lucide-react";

const ICONS = {
  produce: Sprout,
  bakery: Croissant,
  prepared_meals: CookingPot,
  dairy: Milk,
  pantry: Package,
  beverages: Coffee,
};

export function CategoryIcon({ category, ...props }) {
  const Icon = ICONS[category] ?? Package;
  return <Icon aria-hidden="true" {...props} />;
}
