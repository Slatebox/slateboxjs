import { randomBytes } from 'node:crypto'
import { expect, test } from '@playwright/test'
import { register, retire, type Actor } from './agent-principals.shared'

const appUrl = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'

// About you (the profile a person owns) and free integrations, as a brand-new registered account sees them.
test('About you: add, see, download and remove a fact; integrations need no plan', async ({ browser }) => {
  test.skip(!['localhost', '127.0.0.1', 'test.slatebox.com'].includes(new URL(appUrl).hostname), 'writes: disposable account on test only')
  const context = await browser.newContext({ acceptDownloads: true })
  const page = await context.newPage()
  const actor: Actor = { page, email: `sbx-e2e-${randomBytes(6).toString('hex')}@example.com`, id: null }
  try {
    await register(actor, '/start?empty=1')

    await page.goto(new URL('/profile?tab=about', appUrl).href)
    await expect(page.getByRole('tab', { name: 'About you' })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByText('What Slatebox knows about you', { exact: false })).toBeVisible()
    const toggle = page.getByRole('switch', { name: 'Use what is here to personalize Slatebox' })
    await expect(toggle).toBeChecked()

    const fact = `Plans releases for a team of ${3 + (Date.now() % 5)}`
    const form = page.getByRole('form', { name: 'Add something about you' })
    await form.getByLabel('What Slatebox should know').fill(fact)
    await form.getByRole('button', { name: 'Add' }).click()
    await expect(page.getByText(fact)).toBeVisible()

    // The same fact again is refused in place, and the words stay in the field.
    await form.getByLabel('What Slatebox should know').fill(fact)
    await form.getByRole('button', { name: 'Add' }).click()
    await expect(form.getByText('You already have that one.')).toBeVisible()
    await form.getByLabel('What Slatebox should know').fill('')

    // Stored on the server, for this person only.
    const listed = await page.evaluate(() => (window as any).Meteor.callAsync('profile.facts.list', {}))
    expect(JSON.stringify(listed)).toContain(fact)

    const download = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download' }).click()
    const file = await download
    const body = await (await file.createReadStream())?.toArray()
    expect(Buffer.concat(body || []).toString('utf8')).toContain(fact)

    // Off and on again: the switch is the person's.
    await toggle.click()
    await expect(toggle).not.toBeChecked()
    await toggle.click()
    await expect(toggle).toBeChecked()

    const row = page.getByRole('listitem').filter({ hasText: fact })
    await expect(row).toHaveCount(1)
    await row.getByRole('button', { name: 'Remove' }).click()
    await expect(page.getByRole('listitem').filter({ hasText: fact })).toHaveCount(0)
    await expect(page.getByText(fact)).toHaveCount(0)

    // Integrations: a free account sees the gallery with no plan wall.
    await page.goto(new URL('/integrations', appUrl).href)
    await expect(page.locator('body')).not.toContainText(/Needs Slatebox Pro|Pro ended|Renew Pro|See plans/)
    await expect(page.getByRole('button', { name: 'Connect Google' })).toBeVisible({ timeout: 20_000 })
    await page.getByRole('button', { name: 'Connect an agent' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByText('Linear', { exact: true }).first()).toBeVisible({ timeout: 20_000 })
    await expect(dialog).not.toContainText(/Needs Slatebox Pro|Pro ended|Renew Pro|See plans/)
  } finally {
    await retire(actor)
    await context.close()
  }
})
