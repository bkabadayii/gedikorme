"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { Fabric } from "@/content/catalog/types";
import type { Copy } from "@/content/copy/tr";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";
import { CONSENT_VERSION, LIMITS, UNITS, type Kind } from "@/lib/inquiry/validate";
import { useInquiry } from "@/lib/inquiry/store";
import { Field, ErrorMark, control, controlBorder } from "./field";
import { Turnstile } from "./turnstile";

type FormCopy = Copy["form"];
type Values = {
  name: string; email: string; company: string; phone: string; country: string;
  quantity: string; unit: string; message: string; consent: boolean;
};
const EMPTY: Values = {
  name: "", email: "", company: "", phone: "", country: "",
  quantity: "", unit: "", message: "", consent: false,
};
type Errors = Partial<Record<keyof Values | "verify", string>>;
type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "failed"; message: string }
  | { state: "sent"; ref: string; fabrics: Fabric[] };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+\d][\d\s().-]*$/;

/** Client-side mirror of the server rules; the server stays the authority. */
function validate(v: Values, c: FormCopy, hasToken: boolean, kind: Kind): Errors {
  const e: Errors = {};
  const need = (k: "name" | "email" | "message", max: number) => {
    const t = v[k].trim();
    if (!t) e[k] = c.errors.required;
    else if (t.length > max) e[k] = c.errors.tooLong;
  };
  need("name", LIMITS.name);
  need("email", LIMITS.email);
  if (!e.email && !EMAIL.test(v.email.trim())) e.email = c.errors.email;
  if (kind === "quote") {
    if (v.message.trim().length > LIMITS.message) e.message = c.errors.tooLong;
  } else need("message", LIMITS.message);
  if (v.phone.trim() && !PHONE.test(v.phone.trim())) e.phone = c.errors.phone;
  for (const [k, max] of [["company", LIMITS.company], ["phone", LIMITS.phone], ["country", LIMITS.country], ["quantity", LIMITS.quantity]] as const) {
    if (!e[k] && v[k].trim().length > max) e[k] = c.errors.tooLong;
  }
  if (!v.consent) e.consent = c.errors.consent;
  if (!hasToken) e.verify = c.errors.verify;
  return e;
}

const SERVER_FIELD: Record<string, string> = { required: "required", invalid: "invalid", too_long: "tooLong" };

export function InquiryForm({
  kind, locale, copy, siteKey, fabrics = [], notes = {}, browseHref, swatchLabel,
}: {
  kind: "quote" | "contact";
  locale: Locale;
  copy: FormCopy;
  /** Turnstile site key; empty when the form is not configured. */
  siteKey: string;
  /** Catalog entries for the basket, used to name the selected fabrics. */
  fabrics?: readonly Fabric[];
  notes?: Record<string, string>;
  browseHref?: string;
  swatchLabel?: string;
}) {
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const { ids, clear } = useInquiry();
  const [v, setV] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [token, setToken] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [touched, setTouched] = useState(false);
  const idem = useRef<string | undefined>(undefined);
  const honeypot = useRef<HTMLInputElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const failure = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Values>(k: K, value: Values[K]) => {
    setV((p) => ({ ...p, [k]: value }));
    if (touched) setErrors((p) => ({ ...p, [k]: undefined }));
  };
  const set2 = (k: keyof Values) => (e: { target: { value: string } }) => set(k, e.target.value as never);
  const blur = (k: keyof Values) => () => {
    if (!touched) return;
    setErrors((p) => ({ ...p, [k]: validate(v, copy, Boolean(token) || !siteKey, kind)[k] }));
  };

  // Focus the error summary (or the failure note) when it appears, so screen readers announce it.
  const errorKeys = Object.keys(errors).filter((k) => errors[k as keyof Errors]);
  useEffect(() => { if (errorKeys.length > 0) summary.current?.focus(); }, [errorKeys.length]);
  useEffect(() => { if (status.state === "failed") failure.current?.focus(); }, [status]);

  const picked = ids
    .map((x) => fabrics.find((f) => f.id === x))
    .filter((f): f is Fabric => Boolean(f));

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status.state === "submitting") return;
    setTouched(true);
    const found = validate(v, copy, Boolean(token) || !siteKey, kind);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus({ state: "submitting" });
    idem.current ??= crypto.randomUUID();
    const clean = (s: string) => s.trim() || undefined;
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idem.current },
        body: JSON.stringify({
          kind, locale,
          name: v.name.trim(), email: v.email.trim(), message: v.message.trim(),
          company: clean(v.company), phone: clean(v.phone), country: clean(v.country),
          quantity: clean(v.quantity), unit: v.quantity.trim() ? clean(v.unit) : undefined,
          items: kind === "quote" ? picked.map((f) => ({ id: f.id, note: clean(notes[f.id] ?? "") })) : [],
          consent: { accepted: v.consent, version: CONSENT_VERSION },
          turnstileToken: token,
          website: honeypot.current?.value ?? "",
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean; ref?: string; error?: string; fields?: Record<string, string>;
      };
      if (res.ok && body.ok && body.ref) {
        setStatus({ state: "sent", ref: body.ref, fabrics: kind === "quote" ? picked : [] });
        if (kind === "quote") clear();
        idem.current = undefined;
        return;
      }
      // Tokens are single-use: ask for a fresh challenge after any refusal.
      setResetKey((n) => n + 1);
      if (res.status === 422 && body.fields) {
        const next: Errors = {};
        for (const [field, code] of Object.entries(body.fields)) {
          const key = SERVER_FIELD[code] ?? "invalid";
          next[field as keyof Errors] = key === "required" && field === "consent" ? copy.errors.consent
            : key === "required" ? copy.errors.required
            : key === "tooLong" ? copy.errors.tooLong
            : field === "email" ? copy.errors.email
            : field === "phone" ? copy.errors.phone
            : copy.errors.invalid;
        }
        setErrors(next);
        setStatus({ state: "idle" });
        return;
      }
      const msg =
        res.status === 403 ? copy.failures.turnstile
        : res.status === 429 ? copy.failures.rateLimited
        : res.status === 502 ? copy.failures.delivery
        : res.status === 503 ? copy.failures.notConfigured
        : copy.failures.generic;
      setStatus({ state: "failed", message: msg });
    } catch {
      setResetKey((n) => n + 1);
      setStatus({ state: "failed", message: copy.failures.network });
    }
  }

  if (status.state === "sent") {
    return (
      <div className="hairline-frame relative bg-card p-8 shadow-[0_30px_50px_-18px_rgba(60,50,30,.3)] md:p-12" role="status">
        <h2 className="font-display text-3xl md:text-4xl">{kind === "quote" ? copy.successQuote : copy.successContact}</h2>
        <p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-ink/80">{copy.successBody}</p>
        <p className="label mt-8 !text-[0.68rem] text-muted">{copy.reference}</p>
        <p className="font-display text-3xl italic tracking-wide md:text-4xl">{status.ref}</p>
        {status.fabrics.length > 0 && (
          <ul className="mt-8 space-y-1 border-t border-brass-line pt-5">
            {status.fabrics.map((f) => (
              <li key={f.id} className="font-display text-xl">
                {f.name[locale]} <span className="label !text-[0.62rem] text-muted">{f.code}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          {browseHref && (
            <Link href={browseHref} className="label inline-block bg-ink px-6 py-4 text-card transition-colors duration-200 hover:bg-brass">
              {swatchLabel}
            </Link>
          )}
          <button
            type="button"
            onClick={() => { setV(EMPTY); setErrors({}); setTouched(false); setStatus({ state: "idle" }); setResetKey((n) => n + 1); }}
            className="label border-b border-brass-line pb-1.5 transition-colors duration-200 hover:text-brass"
          >
            {copy.newRequest}
          </button>
        </div>
      </div>
    );
  }

  const busy = status.state === "submitting";
  const err = (k: keyof Values) => errors[k];
  const describe = (k: keyof Values, hint?: boolean) =>
    [hint ? `${id(k)}-hint` : "", err(k) ? `${id(k)}-error` : ""].filter(Boolean).join(" ") || undefined;
  const field = (k: keyof Values, hint?: boolean) => ({
    id: id(k),
    "aria-invalid": err(k) ? true : undefined,
    "aria-describedby": describe(k, hint),
    onBlur: blur(k),
  });
  const submitLabel = kind === "quote" ? copy.submitQuote : copy.submitContact;

  return (
    <form onSubmit={submit} noValidate className="space-y-9" aria-busy={busy}>
      <noscript><p className="text-ink">{copy.noscript}</p></noscript>

      {errorKeys.length > 0 && (
        <div ref={summary} tabIndex={-1} role="alert" className="border-y-2 border-ink py-4 focus:outline-none">
          <p className="flex gap-2 font-medium"><ErrorMark /><span>{copy.summary}</span></p>
          <ul className="mt-2 space-y-1 pl-6 text-sm">
            {errorKeys.map((k) => {
              const target = k === "verify" ? `${uid}-verify` : id(k);
              const labels: Record<string, string> = {
                name: copy.name, email: copy.email, company: copy.company, phone: copy.phone,
                country: copy.country, quantity: copy.quantity, unit: copy.unit,
                message: kind === "quote" ? copy.messageQuote : copy.messageContact,
                consent: copy.consentShort, verify: copy.verifyLabel,
              };
              return (
                <li key={k}>
                  <a href={`#${target}`} className="underline underline-offset-4 decoration-brass-line hover:decoration-ink">
                    {labels[k] ?? k}: {errors[k as keyof Errors]}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {status.state === "failed" && (
        <div ref={failure} tabIndex={-1} role="alert" className="border-y-2 border-ink py-4 focus:outline-none">
          <p className="flex gap-2 font-medium"><ErrorMark /><span>{status.message}</span></p>
        </div>
      )}

      <div className="grid gap-x-10 gap-y-9 md:grid-cols-2">
        <Field id={id("name")} label={copy.name} error={err("name")}>
          <input {...field("name")} name="name" type="text" autoComplete="name" required value={v.name} onChange={set2("name")} className={`${control} ${controlBorder(Boolean(err("name")))}`} />
        </Field>
        <Field id={id("email")} label={copy.email} error={err("email")}>
          <input {...field("email")} name="email" type="email" autoComplete="email" inputMode="email" required value={v.email} onChange={set2("email")} className={`${control} ${controlBorder(Boolean(err("email")))}`} />
        </Field>
        {kind === "quote" && (
          <Field id={id("company")} label={copy.company} optional={copy.optional} error={err("company")}>
            <input {...field("company")} name="company" type="text" autoComplete="organization" value={v.company} onChange={set2("company")} className={`${control} ${controlBorder(Boolean(err("company")))}`} />
          </Field>
        )}
        <Field id={id("phone")} label={copy.phone} optional={copy.optional} error={err("phone")}>
          <input {...field("phone")} name="phone" type="tel" autoComplete="tel" inputMode="tel" value={v.phone} onChange={set2("phone")} className={`${control} ${controlBorder(Boolean(err("phone")))}`} />
        </Field>
        {kind === "quote" && (
          <>
            <Field id={id("country")} label={copy.country} optional={copy.optional} error={err("country")}>
              <input {...field("country")} name="country" type="text" autoComplete="country-name" value={v.country} onChange={set2("country")} className={`${control} ${controlBorder(Boolean(err("country")))}`} />
            </Field>
            <div className="grid grid-cols-[minmax(0,1fr)_7.5rem] gap-5">
              <Field id={id("quantity")} label={copy.quantity} optional={copy.optional} error={err("quantity")}>
                <input {...field("quantity")} name="quantity" type="text" inputMode="decimal" value={v.quantity} onChange={set2("quantity")} className={`${control} ${controlBorder(Boolean(err("quantity")))}`} />
              </Field>
              <Field id={id("unit")} label={copy.unit}>
                <select {...field("unit")} name="unit" value={v.unit} onChange={set2("unit")} className={`${control} ${controlBorder(false)} appearance-none`}>
                  <option value="">{copy.unitPlaceholder}</option>
                  {UNITS.map((u) => <option key={u} value={u}>{copy.units[u]}</option>)}
                </select>
              </Field>
            </div>
          </>
        )}
      </div>

      <Field
        id={id("message")}
        label={kind === "quote" ? copy.messageQuote : copy.messageContact}
        optional={kind === "quote" ? copy.optional : undefined}
        hint={kind === "quote" ? copy.messageHintQuote : undefined}
        error={err("message")}
      >
        <textarea {...field("message", kind === "quote")} name="message" rows={6} required={kind !== "quote"} value={v.message} onChange={set2("message")} className={`${control} ${controlBorder(Boolean(err("message")))} resize-y !text-lg leading-relaxed`} />
      </Field>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>Website<input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" /></label>
      </div>

      <div>
        <div className="flex items-start gap-4">
          <input
            id={id("consent")}
            type="checkbox"
            className="peer sr-only"
            checked={v.consent}
            onChange={(e) => set("consent", e.target.checked)}
            onBlur={blur("consent")}
            aria-invalid={err("consent") ? true : undefined}
            aria-describedby={err("consent") ? `${id("consent")}-error` : undefined}
          />
          <label htmlFor={id("consent")} className="flex cursor-pointer items-start gap-4 peer-checked:[&_svg]:opacity-100 peer-focus-visible:[&>span:first-child]:outline peer-focus-visible:[&>span:first-child]:outline-2 peer-focus-visible:[&>span:first-child]:outline-offset-2 peer-focus-visible:[&>span:first-child]:outline-brass">
            <span className={`mt-1 grid h-6 w-6 shrink-0 place-items-center border bg-card ${err("consent") ? "border-2 border-ink" : "border-brass-line"}`} aria-hidden="true">
              <svg viewBox="0 0 16 16" className="h-4 w-4 opacity-0 transition-opacity duration-200" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8.5l3.2 3L13 4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span className="max-w-[62ch] text-base leading-relaxed text-ink/90">{copy.consent}</span>
          </label>
        </div>
        <p className="mt-2 pl-10 text-sm">
          <Link href={localizedPath(locale, "privacy")} target="_blank" rel="noopener" className="border-b border-brass-line pb-0.5 transition-colors duration-200 hover:text-brass">
            {copy.privacyLink}
          </Link>
        </p>
        {err("consent") && (
          <p id={`${id("consent")}-error`} className="mt-2 flex gap-2 pl-10 text-sm font-medium text-ink"><ErrorMark /><span>{err("consent")}</span></p>
        )}
      </div>

      <div id={`${uid}-verify`} tabIndex={-1}>
        <p className="label !text-[0.68rem] text-muted">{copy.verifyLabel}</p>
        <div className="mt-2">
          {siteKey ? (
            <Turnstile siteKey={siteKey} locale={locale} resetKey={resetKey} onToken={(t) => { setToken(t); if (t) setErrors((p) => ({ ...p, verify: undefined })); }} />
          ) : (
            <p className="text-sm font-medium text-ink">{copy.failures.notConfigured}</p>
          )}
        </div>
        {errors.verify && (
          <p className="mt-2 flex gap-2 text-sm font-medium text-ink"><ErrorMark /><span>{errors.verify}</span></p>
        )}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="label inline-block bg-ink px-8 py-5 text-card transition-colors duration-200 hover:bg-brass disabled:cursor-wait disabled:opacity-70 disabled:hover:bg-ink"
      >
        {busy ? `${copy.submitting}…` : submitLabel}
      </button>
    </form>
  );
}
