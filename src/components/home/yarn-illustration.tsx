/**
 * "From yarn to fabric": an engraving-style line drawing of knitting, drawn as
 * plain SVG. Three compositions share one set of primitives so they can be
 * compared with ?illus=a|b|c on the home page. Decorative only (aria-hidden).
 * Lines are charcoal at low opacity with sparing oxblood accents. The short
 * reveal is CSS (see .ill-draw in globals.css) and is static under
 * prefers-reduced-motion.
 */
export type IllustrationVariant = "a" | "b" | "c";

const INK = "#292C29";
const WINE = "#792E3A";

// Deterministic jitter so server and client render the same hand-drawn wobble.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n: number) => n.toFixed(1);

type P = { d: string; w?: number; o?: number; c?: string; delay?: number; dash?: string };

function Line({ d, w = 1.1, o = 0.22, c = INK, delay = 0, dash }: P) {
  return (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={c}
      strokeWidth={w}
      strokeOpacity={o}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dash}
      className={dash ? undefined : "ill-draw"}
      style={{ ["--d" as string]: `${delay}s` }}
    />
  );
}

/** One knit stitch: two yarn legs meeting at the bottom, drawn as a double line. */
function stitchPaths(cx: number, cy: number, w: number, h: number, r: () => number): string[] {
  const j = () => (r() - 0.5) * 1.6;
  const L = `M${f(cx - w / 2 + j())} ${f(cy - h / 2 + j())} C${f(cx - w * 0.44 + j())} ${f(cy + h * 0.02)} ${f(cx - w * 0.12)} ${f(cy + h * 0.34)} ${f(cx + j())} ${f(cy + h / 2 + j())}`;
  const R = `M${f(cx + w / 2 + j())} ${f(cy - h / 2 + j())} C${f(cx + w * 0.44 + j())} ${f(cy + h * 0.02)} ${f(cx + w * 0.12)} ${f(cy + h * 0.34)} ${f(cx + j())} ${f(cy + h / 2 + j())}`;
  const Lb = L.replace(/M([\d.]+)/, (_, x) => `M${f(+x + 2.4)}`).replace(/C([\d.]+)/, (_, x) => `C${f(+x + 2.4)}`);
  const Rb = R.replace(/M([\d.]+)/, (_, x) => `M${f(+x - 2.4)}`).replace(/C([\d.]+)/, (_, x) => `C${f(+x - 2.4)}`);
  return [L, Lb, R, Rb];
}

/** Rows of stitches that resolve from loose lines (top) into finished fabric (bottom). */
function Fabric({ x, y, cols, rows, w, h, seed, tilt = 0, accentRow = -1, delay = 0 }: {
  x: number; y: number; cols: number; rows: number; w: number; h: number; seed: number; tilt?: number; accentRow?: number; delay?: number;
}) {
  const r = rng(seed);
  const out: React.ReactNode[] = [];
  for (let row = 0; row < rows; row++) {
    const done = row / Math.max(rows - 1, 1); // 0 at the top, 1 at the bottom
    const opacity = 0.1 + done * 0.2;
    for (let col = 0; col < cols; col++) {
      if (r() > 0.35 + done * 0.65) continue; // upper rows are incomplete
      const cx = x + col * w + (row % 2 ? w * 0.04 : 0) + Math.sin(row * 0.7) * 2 + tilt * row;
      const cy = y + row * h * 0.78 + Math.sin(col * 0.9) * 1.5;
      const accent = row === accentRow && col % 5 === 2;
      stitchPaths(cx, cy, w * 0.98, h, r).forEach((d, i) => {
        out.push(<Line key={`${row}-${col}-${i}`} d={d} w={i % 2 ? 0.8 : 1.3} o={accent ? 0.7 : opacity * (i % 2 ? 0.7 : 1)} c={accent ? WINE : INK} delay={delay + row * 0.12 + col * 0.015} />);
      });
    }
  }
  return <g data-part="fabric">{out}</g>;
}

/** Engraving-style crosshatch inside a soft rectangle. */
function Hatch({ x, y, w, h, gap = 5, o = 0.1, seed = 1, angle = 1 }: { x: number; y: number; w: number; h: number; gap?: number; o?: number; seed?: number; angle?: number }) {
  const r = rng(seed);
  const lines: string[] = [];
  for (let i = 0; i < w / gap; i++) {
    const x0 = x + i * gap + r() * 1.2;
    lines.push(`M${f(x0)} ${f(y + r() * 2)} l${f(h * 0.35 * angle)} ${f(h - r() * 4)}`);
  }
  return <g data-part="hatch">{lines.map((d, i) => <Line key={i} d={d} w={0.6} o={o} />)}</g>;
}

/** A latch needle: shaft, hook, latch and a short pivot mark. */
function Needle({ x, y, len = 210, lean = 0, accent = false, delay = 0 }: { x: number; y: number; len?: number; lean?: number; accent?: boolean; delay?: number }) {
  const c = accent ? WINE : INK;
  const o = accent ? 0.6 : 0.3;
  return (
    <g data-part="needles">
      <Line d={`M${x} ${y + len} L${f(x + lean)} ${y + 18}`} w={1.4} o={o} c={c} delay={delay} />
      <Line d={`M${x + 2.6} ${y + len} L${f(x + lean + 2.6)} ${y + 18}`} w={0.8} o={o * 0.6} c={c} delay={delay} />
      <Line d={`M${f(x + lean)} ${y + 18} C${f(x + lean)} ${y + 2} ${f(x + lean + 15)} ${y - 2} ${f(x + lean + 13)} ${y + 12}`} w={1.4} o={o} c={c} delay={delay + 0.2} />
      <Line d={`M${f(x + lean + 1)} ${y + 40} L${f(x + lean + 12)} ${y + 20}`} w={0.9} o={o * 0.9} c={c} delay={delay + 0.3} />
      <circle cx={x + lean + 1} cy={y + 40} r={1.6} fill={c} fillOpacity={o} />
    </g>
  );
}

function Callout({ x1, y1, x2, y2, label, tx, ty }: { x1: number; y1: number; x2: number; y2: number; label: string; tx: number; ty: number }) {
  return (
    <g data-part="annotation" className="ill-detail">
      <Line d={`M${x1} ${y1} L${x2} ${y2}`} w={0.7} o={0.28} dash="2 3" />
      <circle cx={x1} cy={y1} r={1.8} fill={INK} fillOpacity={0.35} />
      <text x={tx} y={ty} fontSize={11} fill={INK} fillOpacity={0.45} fontFamily="var(--font-jost), sans-serif" letterSpacing="2">{label}</text>
    </g>
  );
}

// ---------- Variant A: thread formation ----------
function VariantA() {
  const strands = [
    "M1000 24 C880 36 800 20 700 70 C600 120 520 110 440 176",
    "M1000 70 C900 80 830 60 740 110 C650 160 560 150 470 206",
    "M1000 118 C920 124 850 100 780 150 C690 210 600 190 500 236",
    "M1000 0 C860 12 760 -10 650 40 C560 80 480 70 400 150",
  ];
  return (
    <g data-part="yarn">
      {strands.map((d, i) => (
        <g key={i}>
          <Line d={d} w={1.7} o={i === 1 ? 0.7 : 0.3} c={i === 1 ? WINE : INK} delay={i * 0.25} />
          <Line d={d.replace(/(-?\d+) (-?\d+)/g, (_, x, y) => `${+x + 3} ${+y + 4}`)} w={0.8} o={0.16} delay={i * 0.25 + 0.1} />
        </g>
      ))}
      <Fabric x={380} y={196} cols={15} rows={13} w={40} h={38} seed={7} tilt={0.5} accentRow={9} delay={1} />
      <Hatch x={420} y={640} w={380} h={30} gap={7} o={0.07} seed={3} />
    </g>
  );
}

// ---------- Variant B: knitting mechanism ----------
function VariantB() {
  const needles = Array.from({ length: 10 }, (_, i) => 392 + i * 58);
  return (
    <g>
      <g data-part="needles">
        <Line d="M360 176 L960 170" w={1.5} o={0.34} />
        <Line d="M360 190 L960 184" w={0.9} o={0.22} />
        <Hatch x={364} y={192} w={590} h={16} gap={7} o={0.09} seed={5} angle={0.4} />
        {needles.map((x, i) => (
          <Needle key={x} x={x} y={62 + Math.sin(i * 1.3) * 4} len={112} lean={(i - 4.5) * 0.5} accent={i === 5} delay={0.3 + i * 0.1} />
        ))}
      </g>
      <g data-part="yarn">
        {/* yarn guide (feeder) and the strand laid across the hooks */}
        <Line d="M880 22 L940 -10 L972 14 L912 52 Z" w={1.3} o={0.36} delay={0.2} />
        <Line d="M892 28 L926 6" w={0.8} o={0.2} delay={0.4} />
        <Line d="M900 52 C860 70 820 78 760 74 C690 70 640 80 580 76 C510 72 450 82 394 78 C360 76 350 100 360 140" w={1.8} o={0.75} c={WINE} delay={0.6} />
        <Line d="M902 56 C862 74 822 82 762 78 C692 74 642 84 582 80 C512 76 452 86 396 82 C364 80 354 104 364 144" w={0.8} o={0.22} delay={0.7} />
      </g>
      <Fabric x={380} y={214} cols={15} rows={12} w={40} h={38} seed={21} accentRow={0} delay={1.1} />
      <Callout x1={420} y1={78} x2={344} y2={40} label="A" tx={332} ty={36} />
      <Callout x1={944} y1={20} x2={990} y2={60} label="B" tx={982} ty={78} />
      <Callout x1={940} y1={176} x2={986} y2={236} label="C" tx={978} ty={254} />
      <g data-part="annotation" className="ill-detail">
        <Line d="M380 700 L940 700" w={0.7} o={0.25} dash="1 0" />
        <Line d="M380 694 L380 706 M940 694 L940 706" w={0.7} o={0.25} dash="1 0" />
        <text x={620} y={726} fontSize={11} fill={INK} fillOpacity={0.4} fontFamily="var(--font-jost), sans-serif" letterSpacing="3">FIG. 02</text>
      </g>
    </g>
  );
}

// ---------- Variant C: textile engineering notebook ----------
function StitchStudy({ x, y, label, rib = false, seed }: { x: number; y: number; label: string; rib?: boolean; seed: number }) {
  const r = rng(seed);
  const cells: React.ReactNode[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const purl = rib && col % 2 === 1;
      const cx = x + 14 + col * 20, cy = y + 14 + row * 18;
      if (purl) {
        cells.push(<Line key={`${row}${col}`} d={`M${cx - 7} ${cy} q7 5 14 0`} w={1} o={0.28} />);
      } else {
        stitchPaths(cx, cy, 16, 17, r).slice(0, 2).concat(stitchPaths(cx, cy, 16, 17, r).slice(2, 3)).forEach((d, i) => cells.push(<Line key={`${row}${col}${i}`} d={d} w={1} o={0.3} />));
      }
    }
  }
  return (
    <g data-part="loops">
      <rect x={x} y={y} width={94} height={80} fill="none" stroke={INK} strokeOpacity={0.2} strokeWidth={0.8} />
      {cells}
      <text x={x} y={y + 96} fontSize={10} fill={INK} fillOpacity={0.45} fontFamily="var(--font-jost), sans-serif" letterSpacing="2">{label}</text>
    </g>
  );
}

function VariantC() {
  return (
    <g>
      <StitchStudy x={380} y={20} label="1 / 1" seed={2} />
      <StitchStudy x={500} y={20} label="1 × 1" rib seed={4} />
      <StitchStudy x={620} y={20} label="2 / 2" seed={6} />
      <g data-part="needles">
        <Line d="M790 130 L980 126" w={1.3} o={0.28} />
        {[816, 866, 916].map((x, i) => <Needle key={x} x={x} y={40} len={90} lean={i * 0.6 - 0.6} delay={0.4 + i * 0.12} />)}
      </g>
      <g data-part="yarn">
        <Line d="M1000 20 C960 40 940 60 920 70" w={1.6} o={0.7} c={WINE} delay={0.5} />
        <Line d="M360 150 C420 120 480 170 540 150 C600 134 660 168 720 150 C760 140 790 126 816 90" w={1} o={0.3} dash="3 4" />
      </g>
      <Fabric x={384} y={196} cols={14} rows={12} w={40} h={38} seed={33} tilt={0.4} accentRow={6} delay={1} />
      <g data-part="annotation" className="ill-detail">
        <Line d="M340 196 L340 620 M334 196 L346 196 M334 620 L346 620" w={0.7} o={0.25} dash="1 0" />
        <text x={316} y={420} fontSize={10} fill={INK} fillOpacity={0.4} fontFamily="var(--font-jost), sans-serif" letterSpacing="3" transform="rotate(-90 316 420)">COURSES</text>
        <Callout x1={980} y1={126} x2={990} y2={190} label="N" tx={978} ty={208} />
      </g>
    </g>
  );
}

export function YarnIllustration({ variant = "b" }: { variant?: IllustrationVariant }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="300 -20 720 780"
      preserveAspectRatio="xMaxYMid meet"
      className="yarn-illustration pointer-events-none absolute inset-x-0 bottom-0 h-[62%] w-full md:inset-x-auto md:right-0 md:top-0 md:h-full md:w-[76%]"
      data-variant={variant}
    >
      {variant === "a" ? <VariantA /> : variant === "c" ? <VariantC /> : <VariantB />}
    </svg>
  );
}
