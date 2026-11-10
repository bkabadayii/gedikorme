import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InquiryList } from "@/components/catalog/inquiry-list";
import { listFabrics } from "@/content/catalog/repository";
import { getCopy } from "@/content/copy";
import { isLocale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/request-quote">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getCopy(locale).pages.requestQuote } : {};
}

export default async function Page({ params }: PageProps<"/[locale]/request-quote">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = getCopy(locale);
  const t = c.quote;
  const [before, after] = t.title.split(t.titleEmphasis);

  return (
    <div className="mx-auto w-full max-w-[90rem] px-6 md:px-12">
      <header className="grid gap-6 py-14 md:grid-cols-[1.15fr_1fr] md:items-end md:py-20">
        <h1 className="text-balance font-display text-4xl leading-[1.06] sm:text-5xl md:text-[4.5rem] md:leading-[1.04]">
          {before}<em>{t.titleEmphasis}</em>{after}
        </h1>
        <p className="max-w-[44ch] text-lg leading-relaxed text-ink/80">{t.lead}</p>
      </header>

      <div className="grid gap-14 pb-10 md:grid-cols-[1.5fr_1fr] md:gap-20">
        <InquiryList
          fabrics={listFabrics()}
          locale={locale}
          copy={t}
          swatchAlt={c.catalog.swatchAlt}
          fabricsHref={localizedPath(locale, "fabrics")}
          sampleTag={c.catalog.sampleTag}
        />
        <aside aria-labelledby="direct" className="hairline-frame relative self-start bg-card p-7 shadow-[0_30px_50px_-18px_rgba(60,50,30,.3)] md:p-9">
          <h2 id="direct" className="font-display text-3xl">{t.directTitle}</h2>
          <ul className="mt-6 space-y-5">
            <li>
              <a href={`tel:${c.footer.phone.replace(/\s/g, "")}`} className="label border-b border-brass-line pb-1.5 transition-colors duration-200 hover:text-brass">{t.call}</a>
              <p className="mt-2 font-display text-xl">{c.footer.phone}</p>
            </li>
            <li>
              <a href={`mailto:${c.footer.email}`} className="label border-b border-brass-line pb-1.5 transition-colors duration-200 hover:text-brass">{t.email}</a>
              <p className="mt-2 font-display text-xl">{c.footer.email}</p>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
