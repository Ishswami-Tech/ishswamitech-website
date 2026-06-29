"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  ArrowUpRight,
  Calendar,
  Clock,
  User,
  Tag,
  Mail,
} from "lucide-react";
import { blogPosts } from "@/data/blog";

const tags = ["All", "Case Study", "Web Dev", "Mobile", "AI/ML", "Design", "Cloud", "Business"];

function formatDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const sortedAll = useMemo(
    () => [...blogPosts].sort((a, b) => b.date.localeCompare(a.date)),
    []
  );

  const filteredPosts = useMemo(() => {
    return sortedAll.filter((post) => {
      const matchTag = activeTag === "All" || post.category === activeTag;
      const term = search.trim().toLowerCase();
      const matchSearch =
        !term ||
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term);
      return matchTag && matchSearch;
    });
  }, [sortedAll, activeTag, search]);

  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);
  const popularPosts = sortedAll.slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <nav className="type-ui text-[var(--text-muted)]">
              <Link href="/" className="hover:text-[var(--accent)] transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-[var(--foreground)]">Insights</span>
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid items-end gap-8 lg:grid-cols-[1.3fr_1fr]"
          >
            <div>
              <p className="type-eyebrow mb-4">Insights & resources</p>
              <h1 className="type-page-title mb-5 text-[var(--foreground)]">
                Practical writing on building modern software
              </h1>
              <p className="type-lead max-w-2xl">
                Field notes, deep dives, and case studies from our team — covering web
                engineering, AI, mobile, design, and the operating model behind shipping
                products that grow.
              </p>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="search"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-[var(--border)] bg-[var(--card)] px-12 py-3.5 text-[var(--foreground)] placeholder-[var(--text-muted)] backdrop-blur-xl transition-colors focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED */}
      {featuredPost && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Link href={`/blog/${featuredPost.slug}`}>
                <article className="glass group overflow-hidden rounded-[2rem] border border-[var(--border)] transition-all hover:border-[var(--border-strong)] hover:shadow-[var(--button-shadow)]">
                  <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[400px]">
                      <Image
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--button-gradient)] px-3 py-1 text-xs font-semibold text-white shadow-[var(--button-shadow)]">
                        Featured
                      </div>
                    </div>
                    <div className="flex flex-col justify-center p-8 lg:p-12">
                      <span className="type-tag mb-4 inline-flex w-fit items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--card-soft)] px-2.5 py-1 text-[var(--accent)]">
                        <Tag className="h-3 w-3" />
                        {featuredPost.category}
                      </span>
                      <h2 className="type-section-title mb-4 text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="type-body mb-6 line-clamp-3 text-[var(--text-muted)]">
                        {featuredPost.excerpt}
                      </p>
                      <div className="type-ui mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[var(--text-muted)]">
                        <span className="inline-flex items-center gap-1.5">
                          <User className="h-4 w-4" />
                          {featuredPost.author}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {formatDate(featuredPost.date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {featuredPost.readTime}
                        </span>
                      </div>
                      <span className="type-ui inline-flex items-center gap-1.5 text-[var(--accent)]">
                        Read article
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* FILTERS */}
      <section className="pb-6">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] pb-6"
          >
            <span className="type-band-label mr-2 hidden text-[var(--text-muted)] md:inline-block">
              Filter
            </span>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`type-ui rounded-full border px-4 py-2 transition-all ${
                  activeTag === tag
                    ? "border-[var(--border-strong)] bg-[var(--accent)] text-white shadow-[var(--button-shadow)]"
                    : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* GRID + SIDEBAR */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {gridPosts.length === 0 && !featuredPost ? (
                <div className="glass rounded-2xl border border-[var(--border)] p-12 text-center">
                  <p className="type-card-title mb-2 text-[var(--foreground)]">
                    No articles match your filters.
                  </p>
                  <p className="type-body text-[var(--text-muted)]">
                    Try a different category or search term.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {gridPosts.map((post, i) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <div className="glass group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] transition-all hover:-translate-y-1 hover:border-[var(--border-strong)]">
                          <div className="relative aspect-video overflow-hidden">
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                          <div className="flex flex-1 flex-col p-6">
                            <span className="type-tag mb-3 inline-flex w-fit items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--card-soft)] px-2 py-0.5 text-[var(--accent)]">
                              {post.category}
                            </span>
                            <h3 className="type-card-title mb-2 line-clamp-2 text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                              {post.title}
                            </h3>
                            <p className="type-body mb-5 line-clamp-2 flex-1 text-sm text-[var(--text-muted)]">
                              {post.excerpt}
                            </p>
                            <div className="type-ui flex items-center justify-between text-[var(--text-muted)]">
                              <span className="inline-flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {formatDate(post.date)}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[var(--accent)]">
                                Read
                                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <aside className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl border border-[var(--border)] p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="type-card-title text-[var(--foreground)]">Popular posts</h3>
                  <span className="type-tag rounded-md bg-[var(--card-soft)] px-2 py-0.5 text-[var(--accent)]">
                    Top
                  </span>
                </div>
                <ul className="space-y-4">
                  {popularPosts.map((post, idx) => (
                    <li key={post.id} className="group">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex gap-3"
                      >
                        <span className="type-stat shrink-0 text-xl text-[var(--text-muted)] opacity-50">
                          0{idx + 1}
                        </span>
                        <div>
                          <p className="type-ui mb-1 line-clamp-2 text-sm text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                            {post.title}
                          </p>
                          <p className="type-body text-xs text-[var(--text-muted)]">
                            {formatDate(post.date)} · {post.readTime}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="relative overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-[var(--card-soft)] p-6"
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--accent)]/15 blur-2xl" />
                <div className="relative">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h3 className="type-card-title mb-2 text-[var(--foreground)]">
                    Field notes, every Friday
                  </h3>
                  <p className="type-body mb-4 text-sm text-[var(--text-muted)]">
                    One short, practical email on engineering, design, and shipping software.
                    No spam, easy to unsubscribe.
                  </p>
                  <form className="space-y-2">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] focus:border-[var(--border-strong)] focus:outline-none"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[var(--button-gradient)] px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--button-shadow)] transition-all hover:-translate-y-0.5"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-2xl border border-[var(--border)] p-6"
              >
                <h3 className="type-card-title mb-4 text-[var(--foreground)]">Browse by topic</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.filter((t) => t !== "All").map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className="type-tag rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
