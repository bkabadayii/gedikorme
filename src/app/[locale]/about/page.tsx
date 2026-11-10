import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RepresentativeVideo } from "@/components/media/representative-video";
import { getCopy } from "@/content/copy";
import { isLocale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getCopy(locale).pages.about } : {};
}

export default async function Page({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const a = getCopy(locale).about;
  const [before, after] = a.title.split(a.titleEmphasis);

  // Two handled-sample frames, deliberately unequal and offset like the home desk.
  const clips = [
    { src: "cloth-white", cls: "md:mt-0 md:rotate-[-1.5deg]" },
    { src: "cloth-black", cls: "md:mt-24 md:rotate-[2deg]" },
  ];

  return (
    <div className="mx-auto w-full max-w-[90rem] px-6 md:px-12">
      <section className="grid items-start gap-12 py-14 md:grid-cols-[1.1fr_1fr] md:gap-16 md:py-20">
        <div>
          <h1 className="text-balance font-display text-5xl leading-[1.04] md:text-[4.5rem]">
            {before}
            <em>{a.titleEmphasis}</em>
            {after}
          </h1>
          <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-ink/80">{a.lead}</p>
          <p className="mt-3 text-xs text-muted">{a.foundedDraft}</p>
        </div>

        {/* TODO(owner): replace with Gedik Örme fabric and workshop footage; see docs/media-manifest.md */}
        <div>
          <div className="grid grid-cols-2 items-start gap-5 md:gap-8">
            {clips.map((c, i) => (
              <figure key={c.src} className={`hairline-frame relative bg-card p-2.5 shadow-[0_30px_50px_-18px_rgba(60,50,30,.35)] ${c.cls}`}>
                <div className="pinked aspect-[3/5] overflow-hidden">
                  <RepresentativeVideo
                    src={`/video/${c.src}.mp4`}
                    poster={`/video/${c.src}-poster.jpg`}
                    alt={a.clothAlt[i]}
                  />
                </div>
                <figcaption className="label !text-[0.6rem] !tracking-[0.18em] px-1 pb-1 pt-3 text-brass md:!text-[0.68rem]">
                  {a.videoLabel}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-8 max-w-[40ch] text-sm text-muted md:mt-6">{a.videoNote}</p>
        </div>
      </section>

      <section aria-labelledby="facts" className="grid gap-8 py-16 md:grid-cols-[1fr_2fr] md:gap-12 md:py-24">
        <div>
          <h2 id="facts" className="font-display text-4xl md:text-5xl">{a.factsTitle}</h2>
          <p className="mt-4 max-w-[30ch] text-sm text-muted">{a.factsNote}</p>
        </div>
        <dl className="border-t border-brass-line">
          {a.facts.map((f) => (
            <div key={f.k} className="grid gap-1 border-b border-brass-line/60 py-5 sm:grid-cols-[10rem_1fr] sm:gap-8">
              <dt className="label !text-[0.7rem] text-brass">{f.k}</dt>
              <dd className="font-display text-2xl">{f.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="story" className="bg-card/90 px-6 py-14 md:px-16 md:py-20">
        <div className="grid gap-6 md:grid-cols-[1fr_2fr] md:gap-12">
          <h2 id="story" className="font-display text-3xl md:text-4xl">{a.storyTitle}</h2>
          {/* TODO(owner): founding story, team, values. Do not draft invented history. */}
          <p className="max-w-[52ch] italic leading-relaxed text-muted">{a.storyPending}</p>
        </div>
      </section>

      <section aria-labelledby="acta" className="mx-auto max-w-3xl py-24 text-center md:py-32">
        <h2 id="acta" className="text-balance font-display text-4xl md:text-5xl">{a.ctaTitle}</h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
          <Link
            href={localizedPath(locale, "contact")}
            className="label inline-block bg-ink px-8 py-5 text-card transition-colors duration-200 hover:bg-brass"
          >
            {a.cta}
          </Link>
          <Link
            href={localizedPath(locale, "requestQuote")}
            className="label inline-block border-b border-brass-line pb-1.5 transition-colors duration-200 hover:text-brass"
          >
            {a.ctaQuote}
          </Link>
        </div>
      </section>
    </div>
  );
}
