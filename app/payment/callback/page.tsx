import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  buildFallbackCallbackUrl,
  buildViddhakarmaRedirectUrl,
  verifyPaymentCallbackOnServer,
} from "@/lib/payment-bridge.server";

export const metadata: Metadata = {
  title: "Payment",
  description: "Verifying payment.",
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

export default async function PaymentCallbackPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const normalizedSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      const firstValue = value[0];
      if (firstValue) {
        normalizedSearchParams.set(key, firstValue);
      }
      continue;
    }

    if (value) {
      normalizedSearchParams.set(key, value);
    }
  }

  const clinicId = getSearchParam(searchParams, "clinicId");
  const orderId = getSearchParam(searchParams, "orderId");
  const paymentId = getSearchParam(searchParams, "paymentId") || orderId;
  const provider = getSearchParam(searchParams, "provider") || "cashfree";
  const appointmentId = getSearchParam(searchParams, "appointmentId");
  const appointmentType = getSearchParam(searchParams, "appointmentType");
  const handoffToken = getSearchParam(searchParams, "handoff_token");
  const queryString = normalizedSearchParams.toString();
  const verifiedQueryString = queryString ? `${queryString}&paymentVerified=1` : "paymentVerified=1";
  const failedQueryString = queryString ? `${queryString}&paymentVerified=0` : "paymentVerified=0";

  try {
    const response = await verifyPaymentCallbackOnServer({
      clinicId,
      orderId,
      paymentId,
      provider,
      handoffToken,
    });

    if (handoffToken) {
      if (response.success) {
        redirect(
          buildViddhakarmaRedirectUrl({
            appointmentType: response.appointmentType || appointmentType,
            appointmentId: response.appointmentId || appointmentId,
            orderId: response.orderId || orderId,
            paymentId: response.paymentId || paymentId,
            provider: response.provider || provider,
            clinicId: response.clinicId || clinicId,
            paymentVerified: "1",
          })
        );
      }

      redirect(buildFallbackCallbackUrl(failedQueryString));
    }

    redirect(buildFallbackCallbackUrl(verifiedQueryString));
  } catch {
    redirect(buildFallbackCallbackUrl(failedQueryString));
  }
}
