"use client";

import { useEffect, useState } from "react";
import type { Burst } from "./Scene";

/**
 * The pandal, drawn by hand — the fallback used when public/pandal.jpg is
 * missing, so the site is never a blank page.
 *
 * 1600×900, back to front: night over the lane → serial lights → the pandal
 * arch and its banner → बाप्पा → the stage → the crowd. Nothing here is a
 * stock asset; every shape is a path.
 */

type Props = {
  onHit: () => void;
  hit: boolean;
  bursts: Burst[];
};

const GULAAL = ["var(--gulaal-1)", "var(--gulaal-2)", "var(--gulaal-3)", "var(--gulaal-4)"];

const round = (n: number) => Math.round(n * 100) / 100;

/** Beads along a quadratic curve — every garland in the place. */
function beads(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  count: number,
) {
  const out: { x: number; y: number; i: number }[] = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const u = 1 - t;
    // Rounded, or the server and the client disagree in the sixteenth decimal
    // place and React throws out the whole hydrated tree.
    out.push({
      x: round(u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0]),
      y: round(u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]),
      i,
    });
  }
  return out;
}

/** Serial bulbs, strung the way they are every year: nailed up, sagging. */
function Lights({
  from,
  ctrl,
  to,
  count,
}: {
  from: [number, number];
  ctrl: [number, number];
  to: [number, number];
  count: number;
}) {
  const pts = beads(from, ctrl, to, count);
  return (
    <g>
      <path
        d={`M${from[0]} ${from[1]} Q${ctrl[0]} ${ctrl[1]} ${to[0]} ${to[1]}`}
        fill="none"
        stroke="#0d0718"
        strokeWidth="2"
      />
      {pts.map((p) => (
        <circle
          key={p.i}
          className={`bulb${p.i % 3 === 1 ? " bulb--b" : p.i % 3 === 2 ? " bulb--c" : ""}`}
          cx={p.x}
          cy={p.y + 7}
          r="4.5"
          fill={[0, 1, 2, 3][p.i % 4] === 0 ? "var(--bulb)" : GULAAL[p.i % 4]}
        />
      ))}
    </g>
  );
}

/* ── The crowd ─────────────────────────────────────────────── */

// Arms, in a body-local frame where the feet sit at y = 0.
const ARMS: string[][] = [
  ["M-17 -130 L-48 -184 L-37 -191 L-5 -136 Z", "M17 -130 L48 -184 L37 -191 L5 -136 Z"],
  ["M-17 -130 L-31 -197 L-19 -199 L-5 -136 Z", "M17 -130 L31 -197 L19 -199 L5 -136 Z"],
  ["M-17 -130 L-41 -190 L-30 -196 L-5 -136 Z", "M17 -128 L55 -112 L53 -101 L6 -119 Z"],
  ["M-17 -126 L-60 -142 L-61 -130 L-16 -113 Z", "M17 -126 L60 -142 L61 -130 L16 -113 Z"],
  ["M-17 -130 L-15 -199 L-4 -199 L-4 -134 Z", "M17 -130 L15 -199 L4 -199 L4 -134 Z"],
];

const HANDS: [number, number][][] = [
  [[-43, -188], [43, -188]],
  [[-25, -198], [25, -198]],
  [[-36, -193], [54, -107]],
  [[-60, -136], [60, -136]],
  [[-10, -199], [10, -199]],
];

function Dancer({
  x,
  ground,
  s,
  pose,
  tone,
  saree = false,
  flip = false,
  wave = "",
}: {
  x: number;
  ground: number;
  s: number;
  pose: number;
  tone: string;
  saree?: boolean;
  flip?: boolean;
  wave?: string;
}) {
  return (
    <g transform={`translate(${x},${ground}) scale(${flip ? -s : s},${s})`} fill={tone}>
      {/* Legs, or the sweep of a saree */}
      {saree ? (
        <path d="M-25 -66 L-44 0 L44 0 L25 -66 Z" />
      ) : (
        <path d="M-24 -62 L-31 0 H-13 L-2 -36 L2 -36 L13 0 H31 L24 -62 Z" />
      )}
      <path d="M-19 -134 q19 -10 38 0 l6 76 q-25 10 -50 0 Z" />
      <circle cx="0" cy="-152" r="17" />
      {/* A bun, a topknot, a cap — anything to break the row up */}
      {pose % 2 === 0 ? (
        <circle cx="0" cy="-172" r="8" />
      ) : (
        <path d="M-18 -160 q18 -22 36 0 q-18 -10 -36 0 Z" />
      )}
      <g className={`wave ${wave}`}>
        {ARMS[pose].map((d, i) => (
          <path key={i} d={d} />
        ))}
        {HANDS[pose].map(([hx, hy], i) => (
          <circle key={i} cx={hx} cy={hy} r="7.5" />
        ))}
      </g>
    </g>
  );
}

/** One kid, up on someone's shoulders, seeing all of it. */
function OnShoulders({ x, ground, s, tone }: { x: number; ground: number; s: number; tone: string }) {
  return (
    <g transform={`translate(${x},${ground}) scale(${s})`} fill={tone}>
      <path d="M-24 -62 L-31 0 H-13 L-2 -36 L2 -36 L13 0 H31 L24 -62 Z" />
      <path d="M-19 -134 q19 -10 38 0 l6 76 q-25 10 -50 0 Z" />
      <circle cx="0" cy="-152" r="17" />
      <path d="M-17 -132 L-30 -178 L-20 -182 L-6 -140 Z" />
      <path d="M17 -132 L30 -178 L20 -182 L6 -140 Z" />
      {/* The kid */}
      <g className="wave wave--c">
        <path d="M-13 -178 L-17 -216 H17 L13 -178 Z" />
        <circle cx="0" cy="-228" r="12" />
        <path d="M-12 -212 L-30 -246 L-22 -251 L-4 -218 Z" />
        <path d="M12 -212 L30 -246 L22 -251 L4 -218 Z" />
        <circle cx="-26" cy="-248" r="5.5" />
        <circle cx="26" cy="-248" r="5.5" />
      </g>
    </g>
  );
}

/** ताशा — flat, tilted forward, played with two thin canes. */
function TashaPlayer({ x, ground, s, tone }: { x: number; ground: number; s: number; tone: string }) {
  return (
    <g transform={`translate(${x},${ground}) scale(${s})`} fill={tone}>
      <path d="M-24 -62 L-31 0 H-13 L-2 -36 L2 -36 L13 0 H31 L24 -62 Z" />
      <path d="M-19 -134 q19 -10 38 0 l6 76 q-25 10 -50 0 Z" />
      <circle cx="0" cy="-152" r="17" />
      <path d="M-18 -160 q18 -22 36 0 q-18 -10 -36 0 Z" />
      {/* The drum, slung and tipped toward the player */}
      <ellipse cx="0" cy="-74" rx="42" ry="17" fill="var(--gold-deep)" />
      <ellipse cx="0" cy="-78" rx="42" ry="17" fill="#e8dcc0" />
      <ellipse cx="0" cy="-78" rx="30" ry="11" fill="#cfbf9c" />
      <path d="M-22 -128 L-38 -86 L-30 -84 L-16 -124 Z" />
      {/* Canes */}
      <g className="stick">
        <path d="M-26 -128 L-14 -92" stroke="#e6d3ab" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="stick stick--b">
        <path d="M26 -128 L14 -92" stroke="#e6d3ab" strokeWidth="4" strokeLinecap="round" />
      </g>
      <path d="M18 -128 L34 -86 L26 -84 L12 -124 Z" />
    </g>
  );
}

/** ढोल — the one you can hit. */
function DholPlayer({
  x,
  ground,
  s,
  tone,
  onHit,
  hit,
}: {
  x: number;
  ground: number;
  s: number;
  tone: string;
  onHit: () => void;
  hit: boolean;
}) {
  return (
    <g
      className={`dhol${hit ? " dhol--hit" : ""}`}
      transform={`translate(${x},${ground}) scale(${s})`}
      onClick={onHit}
      role="button"
      tabIndex={0}
      aria-label="ढोल वाजवा — hit the dhol"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onHit();
        }
      }}
    >
      <g fill={tone}>
        <path d="M-28 -62 L-36 0 H-15 L-2 -38 L2 -38 L15 0 H36 L28 -62 Z" />
        <path d="M-22 -142 q22 -11 44 0 l7 82 q-29 11 -58 0 Z" />
        <circle cx="0" cy="-162" r="19" />
        <path d="M-20 -170 q20 -24 40 0 q-20 -11 -40 0 Z" />
      </g>
      {/* Strap over the shoulder */}
      <path d="M-18 -150 L-40 -96" stroke="#c8203f" strokeWidth="8" fill="none" />
      <path d="M18 -150 L40 -96" stroke="#c8203f" strokeWidth="8" fill="none" />
      {/* The barrel */}
      <g>
        <rect x="-62" y="-100" width="124" height="60" rx="16" fill="var(--gold-deep)" />
        <rect x="-62" y="-100" width="124" height="26" rx="13" fill="var(--gold)" opacity="0.55" />
        <ellipse cx="-62" cy="-70" rx="15" ry="31" fill="#efe2c4" />
        <ellipse cx="-62" cy="-70" rx="10" ry="23" fill="#d8c7a1" />
        <ellipse cx="62" cy="-70" rx="15" ry="31" fill="#efe2c4" />
        <ellipse cx="62" cy="-70" rx="10" ry="23" fill="#d8c7a1" />
        {/* Rope lacing */}
        <g stroke="#6d4a15" strokeWidth="2.5" opacity="0.65">
          {[-40, -20, 0, 20, 40].map((rx) => (
            <path key={rx} d={`M${rx} -98 L${rx + 8} -42`} fill="none" />
          ))}
        </g>
      </g>
      {/* One stick, one palm */}
      <g fill={tone}>
        <path d="M22 -138 L58 -108 L52 -100 L14 -128 Z" />
        <circle cx="56" cy="-104" r="8" />
      </g>
      <g className="stick">
        <path d="M-24 -140 L-56 -96" stroke="#e6d3ab" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g fill={tone}>
        <path d="M-22 -138 L-40 -118 L-34 -110 L-14 -128 Z" />
      </g>
    </g>
  );
}

/* ── The whole thing ───────────────────────────────────────── */

export default function SceneDrawn({ onHit, hit, bursts }: Props) {
  // On a phone the frame is much taller than wide — keep बाप्पा centred and
  // let the lane crop away instead.
  // A 16:9 frame can't show its own width on a phone, so portrait gets a
  // taller window onto the same artwork: less lane, all of बाप्पा.
  const [box, setBox] = useState("0 0 1600 900");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const apply = () => setBox(mq.matches ? "300 -220 1000 1320" : "0 0 1600 900");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <svg
      className="pandal__art"
      viewBox={box}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="A sarvajanik Ganpati pandal at night: a huge seated Ganpati idol under a decorated arch, marigold garlands and serial lights, and a crowd dancing in front with dhol and tasha players."
    >
      <defs>
        <linearGradient id="night" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="var(--night-1)" />
          <stop offset="52%" stopColor="var(--night-2)" />
          <stop offset="100%" stopColor="var(--night-3)" />
        </linearGradient>

        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="var(--gold-dark)" />
          <stop offset="34%" stopColor="var(--gold-lit)" />
          <stop offset="66%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="var(--gold-dark)" />
        </linearGradient>

        <linearGradient id="ear" x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="var(--idol)" />
          <stop offset="55%" stopColor="var(--idol-shade)" />
          <stop offset="100%" stopColor="#7d4520" />
        </linearGradient>

        <linearGradient id="skin" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="var(--idol-lit)" />
          <stop offset="52%" stopColor="var(--idol)" />
          <stop offset="100%" stopColor="var(--idol-shade)" />
        </linearGradient>

        <linearGradient id="drapeGrad" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="var(--drape)" />
          <stop offset="100%" stopColor="var(--drape-deep)" />
        </linearGradient>

        <linearGradient id="bannerGrad" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#e0245e" />
          <stop offset="50%" stopColor="#b81f5e" />
          <stop offset="100%" stopColor="#8c1247" />
        </linearGradient>

        <radialGradient id="halo">
          <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#ffb03a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ff8a1f" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="lampGlow">
          <stop offset="0%" stopColor="#ffd98a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ff9a1f" stopOpacity="0" />
        </radialGradient>

        <clipPath id="frame">
          <rect x="-800" y="-800" width="3200" height="2600" />
        </clipPath>
      </defs>

      <g clipPath="url(#frame)">
        {/* ── The lane at night ─────────────────────────────── */}
        <rect x="-800" y="-800" width="3200" height="2600" fill="url(#night)" />

        {/* Buildings either side, most windows still on */}
        <g fill="#0e0820">
          <rect x="-20" y="180" width="150" height="620" />
          <rect x="300" y="-330" width="180" height="310" />
          <rect x="1160" y="-360" width="200" height="340" />
          <rect x="120" y="272" width="120" height="528" />
          <rect x="228" y="216" width="106" height="584" />
          <rect x="1290" y="240" width="130" height="560" />
          <rect x="1400" y="184" width="150" height="616" />
          <rect x="1522" y="288" width="100" height="512" />
        </g>
        <g fill="var(--bulb)" opacity="0.5">
          {[
            [16, 232], [70, 232], [16, 302], [70, 372], [148, 320], [200, 320],
            [148, 394], [252, 268], [300, 268], [252, 342], [300, 416],
            [1312, 292], [1364, 292], [1312, 366], [1364, 440], [1424, 236],
            [1478, 236], [1424, 310], [1478, 384], [1540, 340], [1590, 340],
          ].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="26" height="34" rx="2" opacity={i % 3 === 0 ? 0.35 : 1} />
          ))}
        </g>

        {/* Serial lights across the lane */}
        <Lights from={[-40, -190]} ctrl={[540, -60]} to={[1120, -196]} count={26} />
        <Lights from={[240, -60]} ctrl={[800, 40]} to={[1360, -66]} count={22} />
        <Lights from={[-40, 60]} ctrl={[420, 170]} to={[820, 54]} count={22} />
        <Lights from={[780, 54]} ctrl={[1200, 176]} to={[1640, 48]} count={22} />
        <Lights from={[-40, 172]} ctrl={[340, 268]} to={[700, 190]} count={16} />
        <Lights from={[900, 190]} ctrl={[1280, 272]} to={[1640, 168]} count={16} />

        {/* ── The pandal ────────────────────────────────────── */}
        {/* Back drape */}
        <path d="M420 300 Q800 96 1180 300 L1180 800 L420 800 Z" fill="url(#drapeGrad)" />
        <path
          d="M470 318 Q800 140 1130 318 L1130 790 L470 790 Z"
          fill="#5d0f38"
          opacity="0.7"
        />

        {/* Gathered fabric behind बाप्पा */}
        <g opacity="0.55" stroke="#e0245e" strokeWidth="3" fill="none">
          {Array.from({ length: 13 }, (_, i) => {
            const t = i / 12;
            const x = 480 + t * 640;
            return <path key={i} d={`M800 208 Q${x} ${420 + Math.abs(t - 0.5) * 90} ${x} 790`} />;
          })}
        </g>

        {/* Arch trim */}
        <path
          d="M420 300 Q800 96 1180 300"
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="16"
        />
        {beads([432, 296], [800, 118], [1168, 296], 26).map((b) => (
          <circle key={b.i} cx={b.x} cy={b.y} r={b.i % 2 ? 8 : 11} fill="var(--gold-lit)" opacity="0.9" />
        ))}

        {/* Pillars */}
        {[
          [400, 1],
          [1200, -1],
        ].map(([px, dir]) => (
          <g key={px}>
            <rect x={px - 34} y="286" width="68" height="520" fill="url(#goldGrad)" />
            <rect x={px - 22} y="286" width="44" height="520" fill="var(--drape-deep)" opacity="0.5" />
            <rect x={px - 46} y="264" width="92" height="30" rx="6" fill="var(--gold-lit)" />
            <rect x={px - 42} y="782" width="84" height="26" rx="5" fill="var(--gold-deep)" />
            {[350, 430, 510, 590, 670].map((y) => (
              <circle key={y} cx={px} cy={y} r="9" fill="var(--gold-lit)" opacity="0.85" />
            ))}
            <path
              d={`M${px + dir * 34} 300 q${dir * 46} 60 0 120`}
              fill="none"
              stroke="var(--marigold)"
              strokeWidth="7"
              opacity="0.8"
            />
          </g>
        ))}

        {/* Hanging torans of marigold and leaf */}
        {beads([408, 316], [800, 250], [1192, 316], 30).map((b) => (
          <g key={b.i}>
            <line x1={b.x} y1={b.y} x2={b.x} y2={b.y + (b.i % 3 === 0 ? 46 : 28)} stroke="var(--leaf)" strokeWidth="3" />
            <circle
              cx={b.x}
              cy={b.y + (b.i % 3 === 0 ? 50 : 32)}
              r={b.i % 3 === 0 ? 9 : 7}
              fill={b.i % 2 ? "var(--marigold)" : "var(--marigold-2)"}
            />
          </g>
        ))}

        {/* Long strings of flowers, filling the flat panels */}
        {[470, 520, 1080, 1130].map((sx, si) => (
          <g key={sx}>
            <line x1={sx} y1="330" x2={sx} y2="700" stroke="var(--leaf)" strokeWidth="2.5" opacity="0.7" />
            {Array.from({ length: 13 }, (_, i) => (
              <circle
                key={i}
                cx={sx}
                cy={340 + i * 28}
                r={i % 2 ? 6 : 7.5}
                fill={(i + si) % 3 === 0 ? "var(--marigold-2)" : "var(--marigold)"}
                opacity="0.9"
              />
            ))}
          </g>
        ))}

        {/* ── Mandal banner (the title sits on this) ────────── */}
        <g>
          <path
            d="M300 54 H1300 L1300 236 Q1290 262 1258 258 L342 258 Q310 262 300 236 Z"
            fill="url(#bannerGrad)"
          />
          <path
            d="M312 66 H1288 L1288 232 Q1280 250 1252 247 L348 247 Q320 250 312 232 Z"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="5"
          />
          {/* Scalloped hem */}
          <path
            d={`M300 254 ${Array.from({ length: 25 }, () => "q20 26 40 0").join(" ")}`}
            fill="var(--gold)"
            opacity="0.9"
          />
          {/* Tassels at the corners */}
          {[300, 1300].map((tx) => (
            <g key={tx}>
              <circle cx={tx} cy="264" r="10" fill="var(--gold-lit)" />
              <path d={`M${tx - 7} 272 l3 30 M${tx} 274 l0 34 M${tx + 7} 272 l-3 30`} stroke="var(--gold)" strokeWidth="3" />
            </g>
          ))}
        </g>

        {/* ── बाप्पा ─────────────────────────────────────────── */}
        <path d="M580 800 L580 540 Q800 236 1020 540 L1020 800 Z" fill="#43082a" />
        <path
          d="M580 540 Q800 236 1020 540"
          fill="none"
          stroke="var(--gold-deep)"
          strokeWidth="9"
        />
        <circle cx="800" cy="452" r="178" fill="url(#halo)" className="glow" />
        {/* Prabhaval rays */}
        <g stroke="var(--gold)" strokeWidth="4" opacity="0.45">
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={round(800 + Math.cos(a) * 150)}
                y1={round(452 + Math.sin(a) * 150)}
                x2={round(800 + Math.cos(a) * 188)}
                y2={round(452 + Math.sin(a) * 188)}
              />
            );
          })}
        </g>

        {/* Seat: a lotus on the stage */}
        <g>
          <ellipse cx="800" cy="742" rx="212" ry="34" fill="var(--drape-deep)" />
          {Array.from({ length: 13 }, (_, i) => {
            const x = 610 + i * 32;
            return (
              <path
                key={i}
                d={`M${x} 744 q16 -34 32 0 q-16 12 -32 0 Z`}
                fill={i % 2 ? "var(--gulaal-1)" : "#e0245e"}
              />
            );
          })}
        </g>

        {/* Crossed legs and dhoti */}
        <path d="M642 742 q158 -78 316 0 q-32 22 -158 22 q-126 0 -158 -22 Z" fill="url(#skin)" />
        <path
          d="M654 718 q146 -74 292 0 q-26 -70 -146 -70 q-120 0 -146 70 Z"
          fill="var(--saffron)"
        />
        <path d="M660 710 q140 -66 280 0" fill="none" stroke="var(--gold-lit)" strokeWidth="7" />

        {/* Belly */}
        <ellipse cx="800" cy="640" rx="146" ry="98" fill="url(#skin)" stroke="#5e3210" strokeWidth="5" />
        <ellipse cx="752" cy="608" rx="76" ry="48" fill="var(--idol-lit)" opacity="0.3" />
        <path
          d="M876 552 C 944 590, 958 686, 898 736 C 940 678, 928 596, 876 552 Z"
          fill="var(--idol-shade)"
          opacity="0.5"
        />
        <ellipse cx="800" cy="674" rx="12" ry="9" fill="var(--idol-shade)" />

        {/* शेला over the left shoulder — the one cool colour on him */}
        <path
          d="M712 556 C 664 594, 646 668, 656 738 L700 734 C 690 664, 702 606, 738 576 Z"
          fill="var(--drape)"
        />
        <path
          d="M712 556 C 672 590, 654 660, 662 734"
          fill="none"
          stroke="var(--gold-lit)"
          strokeWidth="5"
          opacity="0.85"
        />

        {/* Ears — drawn darker so the face reads in front of them */}
        <g>
          <path
            d="M710 388 C 636 336, 546 358, 516 444 C 486 534, 540 626, 614 650 C 668 668, 704 630, 712 570 Z"
            fill="url(#ear)"
            stroke="#5e3210"
            strokeWidth="5"
          />
          <path
            d="M708 414 C 648 374, 578 396, 556 462 C 534 530, 574 600, 630 618 C 670 630, 700 600, 708 556 Z"
            fill="var(--idol-shade)"
            opacity="0.6"
          />
          <path
            d="M890 388 C 964 336, 1054 358, 1084 444 C 1114 534, 1060 626, 986 650 C 932 668, 896 630, 888 570 Z"
            fill="url(#ear)"
            stroke="#5e3210"
            strokeWidth="5"
          />
          <path
            d="M892 414 C 952 374, 1022 396, 1044 462 C 1066 530, 1026 600, 970 618 C 930 630, 900 600, 892 556 Z"
            fill="var(--idol-shade)"
            opacity="0.6"
          />
          <circle cx="616" cy="652" r="17" fill="var(--gold-lit)" />
          <circle cx="984" cy="652" r="17" fill="var(--gold-lit)" />
        </g>

        {/* Shoulders, so the head doesn't melt into the belly */}
        <path d="M688 566 q112 -48 224 0 q-16 36 -112 36 q-96 0 -112 -36 Z" fill="var(--idol-shade)" />

        {/* The head's own shadow, thrown onto the ears */}
        <ellipse cx="808" cy="464" rx="106" ry="96" fill="#4a2409" opacity="0.55" />

        {/* Head */}
        <ellipse cx="800" cy="456" rx="103" ry="95" fill="url(#skin)" stroke="#5e3210" strokeWidth="5" />
        <ellipse cx="768" cy="424" rx="52" ry="42" fill="var(--idol-lit)" opacity="0.32" />

        {/* Brow ridge, and the bulge the trunk grows out of */}
        <path d="M736 470 q64 -42 128 0 q-64 -22 -128 0 Z" fill="var(--idol-shade)" opacity="0.3" />
        <ellipse cx="800" cy="512" rx="42" ry="34" fill="var(--idol-lit)" opacity="0.35" />

        {/* Eyes */}
        <g>
          <path d="M734 446 q28 -24 56 -2 q-28 21 -56 2 Z" fill="#fff8ea" />
          <path d="M810 444 q28 -22 56 2 q-28 19 -56 -2 Z" fill="#fff8ea" />
          <circle cx="761" cy="445" r="9" fill="#241019" />
          <circle cx="839" cy="445" r="9" fill="#241019" />
          <circle cx="764" cy="442" r="3" fill="#fff" opacity="0.9" />
          <circle cx="842" cy="442" r="3" fill="#fff" opacity="0.9" />
          <path d="M728 432 q32 -30 62 -6" fill="none" stroke="var(--idol-shade)" strokeWidth="5" />
          <path d="M810 426 q30 -24 62 6" fill="none" stroke="var(--idol-shade)" strokeWidth="5" />
        </g>

        {/* Tilak */}
        <path d="M790 400 q10 -36 20 0 q-10 -14 -20 0 Z" fill="var(--sindoor)" />
        <path d="M795 378 l10 0 l-5 -22 Z" fill="var(--sindoor)" />

        {/* Upper arms — outside the ears, hands up */}
        <g fill="none" strokeLinecap="round">
          <path d="M702 652 C 626 682, 546 644, 500 534" stroke="#5e3210" strokeWidth="50" />
          <path d="M898 652 C 974 682, 1054 644, 1100 534" stroke="#5e3210" strokeWidth="50" />
          <path d="M702 652 C 626 682, 546 644, 500 534" stroke="url(#skin)" strokeWidth="40" />
          <path d="M898 652 C 974 682, 1054 644, 1100 534" stroke="url(#skin)" strokeWidth="40" />
        </g>

        {/* पाश in one hand, अंकुश in the other */}
        <g>
          <g transform="translate(494,486)">
            {[-58, -32, 0, 32, 58].map((deg, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-20"
                rx="10"
                ry="24"
                fill={i % 2 ? "#ff6fae" : "var(--gulaal-1)"}
                transform={`rotate(${deg})`}
              />
            ))}
            <circle cx="0" cy="-6" r="9" fill="var(--gold-lit)" />
          </g>
          <path d="M1104 522 l-4 -114" stroke="url(#goldGrad)" strokeWidth="9" />
          <path d="M1100 408 q36 -6 32 32" fill="none" stroke="var(--gold-lit)" strokeWidth="9" />
        </g>
        <circle cx="498" cy="528" r="25" fill="url(#skin)" stroke="#5e3210" strokeWidth="4" />
        <g stroke="#5e3210" strokeWidth="3" opacity="0.55" fill="none"><path d="M486 516 l-4 -14 M498 512 l0 -16 M510 516 l5 -13" /></g>
        <circle cx="1102" cy="528" r="25" fill="url(#skin)" stroke="#5e3210" strokeWidth="4" />
        <g stroke="#5e3210" strokeWidth="3" opacity="0.55" fill="none"><path d="M1090 516 l-5 -13 M1102 512 l0 -16 M1114 516 l4 -14" /></g>

        {/* Lower arms, resting on the lap */}
        <g fill="none" strokeLinecap="round">
          <path d="M708 674 C 648 700, 612 732, 602 758" stroke="#5e3210" strokeWidth="46" />
          <path d="M892 674 C 952 700, 988 728, 998 754" stroke="#5e3210" strokeWidth="46" />
          <path d="M708 674 C 648 700, 612 732, 602 758" stroke="url(#skin)" strokeWidth="36" />
          <path d="M892 674 C 952 700, 988 728, 998 754" stroke="url(#skin)" strokeWidth="36" />
        </g>
        <circle cx="600" cy="760" r="22" fill="url(#skin)" stroke="#5e3210" strokeWidth="4" />

        {/* Abhaya — palm out, fingers up */}
        <g fill="url(#skin)">
          <path d="M978 764 q-8 -44 20 -48 q30 -4 28 38 q-2 24 -24 26 q-22 2 -24 -16 Z" />
          <path d="M986 726 l4 -22 M1000 720 l2 -26 M1014 724 l4 -22" stroke="url(#skin)" strokeWidth="9" strokeLinecap="round" />
        </g>

        {/* A bowl of modaks in the other */}
        <g>
          <path d="M562 772 q38 30 76 0 q-8 -26 -38 -26 q-30 0 -38 26 Z" fill="url(#goldGrad)" />
          {[
            [582, 748],
            [600, 742],
            [618, 748],
          ].map(([mx, my], i) => (
            <path key={i} d={`M${mx} ${my + 12} q-13 -4 -8 -14 q8 -14 16 0 q5 10 -8 14 Z`} fill="#f6e3bd" />
          ))}
        </g>

        {/* Sacred thread, over the left shoulder */}
        <path
          d="M742 556 C 784 624, 840 692, 888 718"
          fill="none"
          stroke="#f6ecd6"
          strokeWidth="6"
          opacity="0.85"
        />

        {/* Necklaces, sitting at the neck where they belong */}
        <g>
          <path d="M714 558 q86 60 172 0" fill="none" stroke="var(--gold-lit)" strokeWidth="9" />
          {beads([706, 564], [800, 638], [894, 564], 18).map((b) => (
            <circle key={b.i} cx={b.x} cy={b.y} r="8" fill={b.i % 2 ? "var(--gold)" : "var(--gulaal-1)"} />
          ))}
        </g>

        {/* Garland — behind the trunk, which is how it hangs */}
        {beads([698, 570], [800, 786], [902, 570], 28).map((b) => (
          <circle
            key={b.i}
            cx={b.x}
            cy={b.y}
            r="11"
            fill={b.i % 3 === 0 ? "var(--marigold-2)" : "var(--marigold)"}
          />
        ))}

        {/* Tusks — one whole, one broken. एकदंत. */}
        <path d="M752 514 C 734 546, 724 576, 726 594 C 742 570, 754 540, 760 514 Z" fill="#fdf6e6" />
        <path d="M848 514 C 862 534, 870 552, 868 566 C 856 550, 848 530, 842 514 Z" fill="#fdf6e6" />

        {/* Trunk, long, and curling to his left */}
        <g fill="none" strokeLinecap="round">
          <path d="M796 520 C 776 592, 784 656, 812 694" stroke="#5e3210" strokeWidth="68" />
          <path d="M812 694 C 840 728, 884 726, 900 690" stroke="#5e3210" strokeWidth="53" />
          <path d="M900 690 C 916 660, 902 634, 878 642" stroke="#5e3210" strokeWidth="36" />
          <path d="M796 520 C 776 592, 784 656, 812 694" stroke="url(#skin)" strokeWidth="58" />
          <path d="M812 694 C 840 728, 884 726, 900 690" stroke="url(#skin)" strokeWidth="43" />
          <path d="M900 690 C 916 660, 902 634, 878 642" stroke="url(#skin)" strokeWidth="27" />
          <circle cx="876" cy="644" r="13" fill="var(--idol-lit)" stroke="#5e3210" strokeWidth="3" />
          <path d="M774 528 C 758 592, 766 650, 790 686" stroke="var(--idol-lit)" strokeWidth="10" opacity="0.4" />
          <g stroke="var(--idol-shade)" strokeWidth="3.5" opacity="0.38">
            <path d="M772 566 q26 8 50 -2" />
            <path d="M774 606 q26 8 48 -2" />
            <path d="M784 646 q24 10 46 2" />
            <path d="M814 682 q18 20 42 18" />
          </g>
        </g>

        {/* Mukut */}
        <g>
          {/* Side flares */}
          <path d="M702 400 C 672 382, 656 344, 668 318 C 690 346, 700 376, 706 398 Z" fill="var(--gold-deep)" />
          <path d="M898 400 C 928 382, 944 344, 932 318 C 910 346, 900 376, 894 398 Z" fill="var(--gold-deep)" />
          {/* Dome */}
          <path
            d="M698 402 C 698 330, 738 272, 800 262 C 862 272, 902 330, 902 402 Z"
            fill="url(#goldGrad)"
            stroke="#5e3210"
            strokeWidth="4"
          />
          <path d="M740 398 C 740 344, 768 302, 800 294 C 832 302, 860 344, 860 398 Z" fill="var(--gold-deep)" opacity="0.4" />
          <circle cx="800" cy="342" r="16" fill="var(--gulaal-1)" />
          <circle cx="800" cy="378" r="9" fill="var(--gulaal-3)" />
          {/* Band */}
          <rect x="698" y="392" width="204" height="28" rx="12" fill="var(--gold-lit)" />
          <rect x="698" y="392" width="204" height="28" rx="12" fill="none" stroke="#5e3210" strokeWidth="3" />
          {[740, 800, 860].map((jx) => (
            <circle key={jx} cx={jx} cy="406" r="8" fill="var(--gulaal-1)" />
          ))}
          {/* Finial */}
          <circle cx="800" cy="256" r="13" fill="var(--gulaal-1)" />
          <path d="M800 242 l0 -24" stroke="var(--gold-lit)" strokeWidth="5" />
          <circle cx="800" cy="212" r="8" fill="var(--gold-lit)" />
        </g>

        {/* मूषक, waiting with his own modak */}
        <g transform="translate(1128,752)">
          <ellipse cx="0" cy="0" rx="44" ry="27" fill="#9a84c2" />
          <ellipse cx="-36" cy="-11" rx="21" ry="18" fill="#ad9bd2" />
          <circle cx="-48" cy="-26" r="13" fill="#8371ab" />
          <circle cx="-25" cy="-30" r="13" fill="#8371ab" />
          <circle cx="-46" cy="-9" r="4.5" fill="#2a1a3c" />
          <path d="M42 4 q36 8 32 -24" fill="none" stroke="#9a84c2" strokeWidth="6" strokeLinecap="round" />
          <path d="M-62 -4 q-11 -4 -7 -13 q7 -12 14 0 q4 9 -7 13 Z" fill="#f6e3bd" />
        </g>

        {/* ── Stage ─────────────────────────────────────────── */}
        <rect x="360" y="758" width="880" height="20" rx="4" fill="var(--gold-deep)" />
        <rect x="360" y="776" width="880" height="66" fill="url(#drapeGrad)" />
        <path
          d={`M360 838 ${Array.from({ length: 22 }, () => "q20 24 40 0").join(" ")}`}
          fill="var(--gold)"
        />
        {beads([372, 790], [800, 828], [1228, 790], 34).map((b) => (
          <circle key={b.i} cx={b.x} cy={b.y} r="7" fill={b.i % 2 ? "var(--marigold)" : "var(--marigold-2)"} />
        ))}

        {/* Samai lamps at the corners of the stage */}
        {[452, 1148].map((lx) => (
          <g key={lx}>
            <circle cx={lx} cy="716" r="46" fill="url(#lampGlow)" className="glow" />
            <path d={`M${lx - 22} 758 q22 12 44 0 l-8 -14 h-28 Z`} fill="url(#goldGrad)" />
            <rect x={lx - 4} y="704" width="8" height="42" fill="var(--gold-deep)" />
            <path d={`M${lx - 20} 706 q20 12 40 0 q-6 -12 -20 -12 q-14 0 -20 12 Z`} fill="url(#goldGrad)" />
            <g className={lx === 452 ? "flame" : "flame flame--b"}>
              <path d={`M${lx} 700 q13 -16 0 -38 q-13 22 0 38 Z`} fill="var(--marigold-2)" />
              <path d={`M${lx} 698 q7 -9 0 -21 q-7 12 0 21 Z`} fill="#fff6d4" />
            </g>
          </g>
        ))}

        {/* ── Gulaal already hanging in the air ─────────────── */}
        <g>
          {Array.from({ length: 9 }, (_, i) => (
            <circle
              key={i}
              className="gulaal"
              cx={180 + i * 160}
              cy={700 + (i % 3) * 40}
              r={26 + (i % 4) * 9}
              fill={GULAAL[i % 4]}
              opacity="0.4"
              style={{ animationDelay: `${-i * 1.1}s`, animationDuration: `${8 + (i % 3) * 2}s` }}
            />
          ))}
        </g>

        {/* ── The crowd ─────────────────────────────────────── */}
        {/* Back, small and pale — they're a long way down the lane */}
        <g className="jumps jumps--c" opacity="0.85">
          {[
            [44, 3], [116, 0], [188, 2], [258, 1], [330, 4], [400, 0], [470, 2],
            [1148, 4], [1220, 0], [1292, 2], [1364, 3], [1436, 1], [1508, 0], [1578, 2],
          ].map(([x, pose], i) => (
            <Dancer
              key={x}
              x={x}
              ground={824}
              s={0.56}
              pose={pose}
              tone="var(--crowd-3)"
              saree={i % 3 === 0}
              flip={i % 2 === 0}
              wave={["", "wave--b", "wave--c", "wave--d"][i % 4]}
            />
          ))}
        </g>

        {/* Middle */}
        <g className="jumps jumps--b">
          {[
            [30, 1], [140, 4], [248, 0], [356, 2], [462, 3], [700, 1], [820, 4],
            [1130, 0], [1240, 4], [1352, 1], [1460, 2], [1570, 3],
          ].map(([x, pose], i) => (
            <Dancer
              key={x}
              x={x}
              ground={876}
              s={0.82}
              pose={pose}
              tone="var(--crowd-2)"
              saree={i % 4 === 1}
              flip={i % 2 === 1}
              wave={["wave--b", "", "wave--d", "wave--c"][i % 4]}
            />
          ))}
          <OnShoulders x={604} ground={876} s={0.82} tone="var(--crowd-2)" />
          <TashaPlayer x={1010} ground={872} s={0.8} tone="var(--crowd-2)" />
        </g>

        {/* Front — big, dark, and cropped by the frame */}
        <g className="jumps">
          {[
            [-24, 0], [104, 3], [452, 1], [592, 4], [730, 2], [880, 0],
            [1046, 2], [1150, 0], [1420, 3], [1560, 1],
          ].map(([x, pose], i) => (
            <Dancer
              key={x}
              x={x}
              ground={1010}
              s={1.28}
              pose={pose}
              tone="var(--crowd)"
              saree={i % 3 === 2}
              flip={i % 2 === 0}
              wave={["wave--c", "wave--b", "", "wave--d"][i % 4]}
            />
          ))}
          <TashaPlayer x={318} ground={962} s={1.12} tone="var(--crowd)" />
          <DholPlayer x={1268} ground={948} s={1.16} tone="var(--crowd)" onHit={onHit} hit={hit} />
        </g>

        {/* Deepest foreground, only in shot on a tall screen */}
        <g className="jumps" opacity="0.96">
          {[[200, 4], [560, 0], [900, 3], [1300, 1]].map(([x, pose], i) => (
            <Dancer
              key={x}
              x={x}
              ground={1180}
              s={1.7}
              pose={pose}
              tone="#0a0512"
              flip={i % 2 === 0}
              wave={["wave--b", "wave--d", "", "wave--c"][i % 4]}
            />
          ))}
        </g>

        {/* ── Petals coming down over all of it ─────────────── */}
        <g>
          {Array.from({ length: 16 }, (_, i) => (
            <ellipse
              key={i}
              className="petal"
              cx={70 + i * 98}
              cy={-20 - (i % 5) * 40}
              rx="7"
              ry="4.5"
              fill={i % 3 === 0 ? "var(--marigold-2)" : "var(--marigold)"}
              style={{
                animationDelay: `${-i * 0.82}s`,
                animationDuration: `${9 + (i % 4) * 1.8}s`,
              }}
            />
          ))}
        </g>

        {/* ── Gulaal thrown on the last hit ─────────────────── */}
        <g>
          {bursts.map((b) => (
            <circle
              key={b.id}
              className="burst"
              cx={b.x * 1600}
              cy={b.y * 900}
              r="30"
              fill={b.c}
              style={{
                ["--dx" as string]: `${b.dx * 1600}px`,
                ["--dy" as string]: `${b.dy * 900}px`,
              }}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
