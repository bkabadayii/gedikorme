import type { MetadataRoute } from "next";
import { listFabrics } from "@/content/catalog/repository";
import { htmlLang, locales } from "@/lib/i18n/config";
import type { RouteKey } from "@/lib/i18n/routes";
import { pathFor, SITE_URL } from "@/lib/seo";

// The draft privacy notice is noindex and stays out until the owner approves it.
const pages: RouteKey[] = ["home", "fabrics", "production", "about", "contact", "requestQuote"];

const alternates = (path: (l: (typeof locales)[number]) => string) => ({
  languages: {
    ...Object.fromEntries(locales.map((l) => [htmlLang[l], `${SITE_URL}${path(l)}`])),
    "x-default": `${SITE_URL}${path("tr")}`,
  },
});

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const route of pages) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}${pathFor(locale, route)}`,
        alternates: alternates((l) => pathFor(l, route)),
      });
    }
  }
  // Sample fabrics are noindex, so only verified ones are listed.
  for (const f of listFabrics().filter((x) => x.status === "verified")) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}${pathFor(locale, "fabrics", f.slug)}`,
        alternates: alternates((l) => pathFor(l, "fabrics", f.slug)),
      });
    }
  }
  return entries;
}
