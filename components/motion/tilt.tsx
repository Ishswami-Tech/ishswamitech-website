"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Degrees of rotation at the far edge. Past ~8 the card reads as a toy. */
const MAX_TILT = 6;

/**
 * Pointer-tracking 3D tilt for a card surface.
 *
 * Pairs with the existing `.spotlight` glow rather than replacing it: that one
 * moves a light across a flat surface, this one turns the surface under the
 * light. Together they read as a single physical response, which is why the
 * cards that get a tilt keep their spotlight.
 *
 * Coordinates are normalised to -0.5..0.5 of the element's own box, so the
 * effect is identical on a 240px card and a 600px panel. Springs — not raw
 * values — because an unsmoothed pointer binding tracks jitter in the mouse
 * and makes the card feel nervous.
 *
 * Opt-outs are deliberate and cheap: a coarse pointer has no hover state to
 * track, and `useReducedMotion` unbinds the style entirely so the element ends
 * up with no transform at all rather than a permanent identity one.
 */
export function Tilt({
  children,
  className,
  /** Scales the rotation. Use below 1 for large panels, where full tilt is too much. */
  intensity = 1,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(py, [-0.5, 0.5], [MAX_TILT * intensity, -MAX_TILT * intensity]),
    transition.springSoft
  );
  const rotateY = useSpring(
    useTransform(px, [-0.5, 0.5], [-MAX_TILT * intensity, MAX_TILT * intensity]),
    transition.springSoft
  );

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    // Touch and pen fire pointer events too, and honouring them would tilt the
    // card under the finger that is trying to tap it.
    if (event.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    px.set(0);
    py.set(0);
  }

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("[perspective:1100px]", className)}>
      <motion.div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="h-full [will-change:transform]"
      >
        {children}
      </motion.div>
    </div>
  );
}
