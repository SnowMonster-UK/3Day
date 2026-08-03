export function firstNum(s: string | undefined): number {
  const m = String(s || "").match(/\d+/);
  return m ? parseInt(m[0], 10) : 10;
}

export function mmss(s: number): string {
  const clamped = Math.max(0, Math.ceil(s));
  return Math.floor(clamped / 60) + ":" + String(clamped % 60).padStart(2, "0");
}
