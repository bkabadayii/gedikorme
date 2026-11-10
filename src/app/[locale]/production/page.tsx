import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RepresentativeVideo } from "@/components/media/representative-video";
import { getCopy } from "@/content/copy";
import { isLocale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/production">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getCopy(locale).pages.production } : {};
}

export default async function Page({ params }: PageProps<"/[locale]/production">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const p = getCopy(locale).production;
  const [before, after] = p.title.split(p.titleEmphasis);

  return (
    <div className="mx-auto w-full max-w-[90rem] px-6 md:px-12">
      <header className="grid gap-8 py-14 md:grid-cols-[1.15fr_1fr] md:items-end md:py-20">
        <h1 className="text-balance font-display text-5xl leading-[1.04] md:text-[4.5rem]">
          {before}
          <em>{p.titleEmphasis}</em>
          {after}
        </h1>
        <p className="max-w-[44ch] text-lg leading-relaxed text-ink/80">{p.lead}</p>
      </header>

      {/* TODO(owner): replace with Gedik Örme's own machine footage; see docs/media-manifest.md */}
      <figure className="hairline-frame relative bg-card p-3 shadow-[0_30px_50px_-18px_rgba(60,50,30,.35)] md:p-4">
        <div className="aspect-[4/3] overflow-hidden md:aspect-[21/9]">
          <RepresentativeVideo
            src="/video/knitting-machine.mp4"
            poster="/video/knitting-machine-poster.jpg"
            alt={p.videoAlt}
          />
        </div>
        <figcaption className="flex flex-wrap items-baseline gap-x-6 gap-y-1 px-1 pb-1 pt-4">
          <span className="label !text-[0.68rem] text-brass">{p.videoLabel}</span>
          <span className="text-sm text-muted">{p.videoNote}</span>
        </figcaption>
      </figure>

      <section aria-labelledby="stages" className="py-20 md:py-28">
        <div className="grid gap-4 border-b border-brass-line pb-6 md:grid-cols-[1fr_2fr] md:gap-12">
          <h2 id="stages" className="font-display text-4xl md:text-5xl">{p.stagesTitle}</h2>
          <p className="max-w-[48ch] self-end text-muted">{p.stagesLead}</p>
        </div>
        <ol>
          {p.stages.map((s, i) => (
            <li
              key={s.name}
              className="grid gap-4 border-b border-brass-line/60 py-10 md:grid-cols-[1fr_2fr] md:gap-12 md:py-14"
            >
              <div className="flex items-baseline gap-5">
                <span className="font-display text-3xl italic text-brass" aria-hidden="true">{i + 1}</span>
                <h3 className="font-display text-3xl md:text-4xl">{s.name}</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2 md:gap-10">
                <p className="text-lg leading-relaxed">{s.what}</p>
                <p className="leading-relaxed text-muted">{s.meaning}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="pending" className="bg-card/90 px-6 py-14 md:px-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-12">
          <div>
            <h2 id="pending" className="font-display text-3xl md:text-4xl">{p.pendingTitle}</h2>
            <p className="mt-4 max-w-[34ch] text-muted">{p.pendingLead}</p>
          </div>
          {/* TODO(owner): each row becomes a verified value when confirmed; never fill with estimates */}
          <dl className="grid gap-x-12 sm:grid-cols-2">
            {p.pending.map((k) => (
              <div key={k} className="flex items-baseline justify-between gap-4 border-b border-brass-line/60 py-4">
                <dt className="font-display text-xl">{k}</dt>
                <dd className="text-sm italic text-muted">{getCopy(locale).home.unknown}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="pcta" className="mx-auto max-w-3xl py-24 text-center md:py-32">
        <h2 id="pcta" className="text-balance font-display text-4xl md:text-5xl">{p.ctaTitle}</h2>
        <Link
          href={localizedPath(locale, "contact")}
          className="label mt-10 inline-block bg-ink px-8 py-5 text-card transition-colors duration-200 hover:bg-brass"
        >
          {p.cta}
        </Link>
      </section>
    </div>
  );
}
