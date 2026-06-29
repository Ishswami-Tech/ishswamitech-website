import { createSign } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const submissionSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10),
});

const spreadsheetId =
  process.env.CONTACT_GOOGLE_SHEET_ID || "1w2JhRg0DNtOEx9AA3vZQS7jcSCwcCg7wjkNM_Lf_eXQ";
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

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = submissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check the form fields and try again." },
      { status: 400 }
    );
  }

  try {
    const row = [
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      parsed.data.name,
      parsed.data.email,
      parsed.data.phone || "",
      parsed.data.company || "",
      parsed.data.service || "",
      parsed.data.budget || "",
      parsed.data.message,
    ];

    if (appsScriptUrl) {
      await appendViaAppsScript(row);
      return NextResponse.json({ message: "Saved to Google Sheet." });
    }

    const accessToken = await getGoogleAccessToken();
    await ensureSheetHeader(accessToken);
    await appendSheetRow(accessToken, row);

    return NextResponse.json({ message: "Saved to Google Sheet." });
  } catch (error) {
    console.error("Failed to save contact submission", error);
    return NextResponse.json(
      { message: "Could not save your message to the spreadsheet. Please try again." },
      { status: 500 }
    );
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
  const header = {
    alg: "RS256",
    typ: "JWT",
  };
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
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
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

async function appendViaAppsScript(row: string[]) {
  if (!appsScriptUrl) return;

  const response = await fetch(appsScriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      headers: spreadsheetHeaders,
      values: row,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Google Apps Script request failed.");
  }
}

async function ensureSheetHeader(accessToken: string) {
  const firstRow = await googleSheetsFetch(
    accessToken,
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      headerRange
    )}`
  );

  if (Array.isArray(firstRow.values) && firstRow.values.length > 0) {
    return;
  }

  await googleSheetsFetch(
    accessToken,
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      headerRange
    )}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      body: JSON.stringify({ values: [spreadsheetHeaders] }),
    }
  );
}

async function appendSheetRow(accessToken: string, row: string[]) {
  await googleSheetsFetch(
    accessToken,
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      appendRange
    )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      body: JSON.stringify({ values: [row] }),
    }
  );
}

async function googleSheetsFetch(
  accessToken: string,
  url: string,
  init: RequestInit = {}
) {
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
