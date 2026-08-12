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
 */

export type Set = "aarti" | "dj" | "visarjan";

export type Track = {
  /** File the player looks for: /audio/{slug}.mp3 */
  slug: string;
  title: string;
  /** Singer, composer, or the film it's from. */
  by: string;
  set: Set;
  /** Devanagari glyph on the player tile. */
  glyph: string;
  /** Shown as a small badge — why this one is here. */
  tag?: string;
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

export const TRACKS: Track[] = [
  /* ── आरती, in sequence ─────────────────────────────────── */
  {
    slug: "sukhkarta-dukhharta",
    title: "सुखकर्ता दुखहर्ता",
    by: "समर्थ रामदास · लता मंगेशकर",
    set: "aarti",
    glyph: "गं",
    tag: "पहिली",
  },
  {
    slug: "shendur-lal-chadhayo",
    title: "शेंदुर लाल चढ़ायो",
    by: "आशा भोसले",
    set: "aarti",
    glyph: "ॐ",
  },
  {
    slug: "jai-ganesh-jai-ganesh-deva",
    title: "जय गणेश जय गणेश देवा",
    by: "अनुराधा पौडवाल",
    set: "aarti",
    glyph: "जय",
  },
  {
    slug: "vakratunda-mahakaya",
    title: "वक्रतुण्ड महाकाय",
    by: "श्लोक",
    set: "aarti",
    glyph: "श्लो",
  },
  {
    slug: "ekadantaya-vakratundaya",
    title: "एकदंताय वक्रतुण्डाय",
    by: "शंकर महादेवन",
    set: "aarti",
    glyph: "ए",
  },
  {
    slug: "ganesha-pancharatnam",
    title: "गणेश पंचरत्नम्",
    by: "आदि शंकराचार्य",
    set: "aarti",
    glyph: "पं",
  },
  {
    slug: "ghalin-lotangan",
    title: "घालीन लोटांगण",
    by: "समारोप",
    set: "aarti",
    glyph: "घा",
    tag: "शेवटची",
  },
  {
    slug: "mantrapushpanjali",
    title: "मंत्रपुष्पांजली",
    by: "वैदिक",
    set: "aarti",
    glyph: "मं",
  },

  /* ── डीजे — the street set ─────────────────────────────── */
  {
    slug: "deva-shree-ganesha",
    title: "देवा श्री गणेशा",
    by: "अजय-अतुल · अग्निपथ",
    set: "dj",
    glyph: "दे",
    tag: "अँथम",
  },
  {
    slug: "ganpati-bappa-morya-agneepath",
    title: "गणपती बाप्पा मोरया",
    by: "अजय गोगावले · अग्निपथ",
    set: "dj",
    glyph: "मो",
  },
  {
    slug: "morya-re",
    title: "मोरया रे",
    by: "शंकर महादेवन · डॉन",
    set: "dj",
    glyph: "रे",
  },
  {
    slug: "gajanana",
    title: "गजानना",
    by: "सुखविंदर सिंग · बाजीराव मस्तानी",
    set: "dj",
    glyph: "गज",
  },
  {
    slug: "ganaraj-rangi-nachto",
    title: "गणराज रंगी नाचतो",
    by: "मराठी भक्तिगीत",
    set: "dj",
    glyph: "रं",
  },
  {
    slug: "zingaat",
    title: "झिंगाट",
    by: "अजय-अतुल · सैराट",
    set: "dj",
    glyph: "झि",
    tag: "गल्ली",
  },
  {
    slug: "dolby-walya",
    title: "डॉल्बी वाल्या",
    by: "नागेश मोरवेकर · जाऊ द्या ना बाळासाहेब",
    set: "dj",
    glyph: "डॉ",
  },
  {
    slug: "baby-bring-it-on",
    title: "बेबी ब्रिंग इट ऑन",
    by: "जाऊ द्या ना बाळासाहेब",
    set: "dj",
    glyph: "ब्रि",
  },
  {
    slug: "naad-kara",
    title: "नाद करा",
    by: "आदर्श शिंदे · आनंद शिंदे",
    set: "dj",
    glyph: "ना",
  },
  {
    slug: "wajle-ki-bara",
    title: "वाजले की बारा",
    by: "बेला शेंडे · नटरंग",
    set: "dj",
    glyph: "वा",
  },
  {
    slug: "apsara-aali",
    title: "अप्सरा आली",
    by: "बेला शेंडे · नटरंग",
    set: "dj",
    glyph: "अ",
  },
  {
    slug: "hey-ganaraya",
    title: "हे गणराया",
    by: "दिव्य कुमार · ABCD 2",
    set: "dj",
    glyph: "हे",
  },
  {
    slug: "sadda-dil-vi-tu",
    title: "सड्डा दिल वी तू",
    by: "ABCD · ग ग गणपती",
    set: "dj",
    glyph: "ग",
  },
  {
    slug: "raja-lalbaugcha",
    title: "राजा लालबागचा",
    by: "आदर्श शिंदे",
    set: "dj",
    glyph: "रा",
  },
  {
    slug: "morya-bola",
    title: "मोरया बोला",
    by: "आनंद शिंदे",
    set: "dj",
    glyph: "बो",
  },
  {
    slug: "bappa-banjo",
    title: "बाप्पा",
    by: "बँजो · रितेश देशमुख",
    set: "dj",
    glyph: "बा",
  },

  /* ── विसर्जन ───────────────────────────────────────────── */
  {
    slug: "ganpati-gele-gavala",
    title: "गणपती गेले गावाला",
    by: "पारंपरिक",
    set: "visarjan",
    glyph: "गे",
    tag: "निरोप",
  },
  {
    slug: "pudchya-varshi-lavkar-ya",
    title: "पुढच्या वर्षी लवकर या",
    by: "जयघोष",
    set: "visarjan",
    glyph: "पु",
  },
  {
    slug: "bappa-morya-re",
    title: "बाप्पा मोरया रे",
    by: "विसर्जन मिरवणूक",
    set: "visarjan",
    glyph: "मो",
  },
  {
    slug: "aali-swari-undaravari",
    title: "आली स्वारी उंदरावरी",
    by: "आनंद शिंदे · हर्षद शिंदे",
    set: "visarjan",
    glyph: "स्वा",
  },
  {
    slug: "gauri-gajanan-pujuya-chala",
    title: "गौरी गजानन पुजूया चला",
    by: "मिलिंद शिंदे",
    set: "visarjan",
    glyph: "गौ",
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
