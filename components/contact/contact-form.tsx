"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { contactFormSchema, type ContactFormValues } from "@/lib/contact-schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const serviceOptions = [
  "Web development",
  "Mobile app development",
  "Desktop software",
  "AI / ML integration",
  "Cloud & DevOps",
  "UI / UX design",
  "API & integrations",
  "Cybersecurity & QA",
  "E-commerce",
  "ERP / CRM",
  "Other",
];

const budgetOptions = [
  "Under Rs. 50,000",
  "Rs. 50,000 - Rs. 2,00,000",
  "Rs. 2,00,000 - Rs. 10,00,000",
  "Rs. 10,00,000+",
  "Not sure yet",
];

function fieldClasses(hasError: boolean) {
  return cn(
    "w-full rounded-[var(--radius-md)] border bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--text-subtle)] backdrop-blur-xl transition-colors focus:outline-none",
    hasError
      ? "border-[var(--danger)]/60 focus:border-[var(--danger)]"
      : "border-[var(--border)] focus:border-[var(--border-strong)]"
  );
}

function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="type-ui mb-2 inline-block text-[var(--foreground)]">
        {label}
        {required && (
          <span className="ml-1 text-[var(--secondary)]" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const id = useId();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const fieldId = (name: string) => `${id}-${name}`;

  const describedBy = (name: keyof ContactFormValues) =>
    errors[name] ? `${fieldId(name)}-error` : undefined;

  const onSubmit = async (values: ContactFormValues) => {
    setSubmissionError(null);

    try {
      const response = await fetch("/api/contact-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setSubmissionError(
          result?.message ?? "We couldn't send your message. Please try again."
        );
        return;
      }
    } catch {
      setSubmissionError("We couldn't reach the server. Please check your connection and retry.");
      return;
    }

    setIsSubmitted(true);
    reset();
  };

  return (
    <AnimatePresence mode="wait">
      {isSubmitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="glass rounded-[var(--radius-2xl)] border-[var(--success)]/40 p-10 text-center md:p-14"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--success)]/30 bg-[var(--success)]/15 text-[var(--success)]">
            <CheckCircle className="h-8 w-8" aria-hidden />
          </div>
          <h2 className="type-section-title mb-3 text-[var(--foreground)]">Message sent</h2>
          <p className="type-lead mx-auto mb-8 max-w-md">
            Thanks for reaching out. We&apos;ve received your project details and will reply within
            one business day.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setIsSubmitted(false);
              setSubmissionError(null);
            }}
          >
            Send another message
          </Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className="glass rounded-[var(--radius-2xl)] p-7 md:p-10"
          noValidate
        >
          <div className="mb-7">
            <p className="type-eyebrow mb-3">Project brief</p>
            <h2 className="type-panel-title text-[var(--foreground)]">
              Tell us about your project
            </h2>
          </div>

          {/* Honeypot: hidden from users, commonly auto-filled by bots. */}
          <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
            <label htmlFor={fieldId("website")}>Website</label>
            <input
              id={fieldId("website")}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />
          </div>

          <div className="mb-5 grid gap-5 md:grid-cols-2">
            <Field label="Full name" htmlFor={fieldId("name")} required error={errors.name?.message}>
              <input
                id={fieldId("name")}
                autoComplete="name"
                placeholder="Jane Doe"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describedBy("name")}
                className={fieldClasses(Boolean(errors.name))}
                {...register("name")}
              />
            </Field>
            <Field label="Email" htmlFor={fieldId("email")} required error={errors.email?.message}>
              <input
                id={fieldId("email")}
                type="email"
                autoComplete="email"
                placeholder="jane@company.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describedBy("email")}
                className={fieldClasses(Boolean(errors.email))}
                {...register("email")}
              />
            </Field>
          </div>

          <div className="mb-5 grid gap-5 md:grid-cols-2">
            <Field label="Phone (optional)" htmlFor={fieldId("phone")}>
              <input
                id={fieldId("phone")}
                type="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                className={fieldClasses(false)}
                {...register("phone")}
              />
            </Field>
            <Field label="Company (optional)" htmlFor={fieldId("company")}>
              <input
                id={fieldId("company")}
                autoComplete="organization"
                placeholder="Acme Inc."
                className={fieldClasses(false)}
                {...register("company")}
              />
            </Field>
          </div>

          <div className="mb-5 grid gap-5 md:grid-cols-2">
            <Field label="Service of interest" htmlFor={fieldId("service")}>
              <select
                id={fieldId("service")}
                className={fieldClasses(false)}
                {...register("service")}
              >
                <option value="">Select a service…</option>
                {serviceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Estimated budget" htmlFor={fieldId("budget")}>
              <select id={fieldId("budget")} className={fieldClasses(false)} {...register("budget")}>
                <option value="">Select a range…</option>
                {budgetOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label="Project description"
            htmlFor={fieldId("message")}
            required
            error={errors.message?.message}
          >
            <textarea
              id={fieldId("message")}
              rows={5}
              placeholder="Tell us about your goals, current state, and what you'd like to build…"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={describedBy("message")}
              className={cn(fieldClasses(Boolean(errors.message)), "resize-none")}
              {...register("message")}
            />
          </Field>

          <p className="type-body mt-4 text-xs text-[var(--text-muted)]">
            By submitting, you agree to our{" "}
            <Link href="/privacy-policy" className="text-[var(--accent)] hover:underline">
              Privacy Policy
            </Link>
            . We&apos;ll never share your information.
          </p>

          {submissionError && (
            <p
              role="alert"
              className="type-body mt-4 rounded-[var(--radius-md)] border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]"
            >
              {submissionError}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="mt-6 w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                Sending…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden />
                Send message
              </>
            )}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
