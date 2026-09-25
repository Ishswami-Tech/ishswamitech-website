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
    let lit = false;
    let pending: { x: number; y: number; target: Element } | null = null;

    const root = document.documentElement;

    const flush = () => {
      frame = 0;
      const next = pending;
      pending = null;
      if (!next) return;

      /*
        Page-wide glow. Viewport coordinates written on <html>, where a single
        fixed layer reads them — so the light follows the cursor across gaps
        between sections, not only while it is over a card. Same frame and the
        same listener as the per-card work below, so the ambient layer is free.
      */
      root.style.setProperty("--cursor-x", `${next.x}px`);
      root.style.setProperty("--cursor-y", `${next.y}px`);
      if (!lit) {
        lit = true;
        root.style.setProperty("--cursor-opacity", "1");
      }

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

    // Fading out on exit matters: without it the glow freezes wherever the
    // cursor left the window and sits there as a stray blob.
    const handleLeave = () => {
      lit = false;
      root.style.setProperty("--cursor-opacity", "0");
    };

    document.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("pointerleave", handleLeave);
    window.addEventListener("blur", handleLeave);

    return () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("blur", handleLeave);
      if (frame) cancelAnimationFrame(frame);
      root.style.removeProperty("--cursor-opacity");
    };
  }, []);

  return (
    /*
      The glow itself. One fixed element that never moves in the layout — it is
      translated on the compositor from the coordinates above, so tracking the
      cursor costs no layout and no paint beyond this layer.

      Rendered here rather than in the root layout so the listener and the
      thing it drives stay in one file; it is inert until the first mouse move
      sets --cursor-opacity.
    */
    <div aria-hidden className="cursor-glow" />
  );
}
