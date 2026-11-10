import { headers } from "next/headers";
import type { MetadataRoute } from "next";
import { INDEXABLE_HOSTS, SITE_URL } from "@/lib/seo";

/** Only the production hostname is crawlable; workers.dev and previews are disallowed. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = ((await headers()).get("host") ?? "").toLowerCase().replace(/:\d+$/, "");
  if (!(INDEXABLE_HOSTS as readonly string[]).includes(host)) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
