import type { Metadata } from "next";
import PaymentStartClient from "./payment-start-client";
import {
  createPaymentIntentOnServer,
  decodePaymentBridgePayload,
  isPrebuiltPaymentIntent,
  buildFallbackCallbackUrl,
} from "@/lib/payment-bridge.server";

export const metadata: Metadata = {
  title: "Payment",
  description: "Secure payment handoff.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

type SearchParams = Record<string, string | string[] | undefined>;

function getSearchParam(searchParams: SearchParams, key: string): string {
  const value = searchParams[key];
  if (Array.isArray(value)) {
    return value[0] || "";
  }
  return value || "";
}

function renderError(message: string, details: string, fallbackUrl: string) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="max-w-lg rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-left text-sm text-red-200">
        <p className="text-center font-medium">{message}</p>
        {details ? (
          <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-black/30 p-3 text-xs leading-5 text-red-100/90">
            {details}
          </pre>
        ) : null}
        <div className="mt-3 flex justify-center">
          <a
            href={fallbackUrl}
            className="rounded-xl border border-red-400/30 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
          >
            Go back to Viddhakarma
          </a>
        </div>
      </div>
    </div>
  );
}

export default async function PaymentStartPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const payloadParam = getSearchParam(searchParams, "payload");
  const fallbackUrl = buildFallbackCallbackUrl(payloadParam ? `payload=${encodeURIComponent(payloadParam)}` : "");
  const payload = decodePaymentBridgePayload(payloadParam);

  if (!payload) {
    return renderError(
      "Invalid payment payload. Please reopen the payment link.",
      "The payment payload could not be decoded from the URL.",
      fallbackUrl
    );
  }

  if (!payload.clinicId || !payload.appointmentId) {
    return renderError(
      "Payment payload is missing clinic or appointment details.",
      JSON.stringify(payload, null, 2),
      fallbackUrl
    );
  }

  if (Number.isFinite(payload.amount) === false || payload.amount <= 0) {
    return renderError(
      "Payment amount is invalid or missing.",
      JSON.stringify(payload, null, 2),
      fallbackUrl
    );
  }

  const provider = String(payload.provider || "").toLowerCase();

  try {
    const paymentIntent = isPrebuiltPaymentIntent(payload)
      ? payload
      : await createPaymentIntentOnServer(payload, provider);

    return <PaymentStartClient payload={payload} paymentIntent={paymentIntent} />;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment gateway could not be opened.";
    return renderError(message, JSON.stringify(payload, null, 2), fallbackUrl);
  }
}
