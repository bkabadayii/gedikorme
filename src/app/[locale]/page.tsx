import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductionFilm } from "@/components/film/production-film";
import { SampleDesk } from "@/components/home/sample-desk";
import { YarnIllustration, type IllustrationVariant } from "@/components/home/yarn-illustration";
import { getCopy } from "@/content/copy";
import { isLocale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";

const primary =
  "label inline-block bg-ink px-8 py-5 text-card transition-colors duration-200 hover:bg-brass";
const secondary =
  "label inline-block border-b border-brass-line pb-1.5 transition-colors duration-200 hover:text-brass";

export default async function Home({ params, searchParams }: PageProps<"/[locale]">) {
  const { locale } = await params;
  const q = (await searchParams).illus;
  const variant: IllustrationVariant = q === "a" || q === "c" ? q : "b";
  if (!isLocale(locale)) notFound();
  const h = getCopy(locale).home;
  const [before, after] = h.title.split(h.titleEmphasis);

  const images = ["fabric-sage-macro", "fabric-terracotta-macro", "fabric-navy-macro"];
  const cards = h.desk.map((c, i) => ({ ...c, sampleLabel: h.sampleLabel, image: images[i] }));

  return (
    <div className="mx-auto w-full max-w-[90rem] px-6 md:px-12">
      <section className="relative grid items-center gap-10 py-12 md:grid-cols-[1fr_1.15fr] md:py-16">
        <YarnIllustration variant={variant} />
        <div className="relative z-10">
          <h1 className="text-balance font-display text-5xl leading-[1.04] md:text-[4.5rem]">
            {before}
            <em>{h.titleEmphasis}</em>
            {after}
          </h1>
          <p className="mt-6 max-w-[34ch] text-lg leading-relaxed text-ink/80">{h.lead}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Link href={localizedPath(locale, "fabrics")} className={primary}>
              {h.explore}
            </Link>
            <Link href={localizedPath(locale, "contact")} className={secondary}>
              {h.contact}
            </Link>
          </div>
          <p className="label mt-14 max-w-[40ch] border-t border-brass-line pt-4 !text-[0.68rem] leading-relaxed text-ink/80">
            {h.identity}
          </p>
        </div>
        <div className="relative z-10">
          <SampleDesk cards={cards} note={h.sampleNote} />
        </div>
      </section>

      <section aria-labelledby="film" className="py-12 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6 pb-8">
          <h2 id="film" className="font-display text-4xl md:text-5xl">{h.filmTitle}</h2>
        </div>
        <ProductionFilm copy={getCopy(locale).film} />
      </section>

      <section aria-labelledby="cats" className="py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-brass-line pb-6">
          <div>
            <h2 id="cats" className="font-display text-4xl md:text-5xl">{h.categoriesTitle}</h2>
            <p className="mt-3 text-muted">{h.categoriesLead}</p>
          </div>
          <Link href={localizedPath(locale, "fabrics")} className={secondary}>
            {h.categoriesCta}
          </Link>
        </div>
        <ul className="mt-12 grid grid-cols-6 gap-6 md:grid-cols-12 md:gap-8">
          {h.categories.map((c, i) => {
            const span = ["col-span-6 md:col-span-4", "col-span-3 md:col-span-2 md:mt-16", "col-span-3 md:col-span-3", "col-span-6 md:col-span-3 md:mt-10"][i];
            const tall = ["aspect-[16/10]", "aspect-[4/5]", "aspect-[1/1]", "aspect-[16/6]"][i];
            return (
              <li key={c.name} className={span}>
                <Link href={localizedPath(locale, "fabrics")} className="group block">
                  <div
                    className={`knit-swatch pinked ${tall} w-full transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1`}
                    style={{ backgroundColor: c.colour }}
                    role="img"
                    aria-label={`${c.name}: ${h.sampleLabel}`}
                  />
                  <p className="mt-4 font-display text-2xl">{c.name}</p>
                  <p className="text-sm text-muted">{c.note}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="proc" className="bg-card/90 px-6 py-16 md:px-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <h2 id="proc" className="font-display text-4xl md:text-5xl">{h.processTitle}</h2>
            <p className="mt-4 max-w-[36ch] text-muted">{h.processLead}</p>
            <Link href={localizedPath(locale, "production")} className={`${secondary} mt-8`}>
              {h.processCta}
            </Link>
          </div>
          <ol className="grid gap-8 md:grid-cols-3">
            {h.process.map((p, i) => (
              <li key={p.name} className={i === 1 ? "md:mt-10" : i === 2 ? "md:mt-20" : ""}>
                <p className="font-display text-3xl italic text-brass">{i + 1}</p>
                <p className="mt-3 font-display text-2xl">{p.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="story" className="mx-auto max-w-2xl py-24 text-center md:py-32">
        <h2 id="story" className="font-display text-4xl md:text-5xl">{h.storyTitle}</h2>
        <p className="mt-6 text-lg leading-relaxed text-muted">{h.storyBody}</p>
        <p className="mt-3 text-xs text-muted">{h.storyNote}</p>
        <Link href={localizedPath(locale, "about")} className={`${secondary} mt-8`}>
          {h.storyCta}
        </Link>
      </section>

      <section aria-labelledby="rfq" className="hairline-frame relative bg-ink px-6 py-16 text-card md:px-20 md:py-24">
        <div className="pointer-events-none absolute -right-6 top-1/2 hidden -translate-y-1/2 md:block" aria-hidden="true">
          {h.desk.map((c, i) => (
            <div key={c.name} className="knit-swatch pinked absolute h-56 w-40 border-8 border-card/95 shadow-[0_20px_30px_-12px_rgba(0,0,0,.6)]" style={{ backgroundColor: c.colour, right: `${i * 70}px`, top: `${(i - 1) * 40 - 112}px`, transform: `rotate(${(i - 1) * 7}deg)` }} />
          ))}
        </div>
        <h2 id="rfq" className="max-w-[18ch] text-balance font-display text-4xl md:text-6xl">{h.inquiryTitle}</h2>
        <p className="mt-6 max-w-[48ch] text-card/80">{h.inquiryBody}</p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          <Link href={localizedPath(locale, "requestQuote")} className="label inline-block bg-card px-8 py-5 text-ink transition-colors hover:bg-brass-line">
            {h.inquiryCta}
          </Link>
          <Link href={localizedPath(locale, "contact")} className="label inline-block border-b border-brass-line pb-1.5 transition-colors hover:text-brass-line">
            {h.contactCta}
          </Link>
        </div>
      </section>
    </div>
  );
}
