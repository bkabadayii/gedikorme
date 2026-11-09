import { locales, type Locale } from "./config";

/**
 * Typed map of localized URL segments. Folder names under src/app/[locale]
 * are the canonical (English) keys; Turkish URLs are rewritten to them in
 * next.config.ts, so the same mapping drives routing, links and hreflang.
 */
export const routeSegments = {
  home: { tr: "", en: "" },
  fabrics: { tr: "kumaslar", en: "fabrics" },
  production: { tr: "uretim", en: "production" },
  about: { tr: "hakkimizda", en: "about" },
  contact: { tr: "iletisim", en: "contact" },
  requestQuote: { tr: "teklif-iste", en: "request-quote" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routeSegments;

/** Internal app-directory folder for each route key. */
const folders: Record<RouteKey, string> = {
  home: "",
  fabrics: "fabrics",
  production: "production",
  about: "about",
  contact: "contact",
  requestQuote: "request-quote",
};

export function localizedPath(locale: Locale, route: RouteKey): string {
  const segment = routeSegments[route][locale];
  return segment ? `/${locale}/${segment}` : `/${locale}`;
}

const nested = (Object.keys(routeSegments) as RouteKey[]).filter((k) => k !== "home");

/** `/tr/kumaslar` -> internal `/tr/fabrics` (and nested paths such as slugs). */
export function localizedRewrites() {
  return locales.flatMap((locale) =>
    nested
      .filter((k) => routeSegments[k][locale] !== folders[k])
      .flatMap((k) => [
        {
          source: `/${locale}/${routeSegments[k][locale]}`,
          destination: `/${locale}/${folders[k]}`,
        },
        {
          source: `/${locale}/${routeSegments[k][locale]}/:path*`,
          destination: `/${locale}/${folders[k]}/:path*`,
        },
      ]),
  );
}

/** Internal folder names and wrong-locale segments redirect to the canonical URL. */
export function localizedRedirects() {
  const out: { source: string; destination: string; permanent: boolean }[] = [];
  for (const locale of locales) {
    for (const k of nested) {
      const canonical = routeSegments[k][locale];
      const other = locales.filter((l) => l !== locale).map((l) => routeSegments[k][l]);
      for (const wrong of new Set([folders[k], ...other])) {
        if (wrong === canonical) continue;
        out.push({
          source: `/${locale}/${wrong}`,
          destination: `/${locale}/${canonical}`,
          permanent: true,
        });
        out.push({
          source: `/${locale}/${wrong}/:path*`,
          destination: `/${locale}/${canonical}/:path*`,
          permanent: true,
        });
      }
    }
  }
  return out;
}

/** Old gedikorme.com URLs -> new Turkish routes (plan §7). */
export function legacyRedirects() {
  return [
    { source: "/hakkimizda", destination: "/tr/hakkimizda", permanent: true },
    { source: "/galeri", destination: "/tr/kumaslar", permanent: true },
    { source: "/iletisim", destination: "/tr/iletisim", permanent: true },
  ];
}
