import type { Metadata } from "next";
import PaymentStartClient from "./payment-start-client";

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

export default function PaymentStartPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const payloadParam = Array.isArray(searchParams.payload)
    ? searchParams.payload[0] || ""
    : searchParams.payload || "";

  return <PaymentStartClient payloadParam={payloadParam} />;
}
