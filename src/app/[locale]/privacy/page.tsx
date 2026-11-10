import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCopy } from "@/content/copy";
import { isLocale } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const c = getCopy(locale);
  // DRAFT notice: kept out of search until the owner approves the wording.
  return pageMeta({ locale, route: "privacy", title: c.pages.privacy, description: c.descriptions.privacy, noindex: true });
}

export default async function Page({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const p = getCopy(locale).privacy;

  return (
    <div className="mx-auto w-full max-w-[90rem] px-6 md:px-12">
      <article className="max-w-3xl py-14 md:py-20">
        <h1 className="text-balance font-display text-4xl leading-[1.06] sm:text-5xl md:text-6xl">{p.title}</h1>
        <p className="mt-8 max-w-[60ch] text-lg leading-relaxed text-ink/80">{p.lead}</p>
        <div className="mt-14 border-t border-brass-line">
          {p.sections.map((s) => (
            <section key={s.h} className="grid gap-3 border-b border-brass-line/60 py-8 md:grid-cols-[12rem_1fr] md:gap-10">
              <h2 className="font-display text-2xl">{s.h}</h2>
              <div className="max-w-[65ch] space-y-4 leading-relaxed text-ink/90">
                {s.p.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
