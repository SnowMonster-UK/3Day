import { PROGRAM, type Day } from "@/data/program";
import { firstNum } from "@/lib/format";

export interface Step {
  phase: "prep" | "work" | "rest" | "end";
  name: string;
  jp: string;
  sec: number;
  reps?: string;
  vol: string;
  set: string;
  side?: string;
  tapDone?: boolean;
  emom?: boolean;
}

type StepInit = Omit<Step, "phase" | "name" | "jp"> & { phase: Step["phase"]; name?: string; jp?: string };

export function buildTimeline(dayIdx: number, lv: number): Step[] {
  const day: Day = PROGRAM[dayIdx];
  const out: Step[] = [];
  const push = (s: StepInit) => out.push({ name: "", jp: "", ...s });

  push({ phase: "prep", sec: 10, name: "Get Ready", jp: "Starting " + day.title, vol: "10s", set: "" });

  const workStep = (name: string, jp: string, o: Omit<StepInit, "phase" | "name" | "jp">): StepInit => ({
    phase: "work",
    name,
    jp,
    ...o,
  });

  if (day.mode === "circuit") {
    const rounds = day.rounds ?? 1;
    const rest = day.rest ?? 30;
    day.ex.forEach((ex, ei) => {
      const L = ex.levels[lv];
      for (let r = 1; r <= rounds; r++) {
        const setLbl = "Exercise " + (ei + 1) + "/" + day.ex.length + " · Round " + r + "/" + rounds;
        if (ex.sides) {
          const sec = L.sec ?? 30;
          (["Right", "Left"] as const).forEach((side) =>
            push(workStep(L.name, ex.jp, { sec, vol: sec + "s (" + side + ")", set: setLbl, side }))
          );
        } else {
          const sec = L.sec ?? Math.max(25, firstNum(L.reps) * 3);
          push(workStep(L.name, ex.jp, { sec, reps: L.reps, vol: L.reps + " reps", set: setLbl, tapDone: true }));
        }
        const last = ei === day.ex.length - 1 && r === rounds;
        if (!last) push({ phase: "rest", sec: rest, name: "Rest", jp: "Take a breather", vol: rest + "s", set: setLbl });
      }
    });
  } else if (day.mode === "sets") {
    day.ex.forEach((ex, ei) => {
      const L = ex.levels[lv];
      const sets = ex.sets ?? 1;
      const rest = ex.rest ?? 30;
      for (let s = 1; s <= sets; s++) {
        const setLbl = "Exercise " + (ei + 1) + "/" + day.ex.length + " · Set " + s + "/" + sets;
        if (ex.time) {
          const sec = L.sec ?? 30;
          push(workStep(L.name, ex.jp, { sec, vol: sec + "s", set: setLbl }));
        } else {
          const reps = ex.repsBySet ? ex.repsBySet[s - 1] : L.reps ?? "";
          push(workStep(L.name, ex.jp, { sec: Math.max(25, firstNum(reps) * 3), reps, vol: reps + " reps", set: setLbl, tapDone: true }));
        }
        const last = ei === day.ex.length - 1 && s === sets;
        if (!last) push({ phase: "rest", sec: rest, name: "Rest", jp: "Take a breather", vol: rest + "s", set: setLbl });
      }
    });
  } else {
    day.ex.forEach((ex, ei) => {
      const L = ex.levels[lv];
      const base = "Exercise " + (ei + 1) + "/" + day.ex.length;
      if (ex.kind === "emom") {
        const reps = ex.repsByLevel ? ex.repsByLevel[lv] : ex.reps ?? "";
        const rounds = ex.rounds ?? 1;
        const window = ex.window ?? 60;
        for (let r = 1; r <= rounds; r++)
          push(
            workStep(L.name, ex.jp, {
              sec: window,
              reps,
              vol: reps + " reps / 1 min",
              set: base + " · EMOM " + r + "/" + rounds,
              tapDone: true,
              emom: true,
            })
          );
      } else if (ex.kind === "interval") {
        const rounds = ex.rounds ?? 1;
        const work = ex.work ?? 30;
        const rest = ex.rest ?? 30;
        for (let r = 1; r <= rounds; r++) {
          push(workStep(L.name, ex.jp, { sec: work, vol: work + "s", set: base + " · " + r + "/" + rounds }));
          if (r < rounds) push({ phase: "rest", sec: rest, name: "Rest", jp: "Take a breather", vol: rest + "s", set: base + " · " + r + "/" + rounds });
        }
      } else {
        const sets = ex.sets ?? 1;
        const rest = ex.rest ?? 30;
        const secBySet = ex.secBySet ?? [];
        for (let s = 1; s <= sets; s++) {
          const sec = secBySet[s - 1] ?? 30;
          const setLbl = base + " · Set " + s + "/" + sets;
          (["Right", "Left"] as const).forEach((side) => push(workStep(L.name, ex.jp, { sec, vol: sec + "s (" + side + ")", set: setLbl, side })));
          if (s < sets) push({ phase: "rest", sec: rest, name: "Rest", jp: "Take a breather", vol: rest + "s", set: setLbl });
        }
      }
    });
  }

  push({ phase: "end", sec: 0, name: "Finish", jp: "Workout complete", vol: "", set: "" });
  return out;
}

export interface PreviewRow {
  i: number;
  name: string;
  jp: string;
  vol: string;
}

export function buildPreview(dayIdx: number, lv: number): PreviewRow[] {
  const day = PROGRAM[dayIdx];
  return day.ex.map((ex, i) => {
    const L = ex.levels[lv];
    let vol: string;
    if (ex.kind === "emom") vol = ex.window === 60 ? ex.rounds + " min EMOM" : ex.rounds + "×" + ex.window + "s EMOM";
    else if (ex.kind === "interval") vol = ex.rounds + "×" + ex.work + "s";
    else if (day.mode === "circuit") vol = ex.sides ? day.rounds + "×" + L.sec + "s" : day.rounds + "×" + L.reps;
    else if (ex.time) vol = (ex.sets || 1) + "×" + (L.sec ?? ex.secBySet?.[0]) + "s";
    else vol = (ex.sets || 1) + "×" + (ex.repsBySet ? ex.repsBySet.join("/") : L.reps);
    return { i: i + 1, name: L.name, jp: ex.jp, vol };
  });
}
