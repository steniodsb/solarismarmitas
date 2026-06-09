/**
 * Converte JPGs em src/assets/ para WebP redimensionado (max 1600px lado maior, q=82).
 * Deleta o JPG original ao final.
 */
import sharp from "sharp";
import { stat, unlink } from "node:fs/promises";
import { join, parse, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = resolve(__dirname, "..", "src", "assets");

const TARGETS = [
  "size-400ml.jpg",
  "size-500ml.jpg",
  "size-850ml.jpg",
  "cat-caseira.jpg",
  "cat-lowcarb.jpg",
  "cat-fitness.jpg",
  "cat-vegetariana.jpg",
  "cat-sucos.jpg",
  "carina-petersen.jpg",
  "hero-meals.jpg",
];

const TO_DELETE = ["fitmeal.jpg", "tradicional.jpg", "vegetariana.jpg", "lowcarb.jpg", "hero-meals.jpg"];

let totalBefore = 0;
let totalAfter = 0;

for (const name of TARGETS) {
  const src = join(ASSETS_DIR, name);
  let info;
  try {
    info = await stat(src);
  } catch {
    console.log(`SKIP (não existe): ${name}`);
    continue;
  }
  const { name: base } = parse(name);
  const dst = join(ASSETS_DIR, `${base}.webp`);
  await sharp(src)
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(dst);
  const after = await stat(dst);
  totalBefore += info.size;
  totalAfter += after.size;
  console.log(`${name}: ${(info.size / 1024).toFixed(0)} KB → ${(after.size / 1024).toFixed(0)} KB`);
  await unlink(src);
}

for (const name of TO_DELETE) {
  try {
    await unlink(join(ASSETS_DIR, name));
    console.log(`DEL: ${name}`);
  } catch {}
}

console.log(`\nTotal: ${(totalBefore / 1024).toFixed(0)} KB → ${(totalAfter / 1024).toFixed(0)} KB`);
console.log(`Economia: ${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%`);
