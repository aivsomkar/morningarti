/**
 * What actually plays at a sarvajanik pandal, in three sets.
 *
 * A pandal doesn't run one playlist. Mornings and evenings are the aarti,
 * sung in a fixed order that ends the same way every night. The rest of the
 * day the speakers belong to the street. On the last day everything turns
 * into a goodbye. The site follows the same three sets.
 *
 * Sources for the DJ set: the "Ganpati Visarjan Marathi Dance Hits" and
 * "Ganpati Visarjan Dance Hits" compilations, and the Bollywood Ganpati
 * standards that every mandal plays.
 *
 * Every one of these songs is somebody's copyright, so nothing is hosted here.
 * Each track points at the official upload and plays through YouTube's own
 * embedded player: the label serves it, the label is named on screen, the play
 * counts for them, and there's a link straight to the video. Each `yt` id was
 * resolved by searching for the rights holder's channel and confirmed through
 * YouTube's oEmbed endpoint, which also drops anything with embedding turned
 * off. Four songs never resolved to an official upload and were left out
 * rather than pointed at a re-upload.
 */

export type Set = "aarti" | "dj" | "visarjan";

export type Track = {
  slug: string;
  title: string;
  /** Singer, composer, or the film it's from. */
  by: string;
  set: Set;
  /** Devanagari glyph on the player tile. */
  glyph: string;
  /** Shown as a small badge — why this one is here. */
  tag?: string;
  /** The official upload. Empty on the synthesised pathak. */
  yt: string;
  /** The channel that holds the recording. Credited on screen. */
  owner: string;
};

export const SETS: { id: Set; name: string; sub: string; note: string }[] = [
  {
    id: "aarti",
    name: "आरती",
    sub: "morning & evening",
    note: "The order it's actually sung in — Sukhkarta first, Ghalin Lotangan and Mantrapushpanjali to close, then the jaighosh.",
  },
  {
    id: "dj",
    name: "डीजे",
    sub: "the street",
    note: "What the speakers play between aartis, and the whole way to the water.",
  },
  {
    id: "visarjan",
    name: "विसर्जन",
    sub: "day eleven",
    note: "Anant Chaturdashi. Everything turns into a goodbye.",
  },
];

/**
 * Prepended to every set. A pathak is how a pandal actually opens — before any
 * song, there's the dhol coming up the lane.
 */
export const OPENER: Track = {
  slug: "nashik-dhol",
  title: "नाशिक ढोल",
  by: "ढोल ताशा पथक · original sound",
  set: "dj",
  glyph: "ढ",
  tag: "पथक",
  yt: "6fAC3LEwKC4",
  owner: "NS Music - मराठी गाणी",
};

export const TRACKS: Track[] = [
  /* ── आरती, in sequence ─────────────────────────────────── */
  {
    slug: "sukhkarta-dukhharta",
    title: "सुखकर्ता दुखहर्ता",
    by: "समर्थ रामदास · लता मंगेशकर",
    set: "aarti",
    glyph: "गं",
    tag: "पहिली",
    yt: "gFr5p5AyuD0",
    owner: "Rajshri Soul",
  },
  {
    slug: "shendur-lal-chadhayo",
    title: "शेंदुर लाल चढ़ायो",
    by: "आशा भोसले · वास्तव",
    set: "aarti",
    glyph: "ॐ",
    yt: "8yv5kMuk31Y",
    owner: "T-Series Bhakti Sagar",
  },
  {
    slug: "jai-ganesh-jai-ganesh-deva",
    title: "जय गणेश जय गणेश देवा",
    by: "अनुराधा पौडवाल",
    set: "aarti",
    glyph: "जय",
    yt: "L-uG5-xf3Pk",
    owner: "T-Series Bhakti Sagar",
  },
  {
    slug: "vakratunda-mahakaya",
    title: "वक्रतुण्ड महाकाय",
    by: "श्लोक",
    set: "aarti",
    glyph: "श्लो",
    yt: "qf3EdXE0c1c",
    owner: "Rajshri Soul",
  },
  {
    slug: "ekadantaya-vakratundaya",
    title: "एकदंताय वक्रतुण्डाय",
    by: "शंकर महादेवन",
    set: "aarti",
    glyph: "ए",
    yt: "re88S-5fpmA",
    owner: "Times Music Spiritual",
  },
  {
    slug: "ganesha-pancharatnam",
    title: "गणेश पंचरत्नम्",
    by: "एम. एस. सुब्बुलक्ष्मी",
    set: "aarti",
    glyph: "पं",
    yt: "guZR2_MS5ec",
    owner: "Saregama Carnatic Classical",
  },
  {
    slug: "ghalin-lotangan",
    title: "घालीन लोटांगण",
    by: "समारोप",
    set: "aarti",
    glyph: "घा",
    tag: "शेवटची",
    yt: "F39gANj5E7I",
    owner: "Shemaroo Bhakti",
  },
  {
    slug: "mantrapushpanjali",
    title: "मंत्रपुष्पांजली",
    by: "वैदिक",
    set: "aarti",
    glyph: "मं",
    yt: "silJPG8SJsY",
    owner: "T-Series Bhakti Marathi",
  },

  /* ── डीजे — the street set ─────────────────────────────── */
  {
    slug: "deva-shree-ganesha",
    title: "देवा श्री गणेशा",
    by: "अजय-अतुल · अग्निपथ",
    set: "dj",
    glyph: "दे",
    tag: "अँथम",
    yt: "RYqJ5w-GrfM",
    owner: "Sony Music India",
  },
  {
    slug: "morya-re",
    title: "मोरया रे",
    by: "शंकर महादेवन · डॉन",
    set: "dj",
    glyph: "रे",
    yt: "8jff2wz3Hpk",
    owner: "T-Series",
  },
  {
    slug: "gajanana",
    title: "गजानना",
    by: "सुखविंदर सिंग · बाजीराव मस्तानी",
    set: "dj",
    glyph: "गज",
    yt: "wGkcQmzysu0",
    owner: "Sony Music India",
  },
  {
    slug: "ganaraj-rangi-nachto",
    title: "गणराज रंगी नाचतो",
    by: "लता मंगेशकर · मराठी भक्तिगीत",
    set: "dj",
    glyph: "रं",
    yt: "_MPNLI1NDHM",
    owner: "Saregama Marathi",
  },
  {
    slug: "zingaat",
    title: "झिंगाट",
    by: "अजय-अतुल · सैराट",
    set: "dj",
    glyph: "झि",
    tag: "गल्ली",
    yt: "5AeX7Ddq4ts",
    owner: "Zee Music Marathi",
  },
  {
    slug: "dolby-walya",
    title: "डॉल्बी वाल्या",
    by: "अजय-अतुल · जाऊ द्या ना बाळासाहेब",
    set: "dj",
    glyph: "डॉ",
    yt: "Z6U3tVjHcUI",
    owner: "Zee Music Marathi",
  },
  {
    slug: "baby-bring-it-on",
    title: "ब्रिंग इट ऑन",
    by: "जाऊ द्या ना बाळासाहेब",
    set: "dj",
    glyph: "ब्रि",
    yt: "zkt7DfOUlyM",
    owner: "Zee Music Marathi",
  },
  {
    slug: "naad-kara",
    title: "नाद करा",
    by: "धुरळा",
    set: "dj",
    glyph: "ना",
    yt: "frlrCKAxatA",
    owner: "Zee Music Marathi",
  },
  {
    slug: "wajle-ki-bara",
    title: "वाजले की बारा",
    by: "बेला शेंडे · नटरंग",
    set: "dj",
    glyph: "वा",
    yt: "7R7QJkznJGU",
    owner: "Zee Music Marathi",
  },
  {
    slug: "apsara-aali",
    title: "अप्सरा आली",
    by: "बेला शेंडे · नटरंग",
    set: "dj",
    glyph: "अ",
    yt: "mW67u_hWiSo",
    owner: "Zee Music Marathi",
  },
  {
    slug: "hey-ganaraya",
    title: "हे गणराया",
    by: "दिव्य कुमार · ABCD 2",
    set: "dj",
    glyph: "हे",
    yt: "v10jDT7SJsw",
    owner: "Zee Music Company",
  },
  {
    slug: "sadda-dil-vi-tu",
    title: "सड्डा दिल वी तू",
    by: "ABCD · ग ग गणपती",
    set: "dj",
    glyph: "ग",
    yt: "ILnYRHmvJOI",
    owner: "Sony Music India",
  },

  /* ── विसर्जन ───────────────────────────────────────────── */
  {
    slug: "bappa-morya-re",
    title: "बाप्पा मोरया रे",
    by: "आनंद शिंदे",
    set: "visarjan",
    glyph: "मो",
    tag: "निरोप",
    yt: "n6MSNAIEBhI",
    owner: "Saregama Marathi",
  },
  {
    slug: "nirop-gheto-deva",
    title: "निरोप घेतो देवा",
    by: "विसर्जन गीत",
    set: "visarjan",
    glyph: "नि",
    yt: "pNWelwjPCcI",
    owner: "Ultra Devotional Marathi",
  },
  {
    slug: "pudchya-varshi-lavkar-ya",
    title: "पुढच्या वर्षी लवकर या",
    by: "सोडून जाता तुम्ही हो देवा",
    set: "visarjan",
    glyph: "पु",
    yt: "9klUCwy7UJE",
    owner: "T-Series Bhakti Marathi",
  },
  {
    slug: "ganpati-apne-gaon-chale",
    title: "गणपती अपने गाँव चले",
    by: "अग्निपथ · १९९० ",
    set: "visarjan",
    glyph: "गा",
    yt: "zbL7wLkh-E8",
    owner: "Tips Official",
  },
  {
    slug: "aali-swari-undaravari",
    title: "आली स्वारी उंदरावरी",
    by: "आनंद शिंदे",
    set: "visarjan",
    glyph: "स्वा",
    yt: "tlSHX840McM",
    owner: "T-Series Bhakti Sagar",
  },
  {
    slug: "gauri-gajanan-pujuya-chala",
    title: "गौरी गजानन पुजूया चला",
    by: "मिलिंद शिंदे",
    set: "visarjan",
    glyph: "गौ",
    yt: "vl2TWDnFf54",
    owner: "T-Series Marathi",
  },
];

export function tracksIn(set: Set): Track[] {
  return TRACKS.filter((t) => t.set === set);
}

/* ── The festival calendar ─────────────────────────────────── */

/**
 * Ganesh Chaturthi moves with the lunar calendar, so there's no formula worth
 * writing — this is a lookup. Extend it as years are needed.
 */
const CHATURTHI: Record<number, string> = {
  2024: "2024-09-07",
  2025: "2025-08-27",
  2026: "2026-09-14",
  2027: "2027-09-04",
  2028: "2028-08-23",
  2029: "2029-09-11",
  2030: "2030-08-31",
};

/** The utsav runs Chaturthi through Anant Chaturdashi — eleven days. */
const LENGTH = 11;

export type Utsav =
  | { phase: "aagman"; day: 1; left: number }
  | { phase: "utsav"; day: number; left: number }
  | { phase: "visarjan"; day: 11; left: 0 }
  | { phase: "waiting"; until: number }
  | { phase: "unknown" };

function midnight(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function parse(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
}

export function utsavOn(now: Date): Utsav {
  const today = midnight(now);
  const thisYear = CHATURTHI[now.getFullYear()];
  const nextYear = CHATURTHI[now.getFullYear() + 1];
  if (!thisYear) return { phase: "unknown" };

  const start = parse(thisYear);
  const dayMs = 86_400_000;
  const day = Math.floor((today - start) / dayMs) + 1;

  if (day >= 1 && day <= LENGTH) {
    const left = LENGTH - day;
    if (day === 1) return { phase: "aagman", day: 1, left };
    if (day === LENGTH) return { phase: "visarjan", day: 11, left: 0 };
    return { phase: "utsav", day, left };
  }

  const upcoming = today < start ? start : nextYear ? parse(nextYear) : null;
  if (upcoming === null) return { phase: "unknown" };
  return { phase: "waiting", until: Math.round((upcoming - today) / dayMs) };
}

/**
 * Which set opens by default. Aarti is sung morning and evening; the last day
 * belongs to visarjan; the rest of the time the street has the speakers.
 */
export function defaultSet(now: Date, u: Utsav): Set {
  if (u.phase === "visarjan") return "visarjan";
  const h = now.getHours();
  if (h < 10 || (h >= 18 && h < 21)) return "aarti";
  return "dj";
}

const DEV_DIGITS = "०१२३४५६७८९";

export function dev(input: string | number): string {
  return String(input).replace(/\d/g, (d) => DEV_DIGITS[Number(d)]);
}

export function partOfDay(hour: number): string {
  if (hour < 4) return "रात्री";
  if (hour < 12) return "सकाळी";
  if (hour < 17) return "दुपारी";
  if (hour < 20) return "संध्याकाळी";
  return "रात्री";
}
