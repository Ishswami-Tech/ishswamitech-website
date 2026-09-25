import type { Metadata } from "next";
import PaymentStartClient from "./payment-start-client";
import {
  createPaymentIntentOnServer,
  decodePaymentBridgePayload,
  hasExistingGatewayOrder,
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

  if (
    !payload ||
    !payload.clinicId ||
    !Number.isFinite(payload.amount) ||
    payload.amount <= 0 ||
    (!payload.appointmentId && !payload.subscriptionId && !payload.invoiceId && !payload.prescriptionId)
  ) {
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
  if (isPrebuiltPaymentIntent(payload)) {
    paymentIntent = payload;
  } else if (!hasExistingGatewayOrder(payload)) {
    // Only create an order when the backend has not already created one;
    // otherwise the client shows an error instead of opening a duplicate order.
    try {
      paymentIntent = await createPaymentIntentOnServer(payload, provider);
    } catch {
      paymentIntent = null;
    }
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
