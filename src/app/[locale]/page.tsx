import Link from "next/link";
import { getCopy } from "@/content/copy";
import { isLocale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getCopy(locale);

  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <h1 className="font-display text-5xl">{copy.home.title}</h1>
      <p className="mt-4 max-w-prose text-lg">{copy.home.lead}</p>
      <div className="mt-8 flex gap-4">
        <Link
          href={localizedPath(locale, "fabrics")}
          className="rounded-sm bg-oxblood px-5 py-3 text-ivory"
        >
          {copy.home.explore}
        </Link>
        <Link
          href={localizedPath(locale, "requestQuote")}
          className="rounded-sm border border-charcoal px-5 py-3"
        >
          {copy.home.quote}
        </Link>
      </div>
    </section>
  );
}
