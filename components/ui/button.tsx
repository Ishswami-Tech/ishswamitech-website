import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-semibold transition-all duration-[var(--motion-base)] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "[background:var(--button-gradient)] text-[var(--button-foreground)] shadow-[var(--button-shadow)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
  secondary:
    "border border-[var(--border-strong)] bg-[var(--card)] text-[var(--foreground)] backdrop-blur-xl hover:bg-[var(--card-soft)]",
  ghost:
    "border border-white/20 bg-white/[0.04] text-[var(--foreground)] backdrop-blur-xl hover:border-white/40 hover:bg-white/[0.08]",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-[0.9375rem]",
  lg: "px-7 py-3.5",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", size = "lg", fullWidth, className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);

  if ("href" in props && props.href) {
    const { href, external } = props;
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const rest = { ...(props as ButtonAsButton) };
  delete rest.variant;
  delete rest.size;
  delete rest.fullWidth;
  delete rest.className;
  delete (rest as { children?: unknown }).children;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
