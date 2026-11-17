import assert from 'node:assert/strict';
import { chromium } from 'playwright';

// Use an existing test fixture to avoid triggering another provider journey.
const url = new URL(process.env.CANVAS_URL);
assert.ok(/^https:\/\/(test|app)\.slatebox\.com$/.test(url.origin));
assert.ok(/^\/canvas\/[\w-]+$/.test(url.pathname));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1400, height: 800 } });
  await page.goto(url.origin, { waitUntil: 'domcontentloaded' });
  assert.equal(await page.evaluate(() => localStorage.getItem('meteor_token')), null);
  await page.goto(url.href);
  await page.locator('g[data-node-id]').first().click();
  // A click selects the node. Its settings cog opens the actual node drawer.
  await page.locator('.node-tool-cog').first().click();
  await page.waitForFunction(() => [...document.querySelectorAll('.MuiDrawer-paper')].some(paper => {
    const box = paper.getBoundingClientRect();
    return paper.querySelectorAll('[role="tab"]').length >= 6 &&
      getComputedStyle(paper).borderRadius === '12px' &&
      box.left === 12 && box.width === innerWidth - 24 &&
      Math.abs(innerHeight - box.bottom - 12) < 0.1;
  }));
  const chunks = await page.evaluate(async () => {
    const sources = [...document.scripts].map(script => script.src)
      .filter(src => src && new URL(src).origin === location.origin);
    for (const src of sources) {
      const body = await (await fetch(src)).text();
      if (body.includes('calc(100% - 24px)') && body.includes('0 8px 24px rgba(0,0,0,0.28)')) return new URL(src).pathname;
    }
    return null;
  });
  assert.ok(chunks, 'deployed drawer styles missing from shipped chunks');
  await page.screenshot({ path: process.env.SCREENSHOT || '/tmp/slatebox-node-drawer.png' });
  console.log('Node settings drawer verified at 1376px wide, 12px radius and bottom inset.', chunks);
} finally {
  await browser.close();
}
