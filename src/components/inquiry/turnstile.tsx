"use client";

import { useEffect, useRef } from "react";

type TurnstileApi = {
  render(el: HTMLElement, opts: Record<string, unknown>): string;
  reset(id: string): void;
  remove(id: string): void;
};
declare global {
  interface Window { turnstile?: TurnstileApi }
}

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loading: Promise<void> | undefined;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { loading = undefined; reject(new Error("turnstile")); };
    document.head.appendChild(s);
  });
  return loading;
}

/** Cloudflare Turnstile widget. `resetKey` changes to ask for a fresh challenge (tokens are single-use). */
export function Turnstile({
  siteKey, locale, resetKey, onToken,
}: {
  siteKey: string;
  locale: string;
  resetKey: number;
  onToken: (token: string | null) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const cb = useRef(onToken);
  useEffect(() => { cb.current = onToken; });

  useEffect(() => {
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !box.current || !window.turnstile) return;
        widget.current = window.turnstile.render(box.current, {
          sitekey: siteKey,
          language: locale,
          theme: "light",
          callback: (t: string) => cb.current(t),
          "expired-callback": () => cb.current(null),
          "error-callback": () => cb.current(null),
        });
      })
      .catch(() => cb.current(null));
    return () => {
      cancelled = true;
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = undefined;
    };
  }, [siteKey, locale]);

  useEffect(() => {
    if (resetKey > 0 && widget.current && window.turnstile) {
      cb.current(null);
      window.turnstile.reset(widget.current);
    }
  }, [resetKey]);

  return <div ref={box} className="min-h-[65px]" />;
}
