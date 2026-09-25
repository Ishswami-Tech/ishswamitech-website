import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f9fe",
    theme_color: "#f7f9fe",
    icons: [
      {
        src: "/icon.svg",
        sizes: "1024x1024",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "1024x1024",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
