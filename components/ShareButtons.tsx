"use client";

import { Twitter, Linkedin, Link2 } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const copyLink = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-[var(--text-muted)]">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 text-[var(--text-muted)] transition-all hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
        aria-label="Share on Twitter"
      >
        <Twitter size={20} />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 text-[var(--text-muted)] transition-all hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={20} />
      </a>
      <button
        onClick={copyLink}
        className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 text-[var(--text-muted)] transition-all hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
        aria-label="Copy link"
      >
        <Link2 size={20} />
      </button>
    </div>
  );
}
