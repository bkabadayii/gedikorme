import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DirectContact } from "@/components/inquiry/direct-contact";
import { InquiryForm } from "@/components/inquiry/inquiry-form";
import { listFabrics } from "@/content/catalog/repository";
import { getCopy } from "@/content/copy";
import { isLocale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";
import { getServerEnv } from "@/lib/server/env";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getCopy(locale).pages.contact } : {};
}

export default async function Page({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = getCopy(locale);
  const t = c.contactPage;
  const [before, after] = t.title.split(t.titleEmphasis);
  const { TURNSTILE_SITE_KEY } = await getServerEnv();

  return (
    <div className="mx-auto w-full max-w-[90rem] px-6 md:px-12">
      <header className="grid gap-6 py-14 md:grid-cols-[1.15fr_1fr] md:items-end md:py-20">
        <h1 className="text-balance font-display text-4xl leading-[1.06] sm:text-5xl md:text-[4.5rem] md:leading-[1.04]">
          {before}<em>{t.titleEmphasis}</em>{after}
        </h1>
        <p className="max-w-[44ch] text-lg leading-relaxed text-ink/80">{t.lead}</p>
      </header>

      <div className="grid gap-14 pb-10 md:grid-cols-[1.5fr_1fr] md:gap-20">
        <section aria-labelledby="send">
          <h2 id="send" className="mb-8 border-b border-brass-line pb-4 font-display text-3xl md:text-4xl">{t.formTitle}</h2>
          <InquiryForm kind="contact" locale={locale} copy={c.form} siteKey={TURNSTILE_SITE_KEY ?? ""} fabrics={listFabrics()} browseHref={localizedPath(locale, "fabrics")} swatchLabel={c.home.explore} />
        </section>
        <DirectContact locale={locale} copy={c} fabrics={listFabrics()} title={t.directTitle} />
      </div>
    </div>
  );
}
