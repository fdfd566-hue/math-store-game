/* مؤثرات صوتية مولّدة داخل المتصفح — بدون أي ملفات خارجية */

let ctx: AudioContext | null = null;
let muted = false;

const getCtx = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
};

export const setMuted = (value: boolean) => {
  muted = value;
};
export const getMuted = () => muted;

const tone = (
  freq: number,
  delay: number,
  duration: number,
  type: OscillatorType = "triangle",
  volume = 0.22
) => {
  const c = getCtx();
  if (!c || muted) return;
  const start = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
};

export const playTap = () => tone(620, 0, 0.08, "sine", 0.12);

export const playDrop = () => {
  tone(520, 0, 0.09, "sine", 0.14);
  tone(700, 0.07, 0.11, "sine", 0.12);
};

export const playCorrect = () => {
  tone(784, 0, 0.14, "triangle", 0.22);
  tone(988, 0.12, 0.16, "triangle", 0.2);
  tone(1175, 0.26, 0.28, "triangle", 0.18);
};

export const playWrong = () => {
  tone(233, 0, 0.18, "sine", 0.18);
  tone(196, 0.14, 0.26, "sine", 0.16);
};

export const playCelebrate = () => {
  const notes = [523, 659, 784, 880, 1046, 1318];
  notes.forEach((n, i) => tone(n, i * 0.13, 0.32, "triangle", 0.2));
};
