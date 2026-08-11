import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * Shared shell for empty and error states so the two can't drift apart:
 * haloed icon, heading, one line of explanation, then an action.
 */
function StateShell({
  icon: Icon,
  title,
  description,
  tone,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone: "neutral" | "danger";
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal
      variant="scale"
      className={cn(
        "flex flex-col items-center rounded-[var(--radius-2xl)] border border-[var(--border)]",
        "bg-[var(--surface-raised)] px-6 py-14 text-center",
        className
      )}
    >
      <div className="relative mb-5">
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 rounded-full blur-2xl",
            tone === "danger" ? "bg-[var(--danger)]/20" : "bg-[var(--primary)]/25"
          )}
        />
        <div
          className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-full border",
            tone === "danger"
              ? "border-[var(--danger)]/30 bg-[var(--danger)]/12 text-[var(--danger)]"
              : "border-[var(--border-strong)] bg-[var(--surface-tint-strong)] text-[var(--accent)]"
          )}
        >
          <Icon className="h-6 w-6" aria-hidden />
        </div>
      </div>

      <h2 className="type-panel-title mb-2 text-[var(--foreground)]">{title}</h2>
      <p className="type-body mx-auto mb-7 max-w-sm text-[var(--text-secondary)]">{description}</p>
      {children}
    </Reveal>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <StateShell
      icon={icon}
      title={title}
      description={description}
      tone="neutral"
      className={className}
    >
      {action}
    </StateShell>
  );
}

export function ErrorState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <StateShell
      icon={icon}
      title={title}
      description={description}
      tone="danger"
      className={className}
    >
      {action}
    </StateShell>
  );
}
