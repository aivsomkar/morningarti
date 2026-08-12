"use client";

import { useCallback, useState } from "react";
import SceneDrawn from "./SceneDrawn";

/**
 * The pandal.
 *
 * A painted 16:9 plate at public/pandal.jpg, with a thin SVG layer on top for
 * the things that have to move: gulaal off the dhol, and the drum you can hit.
 * The overlay uses the image's own pixel dimensions as its viewBox and slices
 * the same way `object-fit: cover` does, so its coordinates land exactly on the
 * painting at every viewport.
 *
 * If the plate isn't there, the hand-drawn scene stands in.
 */

export type Burst = { id: number; x: number; y: number; dx: number; dy: number; c: string };

const PLATE = "/pandal.jpg";

/**
 * Where the two dhols sit in the painting, as fractions of its width and
 * height — so they stay on the drums however the plate is cropped. The player
 * sits over their inner halves; the outer halves stay clickable, and D always
 * works.
 */
const DRUMS = [
  { x: 0.297, y: 0.938, rx: 0.049, ry: 0.046 },
  { x: 0.676, y: 0.946, rx: 0.047, ry: 0.043 },
];

type Props = {
  onHit: () => void;
  hit: boolean;
  bursts: Burst[];
};

export default function Scene({ onHit, hit, bursts }: Props) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [failed, setFailed] = useState(false);

  // The server-rendered <img> can finish — or 404 — before React hydrates, so
  // its load and error events are long gone by the time handlers attach. Read
  // the element's own state on mount instead of waiting for one.
  const settle = useCallback((el: HTMLImageElement | null) => {
    if (!el || !el.complete) return;
    if (el.naturalWidth === 0) setFailed(true);
    else setSize({ w: el.naturalWidth, h: el.naturalHeight });
  }, []);

  if (failed) return <SceneDrawn onHit={onHit} hit={hit} bursts={bursts} />;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={settle}
        className={`plate${hit ? " plate--hit" : ""}`}
        src={PLATE}
        alt="A sarvajanik Ganpati pandal: a large seated Ganpati idol on a lotus under a draped arch hung with marigolds, with a crowd of people below raising their hands and playing dhol."
        onLoad={(e) =>
          setSize({
            w: e.currentTarget.naturalWidth,
            h: e.currentTarget.naturalHeight,
          })
        }
        onError={() => setFailed(true)}
      />

      {size && (
        <svg
          className="plate__over"
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden={bursts.length === 0 || undefined}
        >
          {/* Portrait crops the drums away entirely, so the whole plate
              becomes the drum. Only live under the mobile breakpoint. */}
          <rect
            className="plate__tap"
            x="0"
            y="0"
            width={size.w}
            height={size.h}
            onClick={onHit}
            role="button"
            tabIndex={-1}
            aria-hidden
          />

          {/* The drums, made hittable */}
          {DRUMS.map((d, i) => (
            <ellipse
              key={i}
              className={`drum${hit ? " drum--hit" : ""}`}
              cx={d.x * size.w}
              cy={d.y * size.h}
              rx={d.rx * size.w}
              ry={d.ry * size.h}
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
            />
          ))}

          {/* Gulaal thrown on the last hit */}
          {bursts.map((b) => (
            <circle
              key={b.id}
              className="burst"
              cx={b.x * size.w}
              cy={b.y * size.h}
              r={size.w * 0.019}
              fill={b.c}
              style={{
                ["--dx" as string]: `${b.dx * size.w}px`,
                ["--dy" as string]: `${b.dy * size.h}px`,
              }}
            />
          ))}
        </svg>
      )}
    </>
  );
}
