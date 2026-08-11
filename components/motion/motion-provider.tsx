"use client";

import { MotionConfig } from "motion/react";

/**
 * Applies the reduced-motion preference once, for every Motion component in
 * the tree.
 *
 * `reducedMotion="user"` makes Motion drop transform and layout animations
 * while leaving opacity and colour, which is the behaviour the WCAG guidance
 * asks for: kill the movement, keep the state change legible.
 *
 * Doing it here rather than per-component is not just less repetition — it's
 * the only correct place. A component that calls `useReducedMotion()` and
 * returns a different element depending on the result renders one tree on the
 * server (which cannot know the preference) and another on the client, which
 * React reports as a hydration error and recovers from by throwing away the
 * server HTML.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
