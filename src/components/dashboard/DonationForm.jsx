import { useState } from "react";
import { CheckCircle2, Plus, Sparkles } from "lucide-react";
import { createListing } from "@/services/listingsService";
import {
  ALLERGENS,
  ALLERGEN_LABELS,
  DIETARY_TAGS,
  FOOD_CATEGORIES,
} from "@/constants/food";
import {
  addHours,
  toLocalDateTimeInput,
} from "@/utils/format";
import { Button } from "@/components/ui/Button";
import {
  FormField,
  Input,
  PhotoUpload,
  Select,
  Textarea,
  ToggleChip,
} from "@/components/ui/Form";
import { InlineNotice } from "@/components/ui/InlineNotice";

const CATEGORY_PHOTOS = {
  produce: "/images/produce-box.jpg",
  bakery: "/images/hero-bread.jpg",
  prepared_meals: "/images/prepared-meals.jpg",
  dairy: "/images/dairy.jpg",
  pantry: "/images/pantry.jpg",
  beverages: "/images/coffee.jpg",
};

const FIELD_IDS = {
  title: "donation-title",
  portions: "donation-portions",
  pickup_window_start: "donation-window-start",
  pickup_window_end: "donation-window-end",
  pickup_address: "donation-address",
  pickup_instructions: "donation-instructions",
};

function defaultWindowValues() {
  let start = addHours(new Date(), 2);
  const hour = start.getHours();

  // Keep the sample default inside sensible business hours.
  if (hour < 8 || hour > 19) {
    const next = new Date();
    next.setDate(next.getDate() + 1);
    next.setHours(9, 0, 0, 0);
    start = next;
  }

  return {
    pickup_window_start: toLocalDateTimeInput(start),
    pickup_window_end: toLocalDateTimeInput(addHours(start, 3)),
  };
}

function createInitialValues(profile) {
  const windowValues = defaultWindowValues();

  return {
    title: "",
    description: "",
    category: "bakery",
    portions: "12",
    dietary_tags: [],
    allergens: [],
    ...windowValues,
    pickup_address: profile?.address ?? "",
    pickup_instructions: "",
    photo_url: null,
  };
}

function SectionLabel({ step, title, hint }) {
  return (
    <div className="mb-4 flex items-start gap-2.5">
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-forest-100 text-[10px] font-bold text-forest-700">
        {step}
      </span>
      <div>
        <h3 className="font-sans text-[13px] font-semibold text-forest-950">
          {title}
        </h3>
        {hint ? (
          <p className="mt-0.5 text-[11.5px] leading-snug text-ink-soft">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}

function ChipsField({ label, hint, options, selected, onToggle }) {
  return (
    <fieldset>
      <legend className="text-[12.5px] font-semibold text-forest-900">
        {label}
      </legend>
      {hint ? (
        <p className="mt-0.5 text-[11.5px] leading-snug text-ink-soft">{hint}</p>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((option) => (
          <ToggleChip
            key={option.value}
            selected={selected.includes(option.value)}
            onClick={() => onToggle(option.value)}
          >
            {option.label}
          </ToggleChip>
        ))}
      </div>
    </fieldset>
  );
}

export function DonationForm({ profile, onCreated }) {
  const [values, setValues] = useState(() => createInitialValues(profile));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);

  const update = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setSubmitError(null);
    setCreated(null);
  };

  const toggleTag = (field, value) => {
    setValues((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((item) => item !== value)
        : [...current[field], value],
    }));
    setCreated(null);
  };

  const validate = () => {
    const next = {};
    const start = new Date(values.pickup_window_start);
    const end = new Date(values.pickup_window_end);
    const portions = Number(values.portions);

    if (values.title.trim().length < 3) {
      next.title = "Give the donation a short, clear title.";
    }
    if (!Number.isInteger(portions) || portions < 1) {
      next.portions = "Enter at least one portion.";
    }
    if (Number.isNaN(start.getTime())) {
      next.pickup_window_start = "Choose a valid pickup start time.";
    }
    if (Number.isNaN(end.getTime())) {
      next.pickup_window_end = "Choose a valid pickup end time.";
    } else if (end <= new Date()) {
      next.pickup_window_end = "The pickup window must end in the future.";
    } else if (!Number.isNaN(start.getTime()) && end <= start) {
      next.pickup_window_end = "The window must end after it starts.";
    }
    if (values.pickup_address.trim().length < 5) {
      next.pickup_address = "Add a full pickup address.";
    }
    if (values.pickup_instructions.trim().length < 10) {
      next.pickup_instructions =
        "Add a short note on where to go and what to bring.";
    }

    setErrors(next);
    const firstError = Object.keys(next).find((field) => FIELD_IDS[field]);
    if (firstError) {
      window.requestAnimationFrame(() => {
        document.getElementById(FIELD_IDS[firstError])?.focus();
      });
    }

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);
    setCreated(null);

    if (!validate()) return;

    setSubmitting(true);

    try {
      const start = new Date(values.pickup_window_start);
      const end = new Date(values.pickup_window_end);

      const result = await createListing({
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category,
        dietary_tags: values.dietary_tags,
        allergens: values.allergens,
        portions: Number(values.portions),
        prepared_at: new Date().toISOString(),
        pickup_window_start: start.toISOString(),
        pickup_window_end: end.toISOString(),
        pickup_address: values.pickup_address.trim(),
        pickup_instructions: values.pickup_instructions.trim(),
        distance_km: 0.4,
        photo_url:
          values.photo_url ?? CATEGORY_PHOTOS[values.category] ?? "/images/hero-bread.jpg",
      });

      onCreated?.(result);
      setCreated(result);
      setValues(createInitialValues(profile));
    } catch (error) {
      setSubmitError(
        error.message ||
          "We couldn't publish this sample listing. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(createInitialValues(profile));
    setErrors({});
    setSubmitError(null);
    setCreated(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-forest-900/10 bg-white p-5 shadow-card sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-forest-600">
            New donation
          </p>
          <h2 className="mt-1.5 text-[26px] leading-tight text-forest-950">
            Share surplus food
          </h2>
          <p className="mt-1.5 max-w-sm text-[12.5px] leading-relaxed text-ink-soft">
            Add the essentials and a clear pickup window. You can approve
            requests as they arrive.
          </p>
        </div>
        <span className="hidden size-10 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-700 sm:grid">
          <Sparkles aria-hidden="true" size={18} />
        </span>
      </div>

      {created ? (
        <div className="mt-4">
          <InlineNotice
            tone="success"
            title="Sample listing added"
            icon={CheckCircle2}
          >
            <span className="font-medium text-forest-900">{created.title}</span>{" "}
            is now visible in the preview list. In the connected product this
            will be published through the listing API.
          </InlineNotice>
        </div>
      ) : null}

      {submitError ? (
        <div className="mt-4">
          <InlineNotice tone="warning" title="Couldn't publish the listing">
            {submitError}
          </InlineNotice>
        </div>
      ) : null}

      <div className="mt-6 space-y-6">
        <section>
          <SectionLabel
            step="1"
            title="The food"
            hint="A clear title helps the right kitchen spot it quickly."
          />
          <div className="space-y-4">
            <FormField
              id={FIELD_IDS.title}
              label="Donation title"
              required
              error={errors.title}
            >
              <Input
                value={values.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder="e.g. Fresh sourdough & seeded loaves"
                maxLength={90}
                autoComplete="off"
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
              <FormField label="Category" required>
                <Select
                  value={values.category}
                  onChange={(event) => update("category", event.target.value)}
                >
                  {FOOD_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                id={FIELD_IDS.portions}
                label="Portions"
                required
                error={errors.portions}
              >
                <Input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="999"
                  step="1"
                  value={values.portions}
                  onChange={(event) => update("portions", event.target.value)}
                />
              </FormField>
            </div>

            <FormField
              label="Description"
              optional
              hint="Include what's inside, how it's packed and anything a kitchen should know."
            >
              <Textarea
                value={values.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder="A short, honest description of the food and its condition…"
                maxLength={500}
                rows={3}
              />
            </FormField>

            <ChipsField
              label="Dietary tags"
              hint="Select all that apply."
              options={DIETARY_TAGS}
              selected={values.dietary_tags}
              onToggle={(value) => toggleTag("dietary_tags", value)}
            />

            <ChipsField
              label="Contains allergens"
              hint={`Tick everything present. ${
                values.allergens.length
                  ? `Selected: ${values.allergens
                      .map((item) => ALLERGEN_LABELS[item])
                      .join(", ")}.`
                  : "Leave empty only if none are present."
              }`}
              options={ALLERGENS}
              selected={values.allergens}
              onToggle={(value) => toggleTag("allergens", value)}
            />
          </div>
        </section>

        <div className="h-px bg-forest-900/8" />

        <section>
          <SectionLabel
            step="2"
            title="Pickup details"
            hint="Organizations use this to plan a safe, timely collection."
          />
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                id={FIELD_IDS.pickup_window_start}
                label="Pickup opens"
                required
                error={errors.pickup_window_start}
              >
                <Input
                  type="datetime-local"
                  value={values.pickup_window_start}
                  onChange={(event) =>
                    update("pickup_window_start", event.target.value)
                  }
                />
              </FormField>
              <FormField
                id={FIELD_IDS.pickup_window_end}
                label="Pickup deadline"
                required
                error={errors.pickup_window_end}
              >
                <Input
                  type="datetime-local"
                  value={values.pickup_window_end}
                  onChange={(event) =>
                    update("pickup_window_end", event.target.value)
                  }
                />
              </FormField>
            </div>

            <FormField
              id={FIELD_IDS.pickup_address}
              label="Pickup address"
              required
              error={errors.pickup_address}
            >
              <Input
                value={values.pickup_address}
                onChange={(event) =>
                  update("pickup_address", event.target.value)
                }
                placeholder="Street, entrance and neighbourhood"
                autoComplete="street-address"
              />
            </FormField>

            <FormField
              id={FIELD_IDS.pickup_instructions}
              label="Pickup instructions"
              required
              error={errors.pickup_instructions}
              hint="Door codes, entrance, parking, who to ask for, what to bring."
            >
              <Textarea
                value={values.pickup_instructions}
                onChange={(event) =>
                  update("pickup_instructions", event.target.value)
                }
                placeholder="e.g. Use the side door on Alder Lane and ask for the closing baker…"
                rows={3}
                maxLength={400}
              />
            </FormField>
          </div>
        </section>

        <div className="h-px bg-forest-900/8" />

        <section>
          <SectionLabel
            step="3"
            title="A photo"
            hint="Optional, but listings with a clear photo get noticed."
          />
          <PhotoUpload
            value={values.photo_url}
            onChange={(value) => update("photo_url", value)}
          />
        </section>

        <div className="flex flex-col-reverse gap-2.5 border-t border-forest-900/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={resetForm}
            className="text-[12px] font-medium text-ink-soft transition hover:text-forest-900"
          >
            Clear form
          </button>
          <Button
            type="submit"
            variant="primary"
            icon={Plus}
            loading={submitting}
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? "Publishing…" : "Publish listing"}
          </Button>
        </div>
        <p className="text-[10.5px] leading-relaxed text-ink-soft/70">
          Prototype only — publishing creates a temporary listing on this page.
          In the connected product, photo upload and listing creation will use
          the FoodRescue API.
        </p>
      </div>
    </form>
  );
}
