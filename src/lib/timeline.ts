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

  push({ phase: "prep", sec: 10, name: "Get Ready", jp: day.title + " を始めます", vol: "10秒", set: "" });

  const workStep = (name: string, jp: string, o: Omit<StepInit, "phase" | "name" | "jp">): StepInit => ({
    phase: "work",
    name,
    jp,
    ...o,
  });

  if (day.mode === "circuit") {
    const rounds = day.rounds ?? 1;
    const rest = day.rest ?? 30;
    for (let r = 1; r <= rounds; r++) {
      day.ex.forEach((ex, ei) => {
        const L = ex.levels[lv];
        const setLbl = r + "周目 / " + rounds + "・種目 " + (ei + 1) + "/" + day.ex.length;
        if (ex.sides) {
          const sec = L.sec ?? 30;
          (["右", "左"] as const).forEach((side) =>
            push(workStep(L.name, ex.jp, { sec, vol: sec + "秒（" + side + "）", set: setLbl, side }))
          );
        } else {
          push(workStep(L.name, ex.jp, { sec: Math.max(25, firstNum(L.reps) * 3), reps: L.reps, vol: L.reps + "回", set: setLbl, tapDone: true }));
        }
        const last = r === rounds && ei === day.ex.length - 1;
        if (!last) push({ phase: "rest", sec: rest, name: "Rest", jp: "休憩", vol: rest + "秒", set: setLbl });
      });
    }
  } else if (day.mode === "sets") {
    day.ex.forEach((ex, ei) => {
      const L = ex.levels[lv];
      const sets = ex.sets ?? 1;
      const rest = ex.rest ?? 30;
      for (let s = 1; s <= sets; s++) {
        const setLbl = "種目 " + (ei + 1) + "/" + day.ex.length + "・" + s + "set / " + sets;
        if (ex.time) {
          const sec = L.sec ?? 30;
          push(workStep(L.name, ex.jp, { sec, vol: sec + "秒", set: setLbl }));
        } else {
          const reps = ex.repsBySet ? ex.repsBySet[s - 1] : L.reps ?? "";
          push(workStep(L.name, ex.jp, { sec: Math.max(25, firstNum(reps) * 3), reps, vol: reps + "回", set: setLbl, tapDone: true }));
        }
        const last = ei === day.ex.length - 1 && s === sets;
        if (!last) push({ phase: "rest", sec: rest, name: "Rest", jp: "休憩", vol: rest + "秒", set: setLbl });
      }
    });
  } else {
    day.ex.forEach((ex, ei) => {
      const L = ex.levels[lv];
      const base = "種目 " + (ei + 1) + "/" + day.ex.length;
      if (ex.kind === "emom") {
        const reps = ex.repsByLevel ? ex.repsByLevel[lv] : ex.reps ?? "";
        const rounds = ex.rounds ?? 1;
        const window = ex.window ?? 60;
        for (let r = 1; r <= rounds; r++)
          push(
            workStep(L.name, ex.jp, {
              sec: window,
              reps,
              vol: reps + "回 / 1分",
              set: base + "・EMOM " + r + "/" + rounds,
              tapDone: true,
              emom: true,
            })
          );
      } else if (ex.kind === "interval") {
        const rounds = ex.rounds ?? 1;
        const work = ex.work ?? 30;
        const rest = ex.rest ?? 30;
        for (let r = 1; r <= rounds; r++) {
          push(workStep(L.name, ex.jp, { sec: work, vol: work + "秒", set: base + "・" + r + "/" + rounds }));
          if (r < rounds) push({ phase: "rest", sec: rest, name: "Rest", jp: "休憩", vol: rest + "秒", set: base + "・" + r + "/" + rounds });
        }
      } else {
        const sets = ex.sets ?? 1;
        const rest = ex.rest ?? 30;
        const secBySet = ex.secBySet ?? [];
        for (let s = 1; s <= sets; s++) {
          const sec = secBySet[s - 1] ?? 30;
          const setLbl = base + "・" + s + "set / " + sets;
          (["右", "左"] as const).forEach((side) => push(workStep(L.name, ex.jp, { sec, vol: sec + "秒（" + side + "）", set: setLbl, side })));
          if (s < sets) push({ phase: "rest", sec: rest, name: "Rest", jp: "休憩", vol: rest + "秒", set: setLbl });
        }
      }
    });
  }

  push({ phase: "end", sec: 0, name: "Finish", jp: "完了", vol: "", set: "" });
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
    if (ex.kind === "emom") vol = ex.rounds + "分 EMOM";
    else if (ex.kind === "interval") vol = ex.rounds + "×" + ex.work + "秒";
    else if (day.mode === "circuit") vol = ex.sides ? day.rounds + "×" + L.sec + "秒" : day.rounds + "×" + L.reps;
    else if (ex.time) vol = (ex.sets || 1) + "×" + (L.sec ?? ex.secBySet?.[0]) + "秒";
    else vol = (ex.sets || 1) + "×" + (ex.repsBySet ? ex.repsBySet.join("/") : L.reps);
    return { i: i + 1, name: L.name, jp: ex.jp, vol };
  });
}
