"use client";

import { useState } from "react";
import { InquiryList } from "@/components/catalog/inquiry-list";
import type { Fabric } from "@/content/catalog/types";
import type { Copy } from "@/content/copy/tr";
import type { Locale } from "@/lib/i18n/config";
import { InquiryForm } from "./inquiry-form";

/** The selected fabrics (with per-fabric notes) and the quote form, sharing one notes state. */
export function QuoteSection({
  locale, copy, fabrics, siteKey, fabricsHref,
}: {
  locale: Locale;
  copy: Copy;
  fabrics: readonly Fabric[];
  siteKey: string;
  fabricsHref: string;
}) {
  const [notes, setNotes] = useState<Record<string, string>>({});
  return (
    <div className="space-y-16">
      <InquiryList
        fabrics={fabrics}
        locale={locale}
        copy={{ ...copy.quote, noteLabel: copy.form.itemNote }}
        swatchAlt={copy.catalog.swatchAlt}
        fabricsHref={fabricsHref}
        sampleTag={copy.catalog.sampleTag}
        notes={notes}
        onNote={(id, value) => setNotes((p) => ({ ...p, [id]: value }))}
      />
      <InquiryForm
        kind="quote"
        locale={locale}
        copy={copy.form}
        siteKey={siteKey}
        fabrics={fabrics}
        notes={notes}
        browseHref={fabricsHref}
        swatchLabel={copy.quote.browse}
      />
    </div>
  );
}
