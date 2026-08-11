"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

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
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed inset-x-0 bottom-0 z-[60] p-4 md:p-6"
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
        >
          <div className="container container--narrow">
            <div className="glass flex flex-col items-start gap-4 rounded-[var(--radius-xl)] p-6 md:flex-row md:items-center">
              <div className="flex flex-1 items-start gap-3">
                <span className="shrink-0 rounded-[var(--radius-sm)] bg-[var(--card-soft)] p-2 text-[var(--accent)]">
                  <Cookie className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p
                    id="cookie-consent-title"
                    className="mb-1 font-heading font-semibold text-[var(--foreground)]"
                  >
                    We use cookies
                  </p>
                  <p id="cookie-consent-desc" className="text-sm text-[var(--text-muted)]">
                    We use cookies to enhance your experience and analyse site traffic. By
                    selecting Accept, you consent to our use of cookies.{" "}
                    <Link
                      href="/privacy-policy#cookies"
                      className="text-[var(--accent)] hover:underline"
                    >
                      Learn more
                    </Link>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={accept}
                className="shrink-0 rounded-[var(--radius-sm)] bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--button-foreground)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--button-shadow)] motion-reduce:hover:translate-y-0"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
