import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1400, height: 800 } });
const p = await ctx.newPage();
await p.goto('https://test.slatebox.com/start', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(3000);
for (const label of ['Personal Use', 'Consultant', 'Infographic for market analysis']) {
  const el = p.getByText(label, { exact: true }).first();
  try { await el.waitFor({ state: 'visible', timeout: 2500 }); await el.click(); await p.waitForTimeout(1200); } catch {}
}
const seeded = await p.waitForFunction(() => { const i = window.__slateboxInstances; return Array.isArray(i) && i.some(s => s && (s.nodes || s.v2)); }, { timeout: 90000 }).then(() => true).catch(() => false);
console.log('canvas:', seeded);
if (seeded) {
  await p.waitForTimeout(4000);
  await p.mouse.dblclick(300, 600);
  await p.waitForTimeout(2500);
  const state = await p.evaluate(() => {
    const drawers = Array.from(document.querySelectorAll('[role="presentation"]')).filter(e => e.querySelector('.MuiTabs-root'));
    if (!drawers.length) return 'NO DRAWER';
    const r = drawers[drawers.length - 1].getBoundingClientRect();
    const paper = drawers[drawers.length - 1].querySelector('.MuiPaper-root');
    const cs = paper ? getComputedStyle(paper) : null;
    return `drawer w=${r.width|0} radius=${cs ? cs.borderRadius : '?'} shadow=${cs ? cs.boxShadow.slice(0,24) : '?'} bottom=${(800 - r.y - r.height)|0}px`;
  });
  console.log('drawer:', state);
  await p.screenshot({ path: '/tmp/f4b-drawer.png' });
}
await b.close();
