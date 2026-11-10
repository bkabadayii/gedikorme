"use client";

import type { Fabric } from "@/content/catalog/types";
import { whatsappHref } from "@/content/contact";
import type { Locale } from "@/lib/i18n/config";
import { useInquiry } from "@/lib/inquiry/store";

/** WhatsApp link; with a basket it names the selected fabrics (codes and names only). */
export function WhatsAppLink({
  label, className, locale, fabrics, intro, generic,
}: {
  label: string;
  className: string;
  locale: Locale;
  fabrics: readonly Fabric[];
  intro: string;
  generic: string;
}) {
  const { ids } = useInquiry();
  const picked = ids.map((id) => fabrics.find((f) => f.id === id)).filter((f): f is Fabric => Boolean(f));
  const message = picked.length
    ? `${intro} ${picked.map((f) => `${f.code} ${f.name[locale]}`).join(", ")}.`
    : generic;
  return (
    <a href={whatsappHref(message)} className={className} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}
