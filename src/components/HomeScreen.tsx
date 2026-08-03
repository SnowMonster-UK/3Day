import { useMemo } from "react";
import { PROGRAM, LEVELS } from "@/data/program";
import { buildTimeline, buildPreview } from "@/lib/timeline";
import { ACCENT_GREEN } from "@/lib/colors";

interface Props {
  dayIdx: number;
  level: number;
  voice: boolean;
  onSelectDay: (i: number) => void;
  onSelectLevel: (i: number) => void;
  onStart: () => void;
  onToggleVoice: () => void;
}

export default function HomeScreen({ dayIdx, level, voice, onSelectDay, onSelectLevel, onStart, onToggleVoice }: Props) {
  const preview = useMemo(() => buildPreview(dayIdx, level), [dayIdx, level]);
  const steps = useMemo(() => buildTimeline(dayIdx, level), [dayIdx, level]);
  const totalSec = steps.reduce((a, b) => a + b.sec, 0);
  const estMin = Math.round(totalSec / 60);
  const stepCount = steps.length - 1;

  return (
    <div className="flex flex-col gap-[26px] px-[22px] pt-[34px] pb-10">
      <div className="flex flex-col gap-1.5">
        <div className="font-mono text-[11px] tracking-[.22em]" style={{ color: ACCENT_GREEN }}>
          WEEKLY x3 CIRCUIT
        </div>
        <div className="text-[30px] font-black leading-[1.15] tracking-[-.01em]">3日サーキット</div>
        <div className="text-[13px] leading-relaxed text-[#8b9099]">
          音声ガイドが種目・レップ・休憩まで自動で読み上げます。画面は見なくてOK。
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="font-mono text-[10px] tracking-[.18em] text-[#6d7480]">TODAY / 前回の続き</div>
        <div className="flex flex-col gap-2">
          {PROGRAM.map((d, i) => {
            const active = i === dayIdx;
            return (
              <button
                key={d.n}
                onClick={() => onSelectDay(i)}
                className="min-h-[74px] w-full rounded-2xl border px-[18px] py-4 text-left flex items-center gap-3.5"
                style={{
                  background: active ? "#181d19" : "#13161a",
                  borderColor: active ? "oklch(0.85 0.19 128 / 0.5)" : "#1e2228",
                  color: "#f2f3f0",
                }}
              >
                <div className="w-11 text-[26px] font-bold font-mono" style={{ color: active ? ACCENT_GREEN : "#4d545e" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex flex-1 flex-col gap-[3px]">
                  <div className="text-[16px] font-bold">{d.title}</div>
                  <div className="text-xs text-[#8b9099]">{d.sub}</div>
                </div>
                {active && (
                  <div
                    className="rounded-md px-2 py-[5px] font-mono text-[9px] font-bold tracking-[.14em]"
                    style={{ background: ACCENT_GREEN, color: "#0e1013" }}
                  >
                    NEXT
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="font-mono text-[10px] tracking-[.18em] text-[#6d7480]">LEVEL / 今日は全種目このレベル</div>
        <div className="flex gap-2">
          {LEVELS.map((l, i) => {
            const active = i === level;
            return (
              <button
                key={l.label}
                onClick={() => onSelectLevel(i)}
                className="flex min-h-[66px] flex-1 flex-col items-center gap-1 rounded-[14px] border px-2 py-[13px]"
                style={{
                  background: active ? ACCENT_GREEN : "#13161a",
                  borderColor: active ? ACCENT_GREEN : "#1e2228",
                  color: active ? "#0e1013" : "#c8ccd2",
                }}
              >
                <div className="text-[15px] font-bold">{l.label}</div>
                <div className="text-[10px] opacity-65">{l.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between">
          <div className="font-mono text-[10px] tracking-[.18em] text-[#6d7480]">MENU</div>
          <div className="font-mono text-xs text-[#8b9099]">
            約 {estMin} 分 / {stepCount} ステップ
          </div>
        </div>
        <div className="flex flex-col gap-px overflow-hidden rounded-[14px]" style={{ background: "#191c21" }}>
          {preview.map((p) => (
            <div key={p.i} className="flex items-center gap-3 px-4 py-[13px]" style={{ background: "#13161a" }}>
              <div className="w-4 font-mono text-[11px] text-[#5d646f]">{p.i}</div>
              <div className="flex flex-1 flex-col gap-0.5">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-[11px] text-[#7d838d]">{p.jp}</div>
              </div>
              <div className="text-right font-mono text-xs text-[#a9b0ba]">{p.vol}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onStart}
          className="min-h-[58px] w-full rounded-2xl text-[17px] font-black tracking-[.02em]"
          style={{ background: ACCENT_GREEN, color: "#0e1013" }}
        >
          スタート
        </button>
        <button
          onClick={onToggleVoice}
          className="min-h-[46px] w-full rounded-[14px] text-[13px] font-medium text-[#a9b0ba]"
          style={{ background: "#171a1f" }}
        >
          音声ガイド：{voice ? "オン" : "オフ"}
        </button>
      </div>
    </div>
  );
}
