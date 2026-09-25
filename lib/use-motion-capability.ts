"use client";

import { useSyncExternalStore } from "react";

/**
 * How much decorative motion this device should be asked to render.
 *
 * - `full`    desktop, motion allowed — aurora, beams, drifting orbs
 * - `light`   small screen or modest hardware — static orbs, no sweeps
 * - `none`    prefers-reduced-motion — nothing ambient moves
 */
export type MotionTier = "full" | "light" | "none";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const SMALL_QUERY = "(max-width: 48rem)";

/**
 * Rough proxy for "this GPU will struggle with several large blurred layers".
 * Read once — none of these change during a session.
 */
function isLowPowerDevice(): boolean {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  // An explicit request from the user, so it is honoured as-is.
  if (nav.connection?.saveData) return true;

  /*
    The two hardware thresholds used to be `<= 4`, which was far too eager and
    made this the single biggest source of "the animations do not run on
    Windows".

    Both signals are Chromium-only. Safari and Firefox expose neither
    `deviceMemory` nor a meaningful `hardwareConcurrency` ceiling, so on a Mac
    the checks were effectively skipped and everything animated. On Windows,
    Chrome and Edge report both — and a four-core laptop (still extremely
    common) hit `hardwareConcurrency <= 4` exactly, while `deviceMemory` is
    reported rounded down to a power of two, so a 6GB machine reports 4. Those
    users were silently dropped to the degraded tier on hardware that composites
    a few blurred layers without trouble.

    2 or fewer is a genuinely constrained device; 4 is a normal one.
  */
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return true;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2) return true;
  return false;
}

function subscribe(onChange: () => void): () => void {
  const reduced = window.matchMedia(REDUCED_QUERY);
  const small = window.matchMedia(SMALL_QUERY);
  reduced.addEventListener("change", onChange);
  small.addEventListener("change", onChange);
  return () => {
    reduced.removeEventListener("change", onChange);
    small.removeEventListener("change", onChange);
  };
}

function getSnapshot(): MotionTier {
  if (window.matchMedia(REDUCED_QUERY).matches) return "none";
  if (window.matchMedia(SMALL_QUERY).matches || isLowPowerDevice()) return "light";
  return "full";
}

/**
 * Server renders the full tier so desktop — the common case — gets correct
 * markup on first paint. Constrained clients downgrade on hydration, which is
 * safe because every consumer of this only renders decoration.
 */
function getServerSnapshot(): MotionTier {
  return "full";
}

export function useMotionCapability(): MotionTier {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
