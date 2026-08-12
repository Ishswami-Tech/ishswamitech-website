import { cn } from "@/lib/utils";

type CardTone = "glass" | "solid" | "soft" | "highlight" | "outline";
type CardPadding = "none" | "sm" | "md" | "lg";

const tones: Record<CardTone, string> = {
  glass: "glass",
  solid: "border border-[var(--border)] bg-[var(--surface-raised)] shadow-[var(--shadow-sm)]",
  soft: "border border-[var(--border)] bg-[var(--surface-tint)]",
  highlight: cn(
    "gradient-border border-0 shadow-[var(--shadow-lg)]",
    "bg-[linear-gradient(150deg,var(--surface-overlay),var(--surface))]"
  ),
  outline: "border border-[var(--border)] bg-transparent",
};

const paddings: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5 md:p-6",
  lg: "p-7 md:p-9",
};

export function Card({
  tone = "glass",
  interactive = false,
  spotlight = true,
  padding = "md",
  className,
  children,
  id,
}: {
  tone?: CardTone;
  /** Adds lift, shadow and a border highlight on hover. */
  interactive?: boolean;
  /**
   * Pointer-tracking glow. On by default so card surfaces behave consistently
   * across the site; turn it off for cards sitting on an already-busy
   * background, where a second light source reads as muddle.
   */
  spotlight?: boolean;
  padding?: CardPadding;
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div
      id={id}
      data-spotlight={spotlight ? "" : undefined}
      className={cn(
        // Named group so nested pieces — CardIcon, arrows, titles — can react
        // to the card being hovered without each call site wiring one up.
        "group/card rounded-[var(--radius-2xl)]",
        tones[tone],
        spotlight && "spotlight",
        paddings[padding],
        interactive && [
          // `translate` and `scale`, not `transform`: Tailwind v4 emits the
          // individual properties, so a list naming only `transform` leaves
          // the hover lift to snap.
          "transition-[translate,scale,box-shadow,border-color,background-color]",
          "duration-[var(--duration-normal)] ease-[var(--ease-out)]",
          "hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-lg)]",
          "motion-reduce:transform-none motion-reduce:hover:transform-none",
        ],
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
  size = "md",
  className,
}: {
  children: React.ReactNode;
  /** Overrides the default indigo treatment with a per-item accent. */
  tint?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[var(--radius-lg)]",
        "border border-[var(--border)] shadow-[var(--shadow-inset-top)]",
        size === "sm" ? "h-9 w-9" : "h-11 w-11",
        !tint && "bg-[var(--surface-tint-strong)] text-[var(--accent)]",
        // Picks up the hover of an enclosing <Card>; inert anywhere else.
        // Reduced motion is covered globally — that block collapses every
        // transition duration, so the lift lands instantly rather than moving.
        "transition-[translate,scale,border-color,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-out)]",
        "group-hover/card:-translate-y-0.5 group-hover/card:scale-[1.06]",
        "group-hover/card:border-[var(--border-strong)] group-hover/card:shadow-[var(--shadow-md)]",
        className
      )}
      style={
        tint
          ? { backgroundColor: `color-mix(in srgb, ${tint} 14%, transparent)`, color: tint }
          : undefined
      }
    >
      {children}
    </div>
  );
}
