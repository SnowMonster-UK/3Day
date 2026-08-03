import { PROGRAM, LEVELS } from "@/data/program";
import type { Step } from "@/lib/timeline";
import { mmss } from "@/lib/format";
import { ACCENT_GREEN, ACCENT_PREP, ACCENT_REST } from "@/lib/colors";

interface Props {
  dayIdx: number;
  level: number;
  steps: Step[];
  idx: number;
  remain: number;
  paused: boolean;
  voice: boolean;
  onQuit: () => void;
  onToggleVoice: () => void;
  onBack: () => void;
  onTogglePause: () => void;
  onSkip: () => void;
}

export default function RunScreen({ dayIdx, level, steps, idx, remain, paused, voice, onQuit, onToggleVoice, onBack, onTogglePause, onSkip }: Props) {
  const day = PROGRAM[dayIdx];
  const cur = steps[idx];
  const nx = steps[idx + 1];
  if (!cur) return null;

  const accent = cur.phase === "rest" ? ACCENT_REST : cur.phase === "prep" ? ACCENT_PREP : ACCENT_GREEN;
  const remainTotal = remain + steps.slice(idx + 1).reduce((a, b) => a + b.sec, 0);
  const totalRun = steps.reduce((a, b) => a + b.sec, 0) || 1;
  const overallPct = Math.min(100, Math.round((1 - remainTotal / totalRun) * 100));
  const stepPct = cur.sec ? Math.round((1 - remain / cur.sec) * 100) : 0;
  const phaseLabel = cur.phase === "rest" ? "REST" : cur.phase === "prep" ? "GET READY" : cur.emom ? "EMOM" : "WORK";
  const exJp = cur.side ? cur.jp + " — " + cur.side + "側" : cur.jp || "";
  const nextText = nx ? (nx.phase === "rest" ? "休憩 " + nx.sec + "秒" : nx.name + " / " + (nx.vol || "")) : "ラストです";
  const doneLabel = cur.tapDone ? "完了 → 次へ" : "次へ進む";

  return (
    <div className="flex flex-1 flex-col px-5 pt-4 pb-[22px]">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onQuit} className="min-h-9 min-w-11 rounded-[11px] text-xs text-[#8b9099]" style={{ background: "#171a1f" }}>
          終了
        </button>
        <div className="flex-1 text-center font-mono text-[11px] tracking-[.12em] text-[#7d838d]">
          {day.n} · {LEVELS[level].label} · 残り {mmss(remainTotal)}
        </div>
        <button onClick={onToggleVoice} className="min-h-9 min-w-11 rounded-[11px] text-xs text-[#8b9099]" style={{ background: "#171a1f" }}>
          {voice ? "🔊" : "🔇"}
        </button>
      </div>

      <div className="mt-3.5 h-1 overflow-hidden rounded-full" style={{ background: "#1c2027" }}>
        <div className="h-full" style={{ background: ACCENT_GREEN, width: overallPct + "%" }} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-1 py-[22px]">
        <div className="font-mono text-xs font-semibold tracking-[.24em]" style={{ color: accent }}>
          {phaseLabel}
        </div>
        <div
          className="font-mono text-[96px] leading-none font-bold tracking-[-.03em] tabular-nums"
          style={{ color: accent }}
        >
          {mmss(remain)}
        </div>
        <div className="mt-3.5 mb-5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "#1c2027" }}>
          <div className="h-full" style={{ background: accent, width: stepPct + "%" }} />
        </div>
        <div className="text-center text-[26px] leading-tight font-black text-balance">{cur.name}</div>
        <div className="mt-1.5 text-center text-[13px] leading-relaxed text-[#8b9099]">{exJp}</div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <div className="rounded-[9px] px-3 py-2 text-[13px] text-[#e6e8e3]" style={{ background: "#171a1f" }}>
            {cur.vol || ""}
          </div>
          {!!cur.set && (
            <div className="rounded-[9px] px-3 py-2 text-[13px] text-[#a9b0ba]" style={{ background: "#171a1f" }}>
              {cur.set}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex min-h-[52px] items-center gap-2.5 rounded-2xl px-4 py-3" style={{ background: "#13161a" }}>
          <div className="font-mono text-[9px] tracking-[.16em] text-[#5d646f]">NEXT</div>
          <div className="flex-1 text-[13px] leading-tight text-[#a9b0ba]">{nextText}</div>
        </div>
        <div className="flex gap-2.5">
          <button onClick={onBack} className="min-h-[58px] flex-1 rounded-[15px] text-[13px] font-medium text-[#c8ccd2]" style={{ background: "#171a1f" }}>
            巻き戻し
          </button>
          <button
            onClick={onTogglePause}
            className="flex-[1.6] min-h-[58px] rounded-[15px] text-[15px] font-bold"
            style={{ background: paused ? ACCENT_GREEN : "#1c2027", color: paused ? "#0e1013" : "#e6e8e3" }}
          >
            {paused ? "再開" : "一時停止"}
          </button>
          <button onClick={onSkip} className="min-h-[58px] flex-1 rounded-[15px] text-[13px] font-medium text-[#c8ccd2]" style={{ background: "#171a1f" }}>
            スキップ
          </button>
        </div>
        <button
          onClick={onSkip}
          className="min-h-[52px] w-full rounded-[15px] text-[15px] font-black"
          style={{ background: ACCENT_GREEN, color: "#0e1013" }}
        >
          {doneLabel}
        </button>
      </div>
    </div>
  );
}
