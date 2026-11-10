import { locales, type Locale } from "@/lib/i18n/config";

/** Version of the consent wording the visitor accepted (bump when the text changes). */
export const CONSENT_VERSION = "kvkk-draft-2";

export const UNITS = ["kg", "m", "roll", "piece"] as const;
export type Unit = (typeof UNITS)[number];
export const KINDS = ["quote", "contact"] as const;
export type Kind = (typeof KINDS)[number];

export type FieldError = "required" | "invalid" | "too_long";
export type InquiryInput = {
  kind: Kind;
  locale: Locale;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  country?: string;
  quantity?: string;
  unit?: Unit;
  message: string;
  items: { id: string; note?: string }[];
};

export const LIMITS = {
  name: 200, email: 320, company: 200, phone: 40, country: 100,
  quantity: 40, message: 5000, itemNote: 500, items: 50,
} as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+\d][\d\s().-]*$/;
const rec = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown) => (typeof v === "string" ? v.trim() : undefined);

export type ValidationResult =
  | { ok: true; data: InquiryInput }
  | { ok: false; fields: Record<string, FieldError> };

/**
 * Server-side validation. Pure: the caller supplies the catalog ids.
 * Optional fields that are empty are dropped, never stored as "".
 */
export function validateInquiry(body: unknown, validFabricIds: ReadonlySet<string>): ValidationResult {
  const fields: Record<string, FieldError> = {};
  if (!rec(body)) return { ok: false, fields: { body: "invalid" } };

  const required = (key: "name" | "email" | "message", max: number) => {
    const v = str(body[key]);
    if (!v) fields[key] = "required";
    else if (v.length > max) fields[key] = "too_long";
    return v ?? "";
  };
  const optional = (key: "company" | "phone" | "country" | "quantity", max: number) => {
    const v = str(body[key]);
    if (!v) return undefined;
    if (v.length > max) fields[key] = "too_long";
    return v;
  };

  const name = required("name", LIMITS.name);
  const email = required("email", LIMITS.email);
  if (email && !fields.email && !EMAIL.test(email)) fields.email = "invalid";
  // A quote request may rest on name, email and the selected fabrics alone.
  const message = body.kind === "quote" ? (str(body.message) ?? "") : required("message", LIMITS.message);
  if (message.length > LIMITS.message) fields.message = "too_long";
  const company = optional("company", LIMITS.company);
  const phone = optional("phone", LIMITS.phone);
  if (phone && !fields.phone && !PHONE.test(phone)) fields.phone = "invalid";
  const country = optional("country", LIMITS.country);
  const quantity = optional("quantity", LIMITS.quantity);

  const unitRaw = str(body.unit);
  let unit: Unit | undefined;
  if (unitRaw) {
    if ((UNITS as readonly string[]).includes(unitRaw)) unit = unitRaw as Unit;
    else fields.unit = "invalid";
  }

  const kind = KINDS.find((k) => k === body.kind);
  if (!kind) fields.kind = "invalid";
  const locale = locales.find((l) => l === body.locale);
  if (!locale) fields.locale = "invalid";

  const items: { id: string; note?: string }[] = [];
  if (body.items !== undefined) {
    if (!Array.isArray(body.items) || body.items.length > LIMITS.items) fields.items = "invalid";
    else {
      for (const it of body.items) {
        const id = rec(it) ? str(it.id) : undefined;
        const note = rec(it) ? str(it.note) : undefined;
        if (!id || !validFabricIds.has(id) || (note && note.length > LIMITS.itemNote) || items.some((x) => x.id === id)) {
          fields.items = "invalid";
          break;
        }
        items.push(note ? { id, note } : { id });
      }
    }
  }

  const consent = body.consent;
  if (!rec(consent) || consent.accepted !== true || consent.version !== CONSENT_VERSION) fields.consent = "required";

  if (Object.keys(fields).length > 0 || !kind || !locale) return { ok: false, fields };
  return { ok: true, data: { kind, locale, name, email, company, phone, country, quantity, unit, message, items } };
}
