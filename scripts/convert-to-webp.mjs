// Produces .webp siblings of every bitmap image in public/projects/.
//
// Non-destructive: originals are never modified or deleted. Output is written
// next to the source as `<basename>.webp`, so you can spot-check quality and
// aspect ratio before swapping references in src/data/*.json.
//
// Usage:
//   node scripts/convert-to-webp.mjs              # write .webp siblings
//   node scripts/convert-to-webp.mjs --dry-run    # report what would be written
//   node scripts/convert-to-webp.mjs --force      # overwrite existing .webp output

import sharp from 'sharp';
import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECTS_DIR = fileURLToPath(new URL('../public/projects/', import.meta.url));

const MAX_WIDTH = 1600;        // cap longer side; aspect ratio preserved by sharp
const QUALITY_PHOTO = 82;      // visually lossless-ish for photos
const QUALITY_LOGO = 92;       // bump for hard-edge logos / text

const SOURCE_EXTS = new Set(['.jpg', '.jpeg', '.png']);
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

const isLogo = (name) => /logo/i.test(name);

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function processFile(filePath) {
  const origExt = extname(filePath);
  const lcExt = origExt.toLowerCase();
  const name = basename(filePath);
  if (!SOURCE_EXTS.has(lcExt)) return null;

  const baseName = basename(name, origExt);
  const outputPath = join(PROJECTS_DIR, baseName + '.webp');

  if (!FORCE && (await exists(outputPath))) {
    console.log(`${name.padEnd(52)}  .webp already exists (skipped; pass --force to overwrite)`);
    return null;
  }

  const beforeStat = await stat(filePath);
  const beforeSize = beforeStat.size;

  const buffer = await readFile(filePath);
  const image = sharp(buffer, { failOn: 'none' }).rotate(); // EXIF auto-orient
  const metadata = await image.metadata();

  let pipeline = image;
  let resizedTo = null;
  if ((metadata.width || 0) > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    resizedTo = MAX_WIDTH;
  }

  const quality = isLogo(name) ? QUALITY_LOGO : QUALITY_PHOTO;
  const outputBuffer = await pipeline.webp({ quality, effort: 5 }).toBuffer();
  const afterSize = outputBuffer.length;
  const savedPct = ((1 - afterSize / beforeSize) * 100).toFixed(1);

  const dimsTag = resizedTo
    ? `${metadata.width}→${resizedTo}px`
    : `${metadata.width || '?'}px`;

  console.log(
    `${name.padEnd(52)} ${formatBytes(beforeSize).padStart(10)} → ${formatBytes(afterSize).padStart(10)}  ` +
      `(-${savedPct}%)  q${quality}  ${dimsTag}`
  );

  if (!DRY_RUN) {
    await writeFile(outputPath, outputBuffer);
  }

  return { name, beforeSize, afterSize };
}

async function main() {
  console.log(DRY_RUN ? '[DRY RUN] No files will be written\n' : '[WRITING] Producing .webp siblings\n');

  const files = (await readdir(PROJECTS_DIR)).sort();
  let totalBefore = 0;
  let totalAfter = 0;
  let count = 0;

  for (const file of files) {
    const full = join(PROJECTS_DIR, file);
    try {
      const result = await processFile(full);
      if (result) {
        totalBefore += result.beforeSize;
        totalAfter += result.afterSize;
        count++;
      }
    } catch (err) {
      console.error(`  ! Failed on ${file}:`, err.message);
    }
  }

  const savedPct = totalBefore > 0 ? ((1 - totalAfter / totalBefore) * 100).toFixed(1) : '0';
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Converted ${count} file(s)`);
  console.log(`Total bytes (originals → WebP): ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)}  (-${savedPct}%)`);
  console.log(`\nNext steps:`);
  console.log(`  1. Open a few .webp files in public/projects/ alongside their originals to compare.`);
  console.log(`  2. If happy, swap references in src/data/*.json (e.g. .jpg → .webp).`);
  console.log(`  3. Originals are untouched, so revert is just deleting the .webp files.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
