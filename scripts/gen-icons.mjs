// Regenerates public/ app icons from the source illustration at
// scripts/assets/icon-source.png (two cats training). The source ships as a
// full-bleed square with baked-in black corners, so we re-mask it with our
// own rounded-rect alpha (same ~8% corner radius used across the sibling
// Growth-app project) to get clean transparent corners instead.
// Run: npm run gen-icons
import sharp from "sharp";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../public");
const sourcePath = path.resolve(__dirname, "./assets/icon-source.png");

const roundedMask = (size) => {
  // The source's own black-corner cut extends to roughly 6% of the canvas
  // along the diagonal; a circular-arc mask only starts clearing pixels at
  // ~0.293*r along the diagonal, so r needs real margin over that 6% or a
  // black ring survives between the mask edge and the source's cut.
  const r = Math.round(size * 0.22);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#fff"/></svg>`);
};

async function makeIcon(size, outFile, { flattenBackground } = {}) {
  let img = sharp(sourcePath).resize(size, size).composite([{ input: roundedMask(size), blend: "dest-in" }]);
  if (flattenBackground) img = img.flatten({ background: flattenBackground });
  await img.png().toFile(path.join(outDir, outFile));
}

async function main() {
  await mkdir(outDir, { recursive: true });

  await makeIcon(192, "icon-192.png");
  await makeIcon(512, "icon-512.png");
  await makeIcon(180, "apple-touch-icon.png", { flattenBackground: "#eaf3fb" });
  await makeIcon(32, "favicon.png");

  console.log("Icons written to", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
