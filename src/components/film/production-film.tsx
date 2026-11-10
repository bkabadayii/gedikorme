"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import type { Copy } from "@/content/copy/tr";

/* Üretim Filmi: one production line (yarn, knitting, dyeing, finishing,
   store, delivery). Not played as a video: page scroll scrubs one clock value T
   and every frame is a pure function of it, so the camera pans and pushes in
   as you scroll, and the step buttons jump to a scene. All imagery is procedural CSS/SVG: it is
   representative, not Gedik Örme's own machinery. Copy lives in content/copy. */

export type FilmCopy = Copy["film"];
type P = (a: number, b: number, ease?: (t: number) => number) => number;
type SP = { T: number; A: number; p: P; C: Record<string, number>; dye: string; total: number; F: FilmCopy };

const INK = '#23211e', CARD = '#faf8f3', STONE = '#e6e1d8', BRASS = '#6f5524', BL = '#b69a63', MUTED = '#5b5750', ECRU = '#ece3cf';
const SANS = "var(--font-jost), system-ui, sans-serif";
const W = 1920, HY = 850;
const NAMES = ['Acilis', 'Iplik', 'Orme', 'Boyama', 'Apre', 'Magaza', 'Dunya', 'Kapanis'];
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const MOTION = {
  enter: (t: number) => (--t) * t * t + 1,
  draw: (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  pop: (t: number) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2),
};
const OTHER = ['#2f3a55', '#5f6440', '#b8893a', '#3a3632', '#8c5a4a', '#46576b'];

function makeP(T: number): P {
  return (a: number, b: number, ease: (t: number) => number = MOTION.enter) => (b <= a ? (T >= a ? 1 : 0) : ease(clamp((T - a) / (b - a), 0, 1)));
}
const abs = (o: CSSProperties): CSSProperties => Object.assign({ position: 'absolute' } as CSSProperties, o);
const label = (size = 14, color = MUTED): CSSProperties => ({ font: `400 ${size}px ${SANS}`, letterSpacing: '0.28em', textTransform: 'uppercase', color });

function pinked(n = 30, depth = 3) {
  const pts: string[] = ['0% 0%', '100% 0%'];
  for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 100}% ${i % 2 ? 100 : 100 - depth}%`);
  return `polygon(${pts.join(',')})`;
}

function KnitRect({ id, w, h, color, shift = 0 }: { id: string; w: number; h: number; color: string; shift?: number }) {
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <defs>
        <pattern id={id} width="20" height="24" patternUnits="userSpaceOnUse" patternTransform={`translate(0 ${shift})`}>
          <rect width="20" height="24" fill={color} />
          <path d="M3 1 C3 12 7 18 10 23" stroke="rgba(0,0,0,.17)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M17 1 C17 12 13 18 10 23" stroke="rgba(0,0,0,.17)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M5 2 C5 11 8 16 10 20" stroke="rgba(255,255,255,.2)" strokeWidth="1.2" fill="none" />
          <path d="M15 2 C15 11 12 16 10 20" stroke="rgba(255,255,255,.12)" strokeWidth="1.2" fill="none" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill={`url(#${id})`} />
    </svg>
  );
}

/* ---------- sets (each 1920 wide, placed along one production line) ---------- */

const CONES = [660, 960, 1260];
function SetYarn({ T, p, C }: SP) {
  return (
    <div style={abs({ left: W, top: 0, width: W, height: 1080 })}>
      {CONES.map((cx, k) => {
        const pp = p(C.Iplik - 0.3 + k * 0.22, C.Iplik + 0.7 + k * 0.22, MOTION.pop);
        return (
          <div key={k}>
            <div style={abs({ left: cx - 170, top: HY - 18, width: 340, height: 36, background: 'radial-gradient(ellipse at center, rgba(60,50,30,.28), rgba(60,50,30,0) 70%)', opacity: clamp(pp, 0, 1) })}></div>
            <div style={abs({ left: cx - 130, top: HY - 360, width: 260, height: 360, transformOrigin: '50% 100%', transform: `scaleY(${pp})` })}>
              <div style={abs({ inset: 0, clipPath: 'polygon(30% 0,70% 0,100% 100%,0 100%)', background: `linear-gradient(90deg, rgba(60,50,30,.22), rgba(255,255,255,.28) 38%, rgba(60,50,30,.05) 60%, rgba(60,50,30,.26)), repeating-linear-gradient(0deg, #efe6d3 0 5px, #ddd0b5 5px 8px)`, backgroundPosition: `0 0, 0 ${T * 36}px` })}></div>
              <div style={abs({ left: 110, top: -22, width: 40, height: 26, background: INK })}></div>
            </div>
            <div style={abs({ left: cx - 11, top: 199, width: 22, height: 22, borderRadius: '50%', border: `2px solid ${BRASS}`, boxSizing: 'border-box', opacity: p(C.Iplik + 0.8 + k * 0.15, C.Iplik + 1.3 + k * 0.15) })}></div>
          </div>
        );
      })}
    </div>
  );
}

function Threads({ p, C }: SP) {
  return (
    <svg width={W * 2} height={1080} style={abs({ left: W, top: 0, overflow: 'visible', pointerEvents: 'none' })}>
      {CONES.map((cx, k) => {
        const fx = W + 700 + 260 * k;
        const d = p(C.Iplik + 1.4 + k * 0.18, C.Orme + 0.5, MOTION.draw);
        return (
          <path key={k} d={`M ${cx} ${HY - 382} L ${cx} 210 C ${cx + 520} 150, ${fx - 520} 130, ${fx} 250`} pathLength="1"
            stroke="#ad9a72" strokeWidth="2.5" fill="none" strokeDasharray="1" strokeDashoffset={1 - d} />
        );
      })}
    </svg>
  );
}

function SetKnit({ A, p, C }: SP) {
  const fh = 24 + 500 * p(C.Orme + 0.2, C.Orme + 6.4, MOTION.draw);
  const car = 520 + 790 * (0.5 + 0.5 * Math.sin(A * 2.6));
  return (
    <div style={abs({ left: W * 2, top: 0, width: W, height: 1080 })}>
      <div style={abs({ left: 560, top: 304, width: 800, height: fh, overflow: 'hidden', boxShadow: '0 30px 50px -18px rgba(60,50,30,.35)' })}>
        <div style={abs({ left: 0, bottom: 0 })}><KnitRect id="knitA" w={800} h={540} color={ECRU} /></div>
        <div style={abs({ inset: 0, background: 'linear-gradient(90deg, rgba(60,50,30,.12), rgba(0,0,0,0) 18%, rgba(255,255,255,.08) 50%, rgba(0,0,0,0) 82%, rgba(60,50,30,.12))' })}></div>
      </div>
      <div style={abs({ left: 540, top: 290, width: 840, height: 14, background: `repeating-linear-gradient(90deg, ${BL} 0 2px, rgba(0,0,0,0) 2px 20px)` })}></div>
      <div style={abs({ left: 520, top: 250, width: 880, height: 40, background: INK })}></div>
      <div style={abs({ left: car, top: 236, width: 90, height: 68, background: BRASS })}>
        <div style={abs({ left: 10, top: 10, right: 10, bottom: 10, border: `1px solid ${BL}` })}></div>
      </div>
      <div style={abs({ left: 520, top: 250, width: 4, height: 600, background: INK })}></div>
      <div style={abs({ left: 1396, top: 250, width: 4, height: 600, background: INK })}></div>
    </div>
  );
}

function SampleCard({ id, color, code, sample, style }: { id: string; color: string; code: string; sample: string; style: CSSProperties }) {
  return (
    <div style={Object.assign({ position: 'absolute', width: 200, height: 260, background: CARD, boxShadow: '0 30px 50px -18px rgba(60,50,30,.35)' }, style)}>
      <div style={abs({ inset: 7, border: `1px solid ${BL}` })}></div>
      <div style={abs({ left: 14, top: 14, clipPath: pinked(16, 3) })}><KnitRect id={id} w={172} h={178} color={color} /></div>
      <div style={abs({ left: 16, bottom: 22, ...label(11, MUTED), letterSpacing: '0.18em' })}>{code}</div>
      <div style={abs({ right: 16, bottom: 22, ...label(11, BRASS), letterSpacing: '0.18em' })}>{sample}</div>
    </div>
  );
}

function SetDye({ A, p, C, dye, F }: SP) {
  const B = C.Boyama;
  const dip = 320 * (p(B + 0.7, B + 1.8, MOTION.draw) - p(B + 3.3, B + 4.4, MOTION.draw));
  const top = 150 + dip;
  const dyed = 340 * p(B + 1.3, B + 3.1, MOTION.draw);
  return (
    <div style={abs({ left: W * 3, top: 0, width: W, height: 1080 })}>
      <div style={abs({ left: 600, top: 120, width: 720, height: 4, background: INK })}></div>
      <div style={abs({ left: 640, top: 124, width: 1, height: top - 138, background: INK })}></div>
      <div style={abs({ left: 1280, top: 124, width: 1, height: top - 138, background: INK })}></div>
      <div style={abs({ left: 560, top: 480, width: 800, height: 370, background: '#d3ccbf' })}></div>
      <div style={abs({ left: 660, top, width: 600, height: 340, clipPath: pinked(30, 3) })}>
        <KnitRect id="dyeBase" w={600} h={340} color={ECRU} />
        <div style={abs({ left: 0, bottom: 0, width: 600, height: dyed, overflow: 'hidden' })}>
          <div style={abs({ left: 0, bottom: 0 })}><KnitRect id="dyeTop" w={600} h={340} color={dye} /></div>
        </div>
      </div>
      <div style={abs({ left: 620, top: top - 16, width: 680, height: 7, background: BRASS })}></div>
      <div style={abs({ left: 570, top: 520, width: 780, height: 320, background: dye, opacity: 0.9 })}></div>
      <div style={abs({ left: 570, top: 520, width: 780, height: 3, background: 'rgba(255,255,255,.28)' })}></div>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const ph = (A * 0.55 + i * 0.173) % 1;
        return <div key={i} style={abs({ left: 620 + i * 125 + Math.sin(A * 2 + i) * 10, top: 820 - ph * 290, width: 12, height: 12, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,.55)', opacity: 0.8 * (1 - ph) })}></div>;
      })}
      <div style={abs({ left: 560, top: 480, width: 10, height: 370, background: INK })}></div>
      <div style={abs({ left: 1350, top: 480, width: 10, height: 370, background: INK })}></div>
      <div style={abs({ left: 560, top: 840, width: 800, height: 10, background: INK })}></div>
      {OTHER.slice(0, 3).map((col, k) => {
        const pp = p(B + 4.2 + k * 0.22, B + 5.0 + k * 0.22, MOTION.pop);
        return <SampleCard key={k} id={`var${k}`} color={col} code={`${F.colour} 0${k + 1}`} sample={F.sample}
          style={{ left: 1440 + k * 110, top: 230 + k * 70, opacity: clamp(pp * 1.4, 0, 1), transform: `translateY(${(1 - pp) * 60}px) rotate(${-8 + k * 7}deg)` }} />;
      })}
    </div>
  );
}

function SetFinish({ T, A, p, C, dye }: SP) {
  const rt = 46 + 70 * p(C.Apre - 0.2, C.Magaza + 0.2, MOTION.draw);
  const rollTop = 790 - rt / 2;
  const shift = (T * 46) % 24;
  return (
    <div style={abs({ left: W * 4, top: 0, width: W, height: 1080 })}>
      <div style={abs({ left: 480, top: 168, width: 960, height: rollTop - 168, overflow: 'hidden' })}>
        <KnitRect id="apre" w={960} h={700} color={dye} shift={shift} />
        <div style={abs({ left: 0, top: 0, width: 960, height: 300, background: 'repeating-linear-gradient(112deg, rgba(0,0,0,.13) 0 16px, rgba(0,0,0,0) 16px 44px, rgba(255,255,255,.09) 44px 56px, rgba(0,0,0,0) 56px 96px)', backgroundPosition: `0 ${T * 46}px` })}></div>
        <div style={abs({ left: 0, top: 330, width: 960, height: 400, background: 'linear-gradient(100deg, rgba(255,255,255,0) 38%, rgba(255,255,255,.24) 50%, rgba(255,255,255,0) 62%)', backgroundSize: '220% 100%', backgroundPosition: `${(A * 30) % 220}% 0` })}></div>
        <div style={abs({ inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,.16), rgba(0,0,0,0) 14%, rgba(0,0,0,0) 86%, rgba(0,0,0,.16))' })}></div>
      </div>
      <div style={abs({ left: 470, top: rollTop, width: 980, height: rt, background: `linear-gradient(180deg, rgba(0,0,0,.38), rgba(255,255,255,.14) 34%, rgba(0,0,0,0) 56%, rgba(0,0,0,.42)), ${dye}`, boxShadow: '0 30px 50px -18px rgba(60,50,30,.35)' })}></div>
      <div style={abs({ left: 456, top: 790 - 14, width: 14, height: 28, background: INK })}></div>
      <div style={abs({ left: 1450, top: 790 - 14, width: 14, height: 28, background: INK })}></div>
      <div style={abs({ left: 420, top: 150, width: 18, height: HY - 150, background: INK })}></div>
      <div style={abs({ left: 1482, top: 150, width: 18, height: HY - 150, background: INK })}></div>
      <div style={abs({ left: 420, top: 150, width: 1080, height: 18, background: INK })}></div>
      <div style={abs({ left: 440, top: 404, width: 1040, height: 60, background: 'linear-gradient(180deg, #4b4741, #9a958b 32%, #3a3631 66%, #1c1a17)' })}>
        <div style={abs({ inset: 0, background: 'repeating-linear-gradient(90deg, rgba(255,255,255,.06) 0 2px, rgba(0,0,0,0) 2px 60px)', backgroundPosition: `${T * 80}px 0` })}></div>
      </div>
      {[440, 1456].map((x, i) => <div key={i} style={abs({ left: x - 6, top: 418, width: 36, height: 36, borderRadius: '50%', background: BRASS, border: `2px solid ${BL}`, boxSizing: 'border-box' })}></div>)}
    </div>
  );
}

const SHELVES = [380, 590, 800];
function SetStore({ p, C, dye }: SP) {
  const cols = [dye, ...OTHER, ECRU, '#c9bfae'];
  return (
    <div style={abs({ left: W * 5, top: 0, width: W, height: 1080 })}>
      <div style={abs({ left: 360, top: 140, width: 1200, height: 710, border: `1px solid ${BL}`, boxSizing: 'border-box', background: 'rgba(250,248,243,.5)' })}>
        <div style={abs({ inset: 7, border: `1px solid ${BL}` })}></div>
      </div>
      <div style={abs({ left: 360, width: 1200, top: 176, textAlign: 'center', ...label(16, BRASS), opacity: p(C.Magaza - 0.2, C.Magaza + 0.6) })}>Gedik Örme · Zeytinburnu</div>
      {SHELVES.map((y, si) => (
        <div key={si}>
          <div style={abs({ left: 420, top: y, width: 1080, height: 4, background: INK })}></div>
          {[0, 1, 2, 3, 4, 5].map((j) => {
            const n = si * 6 + j;
            const pp = p(C.Magaza - 0.1 + n * 0.09, C.Magaza + 0.6 + n * 0.09, MOTION.pop);
            const col = cols[(n * 5 + si) % cols.length];
            return <div key={j} style={abs({ left: 470 + j * 170, top: y - 150, width: 150, height: 150, borderRadius: '50%', transformOrigin: '50% 100%', transform: `scale(${pp})`,
              background: `radial-gradient(circle at 36% 30%, rgba(255,255,255,.2), rgba(0,0,0,.22) 75%), repeating-radial-gradient(circle, rgba(0,0,0,0) 0 7px, rgba(0,0,0,.09) 7px 8px), radial-gradient(circle, ${INK} 0 9%, #cfc6b4 9.5% 15%, ${col} 15.5%)` })}></div>;
          })}
        </div>
      ))}
    </div>
  );
}

const TARGETS = [[640, 430], [760, 640], [1190, 570], [1320, 390], [1560, 250], [400, 300], [1480, 700], [880, 730]];
function SetWorld({ T, A, p, C, dye, F }: SP) {
  const D = C.Dunya, cx = 960, cy = 470, r = 300, ist = [1010, 330];
  const rot = T * 0.35 + A * 0.05;
  const fly = p(D - 0.5, D + 1.0, MOTION.draw);
  const fs = 110 - 96 * fly;
  const fxp = 260 + (ist[0] - 260) * fly, fyp = 760 + (ist[1] - 760) * fly - Math.sin(fly * Math.PI) * 180;
  const pulse = (A * 0.8) % 1;
  return (
    <div style={abs({ left: W * 6, top: 0, width: W, height: 1080 })}>
      <div style={abs({ left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: '50%', border: `1.5px solid ${INK}`, boxSizing: 'border-box', background: `radial-gradient(circle at 38% 32%, ${CARD}, #e3dccf)`, overflow: 'hidden' })}>
        {[0, 1, 2, 3].map((k) => {
          const w = 2 * r * Math.abs(Math.cos(rot + (k * Math.PI) / 4));
          return <div key={k} style={abs({ left: r - w / 2, top: 0, width: w, height: 2 * r, borderRadius: '50%', border: '1px solid rgba(35,33,30,.28)', boxSizing: 'border-box' })}></div>;
        })}
        {[-200, -100, 0, 100, 200].map((dy, k) => {
          const hw = Math.sqrt(r * r - dy * dy);
          return <div key={k} style={abs({ left: r - hw, top: r + dy, width: 2 * hw, height: 1, background: 'rgba(35,33,30,.28)' })}></div>;
        })}
      </div>
      <svg width={W} height={1080} style={abs({ left: 0, top: 0, overflow: 'visible' })}>
        {TARGETS.map(([tx, ty], i) => {
          const d = p(D + 1.0 + i * 0.28, D + 2.2 + i * 0.28, MOTION.draw);
          const mx = (ist[0] + tx) / 2, my = (ist[1] + ty) / 2 - Math.hypot(tx - ist[0], ty - ist[1]) * 0.35;
          const dot = p(D + 2.0 + i * 0.28, D + 2.5 + i * 0.28, MOTION.pop);
          return (
            <g key={i}>
              <path d={`M ${ist[0]} ${ist[1]} Q ${mx} ${my} ${tx} ${ty}`} pathLength="1" stroke={dye} strokeWidth="2.5" fill="none" strokeDasharray="1" strokeDashoffset={1 - d} />
              <circle cx={tx} cy={ty} r={7 * dot} fill={INK} />
            </g>
          );
        })}
      </svg>
      <div style={abs({ left: ist[0] - 30, top: ist[1] - 30, width: 60, height: 60, borderRadius: '50%', border: `1.5px solid ${BRASS}`, boxSizing: 'border-box', transform: `scale(${0.3 + pulse})`, opacity: (1 - pulse) * fly })}></div>
      <div style={abs({ left: ist[0] + 26, top: ist[1] - 34, ...label(14, BRASS), opacity: p(D + 0.8, D + 1.4) })}>{F.istanbul}</div>
      <div style={abs({ left: fxp - fs / 2, top: fyp - fs / 2, width: fs, height: fs, borderRadius: '50%', opacity: p(D - 0.6, D - 0.2),
        background: fly < 1 ? `repeating-radial-gradient(circle, rgba(0,0,0,0) 0 5px, rgba(0,0,0,.1) 5px 6px), radial-gradient(circle, ${INK} 0 10%, #cfc6b4 10.5% 16%, ${dye} 16.5%)` : BRASS })}></div>
    </div>
  );
}


const STILL_T = 25; // Apre: the reduced-motion still frame
const T_START = 5.0; // yarn, caption in
const T_END = 37.3; // end of delivery, then the loop restarts at the yarn
const CAPTION_FADE = 0.18;
const SCENES: [string, number][] = [['Acilis', 4], ['Iplik', 5], ['Orme', 6.5], ['Boyama', 6], ['Apre', 5.5], ['Magaza', 5], ['Dunya', 6], ['Kapanis', 4.5]];
const CUES: Record<string, number> = {};
SCENES.reduce((acc, [n, d]) => ((CUES[n] = acc), acc + d), 0);
const STEPS = NAMES.slice(1, 7);
const JUMP_AT = 1.4; // seconds into a scene where its jump button lands

type Look = { x: number; y: number }; // pointer offset, -1..1

function Film({ T, A, F, look }: { T: number; A: number; F: FilmCopy; look: Look }) {
  const C = CUES;
  const p = makeP(T);
  const dye = '#792E3A';
  const total = 42.5;

  let pos = 0;
  for (let i = 1; i < NAMES.length; i++) pos += p(C[NAMES[i]] - 0.6, C[NAMES[i]] + 0.6, MOTION.draw);
  let si = 0;
  for (let i = 0; i < NAMES.length; i++) if (T >= C[NAMES[i]]) si = i;
  const s0 = C[NAMES[si]], s1 = si + 1 < NAMES.length ? C[NAMES[si + 1]] : total;
  const bump = 0.09 * Math.sin(Math.PI * clamp((T - s0) / (s1 - s0), 0, 1));
  const zk = p(C.Orme + 0.6, C.Orme + 1.7, MOTION.draw) - p(C.Orme + 3.2, C.Orme + 5.0, MOTION.draw);
  const z = 1 + bump + 0.85 * zk;
  const fy = 540 + (330 - 540) * zk;
  // The camera swings into every pan and settles, with a little pointer parallax.
  const swing = Math.sin(Math.PI * (pos - Math.floor(pos)));
  const ry = -7 * swing + look.x * 3;
  const rx = 2 + look.y * -2.5 + 1.5 * bump * 10;

  const sp: SP = { T, A, p, C, dye, total, F };
  return (
    <div style={abs({ inset: 0, overflow: 'hidden', background: 'linear-gradient(180deg, #ece8e1, #dcd6cb)', perspective: 2200 })}>
      <div style={abs({ left: 0, top: 0, width: W, height: 1080, transformOrigin: '0 0', transform: `translate(960px, 540px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${z}) translate(-960px, ${-fy}px)` })}>
        <div style={abs({ left: 0, top: 0, width: W * 8, height: 1080, transform: `translateX(${-pos * W}px)` })}>
          <div style={abs({ left: 0, top: HY, width: W * 8, height: 1, background: BL })}></div>
          <SetYarn {...sp} />
          <SetKnit {...sp} />
          <Threads {...sp} />
          <SetDye {...sp} />
          <SetFinish {...sp} />
          <SetStore {...sp} />
          <SetWorld {...sp} />
        </div>
      </div>
      <div style={abs({ inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 60%, rgba(60,50,30,.14))' })}></div>
    </div>
  );
}

const subscribeNever = () => () => {};

/** Autoplaying production line on a loop. Step buttons jump the clock to a
 *  scene (the camera glides there) and playback carries on from it. */
export function ProductionFilm({ copy }: { copy: FilmCopy }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [T, setT] = useState(STILL_T);
  const [A, setA] = useState(0);
  const [look, setLook] = useState<Look>({ x: 0, y: 0 });
  const [playing, setPlaying] = useState(false); // follows the reduced-motion preference only
  const [inView, setInView] = useState(false);
  const mounted = useSyncExternalStore(subscribeNever, () => true, () => false);
  const clock = useRef(STILL_T);
  const goal = useRef<number | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    // Reduced motion: no autoplay, the still frame stays until a step is chosen.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => {
      setPlaying(!mq.matches);
      if (!mq.matches) clock.current = T_START;
    };
    onMq();
    mq.addEventListener("change", onMq);
    return () => { ro.disconnect(); io.disconnect(); mq.removeEventListener("change", onMq); };
  }, []);

  // One loop: advances the clock while playing, glides toward a chosen step,
  // and keeps ambient motion (carriage, bubbles) alive.
  useEffect(() => {
    if (!inView) return;
    let raf = 0, prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - prev) / 1000);
      prev = now;
      if (goal.current !== null) {
        clock.current += (goal.current - clock.current) * 0.12;
        if (Math.abs(goal.current - clock.current) < 0.04) { clock.current = goal.current; goal.current = null; }
      } else if (playing) {
        clock.current += dt;
        if (clock.current >= T_END) clock.current = T_START;
      }
      setT(clock.current);
      if (playing) setA(now / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, playing]);

  const jump = (i: number) => { goal.current = CUES[STEPS[i]] + JUMP_AT; };

  let posT = 0;
  for (let i = 1; i < NAMES.length; i++) posT += clamp((T - (CUES[NAMES[i]] - 0.6)) / 1.2, 0, 1);
  const activeStep = Math.round(clamp(posT - 1, 0, 5));
  const capIdx = STEPS.findIndex((n, i) => T >= CUES[n] + 0.9 && T < CUES[NAMES[i + 2]] - 0.35);
  const capOpacity = capIdx >= 0
    ? clamp(Math.min((T - (CUES[STEPS[capIdx]] + 0.9)) / CAPTION_FADE, (CUES[NAMES[capIdx + 2]] - 0.35 - T) / CAPTION_FADE), 0, 1)
    : 0;
  const parts = copy.captions[capIdx >= 0 ? capIdx : activeStep];
  // Soften the cut where the loop restarts.
  const loopFade = clamp(Math.min(T - T_START, T_END - T) / 0.5, 0, 1);

  return (
    <div className="hairline-frame relative flex flex-col gap-3 bg-card p-3 shadow-[0_30px_50px_-18px_rgba(60,50,30,.35)] md:gap-4 md:p-5">
      <nav aria-label={copy.railLabel} className="flex items-center">
        <ol className="flex min-w-0 flex-1 gap-1 overflow-x-auto md:gap-3">
          {copy.rail.map((name, i) => (
            <li key={name} className="shrink-0">
              <button
                type="button"
                onClick={() => jump(i)}
                aria-current={activeStep === i ? "step" : undefined}
                className={`label flex items-baseline gap-2 border-b-[3px] px-2 pb-2 pt-1 transition-colors duration-200 hover:text-brass md:px-4 ${activeStep === i ? "border-brass text-ink" : "border-transparent text-muted"}`}
              >
                <span className="font-display text-base normal-case italic tracking-normal text-brass md:text-lg">0{i + 1}</span>
                <span className="!text-[0.62rem] md:!text-[0.72rem]">{name}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div
        ref={box}
        role="img"
        aria-label={copy.ariaLabel}
        className="relative aspect-video w-full overflow-hidden"
        style={{ background: STONE }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setLook({ x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 });
        }}
        onPointerLeave={() => setLook({ x: 0, y: 0 })}
      >
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 1080, transformOrigin: "0 0", transform: `scale(${scale})`, opacity: loopFade }}>
          {/* Float-heavy styles differ between server and client, so draw after mount. */}
          {mounted && <Film T={T} A={A} F={copy} look={look} />}
        </div>
      </div>

      <p className="min-h-[3.25rem] text-balance text-center font-display text-2xl leading-tight md:min-h-[3.5rem] md:text-4xl" style={{ opacity: capOpacity }}>
        {parts.map((x, i) => (i === 1 ? <em key={i}>{x}</em> : <span key={i}>{x}</span>))}
      </p>
    </div>
  );
}
