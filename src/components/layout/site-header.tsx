import Link from "next/link";
import { getCopy } from "@/content/copy";
import type { Locale } from "@/lib/i18n/config";
import { QuoteLink } from "@/components/layout/quote-link";
import { localizedPath, type RouteKey } from "@/lib/i18n/routes";

const items: { route: RouteKey; label: "fabrics" | "production" | "about" | "contact" }[] = [
  { route: "fabrics", label: "fabrics" },
  { route: "production", label: "production" },
  { route: "about", label: "about" },
  { route: "contact", label: "contact" },
];

export function SiteHeader({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);
  const other: Locale = locale === "tr" ? "en" : "tr";
  const link = "label transition-colors duration-200 hover:text-brass";

  const langSwitch = (
    <Link
      href={localizedPath(other, "home")}
      hrefLang={other}
      lang={other}
      aria-label={`${copy.nav.language}: ${other.toUpperCase()}`}
      className={link}
    >
      <span aria-current="true" className="text-brass">{locale.toUpperCase()}</span>
      <span aria-hidden="true"> / </span>
      {other.toUpperCase()}
    </Link>
  );

  return (
    <header className="relative z-20 mx-auto w-full max-w-[90rem] px-6 pt-8 md:px-12">
      <nav
        aria-label={copy.nav.primary}
        className="flex items-baseline gap-x-10 border-b border-brass-line pb-5"
      >
        <Link
          href={localizedPath(locale, "home")}
          className="font-display text-xl tracking-[0.18em] md:text-[1.75rem]"
        >
          GEDİK ÖRME
        </Link>
        <ul className="ml-auto hidden items-baseline gap-x-10 md:flex">
          {items.map(({ route, label }) => (
            <li key={route}>
              <Link href={localizedPath(locale, route)} className={link}>
                {copy.nav[label]}
              </Link>
            </li>
          ))}
          <li>{langSwitch}</li>
          <li>
            <QuoteLink
              href={localizedPath(locale, "requestQuote")}
              label={copy.nav.quote}
              className="label font-medium text-ink underline decoration-brass underline-offset-8 transition-colors hover:text-brass"
            />
          </li>
        </ul>
        <details className="group relative ml-auto md:hidden">
          <summary className="label cursor-pointer list-none py-2">
            <span className="group-open:hidden">{copy.nav.menu}</span>
            <svg
              viewBox="0 0 16 16"
              className="hidden h-4 w-4 group-open:block"
              role="img"
              aria-label={copy.nav.close}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </summary>
          <ul className="absolute right-0 top-full z-30 mt-3 w-64 border border-brass-line bg-card p-6 shadow-[0_24px_40px_-16px_rgba(60,50,30,.4)]">
            {items.map(({ route, label }) => (
              <li key={route} className="py-2">
                <Link href={localizedPath(locale, route)} className={link}>
                  {copy.nav[label]}
                </Link>
              </li>
            ))}
            <li className="py-2">{langSwitch}</li>
            <li className="mt-3 border-t border-line pt-4">
              <QuoteLink
                href={localizedPath(locale, "requestQuote")}
                label={copy.nav.quote}
                className="label bg-ink px-5 py-3 text-card inline-block"
              />
            </li>
          </ul>
        </details>
      </nav>
    </header>
  );
}
