# Image credits

Provenance for imagery in `public/Assets`. Keep this current — it is the only
record of where a file came from and what it is licensed under once the
original filename has been lost to optimisation.

## `hero-visual.webp`

- **Source:** supplied by the client (`ishswami-hero.png`, 1536×1024).
- **Licence:** client-owned. No third-party terms apply.
- **Modifications:** re-encoded as WebP at q82 (1.8 MB PNG → 103 KB). No crop;
  the composition is used as delivered.
- **Rendering note:** the hero applies a CSS mask to feather the left, top and
  bottom edges. The artwork's own backdrop is `rgb(0,0,13)` against a page
  background of `#05070f`, close but not identical, so an unmasked image shows
  a faint rectangle. Replacing this file with artwork on a different backdrop
  means revisiting that mask in `app/(site)/page.tsx`.
