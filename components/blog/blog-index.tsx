"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Calendar, Clock, Mail, Search, SearchX, Tag, User } from "lucide-react";
import type { BlogPost } from "@/data/blog";
import { Container } from "@/components/ui/container";
import { Card, CardIcon } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/states";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ALL = "All";

function formatDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function BlogIndex({ posts }: { posts: readonly BlogPost[] }) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState(ALL);

  const sorted = useMemo(() => [...posts].sort((a, b) => b.date.localeCompare(a.date)), [posts]);

  // Derived from the posts themselves so a filter can never show zero results
  // for a category that no longer exists.
  const tags = useMemo(
    () => [ALL, ...Array.from(new Set(sorted.map((post) => post.category)))],
    [sorted]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sorted.filter((post) => {
      const matchesTag = activeTag === ALL || post.category === activeTag;
      const matchesSearch =
        !term ||
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term);
      return matchesTag && matchesSearch;
    });
  }, [sorted, activeTag, search]);

  const [featured, ...rest] = filtered;
  const popular = sorted.slice(0, 4);
  const resetFilters = () => {
    setSearch("");
    setActiveTag(ALL);
  };

  return (
    <section className="site-section--tight site-section--no-top">
      <Container>
        <div className="mb-6 max-w-md">
          <label htmlFor="blog-search" className="sr-only">
            Search articles
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]"
              aria-hidden
            />
            <Input
              id="blog-search"
              type="search"
              placeholder="Search articles by title or topic"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="mb-10 flex flex-wrap items-center gap-2 border-b border-[var(--border)] pb-6">
          <span className="type-band-label mr-2 hidden md:inline-block">Filter</span>
          {tags.map((tag) => {
            const active = activeTag === tag;
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveTag(tag)}
                className={cn(
                  "type-ui relative rounded-[var(--radius-pill)] border px-3.5 py-1.5",
                  "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                  active
                    ? "border-transparent text-[var(--text-on-brand)]"
                    : "border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-tertiary)] hover:border-[var(--border-hover)] hover:text-[var(--foreground)]"
                )}
              >
                {active && (
                  <motion.span
                    aria-hidden
                    layoutId="blog-filter-active"
                    transition={transition.spring}
                    className="absolute inset-0 rounded-[var(--radius-pill)] [background-image:var(--gradient-primary)] shadow-[var(--shadow-glow)]"
                  />
                )}
                <span className="relative">{tag}</span>
              </button>
            );
          })}
        </div>

        <p aria-live="polite" className="sr-only">
          {filtered.length} article{filtered.length === 1 ? "" : "s"} found
        </p>

        {filtered.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No Articles Match Your Filters"
            description="Try a different category, or clear the filters to see everything we've published."
            action={
              <Button type="button" variant="secondary" size="sm" onClick={resetFilters}>
                Clear Filters
              </Button>
            }
          />
        ) : (
          <>
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="mb-8 block">
                <article
                  data-spotlight=""
                  className="spotlight group grid overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface-raised)] shadow-[var(--shadow-md)] transition-[border-color,box-shadow,translate] duration-[var(--duration-normal)] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-lg)] motion-reduce:transform-none lg:grid-cols-[1.1fr_0.9fr]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[380px]">
                    <Image
                      src={featured.image}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-105 motion-reduce:transition-none"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <Badge tone="gradient" className="absolute left-4 top-4">
                      Featured
                    </Badge>
                  </div>

                  <div className="flex flex-col justify-center p-7 lg:p-10">
                    <Badge tone="accent" className="mb-4 w-fit">
                      <Tag className="h-3 w-3" aria-hidden />
                      {featured.category}
                    </Badge>
                    <h2 className="type-section-title mb-3 text-[var(--foreground)] transition-colors duration-[var(--duration-fast)] group-hover:text-[var(--accent)]">
                      {featured.title}
                    </h2>
                    <p className="type-body mb-6 line-clamp-3 text-[var(--text-secondary)]">
                      {featured.excerpt}
                    </p>
                    <div className="type-ui mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[var(--text-tertiary)]">
                      <span className="inline-flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" aria-hidden />
                        {featured.author}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" aria-hidden />
                        <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" aria-hidden />
                        {featured.readTime}
                      </span>
                    </div>
                    <span className="type-ui inline-flex items-center gap-1.5 text-[var(--accent)]">
                      Read article
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                    </span>
                  </div>
                </article>
              </Link>
            )}

            {/*
              An index, not a card wall. The grid-of-cards plus sidebar gave
              every post the same visual weight as the one beside it and left
              the titles competing with their own thumbnails for the eye. Rows
              put the headline first at a readable measure, keep the image as
              support, and let the whole list be scanned down a single edge —
              which is what someone browsing an archive is actually doing.
            */}
            <AnimatePresence mode="wait">
              <Stagger
                key={`${activeTag}-${search}`}
                as="ul"
                immediate
                gap={0.04}
                className="border-t border-[var(--border)]"
              >
                {rest.map((post) => (
                  <StaggerItem as="li" key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group grid items-center gap-5 border-b border-[var(--border)] py-6 transition-colors duration-[var(--duration-fast)] hover:bg-[var(--surface-tint)] sm:grid-cols-[14rem_1fr] sm:gap-7 sm:px-2 lg:grid-cols-[16rem_1fr_auto]"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-overlay)]">
                        <Image
                          src={post.image}
                          alt=""
                          fill
                          className="object-cover saturate-[0.5] transition-[transform,filter] duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-105 group-hover:saturate-100 motion-reduce:transition-none"
                          sizes="(max-width: 640px) 100vw, 16rem"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="type-ui mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--text-tertiary)]">
                          <span className="text-[var(--accent)]">{post.category}</span>
                          <span aria-hidden>·</span>
                          <time dateTime={post.date}>{formatDate(post.date)}</time>
                          <span aria-hidden>·</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="type-block-title mb-2 text-[var(--foreground)] transition-colors duration-[var(--duration-fast)] group-hover:text-[var(--accent)]">
                          {post.title}
                        </h3>
                        <p className="type-body line-clamp-2 max-w-2xl text-[var(--text-secondary)]">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* The affordance only needs to exist once per row, and
                          at the end of it — repeating "Read" under every card
                          was noise when the whole row is already the link. */}
                      <span
                        aria-hidden
                        className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--accent)] transition-[border-color,background-color,translate] duration-[var(--duration-fast)] group-hover:-translate-y-0.5 group-hover:border-[var(--border-strong)] group-hover:bg-[var(--surface-tint-strong)] motion-reduce:transform-none lg:inline-flex"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            </AnimatePresence>

            {/* What the sidebar used to hold, moved under the list. Beside the
                rows it competed with them for width; below, it reads as a
                footer to the archive. */}
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
                <Card tone="solid" padding="md">
                  <h2 className="type-card-title mb-4 text-[var(--foreground)]">Popular Posts</h2>
                  <ol className="flex flex-col gap-4">
                    {popular.map((post, index) => (
                      <li key={post.id} className="group">
                        <Link href={`/blog/${post.slug}`} className="flex gap-3">
                          <span className="type-stat shrink-0 text-lg text-[var(--text-tertiary)]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>
                            <span className="type-ui mb-0.5 line-clamp-2 block text-[var(--foreground)] transition-colors duration-[var(--duration-fast)] group-hover:text-[var(--accent)]">
                              {post.title}
                            </span>
                            <span className="block text-[var(--text-xs)] text-[var(--text-tertiary)]">
                              {formatDate(post.date)} · {post.readTime}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </Card>

                <Card tone="highlight" padding="md">
                  <CardIcon className="mb-3">
                    <Mail className="h-5 w-5" aria-hidden />
                  </CardIcon>
                  <h2 className="type-card-title mb-2 text-[var(--foreground)]">
                    Want This Applied to Your Product?
                  </h2>
                  <p className="type-body mb-4 text-[var(--text-secondary)]">
                    We write about what we ship. If something here maps to a problem you&apos;re
                    facing, tell us about it.
                  </p>
                  <Button href="/contact" size="sm" fullWidth>
                    Start a Conversation
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Button>
                </Card>

                <Card tone="solid" padding="md">
                  <h2 className="type-card-title mb-4 text-[var(--foreground)]">Browse by Topic</h2>
                  <ul className="flex flex-wrap gap-2">
                    {tags
                      .filter((tag) => tag !== ALL)
                      .map((tag) => (
                        <li key={tag}>
                          <button
                            type="button"
                            onClick={() => setActiveTag(tag)}
                            aria-pressed={activeTag === tag}
                            className="type-tag rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[var(--text-tertiary)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
                          >
                            {tag}
                          </button>
                        </li>
                      ))}
                  </ul>
                </Card>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
