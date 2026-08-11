import { cn } from "@/lib/utils";

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: "neutral" | "accent" | "outline";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "type-tag inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 py-1",
        tone === "neutral" && "border border-[var(--border)] bg-[var(--card-soft)] text-[var(--text-muted)]",
        tone === "accent" && "border border-[var(--border-strong)] bg-[var(--card-soft)] text-[var(--accent)]",
        tone === "outline" && "border border-[var(--border)] text-[var(--foreground)]",
        className
      )}
    >
      {children}
    </span>
  );
}
