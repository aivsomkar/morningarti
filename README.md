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

**The dhol you hit is synthesised.** `lib/sound.ts` builds a dhol (pitched
membrane dropping a fifth in 60ms, plus a filtered noise slap), a tasha and
jhanj out of oscillators. Strike the drum in the crowd, or press <kbd>D</kbd>:
it thumps, the plate shakes, and gulaal comes off the drum head. A one-shot is
what oscillators are good at — a full looping pathak sounded synthetic next to
a real one, so the queue opens with a recording instead.

**The festival calendar is real.** Ganesh Chaturthi moves with the lunar
calendar, so `CHATURTHI` in `lib/ganpati.ts` is a lookup table, 2024–2030. The
chip at the top counts days to Chaturthi, or shows which day of the utsav it is,
or says विसर्जन on Anant Chaturdashi.

## Running it

```bash
npm install
npm run dev
```

## The music, and who owns it

Every song here is somebody's copyright. Nothing is hosted, nothing is ripped,
and there are no mp3s in the repo. Each track points at the **official upload**
and plays through YouTube's own embedded player, which means:

- the label streams it, not us
- the label is named on screen, next to the video and in every queue row
- the play counts on their video
- the card links straight to the video, so the traffic goes to them

The owners are the actual rights holders — Sony Music India, Zee Music Marathi,
T-Series, Saregama, Shemaroo, Times Music, Tips, Rajshri, Ultra. Each `yt` id in
`lib/ganpati.ts` was found by searching for the rights holder's channel and then
confirmed through YouTube's oEmbed endpoint, which also drops anything with
embedding switched off. Four songs never resolved to an official upload and were
left out rather than pointed at a re-upload.

If a label turns embedding off later, the player says so, credits them, offers a
link to watch it on YouTube, and moves to the next track.

Every set opens with **नाशिक ढोल** — a recorded pathak, because that's how a
pandal actually starts. The only sound the site makes itself is the single dhol
hit when you strike the drum in the crowd.

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
  YouTubeStage.tsx  the embedded player, and the credit that links to it
lib/
  ganpati.ts      tracklist with owners + video ids, sets, festival calendar
  sound.ts        dhol, tasha, jhanj, and the pathak scheduler
```

## Notes

- Everything respects `prefers-reduced-motion`.
- The clock and the festival day only render after mount; the server has no idea
  what time it is where you are.
- Portrait screens get a taller `viewBox` onto the same artwork — a 16:9 frame
  can't show its own width on a phone.
