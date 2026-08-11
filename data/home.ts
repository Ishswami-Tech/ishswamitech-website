import {
  Code,
  Focus,
  Layers,
  Layout,
  Lock,
  Rocket,
  Search,
  ShieldCheck,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type Differentiator = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const differentiators: readonly Differentiator[] = [
  {
    icon: Rocket,
    title: "Outcome-focused delivery",
    description:
      "Product and engineering ownership from discovery to launch — not ticket-takers waiting for direction.",
  },
  {
    icon: Search,
    title: "Search-ready foundation",
    description:
      "Performant pages, semantic structure, and conversion-aware UX baked into every build, so growth doesn't require a rewrite.",
  },
  {
    icon: ShieldCheck,
    title: "Scalable architecture",
    description:
      "Modern, well-typed stacks and clean systems built for integrations, growth, and the features you will ship next.",
  },
];

export type DeliveryStep = {
  phase: string;
  icon: LucideIcon;
  title: string;
  detail: string;
};

export const deliverySteps: readonly DeliveryStep[] = [
  {
    phase: "Week 1",
    icon: Search,
    title: "Discover",
    detail:
      "Align on business goals, users, success metrics, and technical constraints before any code is written.",
  },
  {
    phase: "Week 2",
    icon: Layout,
    title: "Blueprint",
    detail:
      "Define the roadmap, interface direction, system architecture, and delivery milestones you can plan around.",
  },
  {
    phase: "Week 3+",
    icon: Code,
    title: "Build",
    detail:
      "Ship iteratively across design, engineering, and QA — with weekly demos so progress is visible from day one.",
  },
  {
    phase: "Launch",
    icon: Rocket,
    title: "Scale",
    detail:
      "Deploy with confidence: SEO checks, analytics, performance audits, and a support plan that actually responds.",
  },
];

export const industries: readonly string[] = [
  "SaaS & platforms",
  "Fintech",
  "Healthtech",
  "E-commerce",
  "EdTech",
  "Logistics",
  "Real estate",
  "Media & creator",
];

export type HeroHighlight = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const heroHighlights: readonly HeroHighlight[] = [
  {
    icon: Focus,
    title: "Brand-first visual systems",
    description: "Interfaces that look beautiful and build trust instantly.",
  },
  {
    icon: TrendingUp,
    title: "SEO-aware implementation",
    description: "Built to rank, structured to drive organic growth.",
  },
  {
    icon: Layers,
    title: "Full-stack under one roof",
    description: "From idea to infrastructure, we handle it all.",
  },
  {
    icon: Lock,
    title: "Secure by default",
    description: "Security best practices built into every layer.",
  },
  {
    icon: Zap,
    title: "Fast, scalable architecture",
    description: "Systems built to scale with your ambition.",
  },
];

export const engagementIncludes: readonly string[] = [
  "Conversion-aware interface design",
  "Semantic, crawlable page structure",
  "Performance-minded media decisions",
  "Launch support with analytics ready",
];

export type StatItem = {
  value: string;
  /** Set when the value is a count worth animating; years stay static. */
  count?: number;
  suffix?: string;
  label: string;
};

export const companyStats: readonly StatItem[] = [
  { value: "2026", label: "Registered in Pune" },
  { value: "10", count: 10, suffix: "", label: "Core service areas" },
  { value: "4", count: 4, suffix: "", label: "Platforms covered" },
  { value: "24h", label: "Response window" },
];

export const stackGroups: ReadonlyArray<{ label: string; techs: readonly string[] }> = [
  { label: "Frontend", techs: ["React", "Next.js", "Vue", "TypeScript"] },
  { label: "Backend", techs: ["Node.js", "Python", "Laravel", "FastAPI"] },
  { label: "Mobile", techs: ["Flutter", "React Native", "Swift", "Kotlin"] },
  { label: "Database", techs: ["PostgreSQL", "MongoDB", "Firebase", "Redis"] },
  { label: "Cloud / Ops", techs: ["AWS", "Azure", "GCP", "Docker"] },
  { label: "AI / ML", techs: ["TensorFlow", "PyTorch", "OpenAI"] },
];
