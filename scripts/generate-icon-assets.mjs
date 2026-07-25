import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const svg = readFileSync(path.join(rootDir, 'resources', 'icon.svg'));

await sharp(svg).resize(1024, 1024).png().toFile(path.join(rootDir, 'resources', 'icon.png'));

// Splash: mark centered on a white canvas, occupying roughly the middle 60%.
const markSize = Math.round(2732 * 0.6);
const mark = await sharp(svg).resize(markSize, markSize).png().toBuffer();

await sharp({
  create: { width: 2732, height: 2732, channels: 4, background: '#ffffff' },
})
  .composite([{ input: mark, gravity: 'center' }])
  .png()
  .toFile(path.join(rootDir, 'resources', 'splash.png'));

console.log('Wrote resources/icon.png and resources/splash.png');
