import Link from "next/link";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath, type RouteKey } from "@/lib/i18n/routes";

const items: { route: RouteKey; label: "fabrics" | "production" | "about" | "contact" }[] = [
  { route: "fabrics", label: "fabrics" },
  { route: "production", label: "production" },
  { route: "about", label: "about" },
  { route: "contact", label: "contact" },
];

/** Phase 0 shell header; the bespoke editorial header lands in Phase 1. */
export function SiteHeader({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);
  const other: Locale = locale === "tr" ? "en" : "tr";

  return (
    <header className="border-b border-line">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-4 py-4"
      >
        <Link href={localizedPath(locale, "home")} className="font-display text-xl">
          {copy.meta.siteName}
        </Link>
        <ul className="flex flex-wrap gap-x-6 text-sm">
          {items.map(({ route, label }) => (
            <li key={route}>
              <Link href={localizedPath(locale, route)}>{copy.nav[label]}</Link>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <Link
            href={localizedPath(other, "home")}
            hrefLang={other}
            lang={other}
            aria-label={`${copy.nav.language}: ${other.toUpperCase()}`}
          >
            {other.toUpperCase()}
          </Link>
          <Link
            href={localizedPath(locale, "requestQuote")}
            className="rounded-sm bg-oxblood px-4 py-2 text-ivory"
          >
            {copy.nav.quote}
          </Link>
        </div>
      </nav>
    </header>
  );
}
