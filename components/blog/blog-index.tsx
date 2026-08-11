"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Calendar, Clock, Mail, Search, Tag, User } from "lucide-react";
import type { BlogPost } from "@/data/blog";
import { Container } from "@/components/ui/container";
import { Card, CardIcon } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  return (
    <>
      <section className="site-section--tight site-section--no-top">
        <Container>
          <div className="mb-8 max-w-md">
            <label htmlFor="blog-search" className="sr-only">
              Search articles
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-secondary)]"
                aria-hidden
              />
              <input
                id="blog-search"
                type="search"
                placeholder="Search articles…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-full border border-[var(--border)] bg-[var(--surface-raised)] py-3.5 pl-12 pr-4 text-[var(--foreground)] placeholder-[var(--text-tertiary)] backdrop-blur-xl transition-colors focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-10 flex flex-wrap items-center gap-2 border-b border-[var(--border)] pb-6">
            <span className="type-band-label mr-2 hidden md:inline-block">Filter</span>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                aria-pressed={activeTag === tag}
                onClick={() => setActiveTag(tag)}
                className={cn(
                  "type-ui rounded-full border px-4 py-2 transition-all",
                  activeTag === tag
                    ? "border-[var(--border-strong)] bg-[var(--accent)] text-[var(--text-on-brand)] shadow-[var(--shadow-glow)]"
                    : "border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                )}
              >
                {tag}
              </button>
            ))}
          </div>

          <p aria-live="polite" className="sr-only">
            {filtered.length} article{filtered.length === 1 ? "" : "s"} found
          </p>

          {filtered.length === 0 ? (
            <Card padding="lg" className="text-center">
              <p className="type-card-title mb-2 text-[var(--foreground)]">
                No articles match your filters.
              </p>
              <p className="type-body text-[var(--text-secondary)]">
                Try a different category or search term.
              </p>
            </Card>
          ) : (
            <>
              {featured && (
                <Link href={`/blog/${featured.slug}`} className="mb-10 block">
                  <article className="glass group overflow-hidden rounded-[var(--radius-2xl)] transition-all hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-glow)]">
                    <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                      <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[400px]">
                        <Image
                          src={featured.image}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <p className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full [background-image:var(--gradient-primary)] px-3 py-1 text-xs font-semibold text-[var(--text-on-brand)]">
                          Featured
                        </p>
                      </div>
                      <div className="flex flex-col justify-center p-8 lg:p-12">
                        <p className="type-tag mb-4 inline-flex w-fit items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-tint)] px-2.5 py-1 text-[var(--accent)]">
                          <Tag className="h-3 w-3" aria-hidden />
                          {featured.category}
                        </p>
                        <h2 className="type-section-title mb-4 text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                          {featured.title}
                        </h2>
                        <p className="type-body mb-6 line-clamp-3 text-[var(--text-secondary)]">
                          {featured.excerpt}
                        </p>
                        <div className="type-ui mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[var(--text-secondary)]">
                          <span className="inline-flex items-center gap-1.5">
                            <User className="h-4 w-4" aria-hidden />
                            {featured.author}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" aria-hidden />
                            <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-4 w-4" aria-hidden />
                            {featured.readTime}
                          </span>
                        </div>
                        <span className="type-ui inline-flex items-center gap-1.5 text-[var(--accent)]">
                          Read article
                          <ArrowUpRight
                            className="h-4 w-4 transition-transform group-hover:rotate-45"
                            aria-hidden
                          />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              <div className="grid gap-12 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <ul className="grid gap-6 md:grid-cols-2">
                    {rest.map((post) => (
                      <li key={post.id} className="h-full">
                        <Link href={`/blog/${post.slug}`} className="block h-full">
                          <article className="glass group flex h-full flex-col overflow-hidden rounded-[var(--radius-2xl)] transition-all hover:-translate-y-1 hover:border-[var(--border-strong)] motion-reduce:hover:translate-y-0">
                            <div className="relative aspect-video overflow-hidden">
                              <Image
                                src={post.image}
                                alt=""
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            </div>
                            <div className="flex flex-1 flex-col p-6">
                              <p className="type-tag mb-3 inline-flex w-fit rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-tint)] px-2 py-0.5 text-[var(--accent)]">
                                {post.category}
                              </p>
                              <h3 className="type-card-title mb-2 line-clamp-2 text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                                {post.title}
                              </h3>
                              <p className="type-body mb-5 line-clamp-2 flex-1 text-sm text-[var(--text-secondary)]">
                                {post.excerpt}
                              </p>
                              <div className="type-ui flex items-center justify-between text-[var(--text-secondary)]">
                                <span className="inline-flex items-center gap-1.5">
                                  <Calendar className="h-4 w-4" aria-hidden />
                                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                                </span>
                                <span className="inline-flex items-center gap-1 text-[var(--accent)]">
                                  Read
                                  <ArrowUpRight
                                    className="h-4 w-4 transition-transform group-hover:rotate-45"
                                    aria-hidden
                                  />
                                </span>
                              </div>
                            </div>
                          </article>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <aside className="space-y-6">
                  <Card padding="md">
                    <h2 className="type-card-title mb-4 text-[var(--foreground)]">Popular posts</h2>
                    <ol className="space-y-4">
                      {popular.map((post, index) => (
                        <li key={post.id} className="group">
                          <Link href={`/blog/${post.slug}`} className="flex gap-3">
                            <span className="type-stat shrink-0 text-xl text-[var(--text-tertiary)]">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span>
                              <span className="type-ui mb-1 line-clamp-2 block text-sm text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                                {post.title}
                              </span>
                              <span className="type-body block text-xs text-[var(--text-secondary)]">
                                {formatDate(post.date)} · {post.readTime}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </Card>

                  <Card tone="highlight" className="relative overflow-hidden" padding="md">
                    <div
                      className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--accent)]/15 blur-2xl"
                      aria-hidden
                    />
                    <div className="relative">
                      <CardIcon className="mb-3 h-10 w-10">
                        <Mail className="h-5 w-5" aria-hidden />
                      </CardIcon>
                      <h2 className="type-card-title mb-2 text-[var(--foreground)]">
                        Want this applied to your product?
                      </h2>
                      <p className="type-body mb-4 text-sm text-[var(--text-secondary)]">
                        We write about what we ship. If something here maps to a problem
                        you&apos;re facing, tell us about it.
                      </p>
                      <Button href="/contact" size="sm" fullWidth>
                        Start a conversation
                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                      </Button>
                    </div>
                  </Card>

                  <Card padding="md">
                    <h2 className="type-card-title mb-4 text-[var(--foreground)]">
                      Browse by topic
                    </h2>
                    <ul className="flex flex-wrap gap-2">
                      {tags
                        .filter((tag) => tag !== ALL)
                        .map((tag) => (
                          <li key={tag}>
                            <button
                              type="button"
                              onClick={() => setActiveTag(tag)}
                              aria-pressed={activeTag === tag}
                              className="type-tag rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
                            >
                              {tag}
                            </button>
                          </li>
                        ))}
                    </ul>
                  </Card>
                </aside>
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
}
