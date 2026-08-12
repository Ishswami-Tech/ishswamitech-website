"use client";

import { useEffect } from "react";

/**
 * Drives the pointer-tracking glow on every `.spotlight` surface in the app.
 *
 * One delegated listener for the whole document rather than a handler per
 * card. The per-card version costs a React component (and therefore a client
 * boundary) for every surface that wants the effect; this costs one listener
 * total and lets cards stay server components that only declare
 * `data-spotlight`.
 *
 * Work is deferred to an animation frame so a burst of pointermove events
 * collapses into at most one measure-and-write per frame. Only custom
 * properties are written, and they feed a background gradient, so the write
 * doesn't invalidate layout for the next frame's read.
 */
export function SpotlightRoot() {
  useEffect(() => {
    let frame = 0;
    let pending: { x: number; y: number; target: Element } | null = null;

    const flush = () => {
      frame = 0;
      const next = pending;
      pending = null;
      if (!next) return;

      const surface = next.target.closest<HTMLElement>("[data-spotlight]");
      if (!surface) return;

      const bounds = surface.getBoundingClientRect();
      surface.style.setProperty("--spot-x", `${next.x - bounds.left}px`);
      surface.style.setProperty("--spot-y", `${next.y - bounds.top}px`);
    };

    const handleMove = (event: PointerEvent) => {
      // Touch and pen fire pointermove too, but there is no hover state for
      // the glow to attach to, so tracking them is wasted work.
      if (event.pointerType !== "mouse") return;
      if (!(event.target instanceof Element)) return;

      pending = { x: event.clientX, y: event.clientY, target: event.target };
      frame ||= requestAnimationFrame(flush);
    };

    document.addEventListener("pointermove", handleMove, { passive: true });

    return () => {
      document.removeEventListener("pointermove", handleMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
