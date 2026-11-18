import { chromium } from 'playwright';
const APP = 'https://test.slatebox.com';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1400, height: 800 } });
const p = await ctx.newPage();
await p.goto(APP + '/start', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(3000);
await p.getByRole('button', { name: 'Open a blank slate' }).click();
const seeded = await p.waitForFunction(() => { const i = window.__slateboxInstances; return Array.isArray(i) && i.some(s => s && (s.nodes || s.v2)); }, { timeout: 90000 }).then(() => true).catch(() => false);
console.log('canvas:', seeded, p.url());
if (seeded) {
  await p.waitForTimeout(5000);
  const geo = await p.evaluate(() => {
    const out = [];
    const add = (name, el) => { if (!el) { out.push(name + ': ABSENT'); return; }
      const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      out.push(`${name}: x=${r.x|0} y=${r.y|0} w=${r.width|0} h=${r.height|0} z=${cs.zIndex} ovf=${cs.overflow} pos=${cs.position} cls=${(el.className.baseVal ?? el.className ?? '').toString().slice(0,40)}`); };
    add('birdseye', document.querySelector('.slateboxjs-birdseye'));
    add('canvasGrid', document.querySelector('#\\:r1 \\> div, [id] > .MuiGrid-root'));
    // find the element(s) painting at bottom center (zoom controls) + cookie bar
    const els = ['div', 'button'].flatMap(tag => Array.from(document.querySelectorAll(tag)));
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.y > 730 && r.y < 770 && r.x > 1100 && r.width < 400 && r.height < 60 && el.children.length < 8) {
        add('bottom-chrome@' + (r.x|0), el);
      }
    }
    add('cookieBar', Array.from(document.querySelectorAll('div')).find(d => /uses cookies/.test(d.textContent) && d.getBoundingClientRect().height < 90 && d.getBoundingClientRect().height > 10));
    return out.join('\n');
  });
  console.log(geo);
  await p.screenshot({ path: '/tmp/f4-geo.png' });
}
await b.close();
