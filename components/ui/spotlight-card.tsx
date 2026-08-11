"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Card with a soft glow that tracks the pointer.
 *
 * The position is written straight to CSS custom properties on the node, so
 * moving the mouse never triggers a React render — the compositor handles the
 * whole effect. Reserve this for a handful of feature cards; on a grid of
 * twenty it stops reading as special and starts reading as noise.
 */
export function SpotlightCard({
  children,
  className,
  radius = 340,
}: {
  children: React.ReactNode;
  className?: string;
  /** Glow diameter in pixels. */
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
    node.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={cn(
        "group/spot relative overflow-hidden rounded-[var(--radius-2xl)]",
        "border border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-md",
        "shadow-[var(--shadow-md)] transition-[border-color,box-shadow,transform]",
        "duration-[var(--duration-normal)] ease-[var(--ease-out)]",
        "hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-lg)]",
        "motion-reduce:transform-none motion-reduce:hover:transform-none",
        className
      )}
      style={{ "--spot-x": "50%", "--spot-y": "50%" } as React.CSSProperties}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity",
          "duration-[var(--duration-normal)] group-hover/spot:opacity-100 motion-reduce:hidden"
        )}
        style={{
          background: `radial-gradient(${radius}px circle at var(--spot-x) var(--spot-y), rgba(129,140,248,0.14), transparent 70%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
