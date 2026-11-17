import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1200,height:800}})).newPage();
// go straight to a canvas-less app page that mounts the shell, then dump cookie DOM + grep loaded scripts
await p.goto(process.env.U + '/start?nc=' + Date.now(), { waitUntil: 'networkidle', timeout: 45000 });
await p.waitForTimeout(3000);
const res = await p.evaluate(async () => {
  const srcs = Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
  let hits = 0, checked = 0;
  for (const s of srcs) {
    try {
      const t = await (await fetch(s)).text();
      checked++;
      if (t.includes('0d2b3e')) hits++;
    } catch {}
  }
  return { srcCount: srcs.length, checked, hits, hasConsentDom: !!document.querySelector('.CookieConsent'), bodyHas: /uses cookies/i.test(document.body.innerText) };
});
console.log(process.env.U, JSON.stringify(res));
await b.close();
