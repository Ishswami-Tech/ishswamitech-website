import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/portfolio", destination: "/blog", permanent: true },
      {
        source: "/portfolio/:slug",
        destination: "/blog/case-study-:slug",
        permanent: true,
      },
      { source: "/careers", destination: "/blog", permanent: true },
      // The pricing page is gone, but it was in the sitemap and the nav for
      // long enough to be indexed and linked. Sending it to contact keeps the
      // intent — someone asking what this costs — instead of a 404.
      { source: "/pricing", destination: "/contact", permanent: true },
      // Retired legal URLs. Each policy now lives at exactly one canonical
      // path so the content cannot drift between two pages again.
      { source: "/terms-of-service", destination: "/terms-and-conditions", permanent: true },
      { source: "/refund-policy", destination: "/refund-cancellation", permanent: true },
    ];
  },
};

export default nextConfig;
