import { notFound } from "next/navigation";
import { getCopy } from "@/content/copy";
import { isLocale } from "@/lib/i18n/config";

export default async function Page({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getCopy(locale);

  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <h1 className="font-display text-4xl">{copy.pages.about}</h1>
      <p className="mt-4 text-muted">{copy.pages.soon}</p>
    </section>
  );
}
