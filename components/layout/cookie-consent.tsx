"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { transition } from "@/lib/motion";

const STORAGE_KEY = "cookie-consent";
const ACCEPTED = "accepted";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getStoredConsent(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). Treating it
    // as already accepted keeps the banner from appearing on every render.
    return ACCEPTED;
  }
}

/** The server has no localStorage, so render as if consent were already given. */
function getServerConsent(): string | null {
  return ACCEPTED;
}

export default function CookieConsent() {
  // localStorage is external state, so subscribing to it keeps the server and
  // client renders consistent without a post-mount setState.
  const storedConsent = useSyncExternalStore(subscribe, getStoredConsent, getServerConsent);
  const [dismissed, setDismissed] = useState(false);
  const isVisible = storedConsent === null && !dismissed;

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, ACCEPTED);
    } catch {
      // Preference simply won't persist across reloads.
    }
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={transition.normal}
          className="fixed inset-x-0 bottom-0 z-[60] p-4 md:p-6"
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
        >
          <div className="container container--narrow">
            <div className="glass-strong flex flex-col items-start gap-4 rounded-[var(--radius-2xl)] p-5 md:flex-row md:items-center md:gap-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-tint-strong)] text-[var(--accent)]">
                <Cookie className="h-5 w-5" aria-hidden />
              </span>
              <div className="flex-1">
                <p
                  id="cookie-consent-title"
                  className="type-card-title mb-1 text-[var(--foreground)]"
                >
                  We use cookies
                </p>
                <p
                  id="cookie-consent-desc"
                  className="text-[var(--text-base)] text-[var(--text-secondary)]"
                >
                  We use cookies to enhance your experience and analyse site traffic. By selecting
                  Accept, you consent to our use of cookies.{" "}
                  <Link
                    href="/privacy-policy#cookies"
                    className="text-[var(--accent)] underline-offset-2 hover:underline"
                  >
                    Learn more
                  </Link>
                </p>
              </div>
              <Button type="button" size="sm" onClick={accept} className="shrink-0">
                Accept
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
