"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Link2, Linkedin, Twitter } from "lucide-react";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

const action = cn(
  "inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)]",
  "border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)]",
  "transition-[color,border-color,transform,box-shadow]",
  "duration-[var(--duration-fast)] ease-[var(--ease-out)]",
  "hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--accent)]",
  "hover:shadow-[var(--shadow-sm)] motion-reduce:transform-none"
);

export default function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard access is denied outside a secure context and in some
      // embedded browsers. Nothing useful to recover, and the confirmation
      // below would be a lie, so leave the button untouched.
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="type-ui text-[var(--text-tertiary)]">Share:</span>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={action}
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4" aria-hidden />
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={action}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" aria-hidden />
      </a>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={copyLink}
          className={cn(action, copied && "border-[var(--success)]/40 text-[var(--success)]")}
          aria-label="Copy link to this article"
        >
          {/* Crossfade the glyph in place so the row doesn't reflow. */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "done" : "idle"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={transition.fast}
              className="flex"
            >
              {copied ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : (
                <Link2 className="h-4 w-4" aria-hidden />
              )}
            </motion.span>
          </AnimatePresence>
        </button>

        {/* Announced to screen readers, which get no benefit from the icon
            swap. Reserving no space keeps the row from shifting. */}
        <span role="status" aria-live="polite" className="sr-only">
          {copied ? "Link copied to clipboard" : ""}
        </span>

        <AnimatePresence>
          {copied && (
            <motion.span
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={transition.fast}
              aria-hidden
              className="type-ui whitespace-nowrap text-[var(--success)]"
            >
              Copied
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
