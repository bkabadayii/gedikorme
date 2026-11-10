import type { Metadata } from "next";
import { htmlLang, locales, type Locale } from "@/lib/i18n/config";
import { localizedPath, type RouteKey } from "@/lib/i18n/routes";

/** Canonical origin of the production site (owner-confirmed). */
export const SITE_URL = "https://gedikorme.com";

/** Hosts allowed to be indexed. Everything else (workers.dev, previews) is noindex. */
export const INDEXABLE_HOSTS = ["gedikorme.com", "www.gedikorme.com"] as const;

export const ogImage = (locale: Locale) => `/og/og-${locale}.png`;

type Slugs = Record<Locale, string>;

/** Path of a route, optionally with a per-locale detail slug. */
export function pathFor(locale: Locale, route: RouteKey, slugs?: Slugs): string {
  const base = localizedPath(locale, route);
  return slugs ? `${base}/${slugs[locale]}` : base;
}

type PageMetaInput = {
  locale: Locale;
  route: RouteKey;
  title?: string;
  description: string;
  slugs?: Slugs;
  /** Keep the page out of search (samples, drafts). */
  noindex?: boolean;
};

/**
 * Title, description, canonical, hreflang alternates and Open Graph for one page.
 * Canonical and alternates are absolute (SITE_URL); the site-wide metadataBase is
 * set in the locale layout.
 */
export function pageMeta({ locale, route, title, description, slugs, noindex }: PageMetaInput): Metadata {
  const url = `${SITE_URL}${pathFor(locale, route, slugs)}`;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[htmlLang[l]] = `${SITE_URL}${pathFor(l, route, slugs)}`;
  languages["x-default"] = `${SITE_URL}${pathFor("tr", route, slugs)}`;
  const other = locales.find((l) => l !== locale)!;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      siteName: "Gedik Örme",
      url,
      title: title ? `${title} · Gedik Örme` : "Gedik Örme",
      description,
      locale: htmlLang[locale].replace("-", "_"),
      alternateLocale: [htmlLang[other].replace("-", "_")],
      images: [{ url: ogImage(locale), width: 1200, height: 630, alt: "Gedik Örme" }],
    },
    twitter: { card: "summary_large_image" },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
