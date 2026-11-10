"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getFabricBySlug } from "@/content/catalog/repository";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath, switchLocalePath } from "@/lib/i18n/routes";

/** TR / EN switch that lands on the same page (and the same fabric) in the other language. */
export function LangSwitch({ locale, label, className }: { locale: Locale; label: string; className: string }) {
  const pathname = usePathname();
  const other: Locale = locale === "tr" ? "en" : "tr";
  const href = pathname
    ? switchLocalePath(pathname, other, (route, slug, from, to) =>
        route === "fabrics" ? getFabricBySlug(from, slug)?.slug[to] : undefined,
      )
    : localizedPath(other, "home");
  return (
    <Link href={href} hrefLang={other} lang={other} aria-label={label} className={className}>
      <span aria-current="true" className="text-brass">{locale.toUpperCase()}</span>
      <span aria-hidden="true"> / </span>
      {other.toUpperCase()}
    </Link>
  );
}
