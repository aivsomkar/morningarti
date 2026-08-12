# Adding the songs

No recordings ship with this repo — almost every aarti and every DJ track in
`lib/ganpati.ts` is somebody's copyrighted master. The site works without them:
**ढोल ताशा पथक** is generated live in the browser (dhol, tasha, jhanj on a
scheduled 16-step cycle) and the dhol in the crowd is synthesised too.

To play real songs, drop mp3s in this folder named after the `slug` in
`lib/ganpati.ts`:

```
public/audio/sukhkarta-dukhharta.mp3
public/audio/deva-shree-ganesha.mp3
public/audio/zingaat.mp3
public/audio/ganpati-gele-gavala.mp3
…
```

The player picks them up with no other changes. Anything missing shows a note
pointing here instead of failing silently.

To change the list, edit `TRACKS` in `lib/ganpati.ts`. The `set` field decides
which tab a song lives under — `aarti`, `dj`, or `visarjan`.
