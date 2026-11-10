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

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);
  const f = copy.footer;
  const link = "transition-colors duration-200 hover:text-brass";
  return (
    <footer className="relative z-10 mt-32 bg-ink text-card">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-12">
        <div>
          <p className="font-display text-3xl tracking-[0.18em]">GEDİK ÖRME</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-card/80">{f.tagline}</p>
        </div>
        <div>
          <h2 className="label text-brass-line">{f.navTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map(({ route, label }) => (
              <li key={route}>
                <Link href={localizedPath(locale, route)} className={link}>
                  {copy.nav[label]}
                </Link>
              </li>
            ))}
            <li>
              <Link href={localizedPath(locale, "requestQuote")} className={link}>
                {copy.nav.quote}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="label text-brass-line">{f.contactTitle}</h2>
          <address className="mt-4 space-y-2 text-sm not-italic leading-relaxed">
            <p>{f.address}</p>
            <p><a href={`tel:${f.phone.replace(/\s/g, "")}`} className={link}>{f.phone}</a></p>
            <p><a href={`mailto:${f.email}`} className={link}>{f.email}</a></p>
          </address>
        </div>
      </div>
      <div className="border-t border-card/15">
        <p className="mx-auto max-w-[90rem] px-6 py-6 text-xs text-card/70 md:px-12">
          © {new Date().getFullYear()} Gedik Örme. {f.rights}
        </p>
      </div>
    </footer>
  );
}
