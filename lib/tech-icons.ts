import type { IconType } from "react-icons";
import {
  SiAngular,
  SiCypress,
  SiDocker,
  SiDotnet,
  SiElectron,
  SiFastapi,
  SiFigma,
  SiFirebase,
  SiFlutter,
  SiGooglecloud,
  SiJest,
  SiKotlin,
  SiKubernetes,
  SiLangchain,
  SiLaravel,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiOpenjdk,
  SiOwasp,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiQt,
  SiReact,
  SiRedis,
  SiSelenium,
  SiSharp,
  SiShopify,
  SiStripe,
  SiSwift,
  SiTensorflow,
  SiTypescript,
  SiVuedotjs,
  SiWoocommerce,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { TbBrandAdobeXd, TbBrandAzure } from "react-icons/tb";

/**
 * Brand mark for a technology, keyed by the exact string the data files use.
 *
 * One registry rather than a list per surface: the marquee used to carry its
 * own icon array while every other mention of the same technology rendered as
 * bare text, so "React" had a logo in one band and none in the card directly
 * below it.
 *
 * Marks render in `currentColor`, not brand colours. Forty brand palettes on a
 * navy page fights the accent system the cards already use, and several of
 * these logos are illegible at 14px in their own colour anyway.
 *
 * Simple Icons has dropped some marks over trademark complaints — Azure and
 * Adobe XD come from Tabler instead, and Principle has no mark in any bundled
 * pack. `techIcon` returning undefined is a supported outcome: call sites fall
 * back to text, which is why nothing here is asserted to exist.
 */
const icons: Readonly<Record<string, IconType>> = {
  // Frontend
  React: SiReact,
  "Next.js": SiNextdotjs,
  Vue: SiVuedotjs,
  Angular: SiAngular,
  TypeScript: SiTypescript,
  // Backend
  "Node.js": SiNodedotjs,
  Python: SiPython,
  PHP: SiPhp,
  Laravel: SiLaravel,
  FastAPI: SiFastapi,
  Java: SiOpenjdk,
  "C#": SiSharp,
  ".NET": SiDotnet,
  Qt: SiQt,
  // Mobile & desktop
  Flutter: SiFlutter,
  "React Native": SiReact,
  Swift: SiSwift,
  Kotlin: SiKotlin,
  Electron: SiElectron,
  // Data
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  Firebase: SiFirebase,
  Redis: SiRedis,
  // Cloud & ops
  AWS: FaAws,
  Azure: TbBrandAzure,
  GCP: SiGooglecloud,
  Docker: SiDocker,
  Kubernetes: SiKubernetes,
  // AI
  TensorFlow: SiTensorflow,
  PyTorch: SiPytorch,
  OpenAI: SiOpenai,
  LangChain: SiLangchain,
  // Design
  Figma: SiFigma,
  "Adobe XD": TbBrandAdobeXd,
  // Quality & security
  OWASP: SiOwasp,
  Jest: SiJest,
  Cypress: SiCypress,
  Selenium: SiSelenium,
  // Commerce
  Shopify: SiShopify,
  WooCommerce: SiWoocommerce,
  Stripe: SiStripe,
};

/** The mark for a technology, or undefined when none is bundled for it. */
export function techIcon(name: string): IconType | undefined {
  return icons[name];
}

/** Names that carry a mark, in registry order. Used to build the marquee. */
export const techWithIcons: ReadonlyArray<{ name: string; icon: IconType }> = Object.entries(
  icons
).map(([name, icon]) => ({ name, icon }));
