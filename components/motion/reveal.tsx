"use client";

import { motion, useReducedMotion } from "motion/react";
import { revealVariants, transition, type RevealVariant } from "@/lib/motion";

type Tag = "div" | "section" | "article" | "figure" | "li" | "ul" | "ol" | "span" | "header";

export type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Direction and character of the entrance. */
  variant?: RevealVariant;
  /** Play on mount rather than on scroll. Use above the fold. */
  immediate?: boolean;
  /** Seconds to wait before starting. Prefer <Stagger> for groups. */
  delay?: number;
  as?: Tag;
  id?: string;
};

/**
 * The one scroll/mount entrance in the system.
 *
 * Exists so pages stay server components and ship only this small client
 * boundary instead of the whole subtree. Under reduced motion it renders a
 * plain element with no Motion runtime attached at all.
 */
export function Reveal({
  children,
  className,
  variant = "up",
  immediate = false,
  delay = 0,
  as = "div",
  id,
}: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Tag = as;
    return (
      <Tag className={className} id={id}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion[as];

  return (
    <MotionTag
      id={id}
      className={className}
      variants={revealVariants(variant, false)}
      initial="hidden"
      transition={{ ...transition.slow, delay }}
      {...(immediate
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: { once: true, margin: "-80px" } })}
    >
      {children}
    </MotionTag>
  );
}

export const FadeIn = (props: Omit<RevealProps, "variant">) => (
  <Reveal {...props} variant="fade" />
);

export const SlideUp = (props: Omit<RevealProps, "variant">) => <Reveal {...props} variant="up" />;

export const ScaleIn = (props: Omit<RevealProps, "variant">) => (
  <Reveal {...props} variant="scale" />
);

/** Alias for readability at call sites that are explicitly scroll-driven. */
export const ScrollReveal = (props: RevealProps) => <Reveal {...props} immediate={false} />;
