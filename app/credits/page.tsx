import Link from "next/link";
import type { Metadata } from "next";
import { SETS, TRACKS, tracksIn } from "@/lib/ganpati";

/**
 * Who owns what, and how to get something taken down.
 *
 * The site embeds; it doesn't host. This page says so in plain words, names
 * every rights holder, links to every original, and gives anyone who objects a
 * single obvious place to write to.
 */

// Where takedown requests go. Already the repo's commit address — swap it for a
// role address if this ever gets real traffic.
const CONTACT = "aivsomkar@gmail.com";

export const metadata: Metadata = {
  title: "Credits & rights — गणपती बाप्पा मोरया",
  description:
    "Every song on this site streams from its owner's own YouTube upload. Here is who owns what, and how to ask for something to be removed.",
};

export default function CreditsPage() {
  const owners = [...new Set(TRACKS.map((t) => t.owner))].sort();

  return (
    <main className="doc">
      <p className="doc__back">
        <Link href="/">← back to the pandal</Link>
      </p>

      <h1 className="doc__title">Credits &amp; rights</h1>

      <p className="doc__lede">
        Every song here belongs to somebody. None of it is hosted on this site, and
        none of it has been copied, downloaded or re-uploaded.
      </p>

      <h2>How the music plays</h2>
      <p>
        Each track is embedded straight from the rights holder&apos;s own YouTube
        upload, using YouTube&apos;s player. That means YouTube serves the audio and
        video, the owner is named on screen while it plays, the view counts on their
        video, and every credit links back to it. The player stays visible rather
        than hidden, and it is never stripped of its branding.
      </p>
      <p>
        Where a rights holder has switched embedding off, their song is not played
        here at all — the player says who owns it and links out to YouTube instead.
        Songs that could not be traced to an official upload were left off entirely
        rather than pointed at a re-upload.
      </p>
      <p>
        The one exception is <b>ढोल ताशा पथक</b>, the dhol-tasha loop that opens every
        set. That is generated in your browser from oscillators. Nobody owns it.
      </p>

      <h2>Rights holders</h2>
      <p className="doc__owners">{owners.join(" · ")}</p>

      {SETS.map((set) => (
        <section key={set.id}>
          <h3>
            {set.name} <span className="doc__sub">{set.sub}</span>
          </h3>
          <ul className="doc__list">
            {tracksIn(set.id).map((t) => (
              <li key={t.slug}>
                <a
                  href={`https://www.youtube.com/watch?v=${t.yt}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {t.title}
                </a>
                <span className="doc__by">
                  {t.by} — © {t.owner}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <h2 id="takedown">Asking for something to be removed</h2>
      <p>
        If you hold the rights to any of the above and would rather it were not
        embedded here, write to{" "}
        <a href={`mailto:${CONTACT}?subject=Ganpati%20pandal%20site%20—%20removal%20request`}>
          {CONTACT}
        </a>{" "}
        naming the track, and it will be taken off. No explanation needed, and there
        is nothing to negotiate — removing an embed takes one line.
      </p>
      <p>
        You can also simply disable embedding on the video itself, and this site will
        stop playing it within seconds and show a link to YouTube in its place.
      </p>

      <p className="doc__foot">
        The artwork and the site are original work. The photograph of the pandal was
        made for this project.
      </p>
    </main>
  );
}
