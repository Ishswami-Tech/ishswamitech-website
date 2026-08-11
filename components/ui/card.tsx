import { cn } from "@/lib/utils";

type CardTone = "glass" | "solid" | "soft" | "highlight";

const tones: Record<CardTone, string> = {
  glass: "glass border-[var(--border)]",
  solid: "border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl",
  soft: "border border-[var(--border)] bg-[var(--card-soft)]",
  highlight:
    "border border-[var(--border-strong)] bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-[var(--card-soft)] backdrop-blur-xl",
};

export function Card({
  tone = "glass",
  interactive = false,
  padding = "md",
  className,
  children,
  id,
}: {
  tone?: CardTone;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-[var(--radius-2xl)]",
        tones[tone],
        padding === "sm" && "p-5",
        padding === "md" && "p-6 md:p-7",
        padding === "lg" && "p-8 md:p-10",
        interactive &&
          "hover-lift hover:border-[var(--border-strong)] cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardIcon({
  children,
  tint,
  className,
}: {
  children: React.ReactNode;
  tint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] text-[var(--accent)]",
        !tint && "border border-[var(--border-strong)] bg-[var(--card-soft)]",
        className
      )}
      style={tint ? { backgroundColor: `${tint}20`, color: tint } : undefined}
    >
      {children}
    </div>
  );
}
