// One-shot helper: rewrites image references in source files from
// .jpg/.jpeg/.png (any case) to .webp, but only inside string literals (i.e.
// followed by a quote). Run AFTER `npm run convert:webp` once you're happy
// with the converted output.
//
// Skips index.html (handled by hand so og:image / twitter:image stay as JPG
// for safer social-platform compatibility).
// Skips the conversion scripts themselves so their internal extension lists
// keep working on the original files.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

const TARGETS = [
  'src/data/workExperience.json',
  'src/data/allProjects.json',
  'src/data/leadership.json',
  'src/data/projects3D.json',
  'src/components/sections/Hero.tsx',
  'src/components/sections/WorkExperience.tsx',
  'src/components/sections/Certifications.tsx',
  'src/components/views/CADView.tsx',
  'src/hooks/useImagePreloader.ts',
];

const EXT_PATTERN = /\.(jpe?g|png)(?=["'`])/gi;

let totalReplacements = 0;

for (const rel of TARGETS) {
  const path = join(ROOT, rel);
  const before = await readFile(path, 'utf8');
  let count = 0;
  const after = before.replace(EXT_PATTERN, () => {
    count++;
    return '.webp';
  });
  if (count > 0) {
    await writeFile(path, after);
  }
  totalReplacements += count;
  console.log(`${rel.padEnd(50)} ${count} replacement(s)`);
}

console.log(`\nTotal: ${totalReplacements} reference(s) updated`);
