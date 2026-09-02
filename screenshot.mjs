import puppeteer from 'puppeteer';
import { readdir, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const url = process.argv[2] ?? 'http://localhost:3000';
const label = process.argv[3] ?? '';
const width = Number(process.argv[4] ?? 1440);
const outDir = join(process.cwd(), 'temporary screenshots');

await mkdir(outDir, { recursive: true });
const existing = await readdir(outDir);
const next =
  existing
    .map((f) => Number(f.match(/^screenshot-(\d+)/)?.[1] ?? 0))
    .reduce((a, b) => Math.max(a, b), 0) + 1;
const name = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({ path: join(outDir, name), fullPage: true });
await browser.close();
console.log(join(outDir, name));
