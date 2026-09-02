// Viewport-only capture for close-up comparison: node screenshot-vp.mjs <url> <label> <scrollY> [width] [height] [dpr]
import puppeteer from 'puppeteer';
import { readdir, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const [, , url = 'http://localhost:3000', label = 'vp', scrollY = '0', width = '1440', height = '900', dpr = '2'] = process.argv;
const outDir = join(process.cwd(), 'temporary screenshots');

await mkdir(outDir, { recursive: true });
const existing = await readdir(outDir);
const next = existing.map((f) => Number(f.match(/^screenshot-(\d+)/)?.[1] ?? 0)).reduce((a, b) => Math.max(a, b), 0) + 1;
const name = `screenshot-${next}-${label}.png`;

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: Number(width), height: Number(height), deviceScaleFactor: Number(dpr) });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
await page.evaluate((y) => window.scrollTo(0, y), Number(scrollY));
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({ path: join(outDir, name) });
await browser.close();
console.log(join(outDir, name));
