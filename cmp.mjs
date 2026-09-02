import puppeteer from 'puppeteer';
const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 1000 });
await p.goto('http://localhost:3002/', { waitUntil: 'networkidle2' });
await p.evaluate(async()=>{await new Promise(r=>{let y=0;const i=setInterval(()=>{scrollBy(0,600);y+=600;if(y>document.body.scrollHeight){clearInterval(i);r();}},40);});});
await new Promise(r=>setTimeout(r,900));
const o = await p.evaluate(() => {
  const M=(s,el=document.querySelector(s))=>{if(!el)return s+': MISSING';const c=getComputedStyle(el),r=el.getBoundingClientRect();
    return `${s}: x=${Math.round(r.x)} w=${Math.round(r.width)} h=${Math.round(r.height)} fs=${c.fontSize} lh=${c.lineHeight} ls=${c.letterSpacing} ff=${c.fontFamily.split(',')[0].replace(/"/g,'')}`;};
  const out=[];
  out.push('vw='+document.documentElement.clientWidth+' scrollH='+document.body.scrollHeight);
  out.push(M('.badge')); out.push(M('.hero h1')); out.push(M('.hero__lead'));
  out.push(M('.signature')); out.push(M('.hero__actions .btn--lime'));
  out.push(M('.about h2')); out.push(M('.stat__value')); out.push(M('.stat__label'));
  out.push(M('.svc__num')); out.push(M('.svc__title')); out.push(M('.svc__desc')); out.push(M('.svc'));
  out.push(M('.card')); out.push(M('.card h3')); out.push(M('.card__media'));
  out.push(M('.approach h2')); out.push(M('.step h3'));
  out.push(M('.cta h2')); out.push(M('.footer__grid'));
  // measure rendered width of the word "Empowering"
  const h1=document.querySelector('.hero h1');
  const rg=document.createRange(); const tn=h1.firstChild;
  rg.setStart(tn,0); rg.setEnd(tn,10);
  out.push('word "Empowering" width='+Math.round(rg.getBoundingClientRect().width)+' x='+Math.round(rg.getBoundingClientRect().x));
  // section tops
  for (const s of document.querySelectorAll('section,.marquee,footer')) {
    out.push('SEC '+(s.className||s.tagName).toString().split(' ')[0]+' top='+Math.round(s.getBoundingClientRect().top+scrollY)+' h='+Math.round(s.getBoundingClientRect().height));
  }
  return out.join('\n');
});
console.log(o);
await b.close();
