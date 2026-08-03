import { useCallback, useEffect, useRef, useState } from "react";
import { PROGRAM, LEVELS } from "@/data/program";
import { buildTimeline, type Step } from "@/lib/timeline";
import { beep, releaseWakeLock, requestWakeLock, say, stopSpeak, type SpeechPart } from "@/lib/audio";

export type Screen = "home" | "run" | "done";

export interface WorkoutState {
  screen: Screen;
  dayIdx: number;
  level: number;
  steps: Step[];
  idx: number;
  remain: number;
  paused: boolean;
  voice: boolean;
  elapsed: number;
  doneDay: string;
}

const LAST_DAY_KEY = "circuit3.lastDay";
const VOICE_KEY = "circuit3.voice";

const initialState: WorkoutState = {
  screen: "home",
  dayIdx: 0,
  level: 1,
  steps: [],
  idx: 0,
  remain: 0,
  paused: false,
  voice: true,
  elapsed: 0,
  doneDay: "",
};

function loadInitialState(): WorkoutState {
  let dayIdx = initialState.dayIdx;
  let voice = initialState.voice;
  try {
    const last = parseInt(localStorage.getItem(LAST_DAY_KEY) || "-1", 10);
    if (last >= 0) dayIdx = (last + 1) % PROGRAM.length;
    const v = localStorage.getItem(VOICE_KEY);
    if (v === "0") voice = false;
  } catch {
    /* localStorage unavailable */
  }
  return { ...initialState, dayIdx, voice };
}

export function useWorkout() {
  const [state, setState] = useState<WorkoutState>(loadInitialState);
  const stateRef = useRef(state);
  const flagsRef = useRef<Record<string, boolean>>({});
  const t0Ref = useRef(0);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const patch = useCallback((p: Partial<WorkoutState>) => {
    setState((prev) => ({ ...prev, ...p }));
  }, []);

  // voice-gated speech: mirrors the original say() which only spoke when the
  // voice toggle was on — plain audio.say() has no state access of its own.
  const speak = useCallback((parts: (SpeechPart | null | undefined | false)[]) => {
    if (stateRef.current.voice) say(parts);
  }, []);

  const announce = useCallback(
    (steps: Step[], i: number) => {
      const s = steps[i];
      const nx = steps[i + 1];
      if (!s) return;
      beep(true);
      if (s.phase === "prep") {
        speak([{ t: "準備。10秒後に開始します。" }, nx ? { t: nx.name, en: true } : null]);
        return;
      }
      if (s.phase === "rest") {
        const n = steps.slice(i + 1).find((x) => x.phase === "work");
        speak([
          { t: "休憩 " + s.sec + "秒。" },
          n ? { t: "次は" } : null,
          n ? { t: n.name, en: true } : null,
          n ? { t: (n.vol || "") + "、" + (n.set || "") } : null,
        ]);
        return;
      }
      if (s.phase === "work") {
        speak([
          { t: s.name, en: true },
          { t: (s.emom ? "1分以内に" + (s.reps || "") + "回。" : s.vol + "。") + (s.set ? s.set.replace("/", "の") : "") },
        ]);
      }
    },
    [speak]
  );

  const finish = useCallback(() => {
    stopSpeak();
    releaseWakeLock();
    const el = Math.round((Date.now() - (t0Ref.current || Date.now())) / 1000);
    try {
      localStorage.setItem(LAST_DAY_KEY, String(stateRef.current.dayIdx));
    } catch {
      /* localStorage unavailable */
    }
    speak([{ t: "ワークアウト完了。おつかれさまでした。" }]);
    const day = PROGRAM[stateRef.current.dayIdx];
    patch({ screen: "done", elapsed: el, doneDay: day.n + " " + day.title });
  }, [patch, speak]);

  const goto = useCallback(
    (i: number) => {
      const steps = stateRef.current.steps;
      if (i >= steps.length - 1) {
        finish();
        return;
      }
      if (i < 0) i = 0;
      stopSpeak();
      flagsRef.current = {};
      patch({ idx: i, remain: steps[i].sec, paused: false });
      announce(steps, i);
    },
    [announce, finish, patch]
  );

  const start = useCallback(() => {
    const steps = buildTimeline(stateRef.current.dayIdx, stateRef.current.level);
    flagsRef.current = {};
    t0Ref.current = Date.now();
    requestWakeLock();
    patch({ screen: "run", steps, idx: 0, remain: steps[0].sec, paused: false, elapsed: 0 });
    announce(steps, 0);
  }, [announce, patch]);

  const quit = useCallback(() => {
    stopSpeak();
    releaseWakeLock();
    patch({ screen: "home" });
  }, [patch]);

  const home = useCallback(() => {
    patch({ screen: "home", dayIdx: (stateRef.current.dayIdx + 1) % PROGRAM.length });
  }, [patch]);

  const skip = useCallback(() => goto(stateRef.current.idx + 1), [goto]);
  const back = useCallback(() => goto(stateRef.current.idx - 1), [goto]);

  const togglePause = useCallback(() => {
    const p = !stateRef.current.paused;
    if (p) stopSpeak();
    else speak([{ t: "再開" }]);
    patch({ paused: p });
  }, [patch, speak]);

  const toggleVoice = useCallback(() => {
    const v = !stateRef.current.voice;
    if (!v) stopSpeak();
    try {
      localStorage.setItem(VOICE_KEY, v ? "1" : "0");
    } catch {
      /* localStorage unavailable */
    }
    patch({ voice: v });
  }, [patch]);

  const selectDay = useCallback((i: number) => patch({ dayIdx: i }), [patch]);
  const selectLevel = useCallback((i: number) => patch({ level: i }), [patch]);

  useEffect(() => {
    const timer = setInterval(() => {
      const st = stateRef.current;
      if (st.screen !== "run" || st.paused) return;
      const s = st.steps[st.idx];
      if (!s) return;
      const r = st.remain - 0.2;
      const sec = Math.ceil(r);
      const flags = flagsRef.current;
      if (s.sec >= 24) {
        const half = Math.round(s.sec / 2);
        if (!flags.half && sec === half) {
          flags.half = true;
          speak([{ t: "半分" }]);
        }
        if (!flags.ten && sec === 10) {
          flags.ten = true;
          speak([{ t: "残り10秒" }]);
        }
      }
      if (s.sec >= 5 && sec <= 3 && sec >= 1 && !flags["c" + sec]) {
        flags["c" + sec] = true;
        speak([{ t: String(sec) }]);
      }
      if (r <= 0) {
        if (s.phase === "rest") speak([{ t: "休憩終了" }]);
        goto(st.idx + 1);
        return;
      }
      patch({ remain: r });
    }, 200);

    return () => {
      clearInterval(timer);
      stopSpeak();
      releaseWakeLock();
    };
    // mount-only: goto/patch/speak are stable useCallbacks, safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    state,
    levels: LEVELS,
    program: PROGRAM,
    start,
    quit,
    home,
    skip,
    back,
    togglePause,
    toggleVoice,
    selectDay,
    selectLevel,
  };
}
