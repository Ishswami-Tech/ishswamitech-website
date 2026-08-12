"use client";

import { motion } from "motion/react";
import { easeOut } from "@/lib/motion";

/**
 * A rule that draws itself when it scrolls into view.
 *
 * Scales a single element on one axis rather than animating width, so the
 * whole draw stays on the compositor. `data-reveal` picks up the no-script
 * fallback in the root layout, which resets the transform and leaves the rule
 * fully drawn.
 */
export function DrawLine({
  className,
  delay = 0,
  duration = 0.8,
  vertical = false,
}: {
  className?: string;
  delay?: number;
  duration?: number;
  /** Draw top-to-bottom instead of left-to-right. */
  vertical?: boolean;
}) {
  return (
    <motion.div
      aria-hidden
      data-reveal=""
      className={className}
      style={vertical ? { originY: 0 } : { originX: 0 }}
      initial={vertical ? { scaleY: 0 } : { scaleX: 0 }}
      whileInView={vertical ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, ease: easeOut, delay }}
    />
  );
}
