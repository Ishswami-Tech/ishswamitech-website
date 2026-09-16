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

export default async function PaymentStartPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const payloadParam = getSearchParam(searchParams, "payload");
  const fallbackUrl = buildFallbackCallbackUrl(
    payloadParam ? `payload=${encodeURIComponent(payloadParam)}` : "",
  );
  const invalidPayloadFallbackUrl = buildFallbackCallbackUrl(
    "paymentError=invalid_payload&paymentVerified=0",
  );
  const payload = decodePaymentBridgePayload(payloadParam);

  if (!payload || !payload.clinicId || !payload.appointmentId || Number.isFinite(payload.amount) === false || payload.amount <= 0) {
    return (
      <PaymentStartClient
        payload={null}
        paymentIntent={null}
        initialRawPayload={payloadParam}
        fallbackUrl={invalidPayloadFallbackUrl}
      />
    );
  }

  const provider = String(payload.provider || "").toLowerCase() || undefined;

  let paymentIntent: Record<string, unknown> | null = null;
  try {
    paymentIntent = isPrebuiltPaymentIntent(payload)
      ? payload
      : await createPaymentIntentOnServer(payload, provider);
  } catch {
    paymentIntent = null;
  }

  return (
    <PaymentStartClient
      payload={payload}
      paymentIntent={paymentIntent}
      initialRawPayload={payloadParam}
      fallbackUrl={fallbackUrl}
    />
  );
}
