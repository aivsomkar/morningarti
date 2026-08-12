/**
 * The drum you hit, synthesised.
 *
 * The music comes from YouTube; this is only the percussion the page plays
 * itself, when you strike the dhol in the crowd:
 *
 *   dhol()   — the two-headed drum. Low head is a pitched membrane that drops
 *              a fifth in 60ms; high head is a filtered noise slap.
 *   tasha()  — the tight, high drum played with thin sticks.
 *   jhanj()  — the cymbals, on the count.
 *
 * A one-shot is what oscillators are genuinely good at. There used to be a
 * scheduler here looping all three as a full pathak; it sounded synthetic
 * next to the real thing, so the queue opens with a recorded one instead.
 *
 * Nothing is constructed until the first gesture; browsers won't allow it.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let verb: ConvolverNode | null = null;
let verbSend: GainNode | null = null;

type Ctx = { ctx: AudioContext; master: GainNode; verbSend: GainNode };

/** A lane between buildings: short, bright, a bit slappy. */
function buildImpulse(ac: AudioContext, seconds = 1.9, decay = 3.2) {
  const rate = ac.sampleRate;
  const len = Math.floor(rate * seconds);
  const buf = ac.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
    }
  }
  return buf;
}

let noiseBuf: AudioBuffer | null = null;

function noise(ac: AudioContext) {
  if (!noiseBuf) {
    const len = Math.floor(ac.sampleRate * 1.2);
    noiseBuf = ac.createBuffer(1, len, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }
  const src = ac.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;
  return src;
}

export function audio(): Ctx | null {
  if (typeof window === "undefined") return null;

  if (!ctx) {
    const AC: typeof AudioContext =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;

    ctx = new AC();

    master = ctx.createGain();
    master.gain.value = 0.85;
    master.connect(ctx.destination);

    verb = ctx.createConvolver();
    verb.buffer = buildImpulse(ctx);
    verb.connect(master);

    verbSend = ctx.createGain();
    verbSend.gain.value = 0.22;
    verbSend.connect(verb);
  }

  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, master: master!, verbSend: verbSend! };
}

function bus(a: Ctx, level: number, send = 1) {
  const g = a.ctx.createGain();
  g.gain.value = level;
  g.connect(a.master);
  if (send > 0) {
    const s = a.ctx.createGain();
    s.gain.value = send;
    g.connect(s).connect(a.verbSend);
  }
  return g;
}

/* ── ढोल ───────────────────────────────────────────────────── */

/** The low head. Deep, short, and you feel it in the chest. */
export function dhol(opts: { gain?: number; when?: number } = {}) {
  const a = audio();
  if (!a) return;
  const ac = a.ctx;
  const t = opts.when ?? ac.currentTime + 0.005;
  const out = bus(a, (opts.gain ?? 1) * 0.85, 0.5);

  // Pitched membrane, dropping fast.
  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(132, t);
  osc.frequency.exponentialRampToValueAtTime(52, t + 0.07);
  const og = ac.createGain();
  og.gain.setValueAtTime(0, t);
  og.gain.linearRampToValueAtTime(0.9, t + 0.006);
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
  osc.connect(og).connect(out);
  osc.start(t);
  osc.stop(t + 0.6);

  // Second mode, a touch higher, gives the skin its body.
  const osc2 = ac.createOscillator();
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(210, t);
  osc2.frequency.exponentialRampToValueAtTime(88, t + 0.05);
  const og2 = ac.createGain();
  og2.gain.setValueAtTime(0, t);
  og2.gain.linearRampToValueAtTime(0.28, t + 0.004);
  og2.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  osc2.connect(og2).connect(out);
  osc2.start(t);
  osc2.stop(t + 0.25);

  // Stick contact.
  const n = noise(ac);
  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1400;
  const ng = ac.createGain();
  ng.gain.setValueAtTime(0.5, t);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  n.connect(lp).connect(ng).connect(out);
  n.start(t);
  n.stop(t + 0.06);
}

/** The high head, played with the palm — the "tak". */
export function dholSlap(opts: { gain?: number; when?: number } = {}) {
  const a = audio();
  if (!a) return;
  const ac = a.ctx;
  const t = opts.when ?? ac.currentTime + 0.005;
  const out = bus(a, (opts.gain ?? 1) * 0.5, 0.7);

  const n = noise(ac);
  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(2100, t);
  bp.frequency.exponentialRampToValueAtTime(1100, t + 0.09);
  bp.Q.value = 1.1;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.85, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
  n.connect(bp).connect(g).connect(out);
  n.start(t);
  n.stop(t + 0.16);

  const ring = ac.createOscillator();
  ring.type = "sine";
  ring.frequency.value = 430;
  const rg = ac.createGain();
  rg.gain.setValueAtTime(0.16, t);
  rg.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  ring.connect(rg).connect(out);
  ring.start(t);
  ring.stop(t + 0.14);
}

/* ── ताशा ──────────────────────────────────────────────────── */

/** Tight, cracking, and there are twenty of them. */
export function tasha(opts: { gain?: number; when?: number } = {}) {
  const a = audio();
  if (!a) return;
  const ac = a.ctx;
  const t = opts.when ?? ac.currentTime + 0.005;
  const out = bus(a, (opts.gain ?? 1) * 0.34, 0.8);

  const n = noise(ac);
  const hp = ac.createBiquadFilter();
  hp.type = "bandpass";
  hp.frequency.setValueAtTime(3400, t);
  hp.frequency.exponentialRampToValueAtTime(2000, t + 0.06);
  hp.Q.value = 0.8;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.9, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.085);
  n.connect(hp).connect(g).connect(out);
  n.start(t);
  n.stop(t + 0.1);

  const body = ac.createOscillator();
  body.type = "triangle";
  body.frequency.setValueAtTime(880, t);
  body.frequency.exponentialRampToValueAtTime(560, t + 0.04);
  const bg = ac.createGain();
  bg.gain.setValueAtTime(0.22, t);
  bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
  body.connect(bg).connect(out);
  body.start(t);
  body.stop(t + 0.08);
}

/* ── झांज ──────────────────────────────────────────────────── */

export function jhanj(opts: { gain?: number; when?: number } = {}) {
  const a = audio();
  if (!a) return;
  const ac = a.ctx;
  const t = opts.when ?? ac.currentTime + 0.005;
  const out = bus(a, (opts.gain ?? 1) * 0.18, 1);

  const n = noise(ac);
  const hp = ac.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 5200;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.7, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
  n.connect(hp).connect(g).connect(out);
  n.start(t);
  n.stop(t + 0.45);
}
