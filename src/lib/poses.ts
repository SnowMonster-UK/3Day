export type Point = [number, number];

export interface ExtraShape {
  type: "rect" | "line" | "ellipse" | "path";
  props: Record<string, string | number>;
}

export interface Pose {
  head: Point;
  strokes: Point[][];
  extras?: ExtraShape[];
}

const pl = (...pts: Point[]): Point[] => pts;

export const DEFAULT_POSE: Pose = {
  head: [60, 20],
  strokes: [pl([60, 27], [60, 50]), pl([60, 30], [50, 36], [46, 44]), pl([60, 30], [70, 36], [74, 44]), pl([60, 50], [52, 80]), pl([60, 50], [68, 80])],
};

export const POSES: Record<string, Pose> = {
  "Get Ready": DEFAULT_POSE,
  Rest: {
    head: [60, 20],
    strokes: [pl([60, 27], [60, 50]), pl([60, 30], [50, 48]), pl([60, 30], [70, 48]), pl([60, 50], [52, 80]), pl([60, 50], [68, 80])],
  },
  Finish: {
    head: [60, 18],
    strokes: [pl([60, 25], [60, 50]), pl([60, 28], [44, 8]), pl([60, 28], [76, 8]), pl([60, 50], [52, 80]), pl([60, 50], [68, 80])],
  },

  "Modified Cobra Push Up": {
    head: [24, 45],
    strokes: [pl([34, 50], [70, 76]), pl([34, 50], [34, 76]), pl([70, 76], [88, 78], [104, 78])],
  },
  "Regular Push Up": {
    head: [22, 40],
    strokes: [pl([30, 42], [66, 48]), pl([30, 42], [30, 60], [30, 78]), pl([66, 48], [104, 52])],
  },
  "Push Up": {
    head: [22, 40],
    strokes: [pl([30, 42], [66, 48]), pl([30, 42], [30, 60], [30, 78]), pl([66, 48], [104, 52])],
  },
  "Clapping Push Up": {
    head: [22, 34],
    strokes: [pl([30, 36], [66, 42]), pl([30, 36], [30, 60]), pl([66, 42], [104, 46])],
    extras: [
      { type: "line", props: { x1: 24, y1: 58, x2: 18, y2: 52 } },
      { type: "line", props: { x1: 36, y1: 58, x2: 42, y2: 52 } },
      { type: "line", props: { x1: 30, y1: 50, x2: 30, y2: 44 } },
    ],
  },

  "Limited ROM Squat": {
    head: [60, 20],
    strokes: [pl([60, 30], [62, 46]), pl([60, 30], [44, 34]), pl([62, 46], [70, 62], [66, 82])],
    extras: [{ type: "rect", props: { x: 76, y: 40, width: 16, height: 10, rx: 1, strokeDasharray: "4 3" } }],
  },
  Squat: {
    head: [60, 30],
    strokes: [pl([60, 40], [62, 62]), pl([60, 40], [42, 44]), pl([62, 62], [74, 70], [66, 82])],
  },
  "Squat w/ Band": {
    head: [60, 30],
    strokes: [pl([60, 40], [62, 62]), pl([60, 40], [42, 44]), pl([62, 62], [74, 70], [66, 82])],
    extras: [{ type: "ellipse", props: { cx: 70, cy: 70, rx: 10, ry: 4 } }],
  },
  "Pistol Squat": {
    head: [60, 28],
    strokes: [pl([60, 38], [60, 58]), pl([60, 38], [40, 40]), pl([60, 58], [70, 70], [64, 82]), pl([60, 58], [90, 52])],
  },

  "Banded Row or Chin Up": {
    head: [60, 22],
    strokes: [pl([60, 32], [58, 52]), pl([58, 52], [58, 68], [56, 82]), pl([60, 32], [50, 36], [38, 34])],
    extras: [
      { type: "path", props: { d: "M38,34 L28,30 L20,36 L10,20", strokeDasharray: "3 3" } },
      { type: "line", props: { x1: 8, y1: 10, x2: 8, y2: 40 } },
    ],
  },
  "Row / Chin Up Option 2": {
    head: [60, 16],
    strokes: [pl([60, 24], [60, 50]), pl([60, 24], [60, 12]), pl([60, 50], [70, 56], [66, 48])],
    extras: [{ type: "line", props: { x1: 30, y1: 10, x2: 90, y2: 10 } }],
  },
  "Row / Chin Up Option 3": {
    head: [60, 16],
    strokes: [pl([60, 24], [60, 55]), pl([60, 24], [60, 12]), pl([60, 55], [60, 80])],
    extras: [{ type: "line", props: { x1: 30, y1: 10, x2: 90, y2: 10 } }],
  },

  "Bench Dips": {
    head: [30, 34],
    strokes: [pl([34, 42], [50, 52]), pl([34, 42], [58, 40]), pl([50, 52], [90, 60])],
    extras: [{ type: "rect", props: { x: 58, y: 36, width: 28, height: 6, rx: 1 } }],
  },
  "Feet Assisted Dips": {
    head: [54, 30],
    strokes: [pl([54, 38], [54, 58]), pl([50, 38], [34, 40]), pl([58, 38], [74, 40]), pl([54, 58], [54, 70], [50, 80])],
    extras: [
      { type: "line", props: { x1: 34, y1: 8, x2: 34, y2: 46 } },
      { type: "line", props: { x1: 74, y1: 8, x2: 74, y2: 46 } },
    ],
  },
  Dips: {
    head: [54, 34],
    strokes: [pl([54, 42], [54, 64]), pl([50, 42], [34, 40]), pl([58, 42], [74, 40]), pl([54, 64], [60, 74], [56, 70])],
    extras: [
      { type: "line", props: { x1: 34, y1: 8, x2: 34, y2: 46 } },
      { type: "line", props: { x1: 74, y1: 8, x2: 74, y2: 46 } },
    ],
  },

  "Side Plank / Knee + Elbow": {
    head: [30, 40],
    strokes: [pl([36, 46], [62, 54]), pl([36, 46], [36, 64]), pl([62, 54], [80, 66], [70, 74])],
  },
  "Side Plank": {
    head: [26, 34],
    strokes: [pl([32, 40], [62, 50]), pl([32, 40], [32, 62]), pl([62, 50], [104, 62])],
  },
  "Side Plank / Top Leg Up": {
    head: [26, 34],
    strokes: [pl([32, 40], [62, 50]), pl([32, 40], [32, 62]), pl([62, 50], [104, 62]), pl([62, 50], [100, 38])],
  },

  "Kneeling to Squat": {
    head: [56, 30],
    strokes: [pl([56, 38], [56, 56]), pl([56, 56], [50, 78], [40, 80]), pl([56, 56], [68, 66], [74, 80]), pl([56, 38], [46, 50])],
  },
  Burpee: {
    head: [60, 18],
    strokes: [pl([60, 28], [60, 46]), pl([60, 28], [44, 10]), pl([60, 28], [76, 10]), pl([60, 46], [46, 80]), pl([60, 46], [74, 80])],
    extras: [
      { type: "line", props: { x1: 40, y1: 84, x2: 34, y2: 88 } },
      { type: "line", props: { x1: 80, y1: 84, x2: 86, y2: 88 } },
    ],
  },
  "Roll Up Jumps": {
    head: [50, 60],
    strokes: [pl([54, 64], [62, 66]), pl([62, 66], [56, 70], [48, 66]), pl([54, 64], [50, 74])],
    extras: [{ type: "path", props: { d: "M60,74 L60,32 M54,40 L60,30 L66,40", fill: "none" } }],
  },

  "Limited ROM Hip Thrust": {
    head: [22, 70],
    strokes: [pl([30, 70], [55, 62]), pl([30, 70], [20, 78]), pl([55, 62], [70, 70], [80, 80])],
  },
  "Banded Single Leg Hip Thrust": {
    head: [22, 70],
    strokes: [pl([30, 70], [55, 54]), pl([30, 70], [20, 78]), pl([55, 54], [70, 66], [80, 80]), pl([55, 54], [70, 30])],
    extras: [{ type: "ellipse", props: { cx: 60, cy: 58, rx: 8, ry: 4 } }],
  },
  "Limited ROM Reverse Nordic Curl": {
    head: [78, 40],
    strokes: [pl([70, 46], [55, 58]), pl([70, 46], [78, 52]), pl([55, 58], [55, 78], [45, 80])],
  },

  "Assisted Lunge Variation": {
    head: [55, 22],
    strokes: [pl([55, 30], [55, 48]), pl([55, 30], [30, 34]), pl([55, 48], [66, 62], [70, 82]), pl([55, 48], [48, 66], [40, 80])],
    extras: [{ type: "line", props: { x1: 20, y1: 10, x2: 20, y2: 82 } }],
  },
  "Long Lunge": {
    head: [58, 24],
    strokes: [
      pl([58, 32], [58, 50]),
      pl([58, 32], [40, 28]),
      pl([58, 32], [76, 28]),
      pl([58, 50], [78, 64], [90, 82]),
      pl([58, 50], [40, 68], [28, 80]),
    ],
  },
  "Cossack Squat": {
    head: [58, 24],
    strokes: [pl([58, 32], [58, 52]), pl([58, 32], [44, 40]), pl([58, 32], [72, 40]), pl([58, 52], [42, 66], [34, 82]), pl([58, 52], [94, 80])],
  },

  "Hip Hinge on Chair": {
    head: [30, 42],
    strokes: [pl([36, 46], [58, 52]), pl([58, 52], [58, 68], [56, 82]), pl([36, 46], [20, 50])],
    extras: [{ type: "rect", props: { x: 70, y: 70, width: 20, height: 8, rx: 1 } }],
  },
  "Bent Leg Seated Hip Hinge": {
    head: [66, 58],
    strokes: [pl([58, 64], [44, 74]), pl([44, 74], [56, 72], [68, 76]), pl([58, 64], [66, 74])],
  },
  "Seated Straddle Hip Hinge": {
    head: [40, 56],
    strokes: [pl([46, 66], [50, 74]), pl([50, 74], [20, 78]), pl([50, 74], [80, 78]), pl([46, 66], [50, 78])],
  },

  "Assisted Middle Split Squat Hold": {
    head: [60, 40],
    strokes: [pl([60, 52], [60, 64]), pl([60, 64], [24, 70]), pl([60, 64], [96, 70]), pl([60, 52], [22, 40]), pl([60, 52], [98, 40])],
    extras: [
      { type: "line", props: { x1: 20, y1: 20, x2: 20, y2: 82 } },
      { type: "line", props: { x1: 100, y1: 20, x2: 100, y2: 82 } },
    ],
  },
  "Wide Middle Split Squat Hold": {
    head: [60, 46],
    strokes: [pl([60, 58], [60, 70]), pl([60, 70], [14, 76]), pl([60, 70], [106, 76]), pl([60, 58], [44, 78]), pl([60, 58], [76, 78])],
  },
  "Full Active Middle Split Hold": {
    head: [60, 40],
    strokes: [pl([60, 54], [60, 76]), pl([60, 76], [8, 78]), pl([60, 76], [112, 78]), pl([60, 54], [38, 46]), pl([60, 54], [82, 46])],
  },

  "Prone Arm Raise (arms extended forward)": {
    head: [26, 66],
    strokes: [pl([34, 68], [66, 70]), pl([34, 68], [14, 60]), pl([66, 70], [104, 72])],
  },
  "Superman (legs together, arms overhead)": {
    head: [24, 56],
    strokes: [pl([32, 58], [66, 62]), pl([32, 58], [10, 48]), pl([66, 62], [104, 52])],
  },
  "Weighted Superman (yoga block)": {
    head: [24, 56],
    strokes: [pl([32, 58], [66, 62]), pl([32, 58], [10, 48]), pl([66, 62], [104, 52])],
    extras: [{ type: "rect", props: { x: 4, y: 42, width: 10, height: 8, rx: 1 } }],
  },
};

export function getPose(name: string): Pose {
  return POSES[name] ?? DEFAULT_POSE;
}
