import type { Transition, Variants } from "motion/react";

/**
 * Motion vocabulary shared by every animated component.
 *
 * Durations mirror the CSS tokens in globals.css so a Motion animation and a
 * CSS transition on the same element stay in step. Keep them here rather than
 * inline: a one-off `duration: 0.35` in a component is how a design system
 * starts drifting.
 */
export const duration = {
  instant: 0.08,
  fast: 0.15,
  normal: 0.24,
  slow: 0.4,
} as const;

/** Matches --ease-out. Decelerating, which is what entrances should feel like. */
export const easeOut = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

export const transition = {
  fast: { duration: duration.fast, ease: easeOut },
  normal: { duration: duration.normal, ease: easeOut },
  slow: { duration: duration.slow, ease: easeOut },
  /** For layout/shared-element moves, where a spring reads better than a curve. */
  spring: { type: "spring", stiffness: 380, damping: 32, mass: 0.9 },
  springSoft: { type: "spring", stiffness: 220, damping: 28, mass: 1 },
} satisfies Record<string, Transition>;

/** Distance an entrance travels. Small on purpose — motion should hint, not slide. */
export const travel = {
  sm: 8,
  md: 16,
  lg: 24,
} as const;

export type RevealVariant = "fade" | "up" | "down" | "left" | "right" | "scale";

const hidden: Record<RevealVariant, Record<string, number>> = {
  fade: { opacity: 0 },
  up: { opacity: 0, y: travel.md },
  down: { opacity: 0, y: -travel.md },
  left: { opacity: 0, x: travel.md },
  right: { opacity: 0, x: -travel.md },
  scale: { opacity: 0, scale: 0.96 },
};

const shown: Record<RevealVariant, Record<string, number>> = {
  fade: { opacity: 1 },
  up: { opacity: 1, y: 0 },
  down: { opacity: 1, y: 0 },
  left: { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  scale: { opacity: 1, scale: 1 },
};

/**
 * Reduced motion is applied globally by `<MotionConfig reducedMotion="user">`,
 * which strips transform and layout animation while leaving opacity — so these
 * variants describe the full-motion intent and never need a `reduced` branch.
 * Deciding per-component would mean reading the preference during render, which
 * the server can't do without producing a hydration mismatch.
 */
export function revealVariants(variant: RevealVariant): Variants {
  return { hidden: hidden[variant], visible: shown[variant] };
}

/**
 * Parent/child pair for staggered groups. The parent orchestrates timing so
 * children don't each need their own delay prop — that's what made the old
 * `index * 0.06` pattern fragile when lists were reordered.
 */
export function staggerParent(stagger = 0.06, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

/** Page-level enter/exit. Deliberately understated: opacity plus 8px of lift. */
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: travel.sm },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -travel.sm / 2 },
};

/** Dropdowns, popovers and menus: fade plus a slight scale from the trigger edge. */
export const popVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: -2 },
};

/** Modal surface. Backdrop fades; the panel scales up a touch as it settles. */
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: travel.sm },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: 4 },
};

/** Hover/press feedback shared by buttons and interactive cards. */
export const pressable = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.985 },
  transition: transition.fast,
} as const;
