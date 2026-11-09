import type { NextConfig } from "next";
import { legacyRedirects, localizedRedirects, localizedRewrites } from "./src/lib/i18n/routes";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/", destination: "/tr", permanent: false },
      ...legacyRedirects(),
      ...localizedRedirects(),
    ];
  },
  async rewrites() {
    return localizedRewrites();
  },
};

export default nextConfig;
