"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Drifts and fades its contents as the surrounding section scrolls out of view.
 *
 * Two elements rather than one: the outer div is what `useScroll` measures, and
 * only the inner one is translated. Measuring an element you are transforming
 * feeds the transform back into `getBoundingClientRect`, so the drift would
 * compound against itself. Opacity is safe on the outer element — it doesn't
 * affect layout — which keeps the measured box free of transforms entirely.
 *
 * The movement is scroll-linked rather than time-based, so nothing animates
 * while the page is still and an idle hero costs nothing.
 */
export function Parallax({
  children,
  className,
  /** How far the layer travels by the time the section has fully scrolled past. */
  distance = "-4%",
  /** Opacity at the end of the travel. */
  fade = 0.5,
  "aria-hidden": ariaHidden,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: string;
  fade?: number;
  "aria-hidden"?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", distance]);
  // Callback form, not the `[0, 1] -> [1, fade]` range form: with a numeric
  // range this stayed pinned at its initial value while the sibling transform
  // above tracked scroll normally. Verified in the browser, so don't "simplify".
  const opacity = useTransform(scrollYProgress, (p) => 1 - p * (1 - fade));

  /*
    MotionConfig's reducedMotion governs animations, not values bound through
    `style`, so a scroll-linked effect has to opt out by hand. Binding nothing
    is cleaner than binding a collapsed range: the element ends up with no
    inline transform at all rather than a permanent identity one.
  */
  return (
    <motion.div
      ref={ref}
      aria-hidden={ariaHidden}
      className={className}
      style={reduced ? undefined : { opacity }}
    >
      <motion.div style={reduced ? undefined : { y }} className="absolute inset-0">
        {children}
      </motion.div>
    </motion.div>
  );
}
