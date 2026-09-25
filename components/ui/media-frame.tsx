import Image from "next/image";
import { cn } from "@/lib/utils";

type Ratio = "video" | "wide" | "square" | "portrait" | "fill";

const ratioClass: Record<Ratio, string> = {
  video: "aspect-video",
  wide: "aspect-[21/9]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  fill: "h-full",
};

/**
 * The one way a photograph enters this site.
 *
 * The stock we have is a mix of dark tech renders and light flat illustrations
 * on white. Dropping that range straight onto a near-black page gives every
 * section a different light source, which reads as clip-art rather than art
 * direction. So the frame takes the image back: a duotone wash in the brand
 * ramp plus a bottom-weighted scrim, which lands every source in the same navy
 * and gives any overlaid caption a surface to sit on.
 *
 * All of it is CSS, so this stays a server component and pages that use it keep
 * shipping no JavaScript for their imagery.
 */
export function MediaFrame({
  src,
  alt,
  ratio = "video",
  /** Duotone target. Defaults to the brand indigo; pass a service colour to tint. */
  tint = "var(--indigo-500)",
  /** How hard the duotone pulls. 0 leaves the source alone. */
  strength = 0.42,
  /** Zoom and lift on hover. Turn off for decorative images that aren't links. */
  interactive = true,
  /**
   * Draws the frame's own border, radius and shadow. Turn off when the image is
   * bleeding into a surface that already provides them — a card header, say.
   */
  framed = true,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  children,
}: {
  src: string;
  alt: string;
  ratio?: Ratio;
  tint?: string;
  strength?: number;
  interactive?: boolean;
  framed?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Caption or badge layer, stacked above the scrim. */
  children?: React.ReactNode;
}) {
  return (
    <div
      /*
        The interior is always dark — a duotoned photograph under a navy scrim —
        regardless of the page around it. Declaring the scheme here is what
        keeps `children` legible: a caption using --foreground would otherwise
        resolve to near-black on a light page and vanish into the scrim.
      */
      data-scheme="dark"
      className={cn(
        "media-frame group/media relative overflow-hidden bg-[var(--surface-raised)]",
        ratioClass[ratio],
        framed && [
          "rounded-[var(--radius-2xl)] border border-[var(--border)] shadow-[var(--shadow-md)]",
          interactive && [
            "transition-[border-color,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-out)]",
            "hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-lg)]",
          ],
        ],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(
          "object-cover",
          // Desaturating first is what lets a single tint read consistently: a
          // source that arrives with its own strong hue would otherwise fight
          // the overlay instead of taking it.
          "saturate-[0.35] contrast-[1.08] brightness-[0.82]",
          interactive && [
            "transition-transform duration-[600ms] ease-[var(--ease-out)]",
            // Both groups: `media` for a standalone image, `card` so an image
            // used as a card header zooms when the whole card is hovered rather
            // than only when the pointer crosses the image itself.
            "group-hover/media:scale-[1.06] group-hover/card:scale-[1.06]",
            "motion-reduce:transition-none",
            "motion-reduce:group-hover/media:scale-100 motion-reduce:group-hover/card:scale-100",
          ]
        )}
      />

      {/* Duotone. `color` blend keeps the source's luminance — the shape of the
          photograph survives — and replaces only its hue. */}
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-color"
        style={{ backgroundColor: tint, opacity: strength }}
      />

      {/* Reunites the tinted image with the page colour, and gives `children` a
          legible bed without needing its own panel. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgb(var(--scrim-rgb) / 0.92) 0%, rgb(var(--scrim-rgb) / 0.45) 38%, rgb(var(--scrim-rgb) / 0.06) 72%, rgb(var(--scrim-rgb) / 0.22) 100%)",
        }}
      />

      {/* A single light sweep on hover, matching the button sheen. */}
      {interactive && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -translate-x-full",
            "bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.14)_50%,transparent_70%)]",
            "transition-transform duration-[900ms] ease-[var(--ease-out)]",
            "group-hover/media:translate-x-full group-hover/card:translate-x-full",
            "motion-reduce:hidden"
          )}
        />
      )}

      {children && <div className="absolute inset-x-0 bottom-0 z-10 p-5">{children}</div>}
    </div>
  );
}
