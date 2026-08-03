export interface SpeechPart {
  t: string;
  en?: boolean;
}

export function stopSpeak() {
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* speechSynthesis unavailable */
  }
}

export function say(parts: (SpeechPart | null | undefined | false)[]) {
  if (!window.speechSynthesis) return;
  parts.filter((p): p is SpeechPart => Boolean(p && p.t)).forEach((p) => {
    const u = new SpeechSynthesisUtterance(p.t);
    u.lang = p.en ? "en-US" : "ja-JP";
    u.rate = p.en ? 0.95 : 1.05;
    try {
      window.speechSynthesis.speak(u);
    } catch {
      /* speech synthesis queue error */
    }
  });
}

let audioCtx: AudioContext | null = null;

export function beep(hi: boolean) {
  try {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return;
    audioCtx = audioCtx || new C();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.frequency.value = hi ? 1180 : 760;
    o.type = "sine";
    g.gain.setValueAtTime(0.18, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 0.26);
  } catch {
    /* audio context unavailable */
  }
}

let wakeLock: WakeLockSentinel | null = null;

export async function requestWakeLock() {
  try {
    if (navigator.wakeLock) wakeLock = await navigator.wakeLock.request("screen");
  } catch {
    /* wake lock unavailable / denied */
  }
}

export function releaseWakeLock() {
  try {
    wakeLock?.release();
    wakeLock = null;
  } catch {
    /* already released */
  }
}
