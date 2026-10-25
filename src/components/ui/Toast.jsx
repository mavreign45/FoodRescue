import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/utils/cn";

const ToastContext = createContext(null);

const TONES = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-forest-600",
    border: "border-forest-200",
    accent: "bg-forest-600",
  },
  error: {
    icon: TriangleAlert,
    iconClass: "text-coral-600",
    border: "border-coral-200",
    accent: "bg-coral-500",
  },
  info: {
    icon: Info,
    iconClass: "text-gold-600",
    border: "border-gold-300",
    accent: "bg-gold-500",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const counter = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    ({ title, description, tone = "success", duration = 4500 }) => {
      const id = ++counter.current;
      setToasts((current) => [...current.slice(-2), { id, title, description, tone }]);
      const timer = window.setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
      return id;
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-2 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm"
      >
        {toasts.map((item) => {
          const tone = TONES[item.tone] ?? TONES.success;
          const Icon = tone.icon;
          return (
            <div
              key={item.id}
              role="status"
              className={cn(
                "animate-toast pointer-events-auto relative w-full overflow-hidden rounded-2xl border bg-white p-4 pl-5 shadow-lift sm:w-[380px]",
                tone.border,
              )}
            >
              <span
                aria-hidden="true"
                className={cn("absolute inset-y-0 left-0 w-1", tone.accent)}
              />
              <div className="flex items-start gap-3">
                <Icon
                  aria-hidden="true"
                  className={cn("mt-0.5 shrink-0", tone.iconClass)}
                  size={20}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-forest-950">{item.title}</p>
                  {item.description ? (
                    <p className="mt-0.5 text-[13px] leading-snug text-ink-soft">
                      {item.description}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  className="-mr-1 -mt-1 rounded-full p-1.5 text-ink-soft/70 transition hover:bg-cream-100 hover:text-ink"
                  aria-label="Dismiss notification"
                >
                  <X aria-hidden="true" size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside a ToastProvider");
  }
  return context;
}
