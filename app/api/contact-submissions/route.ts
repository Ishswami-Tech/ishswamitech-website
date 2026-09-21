import { createSign } from "node:crypto";
import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/contact-schema";
import { formatDateTimeInIST } from "@/lib/utils/date-time";

export const runtime = "nodejs";

const spreadsheetId = process.env.CONTACT_GOOGLE_SHEET_ID;
const appendRange = process.env.CONTACT_GOOGLE_SHEET_RANGE || "A:H";
const headerRange = process.env.CONTACT_GOOGLE_SHEET_HEADER_RANGE || "A1:H1";
const appsScriptUrl = process.env.CONTACT_GOOGLE_APPS_SCRIPT_URL;

const spreadsheetHeaders = [
  "Submitted At",
  "Name",
  "Email",
  "Phone",
  "Company",
  "Service",
  "Budget",
  "Message",
];

const GENERIC_ERROR = "We couldn't send your message right now. Please try again shortly.";

/**
 * Best-effort in-process rate limit. Serverless instances don't share memory,
 * so this throttles bursts from a single instance rather than acting as a hard
 * global guarantee; move to a shared store if abuse becomes a problem.
 */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const submissionLog = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (submissionLog.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    submissionLog.set(key, recent);
    return true;
  }

  recent.push(now);
  submissionLog.set(key, recent);

  // Opportunistic cleanup so the map can't grow without bound.
  if (submissionLog.size > 5000) {
    for (const [entryKey, timestamps] of submissionLog) {
      if (timestamps.every((timestamp) => now - timestamp >= RATE_LIMIT_WINDOW_MS)) {
        submissionLog.delete(entryKey);
      }
    }
  }

  return false;
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  if (isRateLimited(clientKey(request))) {
    return NextResponse.json(
      { message: "Too many submissions. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check the form fields and try again." },
      { status: 400 }
    );
  }

  // Honeypot tripped. Report success so bots don't learn they were filtered.
  if (parsed.data.website) {
    return NextResponse.json({ message: "Message received." });
  }

  if (!appsScriptUrl && !spreadsheetId) {
    console.error(
      "Contact submissions are not configured: set CONTACT_GOOGLE_APPS_SCRIPT_URL, or CONTACT_GOOGLE_SHEET_ID with service account credentials."
    );
    return NextResponse.json({ message: GENERIC_ERROR }, { status: 500 });
  }

  try {
    const row = [
      formatDateTimeInIST(new Date()),
      parsed.data.name,
      parsed.data.email,
      parsed.data.phone || "",
      parsed.data.company || "",
      parsed.data.service || "",
      parsed.data.budget || "",
      parsed.data.message,
    ];

    if (appsScriptUrl) {
      await appendViaAppsScript(appsScriptUrl, row);
      return NextResponse.json({ message: "Message received." });
    }

    const accessToken = await getGoogleAccessToken();
    await ensureSheetHeader(accessToken, spreadsheetId!);
    await appendSheetRow(accessToken, spreadsheetId!, row);

    return NextResponse.json({ message: "Message received." });
  } catch (error) {
    // Logged server-side only; upstream errors can contain account details.
    console.error("Failed to save contact submission", error);
    return NextResponse.json({ message: GENERIC_ERROR }, { status: 500 });
  }
}

async function getGoogleAccessToken() {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!serviceAccountEmail || !privateKey) {
    throw new Error(
      "Missing Google Sheets access. Set CONTACT_GOOGLE_APPS_SCRIPT_URL or Google service account credentials."
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: serviceAccountEmail,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const unsignedToken = `${toBase64Url(JSON.stringify(header))}.${toBase64Url(
    JSON.stringify(claim)
  )}`;
  const signature = createSign("RSA-SHA256").update(unsignedToken).sign(privateKey, "base64url");
  const assertion = `${unsignedToken}.${signature}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.access_token) {
    throw new Error(result?.error_description || "Could not authenticate with Google.");
  }

  return result.access_token as string;
}

async function appendViaAppsScript(url: string, row: string[]) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ headers: spreadsheetHeaders, values: row }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Google Apps Script request failed.");
  }
}

async function ensureSheetHeader(accessToken: string, sheetId: string) {
  const firstRow = await googleSheetsFetch(
    accessToken,
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
      headerRange
    )}`
  );

  if (Array.isArray(firstRow.values) && firstRow.values.length > 0) return;

  await googleSheetsFetch(
    accessToken,
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
      headerRange
    )}?valueInputOption=USER_ENTERED`,
    { method: "PUT", body: JSON.stringify({ values: [spreadsheetHeaders] }) }
  );
}

async function appendSheetRow(accessToken: string, sheetId: string, row: string[]) {
  await googleSheetsFetch(
    accessToken,
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
      appendRange
    )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    { method: "POST", body: JSON.stringify({ values: [row] }) }
  );
}

async function googleSheetsFetch(accessToken: string, url: string, init: RequestInit = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...init.headers,
    },
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.error?.message || "Google Sheets request failed.");
  }

  return result;
}

function toBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}
