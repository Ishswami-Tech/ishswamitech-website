"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  CheckCircle,
  Clock,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Linkedin,
  Github,
  Twitter,
} from "lucide-react";
import { contactFaq } from "@/data/faq";
import { siteConfig } from "@/lib/site";

const formSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Please describe your project (10+ characters)"),
});

type FormData = z.infer<typeof formSchema>;

const services = [
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

const budgets = [
  "Under $2,000",
  "$2,000 – $10,000",
  "$10,000 – $50,000",
  "$50,000+",
  "Not sure yet",
];

const trustPoints = [
  { icon: Clock, label: "Response within 24 hours" },
  { icon: ShieldCheck, label: "NDA before discovery" },
  { icon: MessageSquare, label: "No sales pressure" },
];

const whatsAppRecipients = [
  { label: "7218378311", phone: "917218378311" },
  { label: "7888154917", phone: "917888154917" },
];

type WhatsAppLink = (typeof whatsAppRecipients)[number] & { href: string };

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [whatsAppLinks, setWhatsAppLinks] = useState<WhatsAppLink[] | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    const message = buildWhatsAppMessage(data);
    const links = whatsAppRecipients.map((recipient) => ({
      ...recipient,
      href: `https://wa.me/${recipient.phone}?text=${encodeURIComponent(message)}`,
    }));

    setWhatsAppLinks(links);

    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitted(true);
    reset();
  };

  return (
    <div>
      {/* HERO */}
      <section className="page-hero">
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
              <span className="text-[var(--foreground)]">Contact</span>
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid items-end gap-8 lg:grid-cols-[1.2fr_1fr]"
          >
            <div>
              <p className="type-eyebrow mb-4">Get in touch</p>
              <h1 className="type-page-title mb-5 text-[var(--foreground)]">
                Let&apos;s build something worth talking about
              </h1>
              <p className="type-lead max-w-2xl">
                Tell us about your project and we&apos;ll get back within one business day. Every
                conversation starts with a free 30-minute discovery — no commitment, no scripts.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {trustPoints.map((t) => {
                const TIcon = t.icon;
                return (
                  <div
                    key={t.label}
                    className="type-body flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 backdrop-blur-xl"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--card-soft)] text-[var(--accent)]">
                      <TIcon className="h-4 w-4" />
                    </div>
                    {t.label}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* INFO + FORM */}
      <section className="site-section--tight site-section--no-top">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            {/* LEFT: contact info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-4"
            >
              <a
                href={`mailto:${siteConfig.email}`}
                className="glass group flex items-start gap-4 rounded-2xl border border-[var(--border)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--border-strong)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="type-eyebrow mb-1 text-[var(--text-muted)]">Email us</p>
                  <p className="type-card-title text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                    {siteConfig.email}
                  </p>
                  <p className="type-body text-sm text-[var(--text-muted)]">
                    For new projects, partnerships, and general questions
                  </p>
                </div>
              </a>

              <a
                href={`tel:${siteConfig.phone}`}
                className="glass group flex items-start gap-4 rounded-2xl border border-[var(--border)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--border-strong)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="type-eyebrow mb-1 text-[var(--text-muted)]">Call us</p>
                  <p className="type-card-title text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                    {siteConfig.phone}
                  </p>
                  <p className="type-body text-sm text-[var(--text-muted)]">
                    Mon – Fri, 10:00 AM – 7:00 PM IST
                  </p>
                </div>
              </a>

              <div className="glass flex items-start gap-4 rounded-2xl border border-[var(--border)] p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="type-eyebrow mb-1 text-[var(--text-muted)]">Office</p>
                  <p className="type-card-title text-[var(--foreground)]">Pune, Maharashtra</p>
                  <p className="type-body text-sm text-[var(--text-muted)]">
                    Working with clients across India, the US, UK, and UAE
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-[var(--card-soft)] p-6">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--accent)]/15 blur-2xl" />
                <div className="relative">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="type-card-title mb-2 text-[var(--foreground)]">
                    Prefer a real conversation?
                  </h3>
                  <p className="type-body mb-4 text-sm text-[var(--text-muted)]">
                    Book a free 30-minute discovery call. We&apos;ll talk scope, timeline, and
                    whether we&apos;re a fit.
                  </p>
                  <a
                    href={`mailto:${siteConfig.email}?subject=Discovery%20call`}
                    className="type-ui inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--link-emphasis)]"
                  >
                    Schedule a call →
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2 pt-2">
                <span className="type-ui text-[var(--text-muted)]">Or find us on:</span>
                {[
                  { href: siteConfig.social.linkedin, icon: Linkedin, label: "LinkedIn" },
                  { href: siteConfig.social.github, icon: Github, label: "GitHub" },
                  { href: siteConfig.social.x, icon: Twitter, label: "X" },
                ].map(({ href, icon: SocialIcon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
                  >
                    <SocialIcon size={16} />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* RIGHT: form */}
            <div>
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="glass rounded-2xl border border-[var(--success)]/40 p-10 text-center md:p-14"
                  >
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--success)]/30 bg-[var(--success)]/15 text-[var(--success)]">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="type-section-title mb-3 text-[var(--foreground)]">
                      WhatsApp message ready
                    </h3>
                    <p className="type-lead mx-auto mb-8 max-w-md">
                      Your project details are prepared. WhatsApp will open only when you choose
                      one of the numbers below.
                    </p>
                    {whatsAppLinks && (
                      <div className="mb-6 flex flex-col justify-center gap-3 sm:flex-row">
                        {whatsAppLinks.map((link) => (
                          <a
                            key={link.phone}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="type-ui inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#20BD5A]"
                          >
                            <MessageSquare className="h-4 w-4" />
                            WhatsApp {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setWhatsAppLinks(null);
                      }}
                      className="type-ui inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--card)] px-5 py-2.5 text-[var(--foreground)] transition-colors hover:bg-[var(--card-soft)]"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="glass rounded-2xl border border-[var(--border)] p-7 md:p-10"
                    noValidate
                  >
                    <div className="mb-7">
                      <p className="type-eyebrow mb-3">Project brief</p>
                      <h2 className="type-panel-title text-[var(--foreground)]">
                        Tell us about your project
                      </h2>
                    </div>

                    <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                      <Field
                        label="Full name"
                        required
                        error={errors.name?.message}
                      >
                        <input
                          {...register("name")}
                          placeholder="Jane Doe"
                          className={inputClass(!!errors.name)}
                        />
                      </Field>
                      <Field
                        label="Email"
                        required
                        error={errors.email?.message}
                      >
                        <input
                          type="email"
                          {...register("email")}
                          placeholder="jane@company.com"
                          className={inputClass(!!errors.email)}
                        />
                      </Field>
                    </div>

                    <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                      <Field label="Phone (optional)">
                        <input
                          {...register("phone")}
                          placeholder="+1 234 567 8900"
                          className={inputClass(false)}
                        />
                      </Field>
                      <Field label="Company">
                        <input
                          {...register("company")}
                          placeholder="Acme Inc."
                          className={inputClass(false)}
                        />
                      </Field>
                    </div>

                    <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                      <Field label="Service of interest">
                        <select {...register("service")} className={inputClass(false)}>
                          <option value="">Select a service...</option>
                          {services.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Estimated budget">
                        <select {...register("budget")} className={inputClass(false)}>
                          <option value="">Select a range...</option>
                          {budgets.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <Field
                      label="Project description"
                      required
                      error={errors.message?.message}
                    >
                      <textarea
                        {...register("message")}
                        rows={5}
                        placeholder="Tell us about your goals, current state, and what you'd like to build..."
                        className={`${inputClass(!!errors.message)} resize-none`}
                      />
                    </Field>

                    <p className="type-body mt-4 text-xs text-[var(--text-muted)]">
                      By submitting, you agree to our{" "}
                      <Link href="/privacy-policy" className="text-[var(--accent)] hover:underline">
                        Privacy Policy
                      </Link>
                      . We&apos;ll never share your information.
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--button-gradient)] px-7 py-3.5 font-semibold text-white shadow-[var(--button-shadow)] transition-all hover:-translate-y-0.5 disabled:opacity-70 sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Preparing...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Prepare WhatsApp message
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="site-section bg-[var(--home-band-bg)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl"
          >
            <div className="mb-10 text-center">
              <p className="type-eyebrow mb-4">FAQ</p>
              <h2 className="type-section-title text-[var(--foreground)]">
                Frequently asked questions
              </h2>
              <p className="type-lead mx-auto mt-3 max-w-xl">
                The questions we hear most often. Don&apos;t see yours? Just ask in your message.
              </p>
            </div>

            <div className="space-y-3">
              {contactFaq.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`glass overflow-hidden rounded-2xl border transition-colors ${
                      isOpen ? "border-[var(--border-strong)]" : "border-[var(--border)]"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-[var(--card-soft)]"
                      aria-expanded={isOpen}
                    >
                      <span className="type-card-title text-base text-[var(--foreground)]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[var(--accent)] transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 type-body text-[var(--text-muted)]">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function buildWhatsAppMessage(data: FormData) {
  const value = (input?: string) => input?.trim() || "-";

  return [
    "New project enquiry from IshSwamiTech website",
    "",
    `Name: ${value(data.name)}`,
    `Email: ${value(data.email)}`,
    `Phone: ${value(data.phone)}`,
    `Company: ${value(data.company)}`,
    `Service: ${value(data.service)}`,
    `Budget: ${value(data.budget)}`,
    "",
    "Project details:",
    value(data.message),
  ].join("\n");
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--text-muted)] backdrop-blur-xl transition-colors focus:outline-none ${
    hasError
      ? "border-red-500/60 focus:border-red-500"
      : "border-[var(--border)] focus:border-[var(--border-strong)]"
  }`;
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="type-ui mb-2 inline-block text-[var(--foreground)]">
        {label}
        {required && <span className="ml-1 text-[var(--secondary)]">*</span>}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 inline-block text-sm text-red-500">{error}</span>
      )}
    </label>
  );
}
