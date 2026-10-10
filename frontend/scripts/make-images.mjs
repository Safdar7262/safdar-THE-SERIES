// Builds the website images from ONE photo: photo/safdar.jpg
//   1. removes the plain background (works best with a white / light studio background)
//   2. writes 3 sizes of the portrait to public/assets/
//   3. writes the social-share image (og-image.jpg)
// Run:  npm run images
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SOURCE = 'photo/safdar.jpg';
const OUT = 'public/assets';
const NAME = 'SAFDAR';
const SUBTITLE = 'JAVA BACKEND DEVELOPER • SPRING BOOT • REST APIs';
mkdirSync(OUT, { recursive: true });

const { data, info } = await sharp(SOURCE).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;

// Step 1 — find the background: near-white pixels connected to the image border.
const isBg = (i) => data[i * 3] > 232 && data[i * 3 + 1] > 232 && data[i * 3 + 2] > 232;
const bg = new Uint8Array(w * h);
const stack = [];
const push = (x, y) => {
  const i = y * w + x;
  if (!bg[i] && isBg(i)) {
    bg[i] = 1;
    stack.push(i);
  }
};
// (the bottom edge is not used as a seed: a white shirt touches it and must stay)
for (let x = 0; x < w; x++) push(x, 0);
for (let y = 0; y < h; y++) (push(0, y), push(w - 1, y));
while (stack.length) {
  const i = stack.pop();
  const x = i % w;
  const y = (i / w) | 0;
  if (x > 0) push(x - 1, y);
  if (x < w - 1) push(x + 1, y);
  if (y > 0) push(x, y - 1);
  if (y < h - 1) push(x, y + 1);
}

// Step 2 — turn it into a soft alpha mask (blur = smooth edges, no white halo).
const mask = Buffer.alloc(w * h);
for (let i = 0; i < w * h; i++) mask[i] = bg[i] ? 0 : 255;
const soft = await sharp(mask, { raw: { width: w, height: h, channels: 1 } }).blur(1.1).linear(1.35, -45).extractChannel(0).raw().toBuffer();

const rgba = Buffer.alloc(w * h * 4);
for (let i = 0; i < w * h; i++) {
  rgba[i * 4] = data[i * 3];
  rgba[i * 4 + 1] = data[i * 3 + 1];
  rgba[i * 4 + 2] = data[i * 3 + 2];
  rgba[i * 4 + 3] = soft[i];
}
const cutout = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();

// Step 3 — responsive sizes
for (const size of [w, 560, 340]) {
  await sharp(cutout).resize({ width: size }).webp({ quality: 88, alphaQuality: 92 }).toFile(`${OUT}/portrait-${size}.webp`);
}

// Step 4 — social share image (1200x630)
const portrait = await sharp(cutout).resize({ height: 600 }).png().toBuffer();
const glow = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g" cx="78%" cy="45%" r="45%"><stop offset="0" stop-color="#e5132b" stop-opacity="0.45"/><stop offset="1" stop-color="#e5132b" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`;
const text = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <text x="72" y="300" font-family="Impact, 'Arial Narrow', sans-serif" font-size="150" fill="#f4f1ec" letter-spacing="4">${NAME}</text>
  <text x="78" y="352" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="26" fill="#ff3d5a" letter-spacing="16">THE SERIES</text>
  <text x="78" y="420" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="18" fill="#a7a6ad" letter-spacing="3">${SUBTITLE}</text></svg>`;
await sharp({ create: { width: 1200, height: 630, channels: 4, background: '#07070a' } })
  .composite([{ input: Buffer.from(glow) }, { input: portrait, gravity: 'southeast' }, { input: Buffer.from(text) }])
  .jpeg({ quality: 85 })
  .toFile(`${OUT}/og-image.jpg`);
console.log('images built in', OUT);
