# गणपती बाप्पा मोरया

A sarvajanik Ganpati pandal you can stand in front of on any day of the year.
One page: the idol, the lane, the crowd, and the speakers.

Built after [Deluxe Saloon](https://deluxesaloon.in) — a full-bleed illustrated
scene, a floating player, and nothing else.

## What's in it

**A painted plate with a live layer on top.** `public/pandal.jpg` is the scene;
`components/Scene.tsx` puts a thin SVG over it whose viewBox is the image's own
pixel size, sliced exactly the way `object-fit: cover` does — so the drum
hit-areas and the gulaal stay glued to the painting at every viewport,
portrait included. If the plate is ever missing, `components/SceneDrawn.tsx`
stands in: the whole pandal hand-drawn as one 1600×900 SVG, idol and crowd
included.

**Three sets, not one playlist.** A pandal doesn't run a single queue. Mornings
and evenings are the aarti, sung in a fixed order that ends the same way every
night. The rest of the day the speakers belong to the street. The last day is
a goodbye. `lib/ganpati.ts` encodes all three, and the tab that opens is picked
from the actual hour and the actual day of the festival.

**The percussion is synthesised.** `lib/sound.ts` builds a dhol (pitched
membrane dropping a fifth in 60ms, plus a filtered noise slap), a tasha, and
jhanj out of oscillators, then runs them on a 16-step cycle scheduled against
the Web Audio clock so it doesn't drift. That's why the site has sound with no
audio files in the repo. Hit the dhol in the crowd — or press <kbd>D</kbd>.

**The festival calendar is real.** Ganesh Chaturthi moves with the lunar
calendar, so `CHATURTHI` in `lib/ganpati.ts` is a lookup table, 2024–2030. The
chip at the top counts days to Chaturthi, or shows which day of the utsav it is,
or says विसर्जन on Anant Chaturdashi.

## Running it

```bash
npm install
npm run dev
```

## Adding the songs

None ship with the repo — see [`public/audio/README.md`](public/audio/README.md).
Drop mp3s named after the slugs in `lib/ganpati.ts` and the player finds them.
Until then the live pathak covers it, and the links in the top right open a real
playlist.

## Layout

```
app/
  layout.tsx      Rozha One + Mukta, metadata
  globals.css     palette and every style, including the SVG animations
  page.tsx
components/
  Room.tsx        state: clock, festival day, the dhol, gulaal bursts
  Scene.tsx       the whole pandal, in SVG
  Chrome.tsx      clock, festival chip, outbound links
  Player.tsx      transport, the three-set queue, missing-file handling
lib/
  ganpati.ts      tracklist, sets, festival calendar
  sound.ts        dhol, tasha, jhanj, and the pathak scheduler
```

## Notes

- Everything respects `prefers-reduced-motion`.
- The clock and the festival day only render after mount; the server has no idea
  what time it is where you are.
- Portrait screens get a taller `viewBox` onto the same artwork — a 16:9 frame
  can't show its own width on a phone.
