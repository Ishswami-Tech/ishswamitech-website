import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "subtle" | "danger";
type Size = "sm" | "md" | "lg";

const base = [
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden",
  "rounded-[var(--radius-lg)] font-medium whitespace-nowrap select-none",
  "transition-[transform,box-shadow,background-color,border-color,color]",
  "duration-[var(--duration-fast)] ease-[var(--ease-out)]",
  "hover:-translate-y-px active:translate-y-0 active:scale-[0.985]",
  "motion-reduce:transform-none motion-reduce:hover:transform-none",
  "disabled:pointer-events-none disabled:opacity-50",
].join(" ");

const variants: Record<Variant, string> = {
  primary: [
    "text-[var(--text-on-brand)] [background-image:var(--gradient-primary)]",
    "shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-glow-strong)]",
  ].join(" "),
  secondary: [
    "border border-[var(--border-hover)] bg-[var(--surface-raised)] text-[var(--foreground)]",
    "shadow-[var(--shadow-sm)]",
    "hover:border-[var(--border-strong)] hover:bg-[var(--surface-overlay)] hover:shadow-[var(--shadow-md)]",
  ].join(" "),
  ghost: [
    "border border-[var(--border)] bg-white/[0.03] text-[var(--foreground)] backdrop-blur-md",
    "hover:border-[var(--border-hover)] hover:bg-white/[0.07]",
  ].join(" "),
  subtle:
    "text-[var(--text-secondary)] hover:bg-[var(--surface-tint)] hover:text-[var(--foreground)]",
  danger: [
    "border border-[var(--danger)]/35 bg-[var(--danger)]/12 text-[var(--danger)]",
    "hover:bg-[var(--danger)]/20",
  ].join(" "),
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[var(--text-base)]",
  md: "h-11 px-5 text-[var(--text-base)]",
  lg: "h-12 px-6 text-[var(--text-md)]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps & { href: string; external?: boolean };
type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never; loading?: boolean };

/**
 * A light sweep that crosses the button on hover. Rendered only for the
 * gradient variant, where there's enough contrast for it to register.
 */
function Sheen() {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -translate-x-full",
        "bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.22)_50%,transparent_75%)]",
        "transition-transform duration-[600ms] ease-[var(--ease-out)]",
        "group-hover/btn:translate-x-full motion-reduce:hidden"
      )}
    />
  );
}

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", size = "md", fullWidth, className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
  const sheen = variant === "primary" ? <Sheen /> : null;

  if ("href" in props && props.href) {
    const { href, external } = props;
    const content = (
      <>
        {sheen}
        <span className="relative inline-flex items-center gap-2">{children}</span>
      </>
    );

    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  const rest = { ...(props as ButtonAsButton) };
  const loading = rest.loading ?? false;
  delete rest.variant;
  delete rest.size;
  delete rest.fullWidth;
  delete rest.className;
  delete rest.loading;
  delete (rest as { children?: unknown }).children;

  return (
    <button className={classes} disabled={rest.disabled || loading} {...rest}>
      {sheen}
      <span className="relative inline-flex items-center gap-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {children}
      </span>
    </button>
  );
}
