import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAppRegistry, type PaymentApp } from "@/lib/bridge/app-registry";
import { buildReturnUrl, verifyPaymentWithApp } from "@/lib/bridge/verify-client";

export const metadata: Metadata = {
  title: "Payment",
  description: "Verifying payment.",
  robots: { index: false, follow: false, noarchive: true },
};

type SearchParams = Record<string, string | string[] | undefined>;

const SAFE_ID = /^[\w.-]{1,128}$/;
const PROVIDERS = new Set(["razorpay", "cashfree", "phonepe"]);

function firstValue(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) || "";
}

function CallbackError({ message }: { message: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <p className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-center text-sm font-medium text-[var(--danger)]">
        {message}
      </p>
    </div>
  );
}

function findApp(appId: string): PaymentApp | null {
  const registry = getAppRegistry();
  return Object.hasOwn(registry, appId) ? registry[appId] : null;
}

export default async function PayCallbackPage(props: { searchParams: Promise<SearchParams> }) {
  const query = await props.searchParams;
  const appId = firstValue(query.appId);
  const orderId = firstValue(query.orderId);
  const paymentId = firstValue(query.paymentId);
  const razorpaySignature = firstValue(query.razorpaySignature);
  const rawProvider = firstValue(query.provider).toLowerCase();
  const provider = PROVIDERS.has(rawProvider) ? rawProvider : undefined;
  const mode = firstValue(query.mode) === "subscription" ? "subscription" : undefined;

  let app: PaymentApp | null;
  try {
    app = findApp(appId);
  } catch (error) {
    console.error("[payment-bridge] app registry is misconfigured:", error);
    return <CallbackError message="Payments are temporarily unavailable. Please try again later." />;
  }

  if (!app || !SAFE_ID.test(orderId) || (paymentId && !SAFE_ID.test(paymentId))) {
    return <CallbackError message="This payment link is invalid. Please return to the app and check your order." />;
  }

  const { success } = await verifyPaymentWithApp(app, {
    orderId,
    ...(paymentId ? { paymentId } : {}),
    ...(provider ? { provider } : {}),
    ...(razorpaySignature ? { razorpaySignature } : {}),
    ...(mode ? { mode } : {}),
  });

  redirect(
    buildReturnUrl(app, {
      status: success ? "SUCCESS" : "FAILED",
      orderId,
      paymentId: paymentId || undefined,
      provider,
    }),
  );
}
