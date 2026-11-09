import { describe, expect, it } from "vitest";
import { legacyRedirects, localizedPath, localizedRedirects, localizedRewrites } from "./routes";

describe("localizedPath", () => {
  it("maps route keys to locale-prefixed URLs", () => {
    expect(localizedPath("tr", "home")).toBe("/tr");
    expect(localizedPath("tr", "fabrics")).toBe("/tr/kumaslar");
    expect(localizedPath("en", "fabrics")).toBe("/en/fabrics");
    expect(localizedPath("tr", "requestQuote")).toBe("/tr/teklif-iste");
    expect(localizedPath("en", "requestQuote")).toBe("/en/request-quote");
  });
});

describe("localizedRewrites", () => {
  it("rewrites Turkish segments (and nested slugs) to internal folders", () => {
    const rewrites = localizedRewrites();
    expect(rewrites).toContainEqual({ source: "/tr/kumaslar", destination: "/tr/fabrics" });
    expect(rewrites).toContainEqual({
      source: "/tr/kumaslar/:path*",
      destination: "/tr/fabrics/:path*",
    });
  });

  it("needs no rewrite for English, whose segments are the folder names", () => {
    expect(localizedRewrites().some((r) => r.source.startsWith("/en/"))).toBe(false);
  });
});

describe("redirects", () => {
  it("sends internal and wrong-locale segments to the canonical URL", () => {
    const redirects = localizedRedirects();
    expect(redirects).toContainEqual({
      source: "/tr/fabrics",
      destination: "/tr/kumaslar",
      permanent: true,
    });
    expect(redirects).toContainEqual({
      source: "/en/kumaslar",
      destination: "/en/fabrics",
      permanent: true,
    });
  });

  it("never redirects a canonical URL", () => {
    const canonical = new Set(
      (["tr", "en"] as const).flatMap((l) =>
        (["fabrics", "production", "about", "contact", "requestQuote"] as const).map((k) =>
          localizedPath(l, k),
        ),
      ),
    );
    for (const r of localizedRedirects()) expect(canonical.has(r.source)).toBe(false);
  });

  it("keeps the old-site URLs alive", () => {
    expect(legacyRedirects().map((r) => r.source)).toEqual(["/hakkimizda", "/galeri", "/iletisim"]);
  });
});
