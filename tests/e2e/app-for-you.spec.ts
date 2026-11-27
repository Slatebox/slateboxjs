import { randomBytes } from 'node:crypto'
import { expect, test } from '@playwright/test'
import { register, retire, type Actor } from './agent-principals.shared'

const appUrl = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'

// For you: ideas made from what a new person told Slatebox, and one built into a slate.
test('For you proposes ideas tied to the person and builds one onto a new private slate', async ({ browser }) => {
  test.skip(!['localhost', '127.0.0.1', 'test.slatebox.com'].includes(new URL(appUrl).hostname), 'writes: disposable account on test only')
  test.setTimeout(300_000)
  const context = await browser.newContext()
  const page = await context.newPage()
  const actor: Actor = { page, email: `sbx-e2e-${randomBytes(6).toString('hex')}@example.com`, id: null }
  try {
    await register(actor, '/start?empty=1')
    await page.goto(new URL('/profile?tab=about', appUrl).href)
    for (const fact of [
      { kind: 'role', text: 'Runs a fantasy football league of twelve friends' },
      { kind: 'routine', text: 'Sets weekly lineups every Thursday and tracks trades on waiver day' },
    ]) await page.evaluate(f => (window as any).Meteor.callAsync('profile.facts.add', f), fact)

    const refreshed = await page.evaluate(async () => {
      const m = (window as any).Meteor
      try { return { ok: await m.callAsync('personal.ideas.refresh', {}) } } catch (e: any) { return { err: `${e?.error} | ${e?.reason || e?.message}` } }
    })
    console.log('IDEAS >>>', JSON.stringify(refreshed).slice(0, 2000))
    expect(refreshed.err, 'refresh refused').toBeUndefined()
    const ideas = (refreshed.ok?.ideas || [])
    expect(ideas.length).toBeGreaterThanOrEqual(3)
    expect(JSON.stringify(ideas)).toMatch(/fantasy|league|lineup|waiver|trade/i)

    // The page shows them, and Build it opens a new slate with the board on it.
    await page.goto(new URL('/', appUrl).href)
    const section = page.getByRole('region', { name: /For you/ }).first()
    await expect(section).toBeVisible({ timeout: 30_000 })
    console.log('SECTION >>>', (await section.innerText()).slice(0, 800))
    await section.getByRole('button', { name: /Build it/ }).first().click()
    await page.waitForURL(/\/canvas\/[a-zA-Z0-9]{10}$/, { timeout: 180_000 })
    await expect(page.locator('#slateCanvas [data-node-id]').first()).toBeVisible({ timeout: 60_000 })
    console.log('BUILT >>>', page.url(), await page.locator('#slateCanvas [data-node-id]').count(), 'nodes')
  } finally {
    await retire(actor)
    await context.close()
  }
})
