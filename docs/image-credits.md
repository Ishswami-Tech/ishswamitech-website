# Image credits

Provenance for imagery in `public/Assets`. Keep this current — it is the only
record of where a file came from and what it is licensed under once the
original filename has been lost to optimisation.

## `hero-visual.webp`

- **Source:** supplied by the client (`ishswami-hero.png`, 1536×1024).
- **Licence:** client-owned. No third-party terms apply.
- **Modifications:** re-encoded as WebP at q82 (1.8 MB PNG → 103 KB). No crop;
  the composition is used as delivered.
- **Rendering note:** used as the hero's backdrop (`fill` + `object-cover`,
  positioned at `62% 50%` so a phone crop lands on the laptop rather than empty
  sky). Three gradient scrims sit over it in `app/(site)/page.tsx`: a vertical
  one below `lg`, a left-to-right one above it, and a lower band that both
  blends into the page colour and keeps the proof row legible over the lit
  laptop. Measured contrast with those scrims is 5.5:1 for the proof row and
  10:1 or better for the headline, lead and status pill.

  Swapping in artwork with a different composition or a lighter backdrop means
  re-checking those scrims — the current opacities are tuned to this image.
