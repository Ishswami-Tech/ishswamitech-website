"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Clock,
  User,
  Tag,
  Mail,
} from "lucide-react";
import ShareButtons from "./ShareButtons";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  authorAvatar?: string;
  date: string;
  readTime: string;
}

interface BlogPostContentProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

function formatDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (idx: number) => {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ul key={`ul-${idx}`} className="mb-6 list-disc space-y-2 pl-6 marker:text-[var(--accent)]">
        {listBuffer.map((item, i) => (
          <li key={i} className="type-body text-[var(--text-muted)]">
            {item}
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trimEnd();
    if (line.startsWith("- ")) {
      listBuffer.push(line.replace("- ", ""));
      return;
    }
    flushList(idx);

    if (line.startsWith("## ")) {
      blocks.push(
        <h2
          key={idx}
          className="type-section-title mt-12 mb-4 text-[var(--foreground)]"
        >
          {line.replace("## ", "")}
        </h2>
      );
      return;
    }
    if (line.startsWith("### ")) {
      blocks.push(
        <h3
          key={idx}
          className="type-panel-title mt-8 mb-3 text-[var(--foreground)]"
        >
          {line.replace("### ", "")}
        </h3>
      );
      return;
    }
    if (line.trim() === "") return;
    blocks.push(
      <p key={idx} className="type-body mb-5 text-[var(--text-muted)]">
        {line}
      </p>
    );
  });

  flushList(lines.length);
  return blocks;
}

export default function BlogPostContent({ post, relatedPosts }: BlogPostContentProps) {
  const shareUrl = `https://ishswamitech.com/blog/${post.slug}`;

  return (
    <div>
      {/* HERO */}
      <section className="page-hero page-hero--compact">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/blog"
              className="type-ui mb-8 inline-flex items-center gap-2 text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all articles
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="type-tag mb-5 inline-flex w-fit items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--card-soft)] px-2.5 py-1 text-[var(--accent)]">
                <Tag className="h-3 w-3" />
                {post.category}
              </span>
              <h1 className="type-page-title mb-5 text-[var(--foreground)]">{post.title}</h1>
              <p className="type-lead mb-8 max-w-3xl">{post.excerpt}</p>

              <div className="type-ui flex flex-wrap items-center gap-x-5 gap-y-2 text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {post.author}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* COVER */}
      <section className="site-section--tight site-section--no-top">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-5xl"
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-[var(--border)]">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1024px"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ARTICLE BODY */}
      <section className="site-section--tight site-section--no-top">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <article>{renderContent(post.content)}</article>
          </div>
        </div>
      </section>

      {/* SHARE */}
      <section className="site-section--tight site-section--no-top">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="glass flex flex-col items-start gap-4 rounded-2xl border border-[var(--border)] p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="type-band-label text-[var(--text-muted)]">Share this article</p>
              <ShareButtons title={post.title} url={shareUrl} />
            </div>
          </div>
        </div>
      </section>

      {/* AUTHOR */}
      <section className="site-section--tight site-section--no-top">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="glass flex items-center gap-5 rounded-2xl border border-[var(--border)] p-6">
              <div className="relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-2 ring-[var(--card-soft)]">
                <Image
                  src={post.authorAvatar || "/Assets/Programmers_4.jpg"}
                  alt={post.author}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div>
                <p className="type-eyebrow mb-1 text-[var(--text-muted)]">Written by</p>
                <h3 className="type-card-title text-[var(--foreground)]">{post.author}</h3>
                <p className="type-body text-sm text-[var(--text-muted)]">
                  Engineer & writer at IshSwamiTech Solutions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED */}
      {relatedPosts.length > 0 && (
        <section className="site-section bg-[var(--home-band-bg)]">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="type-eyebrow mb-3">Keep reading</p>
                <h2 className="type-section-title text-[var(--foreground)]">Related articles</h2>
              </div>
              <Link
                href="/blog"
                className="type-ui inline-flex items-center gap-2 text-[var(--accent)] transition-colors hover:text-[var(--link-emphasis)]"
              >
                All articles
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedPosts.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`}>
                  <article className="glass group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] transition-all hover:-translate-y-1 hover:border-[var(--border-strong)]">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="type-tag mb-3 inline-flex w-fit items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--card-soft)] px-2 py-0.5 text-[var(--accent)]">
                        {p.category}
                      </span>
                      <h3 className="type-card-title mb-2 line-clamp-2 text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                        {p.title}
                      </h3>
                      <p className="type-body mt-auto text-xs text-[var(--text-muted)]">
                        {formatDate(p.date)} · {p.readTime}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <section className="site-section">
        <div className="container mx-auto px-4">
          <div className="glass relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-[var(--border-strong)] p-10 text-center md:p-14">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--accent)]/15 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[var(--secondary)]/15 blur-3xl" />
            <div className="relative">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
                <Mail className="h-5 w-5" />
              </div>
              <p className="type-eyebrow mb-4">Weekly field notes</p>
              <h2 className="type-section-title mb-4 text-[var(--foreground)]">
                Get the next article straight to your inbox
              </h2>
              <p className="type-lead mx-auto mb-8 max-w-xl">
                One short, practical email each Friday. Engineering, design, and shipping
                software — no fluff.
              </p>
              <form className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="flex-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-[var(--foreground)] placeholder-[var(--text-muted)] focus:border-[var(--border-strong)] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[var(--button-gradient)] px-6 py-3 font-semibold text-white shadow-[var(--button-shadow)] transition-all hover:-translate-y-0.5"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
