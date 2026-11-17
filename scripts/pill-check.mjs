import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1400, height: 800 } });
const p = await ctx.newPage();
await p.goto(process.env.U + '/start?nc=' + Date.now(), { waitUntil: 'networkidle', timeout: 45000 });
await p.waitForTimeout(4000);
const pill = await p.evaluate(() => {
  const el = document.querySelector('.CookieConsent');
  if (!el) return 'NO PILL';
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return `x=${r.x|0} y=${r.y|0} w=${r.width|0} h=${r.height|0} radius=${cs.borderRadius} fixed=${cs.position}`;
});
console.log('pill:', pill);
await p.screenshot({ path: '/tmp/pill-prod.png' });
await b.close();
