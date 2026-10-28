/**
 * Writes src/data/imageSizes.json — intrinsic pixel dimensions for every image in
 * public/projects/.
 *
 * OptimizedImage sets these as the img's width/height attributes, which is what lets
 * the browser reserve the right box before the bytes arrive. Without them, images in
 * `sizing="natural"` mode render into a zero-height container and shove the page down
 * when they load (and the skeleton, being absolute inset-0, has nothing to fill).
 *
  * Only .webp is indexed — the data files reference nothing else.
 *
 * Only .webp is indexed — the data files reference nothing else.
 *
 * Re-run after adding images:  npm run sizes:images
 */
import { readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'public', 'projects');
const out = path.join(root, 'src', 'data', 'imageSizes.json');

const RASTER = /\.webp$/i;

const files = (await readdir(dir)).filter((f) => RASTER.test(f)).sort();

const sizes = {};
let failed = 0;

for (const file of files) {
  try {
    const { width, height } = await sharp(path.join(dir, file)).metadata();
    if (width && height) sizes[`/projects/${file}`] = [width, height];
  } catch {
    failed++;
  }
}

await writeFile(out, JSON.stringify(sizes, null, 2) + '\n');
console.log(`wrote ${Object.keys(sizes).length} entries to src/data/imageSizes.json`);
if (failed) console.log(`${failed} file(s) could not be read`);
