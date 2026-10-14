import { createDecipheriv, createHash } from "node:crypto";
import type { PaymentApp } from "./app-registry.ts";

/**
 * Optional branding / prefill helpers for the generic `/pay/*` bridge.
 * Everything here is best-effort: any invalid input is ignored, never thrown, and never logged.
 */

export const MAX_DISPLAY_NAME = 60;
export const MAX_LOGO_URL = 300;
export const MAX_NOTE = 140;
const MAX_CUSTOMER_FIELD = 120;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_PATTERN = /^\+?\d{8,15}$/;

export interface BridgeCustomer {
  readonly name?: string;
  readonly email?: string;
  readonly contact?: string;
}

export interface BridgeBranding {
  readonly name: string;
  readonly image?: string;
  readonly note?: string;
}

function decodeFixed(value: string, length: number): Buffer | null {
  const buf = Buffer.from(value, "base64url");
  return buf.length === length ? buf : null;
}

function cleanString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength ? trimmed : undefined;
}

function decryptToText(secret: string, value: string): string | null {
  const parts = value.trim().split(".");
  if (parts.length !== 3) {
    return null;
  }
  const iv = decodeFixed(parts[0], 12);
  const tag = decodeFixed(parts[1], 16);
  if (!iv || !tag || !parts[2]) {
    return null;
  }
  const key = createHash("sha256").update(`bridge-prefill:v1:${secret}`, "utf8").digest();
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(Buffer.from(parts[2], "base64url")), decipher.final()]).toString("utf8");
}

/** Decrypts and validates `customerEnc`. Returns null on any failure or when no field is usable. */
export function decryptBridgeCustomer(secret: string, value: unknown): BridgeCustomer | null {
  if (typeof value !== "string" || !value || !secret) {
    return null;
  }

  let parsed: unknown;
  try {
    const text = decryptToText(secret, value);
    if (text === null) {
      return null;
    }
    parsed = JSON.parse(text);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return null;
  }
  const raw = parsed as Record<string, unknown>;

  const name = cleanString(raw.name, MAX_CUSTOMER_FIELD);
  const emailCandidate = cleanString(raw.email, MAX_CUSTOMER_FIELD);
  const email = emailCandidate && EMAIL_PATTERN.test(emailCandidate) ? emailCandidate : undefined;
  const contactCandidate = cleanString(raw.contact, MAX_CUSTOMER_FIELD);
  const contact = contactCandidate && CONTACT_PATTERN.test(contactCandidate) ? contactCandidate : undefined;

  const customer: BridgeCustomer = {
    ...(name ? { name } : {}),
    ...(email ? { email } : {}),
    ...(contact ? { contact } : {}),
  };
  return Object.keys(customer).length > 0 ? customer : null;
}

function safeLogo(app: PaymentApp, value: unknown): string | undefined {
  if (typeof value !== "string" || value.length === 0 || value.length > MAX_LOGO_URL) {
    return undefined;
  }
  try {
    const url = new URL(value);
    const allowedHost = new URL(app.returnUrl).hostname.toLowerCase();
    return url.protocol === "https:" && url.hostname.toLowerCase() === allowedHost ? value : undefined;
  } catch {
    return undefined;
  }
}

/** Validates the optional branding fields of a verified token payload. */
export function sanitizeBranding(
  app: PaymentApp,
  payload: { readonly displayName?: unknown; readonly logoUrl?: unknown; readonly note?: unknown },
): BridgeBranding {
  const name = cleanString(payload.displayName, MAX_DISPLAY_NAME) ?? app.name;
  const image = safeLogo(app, payload.logoUrl);
  const note = cleanString(payload.note, MAX_NOTE);
  return { name, ...(image ? { image } : {}), ...(note ? { note } : {}) };
}
