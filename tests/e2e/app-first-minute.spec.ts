import { expect, test, type Browser, type Page } from '@playwright/test'
import { removeTestGuest, userId } from './workshop-guests.shared'

// The first minute (the app's polish slice 3): a new slate opens on a welcome, not a lone
// "Welcome!" note; "Add a note" puts a note in the middle, ready to write in, and the welcome goes
// (and comes back when the slate is emptied); the minimap waits until the slate is bigger than the
// screen; on a phone Ask Slatebox opens at its top; the library finds the map by "map"; there is one
// way to browse at a time; and the conversation reads as one, anchored at its foot, in sentences.
const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
test.skip(!/localhost|127\.0\.0\.1/.test(origin), 'Creates disposable guests and slates; local app only.')
const at = (path: string) => new URL(path, origin).href

async function fresh(browser: Browser, width = 1440) {
  const phone = width < 600
  const context = await browser.newContext({ viewport: { width, height: phone ? 844 : 900 }, hasTouch: phone, isMobile: phone })
  await context.route('**/*', (route) => /^(https?|wss?):\/\/(localhost|127\.0\.0\.1)[:/]|^(data|blob):/.test(route.request().url()) ? route.continue() : route.abort())
  return { context, page: await context.newPage() }
}

async function newSlate(page: Page) {
  await page.goto(at('/new'))
  await page.waitForURL(/\/canvas\/[a-zA-Z0-9]+$/)
  await expect.poll(() => userId(page)).toBeTruthy()
  const ok = page.getByRole('dialog', { name: /welcome/i }).getByRole('button', { name: 'OK', exact: true })
  if (await ok.waitFor({ timeout: 3000 }).then(() => true, () => false)) await ok.click()
  const cookies = page.getByRole('button', { name: /^(Got it|OK|Accept cookies)$/ }).first()
  if (await cookies.isVisible().catch(() => false)) await cookies.click()
  return (await userId(page))!
}

const welcome = (page: Page) => page.getByRole('region', { name: 'Your slate is ready' })
const panel = (page: Page) => page.getByRole('complementary', { name: 'Ask Slatebox' })
const stored = (page: Page) => page.evaluate(async (shareId) =>
  ((await (window as any).Meteor.callAsync('slates.get', { shareId }))?.slateBase?.nodes ?? []).map((n: any) => n.options.text), new URL(page.url()).pathname.split('/').pop())

test('a new slate opens on its welcome; Add a note writes in the middle, the welcome goes and comes back when the slate is empty', async ({ browser }) => {
  const { context, page } = await fresh(browser)
  let id: string | null = null
  try {
    id = await newSlate(page)
    await expect(welcome(page)).toBeVisible()
    await expect(welcome(page).getByRole('heading', { name: 'Your slate is ready' })).toBeVisible()
    // Nothing on the slate, nothing saved on it: the welcome is not a note.
    await expect(page.locator('#slateCanvas g[data-node-id]')).toHaveCount(0)
    expect(await stored(page)).toEqual([])
    // The minimap waits until something is off screen.
    await expect(page.locator('#slateCanvas')).toHaveAttribute('data-whole-in-view', '')
    await expect(page.locator('.slateboxjs-birdseye')).toBeHidden()
    // Ask Slatebox's first turn has its own cards: no second "Add to this slate" strip under them.
    await expect(panel(page).getByText('What are you working on?')).toBeVisible()
    await expect(panel(page).getByRole('group', { name: 'Add to this slate' })).toHaveCount(0)

    await welcome(page).getByRole('button', { name: 'Add a note' }).click()
    await expect(page.locator('.sb-inline-editor')).toBeVisible()
    await page.keyboard.type('Ship the beta')
    await page.keyboard.press('Enter')
    const note = page.locator('#slateCanvas g[data-node-id]').filter({ hasText: 'Ship the beta' })
    await expect(note).toBeVisible()
    await expect(welcome(page)).toHaveCount(0)
    // In the middle of the canvas, in the default look (white words on the default blue, AA).
    const [box, canvas] = [await note.boundingBox(), await page.locator('#slateCanvas').boundingBox()]
    expect(Math.abs(box!.x + box!.width / 2 - (canvas!.x + canvas!.width / 2))).toBeLessThan(40)
    expect(Math.abs(box!.y + box!.height / 2 - (canvas!.y + canvas!.height / 2))).toBeLessThan(40)
    await expect(note.locator('[data-node-background-path]')).toHaveCSS('fill', 'rgb(64, 112, 154)')
    await expect.poll(() => stored(page)).toEqual(['Ship the beta'])

    // Emptied again, the slate shows its welcome again.
    await page.evaluate(() => { const v2 = (window as any).slate.v2; for (const n of v2.getAllNodes()) v2.removeNode(n.id) })
    await expect(welcome(page)).toBeVisible()
  } finally { await removeTestGuest(page, id); await context.close() }
})

test('the library finds the map by "map" and shows one way to browse; a kept board is said in a sentence, at the foot of the conversation', async ({ browser }) => {
  const { context, page } = await fresh(browser)
  let id: string | null = null
  try {
    id = await newSlate(page)
    await expect(panel(page)).toBeVisible()
    await panel(page).getByRole('button', { name: /^See all/ }).click()
    const library = panel(page).getByRole('region', { name: 'Add to this slate' })
    await expect(library).toBeVisible()
    // The library is the one way to browse while it is open.
    await expect(panel(page).getByRole('group', { name: 'Add to this slate' })).toHaveCount(0)
    // Every group chip is in the panel, none cut off at its edge.
    const right = (await panel(page).boundingBox())!.x + (await panel(page).boundingBox())!.width
    for (const chip of await library.getByRole('group', { name: 'Groups' }).getByRole('button').all()) {
      const chipBox = (await chip.boundingBox())!
      expect(chipBox.x + chipBox.width).toBeLessThanOrEqual(right)
    }
    await library.getByLabel('Search the library or describe what you need').fill('map')
    await expect(library.locator('ul[aria-label="What you can add"] > li').first()).toHaveAttribute('data-entry', 'decision-path')
    await library.getByRole('button', { name: 'Map', exact: true }).click()
    await library.getByLabel('Search the library or describe what you need').fill('')
    await expect(library.locator('ul[aria-label="What you can add"] > li[data-entry="decision-path"]')).toBeVisible()
    await library.getByRole('button', { name: 'All', exact: true }).click()

    await library.getByLabel('Search the library or describe what you need').fill('retro')
    await library.getByRole('button', { name: 'Add Retro', exact: true }).click()
    const keep = panel(page).getByRole('button', { name: 'Keep changes', exact: true })
    await keep.click({ timeout: 25_000 })
    const log = panel(page).getByRole('log', { name: 'Conversation' })
    await expect(log).toContainText('Added a retro: Went well, Change and Try, up to three cards each.', { timeout: 25_000 })
    // A short conversation sits on the message box, as chat does: no empty middle under it.
    const last = log.locator('li').last()
    const history = panel(page).locator('[data-conversation-history]')
    await expect(history).toHaveAttribute('data-conversation-history', 'bottom')
    const [turn, scroller] = [(await last.boundingBox())!, (await history.boundingBox())!]
    expect(scroller.y + scroller.height - (turn.y + turn.height)).toBeLessThan(32)
  } finally { await removeTestGuest(page, id); await context.close() }
})

test('on a phone Ask Slatebox opens at its top, and the welcome above it can be pressed', async ({ browser }) => {
  const { context, page } = await fresh(browser, 390)
  let id: string | null = null
  try {
    id = await newSlate(page)
    await expect(panel(page)).toBeVisible()
    const history = panel(page).locator('[data-conversation-history]')
    await expect(history).toHaveAttribute('data-conversation-history', 'top')
    await expect.poll(() => history.evaluate((el) => el.scrollTop)).toBe(0)
    const question = panel(page).getByText('What are you working on?')
    await expect(question).toBeInViewport()
    // The welcome fits the canvas the sheet leaves, and its button is not under anything.
    const add = welcome(page).getByRole('button', { name: 'Add a note' })
    await expect(add).toBeInViewport()
    const box = (await add.boundingBox())!
    const hit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest('button')?.textContent ?? null, [box.x + box.width / 2, box.y + box.height / 2])
    expect(hit).toContain('Add a note')
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
  } finally { await removeTestGuest(page, id); await context.close() }
})
