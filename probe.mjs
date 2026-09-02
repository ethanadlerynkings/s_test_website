import puppeteer from 'puppeteer';
const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 1000 });
await p.goto('https://navbardigital.com/', { waitUntil: 'networkidle2', timeout: 60000 });
const r = await p.evaluate(() => {
  const cs = getComputedStyle(document.documentElement);
  const names = ['--color-ink','--color-paper','--color-lime','--color-red-500','--background','--foreground','--font-body','--font-display','--font-signature','--font-mono','--font-hanken','--font-bricolage','--color-ash','--color-smoke','--color-muted','--color-surface','--color-border'];
  const vars = {};
  for (const n of names) { const v = cs.getPropertyValue(n).trim(); if (v) vars[n] = v; }
  // scrape all custom props actually defined
  const all = {};
  for (const sheet of document.styleSheets) {
    try { for (const rule of sheet.cssRules) {
      if (rule.style && (rule.selectorText === ':root' || rule.selectorText?.includes(':root'))) {
        for (const prop of rule.style) if (prop.startsWith('--')) all[prop] = rule.style.getPropertyValue(prop).trim();
      }
    } } catch {}
  }
  const bs = getComputedStyle(document.body);
  const h1 = document.querySelector('h1');
  return { vars, all, body: { bg: bs.backgroundColor, color: bs.color, ff: bs.fontFamily },
    h1: h1 ? { ff: getComputedStyle(h1).fontFamily, fs: getComputedStyle(h1).fontSize, fw: getComputedStyle(h1).fontWeight, lh: getComputedStyle(h1).lineHeight, ls: getComputedStyle(h1).letterSpacing } : null };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
