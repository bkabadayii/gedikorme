import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToInquiry, RequestInfo } from "@/components/catalog/add-to-inquiry";
import { FabricSwatch } from "@/components/catalog/fabric-swatch";
import type { Fabric } from "@/content/catalog/types";
import { getCategory, getFabricBySlug, listFabrics, relatedFabrics } from "@/content/catalog/repository";
import { getCopy } from "@/content/copy";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/seo";
import { localizedPath } from "@/lib/i18n/routes";

export function generateStaticParams() {
  return locales.flatMap((locale) => listFabrics().map((f) => ({ locale, slug: f.slug[locale] })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/fabrics/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const f = getFabricBySlug(locale, slug);
  if (!f) return {};
  // Sample pages stay out of search until the catalog is verified (plan §2).
  return pageMeta({
    locale,
    route: "fabrics",
    title: f.name[locale],
    description: f.summary[locale],
    slugs: f.slug,
    noindex: f.status !== "verified",
  });
}

const range = (r: { min?: number; max?: number } | undefined, unit: string) => {
  if (!r || (r.min === undefined && r.max === undefined)) return undefined;
  if (r.min !== undefined && r.max !== undefined && r.min !== r.max) return `${r.min}–${r.max} ${unit}`;
  return `${r.min ?? r.max} ${unit}`;
};

/** Spec value for display, or undefined when we don't know it (never zero, never guessed). */
function specValues(f: Fabric) {
  const s = f.specifications;
  return {
    composition: s?.composition?.length ? s.composition.map((c) => `${c.percent}% ${c.fiber}`).join(", ") : undefined,
    gsm: range(s?.gsm, "g/m²"),
    width: range(s?.widthCm, "cm"),
    applications: s?.applications?.length ? s.applications.join(", ") : undefined,
    colors: s?.colors?.length ? s.colors.join(", ") : undefined,
    finishes: s?.finishes?.length ? s.finishes.join(", ") : undefined,
    moq: s?.moq ? `${s.moq.value} ${s.moq.unit}` : undefined,
  };
}

export default async function Page({ params }: PageProps<"/[locale]/fabrics/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const f = getFabricBySlug(locale, slug);
  if (!f) notFound();
  const c = getCopy(locale);
  const t = c.catalog;
  const base = localizedPath(locale, "fabrics");
  const values = specValues(f);
  const rows = (["composition", "gsm", "width", "applications", "colors", "finishes", "moq"] as const).map((k) => ({
    k, label: t.specs[k], value: values[k],
  }));
  const category = getCategory(f.categoryId);
  const related = relatedFabrics(f, 3);

  return (
    <div className="mx-auto w-full max-w-[90rem] px-6 md:px-12">
      <p className="pt-10 md:pt-14">
        <Link href={base} className="label border-b border-brass-line pb-1.5 transition-colors duration-200 hover:text-brass">{t.back}</Link>
      </p>

      <article className="grid gap-12 py-10 md:grid-cols-[1.1fr_1fr] md:gap-20 md:py-16">
        <div className="md:sticky md:top-8 md:self-start">
          <figure className="hairline-frame relative bg-card p-4 shadow-[0_30px_50px_-18px_rgba(60,50,30,.35)] md:-rotate-[1.2deg] md:p-6">
            <FabricSwatch fabric={f} label={`${f.name[locale]}: ${t.swatchAlt}`} className="aspect-[4/5] w-full" />
            <figcaption className="label flex justify-between gap-4 px-1 pb-1 pt-4 !text-[0.68rem] !tracking-[0.2em] text-muted">
              <span>{f.code}</span>
              <span className="text-brass">{t.sampleTag}</span>
            </figcaption>
          </figure>
        </div>

        <div>
          <h1 className="text-balance font-display text-4xl leading-[1.06] sm:text-5xl md:text-6xl">{f.name[locale]}</h1>
          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-ink/80">{f.summary[locale]}</p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <AddToInquiry id={f.id} copy={t} />
            <RequestInfo id={f.id} href={localizedPath(locale, "requestQuote")} copy={t} />
          </div>

          <section aria-labelledby="specs" className="mt-14">
            <h2 id="specs" className="font-display text-3xl">{t.specsTitle}</h2>
            <dl className="mt-5 border-t border-brass-line">
              <div className="grid gap-1 border-b border-brass-line/60 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="label !text-[0.7rem] text-brass">{t.categoryName}</dt>
                <dd className="font-display text-xl">{category?.name[locale]}</dd>
              </div>
              {rows.map((r) => (
                <div key={r.k} className="grid gap-1 border-b border-brass-line/60 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="label !text-[0.7rem] text-brass">{r.label}</dt>
                  <dd className={r.value ? "font-display text-xl" : "italic text-muted"}>{r.value ?? c.home.unknown}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 max-w-[48ch] text-sm leading-relaxed text-muted">{t.sampleBanner}</p>
          </section>
        </div>
      </article>

      <section aria-labelledby="related" className="border-t border-brass-line py-16 md:py-24">
        <h2 id="related" className="font-display text-3xl md:text-4xl">{t.relatedTitle}</h2>
        <ul className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:gap-10">
          {related.map((r, i) => (
            <li key={r.id} className={i === 1 ? "md:mt-10" : i === 2 ? "md:mt-4" : ""}>
              <Link href={`${base}/${r.slug[locale]}`} className="group block">
                <FabricSwatch
                  fabric={r}
                  label={`${r.name[locale]}: ${t.swatchAlt}`}
                  className={`${["aspect-[4/5]", "aspect-[1/1]", "aspect-[5/6]"][i]} w-full transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1`}
                />
                <p className="mt-4 font-display text-xl">{r.name[locale]}</p>
                <p className="label !text-[0.62rem] !tracking-[0.18em] text-muted">{r.code}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
