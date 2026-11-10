"use client";

import Link from "next/link";
import { useInquiry } from "@/lib/inquiry/store";
import { FabricSwatch } from "./fabric-swatch";
import type { Fabric } from "@/content/catalog/types";
import type { Locale } from "@/lib/i18n/config";

export type QuoteCopy = {
  selected: string; selectedOne: string; emptyTitle: string; emptyBody: string; browse: string;
  remove: string; clear: string;
};

/** The selected fabrics, read from the local basket. Unknown ids are ignored. */
export function InquiryList({
  fabrics, locale, copy, swatchAlt, fabricsHref, sampleTag,
}: {
  fabrics: readonly Fabric[];
  locale: Locale;
  copy: QuoteCopy;
  swatchAlt: string;
  fabricsHref: string;
  sampleTag: string;
}) {
  const { ids, remove, clear } = useInquiry();
  const picked = ids.map((id) => fabrics.find((f) => f.id === id)).filter((f): f is Fabric => Boolean(f));

  if (picked.length === 0) {
    return (
      <div className="border-y border-brass-line py-14 text-center">
        <h2 className="font-display text-3xl md:text-4xl">{copy.emptyTitle}</h2>
        <p className="mx-auto mt-4 max-w-[44ch] text-muted">{copy.emptyBody}</p>
        <Link href={fabricsHref} className="label mt-8 inline-block bg-ink px-6 py-4 text-card transition-colors duration-200 hover:bg-brass">
          {copy.browse}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-6 border-b border-brass-line pb-4" role="status" aria-live="polite">
        <p className="text-muted">{picked.length === 1 ? copy.selectedOne : copy.selected.replace("{n}", String(picked.length))}</p>
        <button type="button" onClick={clear} className="label border-b border-brass-line pb-1.5 transition-colors duration-200 hover:text-brass">
          {copy.clear}
        </button>
      </div>
      <ul>
        {picked.map((f) => (
          <li key={f.id} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-5 border-b border-brass-line/60 py-5 md:grid-cols-[6rem_1fr_auto] md:gap-8">
            <FabricSwatch fabric={f} label={`${f.name[locale]}: ${swatchAlt}`} className="aspect-square w-full" />
            <div className="min-w-0">
              <Link href={`${fabricsHref}/${f.slug[locale]}`} className="font-display text-2xl transition-colors duration-200 hover:text-brass">
                {f.name[locale]}
              </Link>
              <p className="label !text-[0.62rem] !tracking-[0.18em] text-muted">
                {f.code} <span className="text-brass">· {sampleTag}</span>
              </p>
            </div>
            <button type="button" onClick={() => remove(f.id)} aria-label={`${copy.remove}: ${f.name[locale]}`} className="label border-b border-brass-line pb-1.5 transition-colors duration-200 hover:text-brass">
              {copy.remove}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
