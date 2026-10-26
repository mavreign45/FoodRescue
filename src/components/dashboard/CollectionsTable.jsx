import { Check, History } from "lucide-react";
import {
  formatDate,
  formatDay,
  formatNumber,
  formatTime,
  portionLabel,
} from "@/utils/format";
import { EmptyState } from "@/components/ui/States";

/**
 * Shared collections table used by the organization dashboard and the
 * impact dashboard. Estimated diversion figures are backend-owned values;
 * this component only displays them.
 */
export function CollectionsTable({ collections, note }) {
  if (!collections.length) {
    return (
      <EmptyState
        icon={History}
        title="No collections yet"
        description="Completed pickups will be recorded here."
        className="border-0"
      />
    );
  }

  const totals = collections.reduce(
    (accumulator, item) => ({
      portions: accumulator.portions + item.portions,
      kg: accumulator.kg + item.estimated_waste_diverted_kg,
    }),
    { portions: 0, kg: 0 },
  );

  return (
    <div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[560px] text-left">
          <thead>
            <tr className="border-b border-forest-900/8 bg-cream-50/60 text-[9.5px] font-semibold uppercase tracking-[0.13em] text-ink-soft/70">
              <th scope="col" className="px-4 py-2.5 font-semibold">
                Collected
              </th>
              <th scope="col" className="px-4 py-2.5 font-semibold">
                Food &amp; donor
              </th>
              <th scope="col" className="px-4 py-2.5 text-right font-semibold">
                Portions
              </th>
              <th scope="col" className="px-4 py-2.5 text-right font-semibold">
                Est. diverted
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-900/6">
            {collections.map((item) => (
              <tr
                key={item.id}
                className="transition-colors hover:bg-cream-50/60"
              >
                <td className="whitespace-nowrap px-4 py-3">
                  <p className="flex items-center gap-1.5 text-[11.5px] font-medium text-forest-900">
                    <Check
                      aria-hidden="true"
                      size={11}
                      className="text-forest-500"
                    />
                    {formatDay(item.collected_at)}
                  </p>
                  <p className="mt-0.5 pl-[17px] text-[10px] text-ink-soft/60">
                    {formatTime(item.collected_at)}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[11.5px] font-medium text-forest-950">
                    {item.listing_title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-ink-soft">
                    {item.donor_name}
                  </p>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-[11.5px] font-semibold text-forest-900">
                  {formatNumber(item.portions)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <span className="inline-flex items-center rounded-full bg-forest-50 px-2 py-1 text-[10px] font-medium text-forest-700">
                    {item.estimated_waste_diverted_kg.toFixed(1)} kg
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-forest-900/6 md:hidden">
        {collections.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-3 p-4"
          >
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-forest-950">
                {item.listing_title}
              </p>
              <p className="mt-0.5 text-[10.5px] text-ink-soft">
                {item.donor_name} · {formatDate(item.collected_at)}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-forest-600">
                <Check aria-hidden="true" size={10} />
                {portionLabel(item.portions)} collected
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-forest-50 px-2 py-1 text-[10px] font-medium text-forest-700">
              {item.estimated_waste_diverted_kg.toFixed(1)} kg
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-forest-900/8 bg-cream-50/60 px-4 py-3">
        <p className="text-[10.5px] text-ink-soft">
          {note ?? "Estimated waste diverted is a backend calculation."}
        </p>
        <div className="flex items-center gap-3 text-[10.5px] font-medium text-forest-800">
          <span>{formatNumber(totals.portions)} portions</span>
          <span aria-hidden="true" className="size-1 rounded-full bg-forest-300" />
          <span>{totals.kg.toFixed(1)} kg est.</span>
        </div>
      </div>
    </div>
  );
}
