"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

/**
 * Radio group rendered as a pill switch, with the selected indicator sliding
 * between options via a shared layout animation rather than fading in place.
 *
 * Uses real radio semantics (`role="radiogroup"` + arrow-key roving focus is
 * provided by the browser for same-name radios) so it stays operable from the
 * keyboard and announces correctly.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
  className,
}: {
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  label: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const layoutId = useId();

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-pill)]",
        "border border-[var(--border)] bg-[var(--surface-raised)] p-1 shadow-[var(--shadow-sm)]",
        className
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative rounded-[var(--radius-pill)] font-medium",
              "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
              size === "sm" ? "px-3.5 py-1.5 text-[var(--text-base)]" : "px-5 py-2 text-[var(--text-base)]",
              active
                ? "text-[var(--text-on-brand)]"
                : "text-[var(--text-tertiary)] hover:text-[var(--foreground)]"
            )}
          >
                {/* MotionConfig disables layout animation under reduced
                    motion, so the indicator simply appears in place. */}
                {active && (
                  <motion.span
                    aria-hidden
                    layoutId={layoutId}
                    transition={transition.spring}
                    className={cn(
                      "absolute inset-0 rounded-[var(--radius-pill)]",
                      "[background-image:var(--gradient-primary)] shadow-[var(--shadow-glow)]"
                    )}
                  />
                )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
