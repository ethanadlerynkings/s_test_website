import puppeteer from 'puppeteer';
import { readFileSync, mkdirSync } from 'node:fs';
import { basename } from 'node:path';

const [src, outDir, tileH = '1600'] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const buf = readFileSync(src);
const W = buf.readUInt32BE(16), H = buf.readUInt32BE(20);
const dataUri = 'data:image/png;base64,' + buf.toString('base64');
const name = basename(src, '.png').replace(/[^a-z0-9]+/gi, '_');
const th = Number(tileH);

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: W, height: th, deviceScaleFactor: 1 });
await page.setContent(`<style>html,body{margin:0;padding:0}img{display:block;width:${W}px}</style><img src="${dataUri}">`);
await page.waitForSelector('img');
const n = Math.ceil(H / th);
for (let i = 0; i < n; i++) {
  const y = i * th;
  await page.screenshot({
    path: `${outDir}/${name}-${String(i + 1).padStart(2, '0')}.png`,
    clip: { x: 0, y, width: W, height: Math.min(th, H - y) },
    captureBeyondViewport: true,
  });
}
await browser.close();
console.log(`${name}: ${W}x${H} -> ${n} tiles`);
