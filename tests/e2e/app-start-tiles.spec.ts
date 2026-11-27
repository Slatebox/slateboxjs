import { expect, test } from '@playwright/test'

const appUrl = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'

// Talk it through with Slatebox on the start page (a guest), a plan of boards, Build it onto one slate,
// and the tile it leaves under Yours opening another copy with no model.
test('a guest talks it through, builds the plan onto a slate, and the tile makes another', async ({ page }) => {
  test.skip(!['localhost', '127.0.0.1', 'test.slatebox.com'].includes(new URL(appUrl).hostname), 'writes: disposable guest on test only')
  test.setTimeout(420_000)
  let owner: string | null = null
  try {
    await page.goto(new URL('/new?talk=1', appUrl).href)
    const talk = page.getByRole('heading', { name: 'Talk it through with Slatebox' })
    await expect(talk).toBeVisible({ timeout: 30_000 })
    const box = page.getByRole('textbox', { name: /Message Slatebox|Answer in your own words/ }).first()
    const list = page.getByRole('list', { name: 'The conversation' })
    const answers = [
      'I run a fantasy football league for twelve friends and want one place for the season.',
      'Weekly lineups lock Thursday night; waivers clear Wednesday morning; we trade any time before week 10.',
      'Twelve teams, each with QB, two RB, two WR, TE, FLEX and six bench spots.',
    ]
    for (const said of answers) {
      await box.fill(said)
      await box.press('Enter')
      await expect(list).toContainText(said.slice(0, 30))
      await expect(page.getByText(/thinking|reading your answer/i)).toHaveCount(0, { timeout: 90_000 })
    }
    owner = await page.evaluate(() => (window as any).Meteor.userId())
    const build = page.locator('[data-start-build]')
    if (!(await build.count())) await page.getByRole('button', { name: 'Make my plan now' }).click()
    await expect(build.first()).toBeVisible({ timeout: 120_000 })
    console.log('PLAN >>>', (await page.getByRole('list', { name: 'The boards it makes' }).first().innerText()).slice(0, 800))
    await build.first().click()
    await page.waitForURL(/\/canvas\/[a-zA-Z0-9]{10}$/, { timeout: 240_000 })
    const first = page.url()
    await expect(page.locator('#slateCanvas [data-node-id]').first()).toBeVisible({ timeout: 60_000 })
    console.log('BUILT >>>', first, await page.locator('#slateCanvas [data-node-id]').count(), 'nodes')

    // The tile under Yours makes another, with no model, onto a new slate.
    await page.goto(new URL('/new', appUrl).href)
    const yours = page.getByRole('list', { name: 'Your tiles' })
    await expect(yours).toBeVisible({ timeout: 30_000 })
    console.log('TILES >>>', (await yours.innerText()).slice(0, 400))
    const t0 = Date.now()
    await yours.getByRole('button', { name: /Make another/ }).first().click()
    await page.waitForURL(u => /\/canvas\/[a-zA-Z0-9]{10}$/.test(u.toString()) && u.toString() !== first, { timeout: 60_000 })
    await expect(page.locator('#slateCanvas [data-node-id]').first()).toBeVisible({ timeout: 60_000 })
    console.log('ANOTHER >>>', page.url(), `${Date.now() - t0} ms`)
  } finally {
    if (owner) await page.evaluate(() => (window as any).Meteor.callAsync('users.delete')).catch(() => {})
  }
})
