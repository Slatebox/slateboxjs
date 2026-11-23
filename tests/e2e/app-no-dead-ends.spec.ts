import { expect, test, type Browser } from '@playwright/test'
import { randomBytes } from 'node:crypto'
import { retire, type Actor } from './agent-principals.shared'
import { removeTestGuest, userId } from './workshop-guests.shared'

// No dead ends (the app's polish slice 1): an unknown address has a page with a way on; the
// sign-in page creates an account and greets a return; a guest uses Mermaid without being sent to
// the full-page account form; on a phone the cookie notice is one slim line below the canvas bar.
const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
const at = (path: string) => new URL(path, origin).href

async function fresh(browser: Browser, width: number, height = 900) {
  const phone = width < 600
  const context = await browser.newContext({ viewport: { width, height }, hasTouch: phone, isMobile: phone })
  await context.route('**/*', (route) => /^(https?|wss?):\/\/(localhost|127\.0\.0\.1)[:/]|^(data|blob):/.test(route.request().url()) ? route.continue() : route.abort())
  return { context, page: await context.newPage() }
}

test('an unknown address says so and offers a way on, signed out and as a guest', async ({ browser }) => {
  const { context, page } = await fresh(browser, 1440)
  try {
    await page.goto(at('/no-such-page/at-all'))
    await expect(page.getByRole('heading', { name: 'This page isn’t here' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign in', exact: true })).toHaveAttribute('href', '/login')
    await expect(page.getByRole('link', { name: 'Start a new slate', exact: true })).toHaveAttribute('href', '/new')
  } finally { await context.close() }
})

test('Create an account from the sign-in page makes an account; the next sign-in page says Welcome back', async ({ browser }) => {
  const { context, page } = await fresh(browser, 1440)
  const actor: Actor = { page, email: `deadends-${randomBytes(5).toString('hex')}@example.test`, id: null }
  const password = randomBytes(18).toString('hex')
  try {
    await page.goto(at('/login'))
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sign in to Slatebox')
    await expect(page.locator('main .MuiButton-contained')).toHaveCount(1)
    await page.getByRole('link', { name: 'Create an account', exact: true }).click()
    const form = page.getByTestId('guest-account-claim')
    await expect(form.getByRole('heading', { name: 'Create your account' })).toBeVisible({ timeout: 20000 })
    await expect(page).toHaveURL(at('/'))
    actor.id = await userId(page)
    await form.getByLabel('Email address').fill(actor.email)
    await form.locator('input[type=password]').fill(password)
    await form.getByRole('button', { name: 'Create account', exact: true }).click()
    await page.waitForFunction((email) => (window as any).Meteor?.user()?.emails?.[0]?.address === email, actor.email)
    expect(await page.evaluate(() => (window as any).Meteor.user()?.isAnonymous)).toBe(false)
    await page.evaluate(() => new Promise((resolve) => (window as any).Meteor.logout(resolve)))
    await page.goto(at('/login'))
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Welcome back.')
    await page.getByLabel('Email address').fill(actor.email)
    await page.getByLabel(/^Password/).fill(password)
    await page.getByRole('button', { name: 'Sign in', exact: true }).click()
    await expect.poll(() => userId(page)).toBe(actor.id)
  } finally {
    await retire(actor).catch(() => undefined)
    await context.close()
  }
})

for (const width of [1440, 390]) test(`${width}px: a guest opens Mermaid from the slate menu; a new slate from it asks to save, inside the dialog`, async ({ browser }) => {
  const { context, page } = await fresh(browser, width, width < 600 ? 844 : 900)
  let id: string | null = null
  try {
    await page.goto(at('/new'))
    await page.waitForURL(/\/canvas\/[a-zA-Z0-9]+$/)
    await expect.poll(() => userId(page)).toBeTruthy()
    id = await userId(page)
    const ok = page.getByRole('dialog', { name: /welcome/i }).getByRole('button', { name: 'OK', exact: true })
    if (await ok.waitFor({ timeout: 4000 }).then(() => true, () => false)) await ok.click()
    if (width < 600) {
      // The cookie notice is one slim line, below the canvas bar and + Add.
      const notice = (await page.locator('.sb-cookie').boundingBox())!
      const bar = (await page.getByRole('region', { name: 'Slate tools' }).boundingBox())!
      expect(notice.height).toBeLessThanOrEqual(44)
      expect(notice.y).toBeGreaterThanOrEqual(bar.y + bar.height)
    }
    await page.getByRole('button', { name: /slate menu/i }).first().click()
    await page.getByRole('menuitem', { name: /^Mermaid/ }).click()
    const dialog = page.getByRole('dialog', { name: 'Mermaid' })
    await expect(dialog).toBeVisible({ timeout: 20000 })
    await expect(page.getByTestId('guest-account-claim')).toHaveCount(0)
    await expect(dialog.getByTestId('mermaid-text')).toBeVisible()
    await dialog.getByRole('tab', { name: 'Import' }).click()
    await dialog.getByRole('textbox', { name: 'Mermaid to import' }).fill('flowchart LR\n  idea["An idea"] --> plan["A plan"]')
    await expect(dialog.getByRole('button', { name: 'Add to this slate' })).toBeEnabled()
    await expect(dialog.getByRole('button', { name: 'Open as a new slate' })).toHaveCount(0)
    await expect(dialog.getByText('Save your work to open a diagram as a slate of its own')).toBeVisible()
    await dialog.getByRole('button', { name: 'Save your work', exact: true }).click()
    await expect(dialog).toBeHidden()
    await expect(page.getByTestId('guest-account-claim').getByRole('heading', { name: 'Save your work' })).toBeVisible()
  } finally {
    await page.keyboard.press('Escape').catch(() => undefined)
    await removeTestGuest(page, id).catch(() => undefined)
    await context.close()
  }
})
