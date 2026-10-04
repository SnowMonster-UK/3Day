import { LEVELS } from "@/data/program";
import { mmss } from "@/lib/format";
import { ACCENT_GREEN } from "@/lib/colors";

interface Props {
  level: number;
  elapsed: number;
  stepCount: number;
  doneDay: string;
  onHome: () => void;
}

export default function DoneScreen({ level, elapsed, stepCount, doneDay, onHome }: Props) {
  const summary = [
    { k: "Total Time", v: mmss(elapsed) },
    { k: "Level", v: LEVELS[level].label },
    { k: "Steps", v: String(stepCount) },
  ];

  return (
    <div className="flex flex-1 flex-col justify-center gap-[26px] px-6 py-10">
      <div className="flex flex-col gap-2">
        <div className="font-mono text-[11px] tracking-[.22em]" style={{ color: ACCENT_GREEN }}>
          COMPLETE
        </div>
        <div className="text-[32px] font-black leading-[1.15]">Well Done!</div>
        <div className="text-[13px] text-[#8b9099]">You completed {doneDay}.</div>
      </div>
      <div className="flex flex-col gap-px overflow-hidden rounded-2xl" style={{ background: "#191c21" }}>
        {summary.map((s) => (
          <div key={s.k} className="flex items-baseline justify-between px-[18px] py-[17px]" style={{ background: "#13161a" }}>
            <div className="text-[13px] text-[#8b9099]">{s.k}</div>
            <div className="font-mono text-[19px] font-bold text-[#f2f3f0]">{s.v}</div>
          </div>
        ))}
      </div>
      <button
        onClick={onHome}
        className="min-h-14 w-full rounded-2xl text-base font-black"
        style={{ background: ACCENT_GREEN, color: "#0e1013" }}
      >
        Home
      </button>
    </div>
  );
}
