import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { legalDocuments } from "@/lib/legal/policy-content";
import { createPageMetadata } from "@/lib/site";

const doc = legalDocuments["privacy-policy"];

export const metadata: Metadata = createPageMetadata({
  title: doc.metaTitle,
  description: doc.metaDescription,
  path: `/${doc.slug}`,
});

export default function PrivacyPolicyPage() {
  return <LegalPage slug="privacy-policy" />;
}
