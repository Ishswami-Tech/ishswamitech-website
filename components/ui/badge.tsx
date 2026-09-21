import type { IconType } from "react-icons";
import { techIcon } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "outline" | "success" | "warning" | "gradient";

const tones: Record<Tone, string> = {
  neutral: "border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)]",
  accent: "border border-[var(--border-strong)] bg-[var(--surface-tint)] text-[var(--accent)]",
  outline: "border border-[var(--border-hover)] text-[var(--text-secondary)]",
  success: "border border-[var(--success)]/30 bg-[var(--success)]/12 text-[var(--success)]",
  warning: "border border-[var(--warning)]/30 bg-[var(--warning)]/12 text-[var(--warning)]",
  gradient:
    "border-0 [background-image:var(--gradient-primary)] text-[var(--text-on-brand)] shadow-[var(--shadow-glow)]",
};

export function Badge({
  tone = "neutral",
  icon: Icon,
  className,
  children,
}: {
  tone?: Tone;
  /** Leading mark. Inherits the badge's text colour. */
  icon?: IconType;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "type-tag inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-2.5 py-1",
        tones[tone],
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />}
      {children}
    </span>
  );
}

/**
 * A badge that looks its own mark up by name.
 *
 * Exists so call sites stay `<TechBadge name={tech} />` instead of each one
 * importing the registry and handling the undefined case. Technologies without
 * a bundled mark degrade to a plain text badge rather than a gap or a
 * placeholder glyph.
 */
export function TechBadge({
  name,
  tone = "neutral",
  className,
}: {
  name: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <Badge tone={tone} icon={techIcon(name)} className={className}>
      {name}
    </Badge>
  );
}

/** Small live indicator — a filled dot with an expanding ring behind it. */
export function StatusDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex h-2 w-2 shrink-0", className)} aria-hidden>
      <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[var(--success)]" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--success)]" />
    </span>
  );
}
