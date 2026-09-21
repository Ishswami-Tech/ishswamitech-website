"use client";

import { motion } from "motion/react";
import { easeOut } from "@/lib/motion";

/**
 * Lifts a headline into place one word at a time.
 *
 * Words, not characters: a per-character stagger on a hero this size means
 * ~60 animated nodes and a headline that reads as a slot machine. Per word it
 * is a dozen, and the eye follows the line the way it would read it.
 *
 * Each word gets a clipping wrapper so the glyphs rise out of nothing rather
 * than fading in place — the clip is what makes it feel typeset rather than
 * merely animated. Descenders need the wrapper to be taller than the line box,
 * hence the negative margin paired with matching padding.
 *
 * `segments` rather than a plain string so a call site can mark part of the
 * headline for the gradient treatment without this component parsing markup.
 */
export type HeadlineSegment = {
  text: string;
  /** Renders inside the brand gradient sweep. */
  accent?: boolean;
};

export function WordReveal({
  segments,
  className,
  delay = 0,
}: {
  segments: readonly HeadlineSegment[];
  className?: string;
  delay?: number;
}) {
  // A running index across all segments, so the stagger keeps accelerating
  // through the headline instead of restarting at each accent boundary.
  let wordIndex = 0;

  return (
    <span className={className}>
      {segments.map((segment, segmentIndex) => {
        const words = segment.text.split(" ").filter(Boolean);

        const rendered = words.map((word) => {
          const index = wordIndex++;
          return (
            <span
              key={`${segmentIndex}-${index}-${word}`}
              // -0.18em/0.18em reclaims the space the clip would otherwise take
              // from the line box, so the headline's leading is unchanged.
              className="relative -my-[0.18em] inline-flex overflow-hidden py-[0.18em] align-bottom"
            >
              <motion.span
                // Same contract as <Reveal>: Motion serialises `initial` into
                // the SSR markup, so without this the headline ships invisible
                // to a client that never runs the bundle. The root layout's
                // fallback keys off `data-reveal`.
                data-reveal=""
                initial={{ y: "115%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.72, ease: easeOut, delay: delay + index * 0.055 }}
              >
                {word}
              </motion.span>
              {/* Outside the clip, or the space collapses and words run together. */}
              <span className="whitespace-pre">&nbsp;</span>
            </span>
          );
        });

        // The gradient goes on the segment, not the word. Per-word it restarts
        // the colour ramp on every word, so the phrase reads as a row of
        // unrelated colours rather than one sweep across it. `background-clip`
        // paints through the descendants, so the clipped word wrappers inside
        // still show it.
        return segment.accent ? (
          <span key={segmentIndex} className="gradient-text gradient-text--sweep">
            {rendered}
          </span>
        ) : (
          <span key={segmentIndex}>{rendered}</span>
        );
      })}
    </span>
  );
}
