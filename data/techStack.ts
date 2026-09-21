import type { IconType } from "react-icons";
import { techIcon } from "@/lib/tech-icons";

/**
 * The strip that scrolls under the hero.
 *
 * Names only — the marks come from the shared registry in `lib/tech-icons`,
 * which is also what the service badges and the stack cards read from. This
 * file used to carry its own parallel list of icon imports, and the two drifted:
 * a technology could appear with a logo here and as bare text everywhere else.
 *
 * `techIcon` is total over this list because every name below is in the
 * registry; the filter keeps that true rather than trusting it.
 */
const marqueeNames = [
  "React",
  "Flutter",
  "Node.js",
  "Python",
  "AWS",
  "Firebase",
  "Swift",
  "Kotlin",
  "MongoDB",
  "PostgreSQL",
  "TensorFlow",
  "Docker",
  "Next.js",
  "Vue",
  "TypeScript",
  "Figma",
] as const;

export const marqueeTech: ReadonlyArray<{ name: string; icon: IconType }> = marqueeNames.flatMap(
  (name) => {
    const icon = techIcon(name);
    return icon ? [{ name, icon }] : [];
  }
);
