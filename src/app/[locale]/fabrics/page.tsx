import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToInquiry } from "@/components/catalog/add-to-inquiry";
import { FabricSwatch } from "@/components/catalog/fabric-swatch";
import { getCategory, listCategories, searchFabrics } from "@/content/catalog/repository";
import { getCopy } from "@/content/copy";
import { isLocale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/fabrics">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getCopy(locale).pages.fabrics } : {};
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

// Deliberately uneven: offsets and swatch ratios vary so the catalog never reads as a tile row.
const offsets = ["", "md:mt-14", "md:mt-6", "md:mt-20", "", "md:mt-10"];
const ratios = ["aspect-[4/5]", "aspect-[1/1]", "aspect-[5/6]", "aspect-[6/5]", "aspect-[1/1]", "aspect-[4/5]"];

export default async function Page({ params, searchParams }: PageProps<"/[locale]/fabrics">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = getCopy(locale);
  const t = c.catalog;
  const sp = await searchParams;
  const q = first(sp.q)?.trim() ?? "";
  const cat = getCategory(first(sp.cat) ?? "")?.id;
  const results = searchFabrics({ q, category: cat });
  const base = localizedPath(locale, "fabrics");
  const href = (next: { q?: string; cat?: string }) => {
    const p = new URLSearchParams();
    if (next.q) p.set("q", next.q);
    if (next.cat) p.set("cat", next.cat);
    const s = p.toString();
    return s ? `${base}?${s}` : base;
  };
  const [before, after] = t.title.split(t.titleEmphasis);
  const filtered = Boolean(q || cat);
  const tab = (active: boolean) =>
    `label border-b pb-1.5 transition-colors duration-200 hover:text-brass ${active ? "border-brass text-ink" : "border-transparent text-muted"}`;

  return (
    <div className="mx-auto w-full max-w-[90rem] px-6 md:px-12">
      <header className="grid gap-6 py-14 md:grid-cols-[1.15fr_1fr] md:items-end md:py-20">
        <h1 className="text-balance font-display text-4xl leading-[1.06] sm:text-5xl md:text-[4.5rem] md:leading-[1.04]">
          {before}<em>{t.titleEmphasis}</em>{after}
        </h1>
        <p className="max-w-[44ch] text-lg leading-relaxed text-ink/80">{t.lead}</p>
      </header>

      <section aria-label={t.searchLabel} className="border-y border-brass-line py-6">
        <form method="get" action={base} role="search" className="flex flex-wrap items-end gap-x-6 gap-y-4">
          <label className="min-w-[14rem] flex-1">
            <span className="label block !text-[0.68rem] text-muted">{t.searchLabel}</span>
            <input
              type="search" name="q" defaultValue={q} placeholder={t.searchPlaceholder}
              className="mt-2 w-full rounded-none border-0 border-b border-brass-line bg-transparent pb-2 font-display text-2xl placeholder:text-muted/70 focus:border-brass focus:outline-none"
            />
          </label>
          {cat && <input type="hidden" name="cat" value={cat} />}
          <button type="submit" className="label bg-ink px-6 py-3.5 text-card transition-colors duration-200 hover:bg-brass">
            {t.searchButton}
          </button>
        </form>
        <nav aria-label={t.categoryLabel} className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3">
          <Link href={href({ q })} className={tab(!cat)} aria-current={!cat ? "true" : undefined}>{t.all}</Link>
          {listCategories().map((k) => (
            <Link key={k.id} href={href({ q, cat: k.id })} className={tab(cat === k.id)} aria-current={cat === k.id ? "true" : undefined}>
              {k.name[locale]}
            </Link>
          ))}
        </nav>
      </section>

      <div className="flex items-baseline justify-between gap-6 py-6" role="status" aria-live="polite">
        <p className="text-muted">{results.length === 1 ? t.countOne : t.count.replace("{n}", String(results.length))}</p>
        {filtered && (
          <Link href={base} className="label border-b border-brass-line pb-1.5 transition-colors duration-200 hover:text-brass">
            {t.reset}
          </Link>
        )}
      </div>

      {results.length === 0 ? (
        <section className="mx-auto max-w-xl py-20 text-center">
          <h2 className="font-display text-3xl md:text-4xl">{t.emptyTitle}</h2>
          <p className="mt-4 text-muted">{t.emptyBody}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link href={base} className="label inline-block bg-ink px-6 py-4 text-card transition-colors duration-200 hover:bg-brass">{t.reset}</Link>
            <Link href={localizedPath(locale, "requestQuote")} className="label border-b border-brass-line pb-1.5 transition-colors duration-200 hover:text-brass">{c.nav.quote}</Link>
          </div>
        </section>
      ) : (
        <ul className="grid grid-cols-1 gap-x-8 gap-y-14 pb-10 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((f, i) => (
            <li key={f.id} className={offsets[i % offsets.length]}>
              <article className="hairline-frame relative bg-card p-4 shadow-[0_30px_50px_-18px_rgba(60,50,30,.3)]">
                <Link href={`${base}/${f.slug[locale]}`} className="group block" aria-label={f.name[locale]}>
                  <FabricSwatch
                    fabric={f}
                    label={`${f.name[locale]}: ${t.swatchAlt}`}
                    className={`${ratios[i % ratios.length]} w-full transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1`}
                  />
                </Link>
                <div className="px-1 pb-1 pt-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="font-display text-2xl">
                      <Link href={`${base}/${f.slug[locale]}`} className="transition-colors duration-200 hover:text-brass">{f.name[locale]}</Link>
                    </h2>
                    <p className="label shrink-0 !text-[0.62rem] !tracking-[0.18em] text-muted">
                      {f.code} <span className="text-brass">· {t.sampleTag}</span>
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.summary[locale]}</p>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
                    <Link href={`${base}/${f.slug[locale]}`} className="label border-b border-brass-line pb-1.5 transition-colors duration-200 hover:text-brass">{t.view}</Link>
                    <AddToInquiry id={f.id} copy={t} compact />
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
