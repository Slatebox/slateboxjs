import { chromium } from 'playwright';
const APP = 'https://test.slatebox.com';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1400, height: 800 } });
const p = await ctx.newPage();
await p.goto(APP + '/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1500);
await p.goto(APP + '/start', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(3000);
const ok = p.getByRole('button', { name: 'OK', exact: true }).first();
try { await ok.waitFor({ state: 'visible', timeout: 2500 }); await ok.click(); await p.goto(APP + '/start', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2000); } catch {}
await p.getByRole('button', { name: 'Open a blank slate' }).click();
const seeded = await p.waitForFunction(() => {
  const inst = window.__slateboxInstances;
  return Array.isArray(inst) && inst.some(s => s && (s.nodes || s.v2));
}, { timeout: 90000 }).then(() => true).catch(() => false);
console.log('canvas reached:', seeded, '| url:', p.url());
if (seeded) {
  await p.waitForTimeout(3000); // let any template kick content settle in
  await p.screenshot({ path: '/tmp/f4-natural.png' });
  const r = await p.evaluate(() => {
    const inst = window.__slateboxInstances;
    const s = (Array.isArray(inst) ? inst : Object.values(inst || {})).find(x => x?.nodes || x?.v2);
    let made = 0;
    for (let i = 0; i < 8; i++) {
      const n = s.nodes.add({ id: 'f4-' + i, text: 'Under bar ' + i, x: 40 + i * 165, y: 585, width: 150, height: 120, fill: '#f6c344' });
      if (n) made++;
    }
    return 'added ' + made + ' of 8';
  });
  console.log(r);
  await p.waitForTimeout(1500);
  await p.screenshot({ path: '/tmp/f4-before.png' });
  // click one under-bar note to open NodeDrawer + zoom camera so content sits low
  const note = p.locator('svg [fill="#f6c344"]').first();
  try { await note.waitFor({ state: 'visible', timeout: 5000 }); await note.dblclick(); await p.waitForTimeout(3000); } catch (e) { console.log('note dblclick miss'); }
  await p.screenshot({ path: '/tmp/f4-after.png' });
  console.log('shots: f4-natural/before/after');
}
await b.close();
