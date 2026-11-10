"use client";

import { useCallback, useSyncExternalStore } from "react";
import { addId, INQUIRY_KEY, parseIds, removeId } from "./storage";

/** Browser store for the inquiry basket: localStorage, synced across tabs and
 *  components. Holds fabric ids only; no personal data. */
const EMPTY: readonly string[] = [];
let raw: string | null | undefined; // last value read; undefined before the first read
let snapshot: readonly string[] = EMPTY;
const listeners = new Set<() => void>();

function read(): readonly string[] {
  let next: string | null = null;
  try {
    next = window.localStorage.getItem(INQUIRY_KEY);
  } catch {
    /* storage blocked: the basket lasts for this page view only */
    next = raw ?? null;
  }
  if (next !== raw) {
    raw = next;
    const ids = parseIds(next);
    snapshot = ids.length ? ids : EMPTY;
  }
  return snapshot;
}

function write(ids: string[]) {
  const value = JSON.stringify(ids);
  try {
    window.localStorage.setItem(INQUIRY_KEY, value);
  } catch {
    /* keep going in memory */
  }
  raw = value;
  snapshot = ids.length ? ids : EMPTY;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === INQUIRY_KEY || e.key === null) { read(); cb(); }
  };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
}

export function useInquiry() {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY);
  const add = useCallback((id: string) => write(addId(read(), id)), []);
  const remove = useCallback((id: string) => write(removeId(read(), id)), []);
  const clear = useCallback(() => write([]), []);
  return { ids, add, remove, clear, has: (id: string) => ids.includes(id) };
}
