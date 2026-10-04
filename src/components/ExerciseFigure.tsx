import { getPose, type ExtraShape } from "@/lib/poses";

interface Props {
  name: string;
  className?: string;
}

function renderExtra(e: ExtraShape, key: number) {
  switch (e.type) {
    case "rect":
      return <rect key={key} {...e.props} />;
    case "line":
      return <line key={key} {...e.props} />;
    case "ellipse":
      return <ellipse key={key} {...e.props} />;
    case "path":
      return <path key={key} {...e.props} />;
  }
}

export default function ExerciseFigure({ name, className }: Props) {
  const pose = getPose(name);
  return (
    <svg viewBox="0 0 120 90" className={className} fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
      <line x1={6} y1={82} x2={114} y2={82} strokeWidth={2} opacity={0.25} />
      {pose.extras?.map((e, i) => renderExtra(e, i))}
      <circle cx={pose.head[0]} cy={pose.head[1]} r={7} />
      {pose.strokes.map((s, i) => (
        <polyline key={i} points={s.map((p) => p.join(",")).join(" ")} />
      ))}
    </svg>
  );
}
