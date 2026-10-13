import type { Metadata } from "next";
import { getAppRegistry } from "@/lib/bridge/app-registry";
import { verifyBridgeToken } from "@/lib/bridge/token";
import { buildReturnUrl } from "@/lib/bridge/verify-client";
import PayStartClient from "./pay-start-client";

export const metadata: Metadata = {
  title: "Payment",
  description: "Secure payment handoff.",
  robots: { index: false, follow: false, noarchive: true },
};

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) || "";
}

function InvalidLink({ message }: { message: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <p className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-center text-sm font-medium text-[var(--danger)]">
        {message}
      </p>
    </div>
  );
}

export default async function PayStartPage(props: { searchParams: Promise<SearchParams> }) {
  const token = firstValue((await props.searchParams).token);

  let result: ReturnType<typeof verifyBridgeToken>;
  try {
    result = verifyBridgeToken(token, getAppRegistry());
  } catch (error) {
    console.error("[payment-bridge] app registry is misconfigured:", error);
    return <InvalidLink message="Payments are temporarily unavailable. Please try again later." />;
  }

  if (!result.ok) {
    const message =
      result.reason === "expired"
        ? "This payment link has expired. Please go back to the app and try again."
        : "This payment link is invalid. Please go back to the app and try again.";
    return <InvalidLink message={message} />;
  }

  const { payload, app } = result;

  return (
    <PayStartClient
      appName={app.name}
      payment={{
        provider: payload.provider,
        orderId: payload.orderId,
        amount: payload.amount,
        currency: payload.currency,
        description: payload.description,
        displayAmount: payload.displayAmount,
        paymentSessionId: payload.paymentSessionId,
        razorpayKeyId: payload.razorpayKeyId,
        razorpayMode: payload.razorpayMode,
        gatewayRedirectUrl: payload.gatewayRedirectUrl,
      }}
      appId={app.appId}
      cancelUrl={buildReturnUrl(app, {
        status: "CANCELLED",
        orderId: payload.orderId,
        provider: payload.provider,
      })}
      failureUrl={buildReturnUrl(app, {
        status: "FAILED",
        orderId: payload.orderId,
        provider: payload.provider,
      })}
    />
  );
}
