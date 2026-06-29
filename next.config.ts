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
    ];
  },
};

export default nextConfig;
