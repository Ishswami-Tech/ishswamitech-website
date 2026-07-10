"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

const HIDDEN_PREFIXES = ["/payments", "/payment"];

function shouldHideChrome(pathname: string): boolean {
  return HIDDEN_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export default function RouteChrome() {
  const pathname = usePathname();
  const hideChrome = shouldHideChrome(pathname);

  if (hideChrome) return null;

  return (
    <>
      <Navbar />
      <CookieConsent />
    </>
  );
}

export function FooterChrome() {
  const pathname = usePathname();
  if (shouldHideChrome(pathname)) return null;
  return <Footer />;
}
