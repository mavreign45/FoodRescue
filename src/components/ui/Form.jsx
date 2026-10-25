import {
  cloneElement,
  isValidElement,
  useId,
  useRef,
  useState,
} from "react";
import { ChevronDown, ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { cn } from "@/utils/cn";

export const controlClasses =
  "h-11 w-full rounded-xl border border-forest-900/15 bg-cream-50/70 px-3.5 text-sm text-forest-950 shadow-[inset_0_1px_1px_rgba(24,36,29,0.03)] transition placeholder:text-ink-soft/55 hover:border-forest-900/25 focus:border-forest-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-forest-500/10 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-coral-400 aria-invalid:bg-coral-50/40 aria-invalid:focus:ring-coral-500/10";

export function FormField({
  id: idProp,
  label,
  hint,
  error,
  required = false,
  optional = false,
  children,
  className,
  labelAction,
}) {
  const generatedId = useId();
  const id = idProp ?? `field-${generatedId}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const control = isValidElement(children)
    ? cloneElement(children, {
        id,
        required: required || children.props.required,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })
    : children;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="text-[12.5px] font-semibold text-forest-900"
        >
          {label}
          {required ? (
            <span className="ml-1 text-coral-600" aria-hidden="true">
              *
            </span>
          ) : null}
          {optional ? (
            <span className="ml-1.5 font-normal text-ink-soft/70">Optional</span>
          ) : null}
        </label>
        {labelAction}
      </div>
      {control}
      {hint && !error ? (
        <p id={hintId} className="text-[11.5px] leading-snug text-ink-soft">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1 text-[11.5px] font-medium leading-snug text-coral-700"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }) {
  return <input className={cn(controlClasses, className)} {...props} />;
}

export function Select({ className, children, ...props }) {
  return (
    <div className="relative">
      <select
        className={cn(controlClasses, "appearance-none pr-10", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        size={15}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
      />
    </div>
  );
}

export function Textarea({ className, rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      className={cn(
        controlClasses,
        "h-auto min-h-24 resize-y py-3 leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export function ToggleChip({ selected = false, className, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition",
        selected
          ? "border-forest-800 bg-forest-900 text-cream-50 shadow-sm"
          : "border-forest-900/15 bg-white/70 text-ink-soft hover:border-forest-400 hover:text-forest-900",
        className,
      )}
      {...props}
    >
      {selected ? (
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-gold-400"
        />
      ) : null}
      {children}
    </button>
  );
}

export function PhotoUpload({ value, onChange, className }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const readFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("That image is larger than 5 MB. Please choose a smaller file.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result, file);
    reader.onerror = () => setError("We couldn't read that image. Please try another file.");
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event) => {
    readFile(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    readFile(event.dataTransfer.files?.[0]);
  };

  const handleRemove = () => {
    setError(null);
    onChange(null, null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12.5px] font-semibold text-forest-900">
          Photo
          <span className="ml-1.5 font-normal text-ink-soft/70">Optional</span>
        </span>
        {value ? (
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-1 text-[11.5px] font-medium text-coral-700 transition hover:text-coral-600"
          >
            <Trash2 aria-hidden="true" size={12} />
            Remove
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={handleFileChange}
      />

      {value ? (
        <div className="relative aspect-[16/7] overflow-hidden rounded-xl border border-forest-900/10 bg-cream-100">
          <img
            src={value}
            alt="Selected donation preview"
            className="h-full w-full object-cover"
          />
          <label
            htmlFor={inputId}
            className="absolute bottom-2 right-2 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-forest-900 shadow-sm backdrop-blur transition hover:bg-white"
          >
            <ImagePlus aria-hidden="true" size={12} />
            Change photo
          </label>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-7 text-center transition focus-within:ring-4 focus-within:ring-forest-500/10",
            isDragging
              ? "border-forest-500 bg-forest-50"
              : "border-forest-900/20 bg-cream-50/50 hover:border-forest-400 hover:bg-cream-50",
          )}
        >
          <span className="grid size-9 place-items-center rounded-full bg-white text-forest-600 shadow-sm">
            <UploadCloud aria-hidden="true" size={17} strokeWidth={1.8} />
          </span>
          <span className="mt-2.5 text-[12.5px] font-medium text-forest-900">
            Drop a photo or{" "}
            <span className="text-coral-600 underline decoration-coral-300 underline-offset-2">
              browse
            </span>
          </span>
          <span className="mt-1 text-[11px] text-ink-soft">
            JPG, PNG or WebP · up to 5 MB
          </span>
        </label>
      )}

      {error ? (
        <p role="alert" className="text-[11.5px] font-medium text-coral-700">
          {error}
        </p>
      ) : (
        <p className="text-[11.5px] leading-snug text-ink-soft">
          A clear photo helps organizations recognise the food. Upload is
          simulated in this prototype.
        </p>
      )}
    </div>
  );
}
