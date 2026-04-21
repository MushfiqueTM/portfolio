import sharp from 'sharp';
import { readdir, stat, readFile, writeFile, rename } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const PROJECTS_DIR = new URL('../public/projects/', import.meta.url).pathname.replace(/^\//, '');
const MAX_WIDTH = 1800;       // cap the longest side
const JPEG_QUALITY = 82;      // visually lossless-ish
const PNG_QUALITY = 82;       // only applied if we convert
const DRY_RUN = process.argv.includes('--dry-run');
const SIZE_THRESHOLD_KB = 400; // only touch files larger than this

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function processFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  const name = basename(filePath);
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return null;

  const beforeStat = await stat(filePath);
  const beforeSize = beforeStat.size;
  if (beforeSize < SIZE_THRESHOLD_KB * 1024) return null;

  const buffer = await readFile(filePath);
  const image = sharp(buffer, { failOn: 'none' });
  const metadata = await image.metadata();
  const needsResize = (metadata.width || 0) > MAX_WIDTH;

  let pipeline = image;
  if (needsResize) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  let outputBuffer;
  if (ext === '.png') {
    // Check if the PNG has alpha. If no alpha, re-encode as JPEG for much smaller size
    if (!metadata.hasAlpha) {
      outputBuffer = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
    } else {
      outputBuffer = await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toBuffer();
    }
  } else {
    outputBuffer = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
  }

  const afterSize = outputBuffer.length;
  const savedPct = ((1 - afterSize / beforeSize) * 100).toFixed(1);

  console.log(`${name.padEnd(45)} ${formatBytes(beforeSize).padStart(10)} → ${formatBytes(afterSize).padStart(10)}  (-${savedPct}%)`);

  if (!DRY_RUN && afterSize < beforeSize) {
    await writeFile(filePath, outputBuffer);
  }

  return { name, beforeSize, afterSize };
}

async function main() {
  console.log(DRY_RUN ? '[DRY RUN] No files will be modified\n' : '[APPLYING] Compressing in place\n');
  const files = await readdir(PROJECTS_DIR);
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const full = join(PROJECTS_DIR, file);
    try {
      const result = await processFile(full);
      if (result) {
        totalBefore += result.beforeSize;
        totalAfter += result.afterSize;
      }
    } catch (err) {
      console.error(`  ! Failed on ${file}:`, err.message);
    }
  }

  const savedPct = totalBefore > 0 ? ((1 - totalAfter / totalBefore) * 100).toFixed(1) : '0';
  console.log(`\n${'='.repeat(70)}`);
  console.log(`Total: ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)}  (-${savedPct}%)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
