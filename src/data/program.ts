export interface LevelSpec {
  name: string;
  reps?: string;
  sec?: number;
}

export type DayMode = "circuit" | "sets" | "mixed";
export type ExerciseKind = "emom" | "interval" | "sets";

export interface Exercise {
  jp: string;
  levels: LevelSpec[];
  time?: boolean;
  sides?: boolean;
  sets?: number;
  rest?: number;
  repsBySet?: string[];
  secBySet?: number[];
  kind?: ExerciseKind;
  rounds?: number;
  window?: number;
  reps?: string;
  repsByLevel?: string[];
  work?: number;
}

export interface Day {
  n: string;
  title: string;
  sub: string;
  mode: DayMode;
  rounds?: number;
  rest?: number;
  ex: Exercise[];
}

const S = (name: string, reps: string): LevelSpec => ({ name, reps });

export const PROGRAM: Day[] = [
  {
    n: "Day 1",
    title: "全身サーキット",
    sub: "5種目 × 4周のサーキット",
    mode: "circuit",
    rounds: 4,
    rest: 30,
    ex: [
      { jp: "腕立て系", levels: [S("Modified Cobra Push Up", "10+"), S("Regular Push Up", "15+"), S("Clapping Push Up", "10+")] },
      { jp: "スクワット系（自重 or バンド・壁向き）", levels: [S("Limited ROM Squat", "12-15"), S("Squat", "12-15"), S("Pistol Squat", "6-8")] },
      { jp: "ロウ / 懸垂系", levels: [S("Banded Row or Chin Up", "12"), S("Row / Chin Up Option 2", "10"), S("Row / Chin Up Option 3", "6+")] },
      { jp: "ディップス系（足は体の後ろに曲げる）", levels: [S("Bench Dips", "10"), S("Feet Assisted Dips", "10"), S("Dips", "8-10")] },
      {
        jp: "サイドプランク（左右）",
        time: true,
        sides: true,
        levels: [
          { name: "Side Plank / Knee + Elbow", sec: 30 },
          { name: "Side Plank", sec: 45 },
          { name: "Side Plank / Top Leg Up", sec: 45 },
        ],
      },
    ],
  },
  {
    n: "Day 2",
    title: "レッグデー",
    sub: "脚・ヒンジ・開脚まで6種目",
    mode: "sets",
    ex: [
      { jp: "バーピー系（ウォームアップ）", sets: 1, rest: 120, levels: [S("Kneeling to Squat", "10-15"), S("Burpee", "10-15"), S("Roll Up Jumps", "10-15")] },
      { jp: "スクワット", sets: 3, rest: 30, levels: [S("Limited ROM Squat", "15"), S("Squat w/ Band", "15"), S("Pistol Squat", "片脚 6-7")] },
      { jp: "ヒップスラスト系", sets: 3, rest: 30, levels: [S("Limited ROM Hip Thrust", "8-10"), S("Banded Single Leg Hip Thrust", "8-10"), S("Limited ROM Reverse Nordic Curl", "8-10")] },
      { jp: "ランジ系", sets: 3, rest: 45, repsBySet: ["12", "10", "8"], levels: [S("Assisted Lunge Variation", ""), S("Long Lunge", ""), S("Cossack Squat", "")] },
      { jp: "ヒップヒンジ", sets: 3, rest: 30, levels: [S("Hip Hinge on Chair", "10"), S("Bent Leg Seated Hip Hinge", "10"), S("Seated Straddle Hip Hinge", "10")] },
      {
        jp: "開脚ホールド",
        sets: 2,
        rest: 45,
        time: true,
        levels: [
          { name: "Assisted Middle Split Squat Hold", sec: 25 },
          { name: "Wide Middle Split Squat Hold", sec: 25 },
          { name: "Full Active Middle Split Hold", sec: 25 },
        ],
      },
    ],
  },
  {
    n: "Day 3",
    title: "基礎固め（EMOM）",
    sub: "毎分スタートのインターバル",
    mode: "mixed",
    ex: [
      { jp: "EMOM 8分・毎分10回", kind: "emom", rounds: 8, window: 60, reps: "10", levels: [S("Modified Cobra Push Up", ""), S("Push Up", ""), S("Clapping Push Up", "")] },
      {
        jp: "30秒オン / 30秒休憩",
        kind: "interval",
        rounds: 8,
        work: 30,
        rest: 30,
        levels: [
          { name: "Prone Arm Raise（腕を前方に伸ばす）" },
          { name: "Superman（足を揃え腕は頭上）" },
          { name: "Weighted Superman（ヨガブロック）" },
        ],
      },
      { jp: "EMOM 6分", kind: "emom", rounds: 6, window: 60, repsByLevel: ["10-15", "10", "6-8"], levels: [S("Banded Row or Chin Up", ""), S("Row / Chin Up Option 2", ""), S("Row / Chin Up Option 3", "")] },
      {
        jp: "サイドプランク（左右）",
        kind: "sets",
        sets: 3,
        rest: 30,
        time: true,
        sides: true,
        secBySet: [30, 30, 45],
        levels: [{ name: "Side Plank / Knee + Elbow" }, { name: "Side Plank" }, { name: "Side Plank / Top Leg Up" }],
      },
    ],
  },
];

export const LEVELS = [
  { label: "補助", desc: "やさしい" },
  { label: "メイン", desc: "標準" },
  { label: "強化", desc: "きつい" },
];
