import Link from "next/link";
import { ArrowLeft, FileText, PackageCheck, RotateCcw, Shield } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardIcon } from "@/components/ui/card";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Reveal } from "@/components/motion/reveal";
import { legalContacts, legalDocuments, type LegalSlug } from "@/lib/legal/policy-content";

const icons: Record<LegalSlug, React.ElementType> = {
  "privacy-policy": Shield,
  "terms-and-conditions": FileText,
  "refund-cancellation": RotateCcw,
  "shipping-delivery": PackageCheck,
};

/** Strips the leading "12. " so the table of contents reads cleanly. */
function stripNumber(title: string) {
  return title.replace(/^\d+\.\s*/, "");
}

export function LegalPage({ slug }: { slug: LegalSlug }) {
  const doc = legalDocuments[slug];
  const Icon = icons[slug];

  return (
    <>
      <section className="page-hero page-hero--compact relative isolate overflow-hidden">
        <AnimatedBackground variant="minimal" intensity="subtle" />
        <Container width="narrow" className="relative z-10">
          <Reveal immediate variant="fade">
            <nav aria-label="Breadcrumb" className="type-ui mb-6 text-[var(--text-tertiary)]">
              <ol className="flex items-center gap-2">
                <li>
                  <Link
                    href="/"
                    className="transition-colors duration-[var(--duration-fast)] hover:text-[var(--foreground)]"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-[var(--foreground)]" aria-current="page">
                  {doc.breadcrumb}
                </li>
              </ol>
            </nav>
          </Reveal>

          <Reveal immediate delay={0.06}>
            <CardIcon className="mb-5">
              <Icon className="h-5 w-5" aria-hidden />
            </CardIcon>
            <p className="type-eyebrow mb-3">{doc.eyebrow}</p>
            <h1 className="type-page-title mb-3 text-[var(--foreground)]">{doc.title}</h1>
            <p className="type-ui text-[var(--text-tertiary)]">Last updated: {doc.updated}</p>
            <p className="type-body mt-4 max-w-2xl text-[var(--text-secondary)]">{doc.intro}</p>
          </Reveal>
        </Container>
      </section>

      <section className="site-section--tight site-section--no-top">
        <Container width="narrow">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,14rem)_1fr]">
            <aside className="hidden lg:block">
              <nav
                aria-label="On this page"
                className="sticky top-[calc(var(--navbar-height)+1.5rem)]"
              >
                <p className="type-band-label mb-3">On this page</p>
                <ul className="flex flex-col gap-1 border-l border-[var(--border)]">
                  {doc.sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="type-ui -ml-px block border-l border-transparent py-1 pl-4 text-[var(--text-tertiary)] transition-[color,border-color] duration-[var(--duration-fast)] hover:border-[var(--primary)] hover:text-[var(--foreground)]"
                      >
                        {stripNumber(section.title)}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <article className="flex flex-col gap-9">
              {doc.disclosure && (
                <Card tone="soft" padding="md">
                  <p className="type-body text-[var(--text-secondary)]">{doc.disclosure}</p>
                </Card>
              )}

              {doc.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-[calc(var(--navbar-height)+1.5rem)]"
                >
                  <h2 className="type-panel-title mb-3 text-[var(--foreground)]">
                    {section.title}
                  </h2>
                  <p className="type-body text-[var(--text-secondary)]">{section.body}</p>
                </section>
              ))}

              <Card tone="soft" padding="md">
                <h2 className="type-panel-title mb-3 text-[var(--foreground)]">Contact Us</h2>
                <p className="type-body text-[var(--text-secondary)]">
                  For questions about this policy, email{" "}
                  <a
                    href={`mailto:${legalContacts.supportEmail}`}
                    className="text-[var(--accent)] hover:underline"
                  >
                    {legalContacts.supportEmail}
                  </a>{" "}
                  or call{" "}
                  <a
                    href={`tel:${legalContacts.supportPhone}`}
                    className="text-[var(--accent)] hover:underline"
                  >
                    {legalContacts.supportPhone}
                  </a>
                  .
                </p>
              </Card>

              <Link
                href="/"
                className="type-ui inline-flex items-center gap-2 text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to home
              </Link>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}
