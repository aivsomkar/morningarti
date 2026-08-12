"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Scene, { type Burst } from "./Scene";
import Chrome from "./Chrome";
import Player from "./Player";
import { defaultSet, utsavOn, type Set, type Utsav } from "@/lib/ganpati";
import { dhol, jhanj } from "@/lib/sound";

const GULAAL = ["var(--gulaal-1)", "var(--gulaal-2)", "var(--gulaal-3)", "var(--gulaal-4)"];

/** Where the dhol sits, as a fraction of the artwork — bursts come off it. */
const DHOL = { x: 0.297, y: 0.915 };

export default function Room() {
  // Rendered on the server too, so it must not read the clock until mounted.
  const [now, setNow] = useState<Date | null>(null);
  const [utsav, setUtsav] = useState<Utsav | null>(null);
  const [set, setSet] = useState<Set>("dj");
  const [hit, setHit] = useState(false);
  const [jumping, setJumping] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [hintSeen, setHintSeen] = useState(false);
  const [beat, setBeat] = useState(0);
  const burstId = useRef(0);
  const setPicked = useRef(false);

  useEffect(() => {
    const read = () => {
      const d = new Date();
      const u = utsavOn(d);
      setNow(d);
      setUtsav(u);
      // Only on the first read — the clock shouldn't yank the set out from
      // under someone who has chosen one.
      if (!setPicked.current) {
        setPicked.current = true;
        setSet(defaultSet(d, u));
      }
    };
    read();
    const t = window.setInterval(read, 30_000);
    return () => window.clearInterval(t);
  }, []);

  /** Gulaal off the drum head, in a rough cone. */
  const throwGulaal = useCallback((count: number) => {
    const made: Burst[] = Array.from({ length: count }, () => {
      const id = ++burstId.current;
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.7;
      const dist = 0.07 + Math.random() * 0.15;
      return {
        id,
        x: DHOL.x + (Math.random() - 0.5) * 0.07,
        y: DHOL.y + (Math.random() - 0.5) * 0.04,
        dx: Math.cos(angle) * dist,
        // The y fraction is of height, so stretch it to travel as far visually.
        dy: Math.sin(angle) * dist * 1.75,
        c: GULAAL[Math.floor(Math.random() * GULAAL.length)],
      };
    });
    setBursts((b) => [...b, ...made]);
    const ids = new global.Set(made.map((m) => m.id));
    window.setTimeout(() => setBursts((b) => b.filter((x) => !ids.has(x.id))), 1700);
  }, []);

  const bounce = useCallback(() => {
    setJumping(true);
    setBeat(1);
    window.setTimeout(() => setJumping(false), 430);
    window.setTimeout(() => setBeat(0), 260);
  }, []);

  /** A deliberate hit: drum, cymbal, gulaal, and the crowd goes up. */
  const strike = useCallback(() => {
    dhol({ gain: 1.15 });
    jhanj({ gain: 0.8 });
    setHintSeen(true);
    setHit(true);
    window.setTimeout(() => setHit(false), 340);
    bounce();
    throwGulaal(9);
  }, [bounce, throwGulaal]);

  /** The live pathak drives the same bounce, without the extra gulaal. */
  const onBeat = useCallback(
    (accent: boolean) => {
      bounce();
      if (accent) throwGulaal(3);
    },
    [bounce, throwGulaal],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "d") return;
      const el = document.activeElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return;
      strike();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [strike]);

  return (
    <main className="pandal" style={{ ["--beat" as string]: beat }}>
      <Scene onHit={strike} hit={hit} bursts={bursts} />

      <div className="pandal__grade" aria-hidden />

      <Chrome now={now} utsav={utsav} />

      <div className="title">
        <h1 className="title__mark">
          गणपती बाप्पा <span>मोरया</span>
        </h1>
        <p className="title__sub">ढोल वाजतोय · गुलाल उडतोय · गल्ली नाचतेय</p>
      </div>

      <Player set={set} onSetChange={setSet} onBeat={onBeat} />

      <p className="dhol-hint" style={{ opacity: hintSeen ? 0 : 1 }}>
        ढोल वाजवा
        <span className="dhol-hint__key">D</span>
      </p>

      <JumpSync on={jumping} />
    </main>
  );
}

/**
 * The crowd's bounce lives on SVG groups inside <Scene>, which re-renders on
 * every burst. Toggling the class from here through the DOM keeps the beat off
 * React's render path — at 108bpm that matters.
 */
function JumpSync({ on }: { on: boolean }) {
  useEffect(() => {
    const rows = document.querySelectorAll(".jumps");
    rows.forEach((r) => r.classList.toggle("jumps--hit", on));
  }, [on]);
  return null;
}
