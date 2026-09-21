"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle, Send } from "lucide-react";
import { contactFormSchema, type ContactFormValues } from "@/lib/contact-schema";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { modalVariants, transition } from "@/lib/motion";

const serviceOptions = [
  "Web Development",
  "Mobile app development",
  "Desktop software",
  "AI / ML integration",
  "Cloud & DevOps",
  "UI / UX Design",
  "API & integrations",
  "Cybersecurity & QA",
  "E-Commerce",
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
        setSubmissionError(result?.message ?? "We couldn't send your message. Please try again.");
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
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition.normal}
          className="glass rounded-[var(--radius-2xl)] border-[var(--success)]/35 p-10 text-center md:p-14"
        >
          <div className="relative mx-auto mb-5 w-fit">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full bg-[var(--success)]/25 blur-2xl"
            />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[var(--success)]/30 bg-[var(--success)]/12 text-[var(--success)]">
              <CheckCircle className="h-7 w-7" aria-hidden />
            </div>
          </div>
          <h2 className="type-section-title mb-3 text-[var(--foreground)]">Message Sent</h2>
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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition.normal}
          onSubmit={handleSubmit(onSubmit)}
          className="glass rounded-[var(--radius-2xl)] p-6 md:p-9"
          noValidate
        >
          <div className="mb-7">
            <p className="type-eyebrow mb-2.5">Project brief</p>
            <h2 className="type-panel-title text-[var(--foreground)]">Tell Us About Your Project</h2>
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

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full Name" htmlFor={fieldId("name")} required error={errors.name?.message}>
              <Input
                id={fieldId("name")}
                autoComplete="name"
                placeholder="Jane Doe"
                invalid={Boolean(errors.name)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describedBy("name")}
                {...register("name")}
              />
            </Field>

            <Field label="Email" htmlFor={fieldId("email")} required error={errors.email?.message}>
              <Input
                id={fieldId("email")}
                type="email"
                autoComplete="email"
                placeholder="jane@company.com"
                invalid={Boolean(errors.email)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describedBy("email")}
                {...register("email")}
              />
            </Field>

            <Field label="Phone" htmlFor={fieldId("phone")} hint="Optional">
              <Input
                id={fieldId("phone")}
                type="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                {...register("phone")}
              />
            </Field>

            <Field label="Company" htmlFor={fieldId("company")} hint="Optional">
              <Input
                id={fieldId("company")}
                autoComplete="organization"
                placeholder="Acme Inc."
                {...register("company")}
              />
            </Field>

            <Field label="Service of Interest" htmlFor={fieldId("service")}>
              <Select id={fieldId("service")} defaultValue="" {...register("service")}>
                <option value="">Select a service…</option>
                {serviceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Estimated Budget" htmlFor={fieldId("budget")}>
              <Select id={fieldId("budget")} defaultValue="" {...register("budget")}>
                <option value="">Select a range…</option>
                {budgetOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label="Project Description"
              htmlFor={fieldId("message")}
              required
              error={errors.message?.message}
              className="md:col-span-2"
            >
              <Textarea
                id={fieldId("message")}
                rows={5}
                placeholder="Tell us about your goals, current state, and what you'd like to build…"
                invalid={Boolean(errors.message)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={describedBy("message")}
                {...register("message")}
              />
            </Field>
          </div>

          <p className="mt-5 text-[var(--text-xs)] text-[var(--text-tertiary)]">
            By submitting, you agree to our{" "}
            <Link
              href="/privacy-policy"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Privacy Policy
            </Link>
            . We&apos;ll never share your information.
          </p>

          <AnimatePresence>
            {submissionError && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={transition.fast}
                className="mt-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-[var(--text-base)] text-[var(--danger)]"
              >
                {submissionError}
              </motion.p>
            )}
          </AnimatePresence>

          <Button type="submit" loading={isSubmitting} className="mt-6 w-full sm:w-auto">
            {!isSubmitting && <Send className="h-4 w-4" aria-hidden />}
            {isSubmitting ? "Sending…" : "Send message"}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
