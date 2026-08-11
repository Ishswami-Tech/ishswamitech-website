# Image credits

Provenance for imagery in `public/Assets`. Keep this current — it is the only
record of where a file came from and what it is licensed under once the
original filename has been lost to optimisation.

## `hero-visual.webp`

- **Source:** supplied by the client (`ishswami-hero.png`, 1536×1024).
- **Licence:** client-owned. No third-party terms apply.
- **Modifications:** re-encoded as WebP at q82 (1.8 MB PNG → 103 KB). No crop;
  the composition is used as delivered.
- **Rendering note:** used as the hero's backdrop via `fill`. It is *contained*
  and right-aligned from `lg` up, because the hero is wider than the 3:2 source
  there and covering would enlarge the render and cut off the arc and the rock.
  Below `lg` the hero is taller than it is wide, so it covers instead,
  positioned at `62% 50%` to keep the laptop in a phone's narrow crop.

  Three gradient scrims sit over it in `app/(site)/page.tsx`: a vertical one
  below `lg`, a left-to-right one above it, and a lower band that both blends
  into the page colour and keeps the proof row legible. Worst measured contrast
  across 390–1680 px is 5.16:1; headline, lead and status pill are 10:1 or
  better.

  Swapping in artwork with a different composition or a lighter backdrop means
  re-checking those scrims — the current opacities are tuned to this image.
