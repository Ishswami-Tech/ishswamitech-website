import { z } from "zod";

/**
 * Apps allowed to use the payment bridge through the generic `/pay/*` routes.
 * Configured with the server-only `PAYMENT_BRIDGE_APPS` env var (JSON object keyed by appId).
 * Viddhakarma keeps using the legacy `/payments/*` routes and is not part of this registry.
 */

export const RESERVED_APP_IDS: ReadonlySet<string> = new Set(["viddhakarma"]);

const APP_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{1,31}$/;
const MIN_SECRET_LENGTH = 32;

export interface PaymentApp {
  readonly appId: string;
  readonly name: string;
  /** Where the user lands after payment. Result params are appended to it. */
  readonly returnUrl: string;
  /** Server-to-server endpoint on the app's backend that confirms an order's status. */
  readonly verifyUrl: string;
  /** Shared HMAC secret. Never sent to the browser. */
  readonly secret: string;
}

export type PaymentAppRegistry = Readonly<Record<string, PaymentApp>>;

function isSecureOrLocalhost(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol === "https:") {
      return true;
    }
    return url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1");
  } catch {
    return false;
  }
}

const secureUrl = z.string().refine(isSecureOrLocalhost, "must be an https URL (http only for localhost)");

const appConfigSchema = z.object({
  name: z.string().min(1).max(80),
  returnUrl: secureUrl,
  verifyUrl: secureUrl,
  secret: z.string().min(MIN_SECRET_LENGTH, `secret must be at least ${MIN_SECRET_LENGTH} characters`),
});

function describeIssues(error: z.ZodError): string {
  return error.issues.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`).join("; ");
}

export function parseAppRegistry(raw: string | undefined): PaymentAppRegistry {
  if (!raw || !raw.trim()) {
    return {};
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("PAYMENT_BRIDGE_APPS is not valid JSON.");
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("PAYMENT_BRIDGE_APPS must be a JSON object keyed by appId.");
  }

  const registry: Record<string, PaymentApp> = {};
  for (const [appId, config] of Object.entries(parsed)) {
    if (RESERVED_APP_IDS.has(appId)) {
      throw new Error(`PAYMENT_BRIDGE_APPS: "${appId}" is reserved for the legacy payment routes.`);
    }
    if (!APP_ID_PATTERN.test(appId)) {
      throw new Error(`PAYMENT_BRIDGE_APPS: invalid appId "${appId}" (use lowercase letters, digits, - or _).`);
    }
    const result = appConfigSchema.safeParse(config);
    if (!result.success) {
      throw new Error(`PAYMENT_BRIDGE_APPS: app "${appId}" is invalid — ${describeIssues(result.error)}`);
    }
    registry[appId] = { appId, ...result.data };
  }

  return registry;
}

let cachedRegistry: { raw: string | undefined; registry: PaymentAppRegistry } | undefined;

/** Server-only accessor; re-parses only when the env value changes. */
export function getAppRegistry(): PaymentAppRegistry {
  const raw = process.env.PAYMENT_BRIDGE_APPS;
  if (!cachedRegistry || cachedRegistry.raw !== raw) {
    cachedRegistry = { raw, registry: parseAppRegistry(raw) };
  }
  return cachedRegistry.registry;
}
