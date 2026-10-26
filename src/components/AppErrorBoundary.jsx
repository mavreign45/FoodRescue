import { Component } from "react";
import { cn } from "@/utils/cn";

/**
 * Last line of defence: any unexpected render error surfaces a friendly
 * fallback with a "try again" action instead of a blank page.
 */
export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, stack: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ stack: info.componentStack });
  }

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center px-6 py-20 text-center"
        >
          <span className="grid size-14 place-items-center rounded-2xl bg-coral-100 text-coral-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="size-6"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M12 8v5" strokeLinecap="round" />
              <circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none" />
              <path
                d="M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h1 className="mt-5 text-2xl text-forest-950">
            Something unexpected happened
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
            The page hit an error while rendering. Try again — and if it keeps
            happening, let us know.
          </p>
          <pre
            className={cn(
              "mt-6 max-w-full overflow-auto rounded-xl bg-forest-950 p-4 text-left text-[10px] leading-relaxed text-cream-200",
              import.meta.env.DEV ? "block" : "hidden",
            )}
          >
            {String(this.state.error?.message ?? this.state.error)}
          </pre>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-11 items-center justify-center rounded-full bg-forest-900 px-6 text-sm font-medium text-cream-50 transition hover:bg-forest-800"
            >
              Reload the page
            </button>
            <button
              type="button"
              onClick={() => this.setState({ error: null, stack: null })}
              className="inline-flex h-11 items-center justify-center rounded-full border border-forest-900/15 bg-white px-6 text-sm font-medium text-forest-900 transition hover:bg-cream-100"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
