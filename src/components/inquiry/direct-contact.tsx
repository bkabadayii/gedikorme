import type { Fabric } from "@/content/catalog/types";
import type { Copy } from "@/content/copy/tr";
import type { Locale } from "@/lib/i18n/config";
import { WhatsAppLink } from "./whatsapp-link";

const link = "label border-b border-brass-line pb-1.5 transition-colors duration-200 hover:text-brass";

/** The plain routes to a person: phone, WhatsApp, email, address. */
export function DirectContact({
  locale, copy, fabrics, title,
}: {
  locale: Locale;
  copy: Copy;
  fabrics: readonly Fabric[];
  title: string;
}) {
  const c = copy.contactPage;
  const f = copy.footer;
  return (
    <aside aria-labelledby="direct" className="hairline-frame relative self-start bg-card p-7 shadow-[0_30px_50px_-18px_rgba(60,50,30,.3)] md:p-9">
      <h2 id="direct" className="font-display text-3xl">{title}</h2>
      <ul className="mt-6 space-y-6">
        <li>
          <a href={`tel:${f.phone.replace(/\s/g, "")}`} className={link}>{c.phoneLabel}</a>
          <p className="mt-2 font-display text-xl">{f.phone}</p>
          <p className="mt-3">
            <WhatsAppLink
              label={c.whatsapp}
              className={link}
              locale={locale}
              fabrics={fabrics}
              intro={copy.form.whatsappMessage}
              generic={copy.form.whatsappGeneric}
            />
          </p>
        </li>
        <li>
          <a href={`mailto:${f.email}`} className={link}>{c.emailLabel}</a>
          <p className="mt-2 break-words font-display text-xl">{f.email}</p>
        </li>
        <li>
          <p className="label !text-[0.68rem] text-muted">{c.addressLabel}</p>
          <address className="mt-2 font-display text-xl not-italic leading-snug">{f.address}</address>
        </li>
      </ul>
    </aside>
  );
}
