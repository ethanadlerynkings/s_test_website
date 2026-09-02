import puppeteer from 'puppeteer';
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = process.argv[2];
mkdirSync(OUT, { recursive: true });
const PAGES = [['home','/'],['services','/services/'],['about','/about/'],['pricing','/pricing/'],['insights','/insights/']];

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
for (const [name, path] of PAGES) {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  try {
    await page.goto('https://navbardigital.com' + path, { waitUntil: 'networkidle2', timeout: 60000 });
  } catch (e) { console.log(name, 'NAV FAIL', e.message); await page.close(); continue; }

  // force everything visible + scroll to trigger observers
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.addStyleTag({ content: `*{opacity:1 !important;transform:none !important;visibility:visible !important;clip-path:none !important;filter:none !important}` });
  await new Promise(r => setTimeout(r, 400));

  writeFileSync(`${OUT}/${name}.html`, await page.content());

  const outline = await page.evaluate(() => {
    const out = [];
    const sel = 'h1,h2,h3,h4,h5,h6,p,li,a,button,span,td,th';
    const seen = new Set();
    for (const el of document.querySelectorAll(sel)) {
      const t = (el.textContent || '').trim().replace(/\s+/g, ' ');
      if (!t || t.length > 400) continue;
      if (el.querySelector(sel)) continue;
      const cs = getComputedStyle(el);
      const key = el.tagName + '|' + t;
      if (seen.has(key)) continue; seen.add(key);
      out.push(`${el.tagName} [${cs.fontFamily.split(',')[0]} ${cs.fontSize}/${cs.lineHeight} w${cs.fontWeight} ls${cs.letterSpacing} ${cs.color}] ${t}`);
    }
    return out.join('\n');
  });
  writeFileSync(`${OUT}/${name}.outline.txt`, outline);

  await page.screenshot({ path: `${OUT}/${name}-1440.png`, fullPage: true });
  await page.setViewport({ width: 500, height: 1000 });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `${OUT}/${name}-500.png`, fullPage: true });
  console.log(name, 'ok');
  await page.close();
}
await browser.close();
