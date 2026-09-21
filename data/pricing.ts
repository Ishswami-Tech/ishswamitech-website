import { Brain, Briefcase, Brush, Search, ShieldCheck, Sparkles, Wrench, type LucideIcon } from "lucide-react";

export type BillingMode = "project" | "monthly";

export type Plan = {
  name: string;
  icon: LucideIcon;
  desc: string;
  /** Headline price per billing mode, so the toggle changes real numbers. */
  price: Record<BillingMode, string>;
  timeline: Record<BillingMode, string>;
  features: readonly string[];
  notIncluded: readonly string[];
  cta: string;
  popular: boolean;
};

export const plans: readonly Plan[] = [
  {
    name: "Starter",
    icon: Sparkles,
    desc: "For founders validating an idea or shipping a v1",
    price: { project: "From Rs. 25,000", monthly: "From Rs. 15,000 / mo" },
    timeline: { project: "2 - 4 weeks", monthly: "Rolling, 1-month term" },
    features: [
      "Single-platform web or mobile app",
      "Up to 5 core screens / features",
      "Brand-aware UI implementation",
      "30-day post-launch support",
      "Source code + documentation",
    ],
    notIncluded: ["Multi-platform delivery", "Dedicated team", "Priority SLA"],
    cta: "Get started",
    popular: false,
  },
  {
    name: "Growth",
    icon: Briefcase,
    desc: "For SMBs scaling a product with traction",
    price: { project: "From Rs. 75,000", monthly: "From Rs. 40,000 / mo" },
    timeline: { project: "4 - 12 weeks", monthly: "Rolling, 3-month term" },
    features: [
      "Full-stack custom application",
      "Multi-platform (web + mobile)",
      "Advanced features & integrations",
      "REST / GraphQL API development",
      "Performance & SEO optimisation",
      "60-day post-launch support",
    ],
    notIncluded: ["Dedicated team", "24/7 SLA"],
    cta: "Talk to us",
    popular: true,
  },
  {
    name: "Enterprise",
    icon: ShieldCheck,
    desc: "For organisations with complex needs and SLAs",
    price: { project: "Custom quote", monthly: "Custom quote" },
    timeline: { project: "Scoped per phase", monthly: "Ongoing" },
    features: [
      "Complex enterprise systems",
      "All platforms — web, mobile, desktop",
      "Ongoing retainer with dedicated team",
      "Custom SLA with response targets",
      "Security audit & compliance review",
      "24/7 incident response",
      "Architecture and DevOps consulting",
    ],
    notIncluded: [],
    cta: "Contact Us",
    popular: false,
  },
];

export const addOns: ReadonlyArray<{
  icon: LucideIcon;
  name: string;
  price: string;
  desc: string;
}> = [
  {
    icon: Brush,
    name: "UI/UX Design",
    price: "From Rs. 25,000",
    desc: "Wireframes, prototypes, and a complete brand-aligned visual system.",
  },
  {
    icon: Search,
    name: "SEO Optimisation",
    price: "From Rs. 15,000",
    desc: "Technical SEO audit, schema, page speed, and content recommendations.",
  },
  {
    icon: Wrench,
    name: "Maintenance Retainer",
    price: "From Rs. 15,000 / mo",
    desc: "Bug fixes, security patches, dependency upgrades, and small features.",
  },
  {
    icon: Brain,
    name: "AI Integration",
    price: "From Rs. 50,000",
    desc: "GPT, embeddings, RAG, or custom models added to an existing product.",
  },
];

export const includedAcrossAll: readonly string[] = [
  "Discovery call & written scope",
  "Senior engineering leadership",
  "Weekly demos & shared backlog",
  "Source code & full ownership",
  "Mobile-responsive by default",
  "Production-grade hosting setup",
];
