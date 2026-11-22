// Builds the responsive variants the site serves from the masters in images/.
//
//   pnpm images
//
// Each master becomes WebP files at several widths in src/assets/img/ (never wider than the
// master, so nothing is upscaled), plus manifest.json with each image's intrinsic size and the
// widths available. src/app/media/images.ts turns those into srcset entries for NgOptimizedImage.
// Add or replace a photo by dropping the best original you have into images/ and re-running this.
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';

const SOURCE = 'images';
const TARGET = 'src/assets/img';
const WIDTHS = [160, 320, 640, 960, 1280, 1920, 2560] as const;
const MAX_WIDTH = 2560;
/** Illustrations are never shown wider than a card. */
const MAX_ILLUSTRATION_WIDTH = 960;
/** A master this close to a standard width replaces it instead of adding an almost identical file. */
const MERGE_RATIO = 0.85;

const masters = (await readdir(SOURCE)).filter(file => /\.(webp|png|jpe?g)$/i.test(file)).sort();
await rm(TARGET, { recursive: true, force: true });
await mkdir(TARGET, { recursive: true });

interface ManifestEntry {
  readonly width: number;
  readonly height: number;
  readonly widths: readonly number[];
}

const manifest: Record<string, ManifestEntry> = {};
for (const file of masters) {
  const name = basename(file, extname(file));
  const input = sharp(join(SOURCE, file)).rotate();
  const { width, height, hasAlpha } = await input.metadata();

  const largest = Math.min(width, hasAlpha ? MAX_ILLUSTRATION_WIDTH : MAX_WIDTH);
  const widths: number[] = WIDTHS.filter(candidate => candidate < largest * MERGE_RATIO);
  widths.push(largest);

  for (const target of widths) {
    await input
      .clone()
      .resize({ width: target, withoutEnlargement: true })
      // Illustrations keep sharp edges and full alpha; photos trade a little detail for size.
      .webp(hasAlpha ? { quality: 90, alphaQuality: 90, effort: 6 } : { quality: 80, effort: 6, smartSubsample: true })
      .toFile(join(TARGET, `${name}-${target}.webp`));
  }

  manifest[name] = { width, height, widths };
  console.log(`${name}: ${width}×${height} → ${widths.join(', ')}`);
}

await writeFile(join(TARGET, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
