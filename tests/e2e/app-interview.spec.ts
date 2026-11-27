import { randomBytes } from 'node:crypto'
import { expect, test } from '@playwright/test'
import { register, retire, type Actor } from './agent-principals.shared'

const appUrl = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'

// The interview, as a brand-new registered account meets it from About you.
test('the interview asks, proposes facts from the answer, and keeps only what the person keeps', async ({ browser }) => {
  test.skip(!['localhost', '127.0.0.1', 'test.slatebox.com'].includes(new URL(appUrl).hostname), 'writes: disposable account on test only')
  test.setTimeout(240_000)
  const context = await browser.newContext()
  const page = await context.newPage()
  const actor: Actor = { page, email: `sbx-e2e-${randomBytes(6).toString('hex')}@example.com`, id: null }
  try {
    await register(actor, '/start?empty=1')
    await page.goto(new URL('/profile?tab=about', appUrl).href)
    await page.getByRole('button', { name: 'Start a talk with Slatebox' }).click()
    const talk = page.getByRole('tabpanel')
    await expect(page.getByRole('heading', { name: 'Your talk with the agent' })).toBeVisible()
    await expect(talk.first()).toBeVisible()
    console.log('OPENED >>>', (await talk.first().innerText()).slice(0, 800))

    // The first question arrives (or the server says why it cannot ask: that is reported, not hidden).
    const said = talk.first().getByRole('list', { name: 'The conversation' })
    await expect(said).toContainText(/\?|off on this server|No agent model|credits|Pro/, { timeout: 90_000 })
    console.log('FIRST TURN >>>', (await talk.first().innerText()).slice(0, 1200))

    const box = talk.first().getByRole('textbox', { name: 'Message Slatebox' })
    await box.fill('I lead product at a small design studio. We plan releases in Linear and I write the weekly update for clients every Friday.')
    await box.press('Enter')
    const keep = talk.first().getByRole('button', { name: /^Keep/ })
    await expect(keep.first()).toBeVisible({ timeout: 90_000 })
    console.log('PROPOSED >>>', (await talk.first().innerText()).slice(-1200))
    const chip = await keep.first().getAttribute('aria-label')
    await keep.first().click()

    const facts = await page.evaluate(() => (window as any).Meteor.callAsync('profile.facts.list', {}))
    console.log('KEPT >>>', JSON.stringify(facts).slice(0, 800), 'CHIP >>>', chip)
    expect(JSON.stringify(facts)).toMatch(/interview/)
  } finally {
    await retire(actor)
    await context.close()
  }
})
