"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { duration as durationToken, easeOut } from "@/lib/motion";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Props = {
  end: number;
  suffix?: string;
  prefix?: string;
  /** Seconds. */
  duration?: number;
  className?: string;
};

/**
 * Counts up to `end` when scrolled into view.
 *
 * The tween writes to `textContent` directly instead of through state — a
 * setState per frame means ~60 React renders per second per counter, and the
 * stats strip has four of them side by side.
 *
 * Server output is the final value, so the real number is what lands in the
 * HTML for crawlers and for anyone without JavaScript. The client resets it to
 * zero before first paint, so there's no flash of the end value.
 */
export default function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = durationToken.slow * 4,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  const format = (value: number) => `${prefix}${Math.round(value)}${suffix}`;

  useIsomorphicLayoutEffect(() => {
    if (reduced || !ref.current) return;
    ref.current.textContent = format(0);
    // Only on mount: once the tween owns the node, this must not stomp on it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced || !inView) return;

    const controls = animate(0, end, {
      duration,
      ease: easeOut,
      onUpdate: (value) => {
        node.textContent = format(value);
      },
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, end, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {format(end)}
    </span>
  );
}
