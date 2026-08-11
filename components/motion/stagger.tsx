"use client";

import { motion } from "motion/react";
import { revealVariants, staggerParent, transition, type RevealVariant } from "@/lib/motion";

type Tag = "div" | "ul" | "ol" | "dl" | "section";
type ItemTag = "div" | "li" | "article" | "figure";

/**
 * Orchestrates a group entrance.
 *
 * The parent owns the timing, so children never carry an index-based delay.
 * That matters for lists that filter or reorder — a hardcoded `index * 0.06`
 * makes the fifth card animate late even when it's the only one left.
 *
 * Reduced motion is handled globally by `<MotionConfig reducedMotion="user">`;
 * see the note in `Reveal` for why this doesn't branch on the preference.
 */
export function Stagger({
  children,
  className,
  as = "div",
  gap = 0.06,
  delay = 0,
  immediate = false,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  as?: Tag;
  /** Seconds between each child. */
  gap?: number;
  delay?: number;
  immediate?: boolean;
  id?: string;
}) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      id={id}
      data-reveal=""
      className={className}
      variants={staggerParent(gap, delay)}
      initial="hidden"
      {...(immediate
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: { once: true, margin: "-60px" } })}
    >
      {children}
    </MotionTag>
  );
}

/** A child of <Stagger>. Inherits `hidden`/`visible` from the parent. */
export function StaggerItem({
  children,
  className,
  as = "div",
  variant = "up",
}: {
  children: React.ReactNode;
  className?: string;
  as?: ItemTag;
  variant?: RevealVariant;
}) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      data-reveal=""
      className={className}
      variants={revealVariants(variant)}
      transition={transition.slow}
    >
      {children}
    </MotionTag>
  );
}
