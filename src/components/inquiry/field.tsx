import type { ReactNode } from "react";

/** Shared look for form controls: underlined, display-serif text, brass focus line. */
export const control =
  "block w-full rounded-none border-0 border-b bg-transparent pb-2 pt-1 font-display text-xl text-ink placeholder:text-muted focus:border-brass";

export const controlBorder = (hasError: boolean) =>
  hasError ? "border-b-2 border-ink" : "border-brass-line";

/** Drawn mark that carries an error without relying on colour. */
export function ErrorMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="mt-[0.2em] h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4.5v4.2M8 11.2v.1" strokeLinecap="round" />
    </svg>
  );
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex gap-2 text-sm font-medium text-ink">
      <ErrorMark />
      <span>{children}</span>
    </p>
  );
}

export function Field({
  id, label, optional, hint, error, children,
}: {
  id: string;
  label: string;
  optional?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline gap-3">
        <span className="label !text-[0.68rem] text-ink">{label}</span>
        {optional && <span className="text-xs text-muted">{optional}</span>}
      </label>
      {hint && <p id={`${id}-hint`} className="mt-1 max-w-[52ch] text-sm text-muted">{hint}</p>}
      <div className="mt-1">{children}</div>
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}
