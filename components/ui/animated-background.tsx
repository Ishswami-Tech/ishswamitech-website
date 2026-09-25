"use client";

import { useMotionCapability } from "@/lib/use-motion-capability";
import { cn } from "@/lib/utils";

export type BackgroundVariant =
  | "aurora"
  | "gradient"
  | "grid"
  | "particles"
  | "spotlight"
  | "minimal";

type Props = {
  variant?: BackgroundVariant;
  /** Fixed covers the viewport (page shell); absolute fills its nearest positioned ancestor. */
  position?: "fixed" | "absolute";
  /** Scales every layer's opacity. Drop it under dense text. */
  intensity?: "subtle" | "normal" | "strong";
  className?: string;
};

const intensityOpacity = {
  subtle: 0.55,
  normal: 1,
  strong: 1.35,
} as const;

/**
 * The only place background effects are implemented.
 *
 * Pages pick a variant; they never hand-roll their own orbs and radial
 * gradients. Everything here is a composited CSS layer — transform, opacity
 * and filter only — so the whole background costs no main-thread work and no
 * JavaScript beyond choosing a tier.
 *
 * Effects are inspired by the React Bits / Aceternity vocabulary (aurora,
 * beams, dot field, grid, spotlight, grain) but implemented in CSS rather than
 * WebGL. A shader canvas for a slow ambient gradient would burn GPU budget for
 * a result the compositor can produce for free.
 */
export function AnimatedBackground({
  variant = "gradient",
  position = "absolute",
  intensity = "normal",
  className,
}: Props) {
  const tier = useMotionCapability();
  const animate = tier === "full";
  const showHeavyLayers = tier !== "none";
  const scale = intensityOpacity[intensity];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none overflow-hidden",
        position === "fixed" ? "fixed inset-0 -z-10" : "absolute inset-0 z-0",
        className
      )}
    >
      {/* Base wash. Present in every variant so content never sits on flat black. */}
      <div
        className="absolute inset-0"
        style={{
          background: "var(--ambient-base)",
          opacity: scale,
        }}
      />

      {variant === "aurora" && showHeavyLayers && (
        <>
          <div className="bg-aurora" style={{ opacity: 0.42 * scale }} />
          <Orb
            className="bg-orb--drift-a"
            animate={animate}
            style={{
              top: "-18%",
              left: "-10%",
              width: "46rem",
              height: "46rem",
              background: "radial-gradient(circle, var(--ambient-a), transparent 68%)",
              opacity: 0.55 * scale,
            }}
          />
          <Orb
            className="bg-orb--drift-b"
            animate={animate}
            style={{
              bottom: "-24%",
              right: "-12%",
              width: "40rem",
              height: "40rem",
              background: "radial-gradient(circle, var(--ambient-b), transparent 68%)",
              opacity: 0.5 * scale,
            }}
          />
        </>
      )}

      {variant === "gradient" && (
        <>
          <Orb
            className="bg-orb--drift-a"
            animate={animate}
            style={{
              top: "-22%",
              left: "8%",
              width: "42rem",
              height: "42rem",
              background: "radial-gradient(circle, var(--ambient-a), transparent 70%)",
              opacity: 0.5 * scale,
            }}
          />
          <Orb
            className="bg-orb--drift-b"
            animate={animate}
            style={{
              top: "10%",
              right: "-14%",
              width: "36rem",
              height: "36rem",
              background: "radial-gradient(circle, var(--ambient-b), transparent 70%)",
              opacity: 0.45 * scale,
            }}
          />
          <Orb
            className="bg-orb--drift-c"
            animate={animate}
            style={{
              bottom: "-28%",
              left: "34%",
              width: "34rem",
              height: "34rem",
              background: "radial-gradient(circle, var(--ambient-c), transparent 72%)",
              opacity: 0.4 * scale,
            }}
          />
        </>
      )}

      {variant === "grid" && (
        <>
          <div className="bg-grid" style={{ opacity: scale }} />
          <Orb
            className="bg-orb--drift-a"
            animate={animate}
            style={{
              top: "-25%",
              left: "22%",
              width: "40rem",
              height: "40rem",
              background: "radial-gradient(circle, var(--ambient-a), transparent 70%)",
              opacity: 0.45 * scale,
            }}
          />
        </>
      )}

      {variant === "particles" && (
        <>
          <div className="bg-dots" style={{ opacity: scale }} />
          <Orb
            className="bg-orb--drift-c"
            animate={animate}
            style={{
              top: "5%",
              right: "5%",
              width: "32rem",
              height: "32rem",
              background: "radial-gradient(circle, var(--ambient-a), transparent 72%)",
              opacity: 0.4 * scale,
            }}
          />
        </>
      )}

      {variant === "spotlight" && (
        <>
          {showHeavyLayers && (
            <>
              <div className="bg-beam" style={{ left: "12%" }} />
              <div
                className="bg-beam"
                style={{ left: "52%", animationDelay: "-6s", width: "20rem" }}
              />
            </>
          )}
          <div
            className="absolute inset-x-0 top-0 h-[42rem]"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 0%, var(--ambient-a), transparent 70%)",
              opacity: scale,
            }}
          />
          <div className="bg-grid" style={{ opacity: 0.7 * scale }} />
        </>
      )}

      {/* Grain last so it sits over the colour and breaks up gradient banding. */}
      {variant !== "minimal" && <div className="bg-grain" />}

      {/* Fade to the page background at the bottom edge so sections join cleanly. */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to bottom, transparent, var(--ambient-fade))" }}
      />
    </div>
  );
}

function Orb({
  className,
  animate,
  style,
}: {
  className: string;
  animate: boolean;
  style: React.CSSProperties;
}) {
  return <div className={cn("bg-orb", animate && className)} style={style} />;
}
