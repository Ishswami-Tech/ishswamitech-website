import type { Metadata } from "next";
import PaymentCallbackClient from "./payment-callback-client";

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

export default function PaymentCallbackPage({
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

  return <PaymentCallbackClient queryString={normalizedSearchParams.toString()} />;
}
