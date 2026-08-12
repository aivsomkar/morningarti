"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * The songs play through YouTube's own embedded player.
 *
 * Nothing is hosted here and nothing is ripped: the label's upload is what
 * streams, the label is named next to it, the play counts on their video, and
 * the card links straight through. The iframe stays visible for the same
 * reason — an embed you can see and click is the deal YouTube offers.
 */

type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  loadVideoById(id: string): void;
  cueVideoById(id: string): void;
  getCurrentTime(): number;
  getDuration(): number;
  setVolume(v: number): void;
  destroy(): void;
};

type YTNamespace = {
  Player: new (
    el: HTMLElement | string,
    opts: Record<string, unknown>,
  ) => YTPlayer;
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

/** Loads the IFrame API once, however many players ask for it. */
function loadApi(): Promise<YTNamespace> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT!);
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  });
  return apiPromise;
}

export type Stage = {
  play: (videoId: string) => void;
  resume: () => void;
  pause: () => void;
};

type Props = {
  /** The video to hold. Null hides the card entirely. */
  videoId: string | null;
  title: string;
  owner: string;
  visible: boolean;
  onReady: (stage: Stage) => void;
  onEnded: () => void;
  /** 101 / 150 mean the owner disabled embedding for this one. */
  onBlocked: () => void;
  onProgress: (pos: number, dur: number) => void;
};

export default function YouTubeStage({
  videoId,
  title,
  owner,
  visible,
  onReady,
  onEnded,
  onBlocked,
  onProgress,
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const pendingRef = useRef<string | null>(null);
  const tickRef = useRef<number | null>(null);

  // Callbacks change identity every render; keep the live ones in a ref so the
  // player is only ever built once.
  const cbs = useRef({ onReady, onEnded, onBlocked, onProgress });

  useEffect(() => {
    cbs.current = { onReady, onEnded, onBlocked, onProgress };
  }, [onReady, onEnded, onBlocked, onProgress]);

  const startTicking = useCallback(() => {
    if (tickRef.current !== null) return;
    tickRef.current = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      try {
        cbs.current.onProgress(p.getCurrentTime(), p.getDuration());
      } catch {
        /* player not ready yet */
      }
    }, 500);
  }, []);

  const stopTicking = useCallback(() => {
    if (tickRef.current !== null) window.clearInterval(tickRef.current);
    tickRef.current = null;
  }, []);

  useEffect(() => {
    let dead = false;

    void loadApi().then((YT) => {
      if (dead || !mountRef.current || playerRef.current) return;

      playerRef.current = new YT.Player(mountRef.current, {
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: () => {
            const stage: Stage = {
              play: (id) => {
                playerRef.current?.loadVideoById(id);
                startTicking();
              },
              resume: () => {
                playerRef.current?.playVideo();
                startTicking();
              },
              pause: () => {
                playerRef.current?.pauseVideo();
                stopTicking();
              },
            };
            cbs.current.onReady(stage);
            if (pendingRef.current) {
              stage.play(pendingRef.current);
              pendingRef.current = null;
            }
          },
          onStateChange: (e: { data: number }) => {
            if (e.data === YT.PlayerState.ENDED) {
              stopTicking();
              cbs.current.onEnded();
            } else if (e.data === YT.PlayerState.PLAYING) {
              startTicking();
            }
          },
          onError: (e: { data: number }) => {
            // 101 and 150 are the same thing: embedding disabled by the owner.
            if (e.data === 101 || e.data === 150 || e.data === 100) {
              cbs.current.onBlocked();
            }
          },
        },
      });
    });

    return () => {
      dead = true;
      stopTicking();
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [startTicking, stopTicking]);

  return (
    <div className={`stage${visible ? "" : " stage--hidden"}`}>
      <div className="stage__frame">
        <div ref={mountRef} />
      </div>
      {videoId && (
        <a
          className="stage__credit"
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noreferrer noopener"
          title={title}
        >
          <span className="stage__owner">{owner}</span>
          <span className="stage__watch">Watch on YouTube ↗</span>
        </a>
      )}
    </div>
  );
}
