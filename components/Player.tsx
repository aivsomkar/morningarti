"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SETS, tracksIn, type Set, type Track } from "@/lib/ganpati";
import { Pathak } from "@/lib/sound";

/**
 * The pathak is the first thing in every set because it's the one thing that
 * always works — it's generated in the browser, not fetched.
 */
const PATHAK: Track = {
  slug: "__pathak",
  title: "ढोल ताशा पथक",
  by: "लाइव · ढोल, ताशा, झांज",
  set: "dj",
  glyph: "ढ",
  tag: "लाइव",
};

function clock(s: number) {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

type Props = {
  /** Which set is open. Owned by the room, because the clock picks the first one. */
  set: Set;
  onSetChange: (set: Set) => void;
  /** Fires on each downbeat of the live pathak so the crowd can jump. */
  onBeat: (accent: boolean) => void;
};

export default function Player({ set, onSetChange, onBeat }: Props) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [dur, setDur] = useState(0);
  const [missing, setMissing] = useState<Track | null>(null);
  const [open, setOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathakRef = useRef<Pathak | null>(null);

  const queue = useMemo(() => [PATHAK, ...tracksIn(set)], [set]);
  const track = queue[Math.min(idx, queue.length - 1)];
  const isPathak = track.slug === PATHAK.slug;

  // Built once, in an effect — never during render.
  useEffect(() => {
    const p = new Pathak();
    pathakRef.current = p;
    return () => {
      p.stop();
      pathakRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (pathakRef.current) pathakRef.current.onBeat = onBeat;
  }, [onBeat]);

  const stopEverything = useCallback(() => {
    pathakRef.current?.stop();
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  }, []);

  const start = useCallback(() => {
    setMissing(null);
    if (isPathak) {
      audioRef.current?.pause();
      pathakRef.current?.start();
      setPlaying(true);
      return;
    }
    pathakRef.current?.stop();
    const el = audioRef.current;
    if (!el) return;
    void el.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }, [isPathak]);

  const toggle = useCallback(() => {
    if (playing) {
      stopEverything();
      setPlaying(false);
    } else {
      start();
    }
  }, [playing, start, stopEverything]);

  const go = useCallback(
    (next: number) => {
      const n = (next + queue.length) % queue.length;
      stopEverything();
      setPos(0);
      setDur(0);
      setMissing(null);
      setIdx(n);
    },
    [queue.length, stopEverything],
  );

  const pick = useCallback(
    (n: number) => {
      go(n);
      window.setTimeout(() => setPlaying(true), 0);
    },
    [go],
  );

  const switchSet = useCallback(
    (s: Set) => {
      if (s === set) return;
      stopEverything();
      onSetChange(s);
      setIdx(0);
      setPos(0);
      setDur(0);
      setMissing(null);
    },
    [set, onSetChange, stopEverything],
  );

  // Load whatever is selected; play it if we were already playing.
  useEffect(() => {
    const el = audioRef.current;
    if (isPathak) {
      el?.pause();
      if (playing) pathakRef.current?.start();
      else pathakRef.current?.stop();
      return;
    }
    pathakRef.current?.stop();
    if (!el) return;
    el.src = `/audio/${track.slug}.mp3`;
    el.load();
    if (playing) void el.play().catch(() => setPlaying(false));
    // `playing` is read but not depended on, so the transport doesn't reload
    // the source every time it toggles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, set, isPathak, track.slug]);

  useEffect(() => {
    if (!playing || isPathak) return;
    const el = audioRef.current;
    if (el && el.paused) void el.play().catch(() => setPlaying(false));
  }, [playing, isPathak]);

  // Media keys and the lock screen.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.by,
      album: "गणपती बाप्पा मोरया",
    });
    navigator.mediaSession.setActionHandler("play", () => start());
    navigator.mediaSession.setActionHandler("pause", () => {
      stopEverything();
      setPlaying(false);
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => go(idx - 1));
    navigator.mediaSession.setActionHandler("nexttrack", () => go(idx + 1));
  }, [track, idx, go, start, stopEverything]);

  const pct = dur > 0 ? Math.min(100, (pos / dur) * 100) : 0;
  const artTone = isPathak ? "dj" : track.set;
  const setMeta = SETS.find((s) => s.id === set)!;

  return (
    <>
      <audio
        ref={audioRef}
        preload="none"
        onTimeUpdate={(e) => setPos(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDur(e.currentTarget.duration)}
        onEnded={() => go(idx + 1)}
        onError={() => {
          if (isPathak) return;
          setMissing(track);
          setPlaying(false);
        }}
      />

      {missing && (
        <div className="notice" role="status">
          <b>{missing.title}</b> isn&apos;t in this copy — the recordings are
          somebody&apos;s copyright, so none ship with the repo. Drop an mp3 at{" "}
          <code>public/audio/{missing.slug}.mp3</code> and it plays here. Meanwhile{" "}
          <button onClick={() => pick(0)}>ढोल ताशा पथक</button> is live, and the links
          up top open a real playlist.
        </div>
      )}

      {open && !missing && (
        <div className="queue">
          <div className="queue__tabs" role="tablist" aria-label="Sets">
            {SETS.map((s) => (
              <button
                key={s.id}
                className="queue__tab"
                role="tab"
                aria-selected={s.id === set}
                onClick={() => switchSet(s.id)}
              >
                {s.name}
                <small>{s.sub}</small>
              </button>
            ))}
          </div>
          <p className="queue__note">{setMeta.note}</p>
          <div className="queue__list" role="listbox" aria-label={setMeta.name}>
            {queue.map((t, i) => (
              <button
                key={t.slug}
                className="queue__row"
                role="option"
                aria-current={i === idx}
                aria-selected={i === idx}
                onClick={() => pick(i)}
              >
                <span className="queue__idx">{i === idx && playing ? "▶" : i}</span>
                <span>
                  <span className="queue__name">{t.title}</span>
                  <span className="queue__for"> · {t.by}</span>
                </span>
                {t.tag ? <span className="queue__badge">{t.tag}</span> : <span />}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="player">
        <button
          className={`player__art player__art--${artTone}${playing ? " player__art--playing" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Hide the queue" : "Show the queue"}
        >
          <span className="player__glyph">{track.glyph}</span>
        </button>

        <div className="player__meta">
          <div className="player__name">{track.title}</div>
          <div className="player__by">{track.by}</div>
          <div className="player__scrub">
            <span className="player__time">{isPathak ? "live" : clock(pos)}</span>
            <div className="player__bar">
              <div
                className="player__fill"
                style={{ width: isPathak ? (playing ? "100%" : "0%") : `${pct}%` }}
              />
            </div>
            <span className="player__time">{isPathak ? "∞" : clock(dur)}</span>
          </div>
        </div>

        <div className="player__controls">
          <button className="player__btn" onClick={() => go(idx - 1)} aria-label="Previous">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M4 3h2v10H4zm8 0v10L6 8z" />
            </svg>
          </button>

          <button
            className="player__btn player__btn--main"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M4.5 2.5h3v11h-3zm4.5 0h3v11H9z" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M5 2.6 13 8l-8 5.4z" />
              </svg>
            )}
          </button>

          <button className="player__btn" onClick={() => go(idx + 1)} aria-label="Next">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M10 3h2v10h-2zM4 3l6 5-6 5z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
