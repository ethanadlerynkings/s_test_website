import puppeteer from 'puppeteer';
import { writeFileSync } from 'node:fs';

const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 1000 });
await p.goto('https://navbardigital.com/', { waitUntil: 'networkidle2', timeout: 90000 });
await p.evaluate(async () => {
  await new Promise(r => { let y = 0; const i = setInterval(() => { window.scrollBy(0, 800); y += 800; if (y > document.body.scrollHeight) { clearInterval(i); r(); } }, 60); });
});
await new Promise(r => setTimeout(r, 1500));

const out = await p.evaluate(() => {
  const px = n => Math.round(n * 10) / 10;
  const sections = [...document.querySelectorAll('body section, body > div > section, main > *')];
  const seen = new Set();
  const dump = [];
  for (const s of sections) {
    if (seen.has(s)) continue; seen.add(s);
    const r = s.getBoundingClientRect();
    const cs = getComputedStyle(s);
    const heads = [...s.querySelectorAll('h1,h2,h3,h4')].slice(0, 14).map(h => {
      const c = getComputedStyle(h);
      return { tag: h.tagName, text: h.innerText.trim().slice(0, 160), fs: c.fontSize, fw: c.fontWeight, lh: c.lineHeight, ls: c.letterSpacing, ff: c.fontFamily.split(',')[0], color: c.color, tt: c.textTransform };
    });
    dump.push({
      cls: (s.className || '').toString().slice(0, 120),
      top: px(r.top + scrollY), h: px(r.height),
      bg: cs.backgroundColor, pad: cs.padding,
      heads,
      text: s.innerText.replace(/\n{2,}/g, '\n').trim().slice(0, 1400),
    });
  }
  return { title: document.title, h: document.body.scrollHeight, dump };
});
writeFileSync('reference-structure.json', JSON.stringify(out, null, 1));
console.log('sections:', out.dump.length, 'pageHeight:', out.h, 'title:', out.title);
await b.close();
