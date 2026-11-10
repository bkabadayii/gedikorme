// One-off generator for the favicon set and the Open Graph images.
// Run: node scripts/make-brand-assets.mjs  (needs network for Google Fonts and Playwright's Chromium).
// Outputs are committed; rerun only when the logo or the tagline changes.
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const logo = `data:image/png;base64,${readFileSync(resolve(root, "public/brand/logo.png")).toString("base64")}`;
const stone = "#e6e1d8", card = "#faf8f3", ink = "#23211e", brass = "#6f5524", line = "#b69a63";

const browser = await chromium.launch();
const shot = async (html, w, h, file) => {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.screenshot({ type: "png", omitBackground: true });
  await page.close();
  if (file) writeFileSync(resolve(root, file), buf);
  return buf;
};

// Alpha .996 keeps the PNGs RGBA, which Next's ICO decoder requires.
// The "G" mark: the left part of the logo (x 100-360, y 28-322 of 705x355), on stone, square corners.
const icon = (size) => `<body style="margin:0;background:transparent">
<div style="width:${size}px;height:${size}px;background:rgba(230,225,216,.996);position:relative;overflow:hidden">
  <div style="position:absolute;left:50%;top:50%;width:260px;height:294px;transform:translate(-50%,-50%) scale(${(size * 0.8) / 294});transform-origin:center;
    background:url(${logo}) -100px -28px / 705px 355px no-repeat"></div></div></body>`;

const sizes = { 16: null, 32: null, 48: null, 180: "src/app/apple-icon.png", 192: "src/app/icon.png" };
const pngs = {};
for (const s of Object.keys(sizes)) pngs[s] = await shot(icon(+s), +s, +s, sizes[s]);

// favicon.ico with PNG payloads (16, 32, 48).
const ico = [16, 32, 48];
const head = Buffer.alloc(6 + 16 * ico.length);
head.writeUInt16LE(1, 2); head.writeUInt16LE(ico.length, 4);
let offset = head.length;
ico.forEach((s, i) => {
  const b = 6 + 16 * i;
  head[b] = s; head[b + 1] = s; head.writeUInt16LE(1, b + 4); head.writeUInt16LE(32, b + 6);
  head.writeUInt32LE(pngs[s].length, b + 8); head.writeUInt32LE(offset, b + 12);
  offset += pngs[s].length;
});
writeFileSync(resolve(root, "src/app/favicon.ico"), Buffer.concat([head, ...ico.map((s) => pngs[s])]));

const og = (headline, sub) => `<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;1,6..96,400&family=Jost:wght@400;500&display=swap" rel="stylesheet">
<style>
  body{margin:0;width:1200px;height:630px;background:${stone};display:grid;place-items:center;font-family:Jost,sans-serif;color:${ink}}
  .card{width:1060px;height:490px;background:${card};box-sizing:border-box;border:1px solid ${line};outline:1px solid ${line};outline-offset:-12px;
    display:grid;grid-template-columns:420px 1fr;align-items:center;gap:30px;padding:0 70px 0 50px;box-shadow:0 30px 50px -18px rgba(60,50,30,.35)}
  .card img{width:380px;height:auto}
  h1{font-family:'Bodoni Moda',serif;font-weight:400;font-size:66px;line-height:1.06;margin:0}
  p{margin:30px 0 0;font-size:22px;letter-spacing:.2em;text-transform:uppercase;color:${brass};font-weight:500}
</style></head><body><div class="card"><img src="${logo}" alt=""><div><h1>${headline}</h1><p>${sub}</p></div></div></body></html>`;

await shot(og("Örme kumaş <em>üreticisi</em>", "Örme · Boyama · Apre — 1997"), 1200, 630, "public/og/og-tr.png");
await shot(og("Knitted-fabric <em>manufacturer</em>", "Knitting · Dyeing · Finishing — 1997"), 1200, 630, "public/og/og-en.png");
await browser.close();
console.log("brand assets written");
