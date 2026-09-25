import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Reveal } from "@/components/motion/reveal";

type SectionTone = "plain" | "band" | "elevated" | "ruled";

const toneClass: Record<SectionTone, string> = {
  plain: "",
  band: "site-section--band",
  elevated: "site-section--elevated",
  ruled: "site-section--ruled",
};

export function Section({
  tone = "plain",
  spacing = "default",
  width = "default",
  scheme,
  id,
  className,
  children,
}: {
  tone?: SectionTone;
  spacing?: "default" | "tight" | "none";
  width?: "default" | "narrow" | "prose";
  /**
   * Opts the whole section into the dark palette. The page is light; this is
   * how a band inverts. Everything inside follows automatically — cards,
   * badges, borders, shadows and text all read semantic tokens, so nothing
   * below this needs to know which scheme it is rendering in.
   */
  scheme?: "dark";
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-scheme={scheme}
      className={cn(
        spacing === "default" && "site-section",
        spacing === "tight" && "site-section--tight",
        toneClass[tone],
        className
      )}
    >
      <Container width={width}>{children}</Container>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "start",
  aside,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "start" | "center";
  aside?: React.ReactNode;
  className?: string;
}) {
  const centered = align === "center";

  return (
    <Reveal
      className={cn(
        "mb-12 md:mb-14",
        centered ? "text-center" : aside && "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className={cn(centered ? "mx-auto max-w-2xl" : "max-w-2xl")}>
        {eyebrow && <p className="type-eyebrow mb-3">{eyebrow}</p>}
        <h2 className="type-section-title text-[var(--foreground)]">{title}</h2>
        {lead && <p className={cn("type-lead mt-4", centered && "mx-auto")}>{lead}</p>}
      </div>
      {aside && <div className={cn(centered && "mt-6")}>{aside}</div>}
    </Reveal>
  );
}
