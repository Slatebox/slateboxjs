import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:1400}})).newPage();
await p.goto('http://localhost:4111/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
await p.screenshot({ path: '/tmp/home-preview.png', fullPage: true });
await b.close();
