"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OPENER, SETS, tracksIn, type Set, type Track } from "@/lib/ganpati";
import YouTubeStage, { type Stage } from "./YouTubeStage";

/** Roughly a pathak's tempo — what the crowd bounces to while anything plays. */
const BOUNCE_MS = 600;

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
  const [blocked, setBlocked] = useState<Track | null>(null);
  const [open, setOpen] = useState(false);

  const stageRef = useRef<Stage | null>(null);

  const queue = useMemo(() => [OPENER, ...tracksIn(set)], [set]);
  const track = queue[Math.min(idx, queue.length - 1)];

  // Nothing here reports its beat, so the crowd keeps a steady one of its own
  // for as long as something is playing.
  useEffect(() => {
    if (!playing) return;
    let n = 0;
    const t = window.setInterval(() => onBeat(n++ % 4 === 0), BOUNCE_MS);
    return () => window.clearInterval(t);
  }, [playing, onBeat]);

  const stopEverything = useCallback(() => {
    stageRef.current?.pause();
  }, []);

  const start = useCallback(() => {
    setBlocked(null);
    stageRef.current?.play(track.yt);
    setPlaying(true);
  }, [track.yt]);

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
      setPos(0);
      setDur(0);
      setBlocked(null);
      setIdx(n);
      if (playing) stageRef.current?.play(queue[n].yt);
    },
    [queue, playing],
  );

  const pick = useCallback(
    (n: number) => {
      const i = (n + queue.length) % queue.length;
      setPos(0);
      setDur(0);
      setBlocked(null);
      setIdx(i);
      setPlaying(true);
      stageRef.current?.play(queue[i].yt);
    },
    [queue],
  );

  const switchSet = useCallback(
    (s: Set) => {
      if (s === set) return;
      stopEverything();
      onSetChange(s);
      setIdx(0);
      setPos(0);
      setDur(0);
      setBlocked(null);
      setPlaying(false);
    },
    [set, onSetChange, stopEverything],
  );

  /** A label can turn embedding off after the fact. Say so, and move on. */
  const onBlockedTrack = useCallback(() => {
    setBlocked(track);
    setPlaying(false);
  }, [track]);

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
  const artTone = track.set;
  const setMeta = SETS.find((s) => s.id === set)!;

  return (
    <>
      <YouTubeStage
        videoId={track.yt}
        title={track.title}
        owner={track.owner}
        visible={playing}
        onReady={(s) => {
          stageRef.current = s;
        }}
        onEnded={() => go(idx + 1)}
        onBlocked={onBlockedTrack}
        onProgress={(p, d) => {
          setPos(p);
          setDur(d);
        }}
      />

      {blocked && (
        <div className="notice" role="status">
          <b>{blocked.title}</b> — {blocked.owner} has embedding turned off for this
          one, so it can only play on YouTube.{" "}
          <a
            href={`https://www.youtube.com/watch?v=${blocked.yt}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            Open it there ↗
          </a>{" "}
          or{" "}
          <button onClick={() => pick(idx + 1)}>skip to the next one</button>.
        </div>
      )}

      {open && !blocked && (
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
                  <span className="queue__owner">{t.owner}</span>
                </span>
                {t.tag ? <span className="queue__badge">{t.tag}</span> : <span />}
              </button>
            ))}
          </div>
          <p className="queue__legal">
            Nothing is hosted here. Every song streams from its owner&apos;s own
            YouTube upload, credited above — the play counts for them.{" "}
            <a href="/credits">Credits &amp; rights →</a>
          </p>
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
          <div className="player__by">
            {track.by}
            {" · "}
            <a
              className="player__owner"
              href={`https://www.youtube.com/watch?v=${track.yt}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              {track.owner} ↗
            </a>
          </div>
          <div className="player__scrub">
            <span className="player__time">{clock(pos)}</span>
            <div className="player__bar">
              <div
                className="player__fill"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="player__time">{clock(dur)}</span>
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
