import puppeteer from 'puppeteer';
const [out, clipY, clipH] = process.argv.slice(2);
const b = await puppeteer.launch({ headless:'new', args:['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width:1440, height:1000 });
await p.goto('http://localhost:3002/', { waitUntil:'networkidle2' });
await p.evaluate(async()=>{await new Promise(r=>{let y=0;const i=setInterval(()=>{scrollBy(0,600);y+=600;if(y>document.body.scrollHeight){clearInterval(i);r();}},40);});});
await p.evaluate(()=>scrollTo(0,0));
await new Promise(r=>setTimeout(r,1200));
const clip = clipY ? { x:0, y:Number(clipY), width:1440, height:Number(clipH) } : undefined;
await p.screenshot({ path: out, fullPage: !clip, clip, captureBeyondViewport: true });
// nav overflow check
console.log(await p.evaluate(()=>{
  const bar=document.querySelector('.site-header__bar'), nav=document.querySelector('.site-nav');
  return `bar w=${Math.round(bar.getBoundingClientRect().width)} nav w=${Math.round(nav.getBoundingClientRect().width)} navX=${Math.round(nav.getBoundingClientRect().x)} scrollW=${bar.scrollWidth}`;
}));
await b.close();
