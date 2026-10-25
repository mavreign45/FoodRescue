import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/utils/cn";

const VARIANTS = {
  primary:
    "bg-coral-500 text-white shadow-[0_10px_24px_-12px_rgba(222,90,56,0.8)] hover:bg-coral-600 active:bg-coral-700",
  dark: "bg-forest-900 text-cream-50 shadow-[0_10px_24px_-14px_rgba(14,31,22,0.8)] hover:bg-forest-800",
  secondary:
    "border border-forest-900/15 bg-white/80 text-forest-900 backdrop-blur hover:border-forest-900/25 hover:bg-white",
  outline:
    "border border-forest-900/20 bg-transparent text-forest-900 hover:border-forest-900/35 hover:bg-forest-900/[0.04]",
  soft: "bg-forest-100 text-forest-900 hover:bg-forest-200",
  ghost: "bg-transparent text-forest-900 hover:bg-forest-900/[0.06]",
  cream: "bg-cream-100 text-forest-950 hover:bg-cream-200",
  danger: "bg-coral-50 text-coral-700 hover:bg-coral-100",
};

const SIZES = {
  sm: "h-9 gap-1.5 rounded-full px-3.5 text-[12.5px] font-medium",
  md: "h-11 gap-2 rounded-full px-5 text-sm font-medium",
  lg: "h-[52px] gap-2.5 rounded-full px-6 text-[15px] font-medium",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  to,
  href,
  icon: Icon,
  iconPosition = "left",
  trailingIcon: TrailingIcon,
  loading = false,
  disabled = false,
  type = "button",
  ...props
}) {
  const iconSize = size === "sm" ? 15 : 17;

  const classes = cn(
    "inline-flex select-none items-center justify-center whitespace-nowrap transition-all duration-200 disabled:pointer-events-none disabled:opacity-55",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  const content = (
    <>
      {loading ? (
        <LoaderCircle
          aria-hidden="true"
          className="animate-spin"
          size={iconSize}
        />
      ) : Icon && iconPosition === "left" ? (
        <Icon aria-hidden="true" size={iconSize} strokeWidth={1.9} />
      ) : null}
      <span>{children}</span>
      {!loading && TrailingIcon ? (
        <TrailingIcon aria-hidden="true" size={iconSize} strokeWidth={1.9} />
      ) : null}
      {!loading && Icon && iconPosition === "right" ? (
        <Icon aria-hidden="true" size={iconSize} strokeWidth={1.9} />
      ) : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {content}
    </button>
  );
}
