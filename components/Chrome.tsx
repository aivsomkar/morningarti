"use client";

import { dev, partOfDay, type Utsav } from "@/lib/ganpati";

type Props = {
  now: Date | null;
  utsav: Utsav | null;
};

/** Playlists we don't host. Search links, so they don't rot. */
const LINKS = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/search/ganpati/playlists",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 1 1-.33-1.46c4.57-1.04 8.5-.59 11.66 1.34.35.22.46.68.25 1.03Zm1.23-2.74a.94.94 0 0 1-1.29.31c-3.23-1.98-8.15-2.56-11.97-1.4a.94.94 0 1 1-.54-1.79c4.37-1.32 9.79-.68 13.5 1.6.44.27.58.85.3 1.28Zm.11-2.85C14.07 8.51 7.9 8.3 4.2 9.43a1.12 1.12 0 1 1-.65-2.15c4.25-1.29 11.07-1.04 15.43 1.55a1.12 1.12 0 1 1-1.14 1.94Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://music.youtube.com/search?q=ganpati+dj+nonstop",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-2 14.5v-9l8 4.5-8 4.5Z" />
      </svg>
    ),
  },
];

/** What the chip says depends on where we are in the ten days. */
function utsavText(u: Utsav): { label: string; value: string; note: string } {
  switch (u.phase) {
    case "aagman":
      return { label: "आगमन", value: "दिवस १", note: "बाप्पा आले" };
    case "utsav":
      return {
        label: "गणेशोत्सव",
        value: `दिवस ${dev(u.day)}`,
        note: `विसर्जनाला ${dev(u.left)} दिवस`,
      };
    case "visarjan":
      return { label: "अनंत चतुर्दशी", value: "विसर्जन", note: "पुढच्या वर्षी लवकर या" };
    case "waiting":
      return {
        label: "बाप्पा येणार",
        value: `${dev(u.until)} दिवस`,
        note: "गणेश चतुर्थीची वाट",
      };
    default:
      return { label: "गणपती बाप्पा", value: "मोरया", note: "" };
  }
}

export default function Chrome({ now, utsav }: Props) {
  // The clock only exists after mount — the server has no idea what time it
  // is where you are, and a wrong first paint is worse than a blank one.
  const time = now
    ? dev(`${((now.getHours() + 11) % 12) + 1}:${String(now.getMinutes()).padStart(2, "0")}`)
    : "—";
  const suffix = now ? partOfDay(now.getHours()) : "";
  const chip = utsav ? utsavText(utsav) : null;

  return (
    <header className="chrome">
      <div className="clock">
        <span className="clock__time">{time}</span>
        <span className="clock__suffix">{suffix}</span>
      </div>

      <div className="utsav">
        <p className="utsav__line">
          <span className="utsav__label">{chip ? chip.label : "गणपती बाप्पा"}</span>
          <span className="utsav__dot" aria-hidden />
          <span className="utsav__value">{chip ? chip.value : "मोरया"}</span>
        </p>
        {chip?.note && <p className="utsav__note">{chip.note}</p>}
      </div>

      <nav className="links" aria-label="Ganpati playlists elsewhere">
        {LINKS.map((l) => (
          <a
            key={l.label}
            className="links__item"
            href={l.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            {l.icon}
            <span>{l.label}</span>
          </a>
        ))}
      </nav>
    </header>
  );
}
