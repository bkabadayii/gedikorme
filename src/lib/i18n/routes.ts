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
  privacy: { tr: "gizlilik", en: "privacy" },
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
  privacy: "privacy",
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

/**
 * Same page in another language. `/tr/kumaslar/suprem` -> `/en/fabrics/<english slug>`.
 * `mapSlug` translates a detail slug; without it, or when it cannot, the section index is used.
 * Unknown paths fall back to the other language's home.
 */
export function switchLocalePath(
  pathname: string,
  to: Locale,
  mapSlug?: (route: RouteKey, slug: string, from: Locale, to: Locale) => string | undefined,
): string {
  const [, from, segment, slug] = pathname.split("/");
  if (!(locales as readonly string[]).includes(from)) return localizedPath(to, "home");
  if (!segment) return localizedPath(to, "home");
  const route = nested.find((k) => routeSegments[k][from as Locale] === segment || folders[k] === segment);
  if (!route) return localizedPath(to, "home");
  const base = localizedPath(to, route);
  if (!slug) return base;
  const mapped = mapSlug?.(route, slug, from as Locale, to);
  return mapped ? `${base}/${mapped}` : base;
}
