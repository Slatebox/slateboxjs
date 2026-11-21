import { expect, test, type Browser, type Page } from '@playwright/test'
import { openGuestCanvas } from './app-host.shared'
import { dismissWelcome, removeTestGuest, shareAs, userId } from './workshop-guests.shared'
import { register, retire, type Actor } from './agent-principals.shared'
import { card, lane, standing, workshopReady } from './app-native-workshop.shared'

/**
 * What the owner found on test.slatebox.com (2026-11-21), each in the running Meteor app:
 * the style bar's text alignment, the line under a workshop board, the people at the foot of the
 * canvas, the header's Ask Slatebox, Export and Embed twice over, and two side panels at once.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')

const header = (page: Page) => page.locator('.sb-board-toolbar')
const slateMenu = (page: Page) => header(page).getByRole('button', { name: /slate menu$/ })
const askToggle = (page: Page) => page.locator('[data-conversation-toggle]').first()
const askPanel = (page: Page) => page.getByRole('complementary', { name: 'Ask Slatebox' })
const settingsPanel = (page: Page) => page.getByRole('complementary', { name: 'Slate settings' })
const noteNamed = (page: Page, text: string) => page.locator('#slateCanvas [data-node-id]').filter({ hasText: text }).first()
const bar = (page: Page) => page.getByRole('toolbar', { name: 'Note', exact: true })

async function guestAt(browser: Browser, width = 1440, height = 900) {
  // A context of its own, so a second tab of the same guest can be opened in it.
  const page = await (await browser.newContext({ viewport: { width, height } })).newPage()
  await openGuestCanvas(page, origin.origin)
  const cookies = page.getByRole('button', { name: 'Accept cookies' })
  if (await cookies.isVisible().catch(() => false)) await cookies.click()
  await expect.poll(() => userId(page)).toBeTruthy()
  return { page, id: await userId(page) }
}

/** Where a note's text sits inside the note, in the note's own (unrotated) frame. */
const textPlace = (page: Page, text: string) => page.evaluate((text) => {
  const n = (window as any).slate.v2.getAllNodes().find((n: any) => n.options.text === text)
  const t = n.textElement.node.getBBox()
  const { width, height } = n.options
  return { x: n.options.textXAlign, y: n.options.textYAlign, left: t.x, right: width - t.x - t.width, top: t.y, bottom: height - t.y - t.height }
}, text)

async function alignWith(page: Page, name: string) {
  const pop = page.locator('#sb-pop-align')
  if (!(await pop.isVisible().catch(() => false))) await bar(page).getByRole('button', { name: 'Alignment' }).click()
  await pop.getByRole('radio', { name, exact: true }).click()
  await expect(pop.getByRole('radio', { name, exact: true })).toHaveAttribute('aria-checked', 'true')
}

test('text alignment: all six choices move the text of a plain and a rotated, wrapped note; undone, saved and on a second screen', async ({ browser }) => {
  const { page, id } = await guestAt(browser)
  try {
    const close = askPanel(page).getByRole('button', { name: 'Close conversation' })
    if (await close.isVisible().catch(() => false)) await close.click()
    const long = 'a longer note that wraps across several lines'
    await page.mouse.dblclick(420, 640)
    await page.keyboard.type(long)
    await page.keyboard.press('Enter')
    await expect(noteNamed(page, 'a longer note')).toBeVisible()
    await page.evaluate((t) => (window as any).slate.v2.getAllNodes().find((n: any) => n.options.text === t).setRotation(25), long)

    for (const text of ['Welcome!', long]) {
      const box = (await noteNamed(page, text.split(' ')[0] === 'a' ? 'a longer note' : text).boundingBox())!
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
      await expect(bar(page)).toBeVisible()
      const centred = await textPlace(page, text)
      await alignWith(page, 'Left')
      await expect.poll(async () => (await textPlace(page, text)).left).toBeLessThan(centred.left - 4)
      expect((await textPlace(page, text)).x).toBe('left')
      await alignWith(page, 'Right')
      await expect.poll(async () => (await textPlace(page, text)).right).toBeLessThan(centred.right - 4)
      expect((await textPlace(page, text)).x).toBe('right')
      await alignWith(page, 'Centre')
      await expect.poll(async () => Math.abs((await textPlace(page, text)).left - centred.left)).toBeLessThan(1.5)
      await alignWith(page, 'Top')
      await expect.poll(async () => (await textPlace(page, text)).top).toBeLessThan(centred.top - 2)
      await alignWith(page, 'Bottom')
      // The whole block stays inside the note: its last line, not its first, is at the bottom.
      await expect.poll(async () => (await textPlace(page, text)).bottom).toBeLessThan(centred.bottom - 2)
      const bottom = await textPlace(page, text)
      expect(bottom.bottom).toBeGreaterThan(-1)
      expect(bottom.top).toBeGreaterThan(0)
      await alignWith(page, 'Middle')
      await expect.poll(async () => Math.abs((await textPlace(page, text)).top - centred.top)).toBeLessThan(1.5)
      await page.keyboard.press('Escape')
    }

    // Undo takes back an alignment; a second screen and a reload show it.
    const box = (await noteNamed(page, 'Welcome!').boundingBox())!
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    await alignWith(page, 'Right')
    await page.keyboard.press('Escape')
    await page.mouse.click(40, 860)
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(async () => (await textPlace(page, 'Welcome!')).x).not.toBe('right')
    await page.keyboard.press('ControlOrMeta+Shift+z')
    await expect.poll(async () => (await textPlace(page, 'Welcome!')).x).toBe('right')
    const second = await page.context().newPage()
    await second.setViewportSize({ width: 1280, height: 800 })
    await second.goto(page.url())
    await dismissWelcome(second)
    await expect(noteNamed(second, 'Welcome!')).toBeVisible()
    await expect.poll(async () => (await textPlace(second, 'Welcome!')).x).toBe('right')
    const right = await textPlace(second, 'Welcome!')
    expect(right.right).toBeLessThan(right.left)
    await second.close()
    await page.waitForTimeout(1200)
    await page.reload()
    await dismissWelcome(page)
    await expect(noteNamed(page, 'Welcome!')).toBeVisible()
    await expect.poll(async () => (await textPlace(page, 'Welcome!')).x).toBe('right')
  } finally { await removeTestGuest(page, id); await page.context().close() }
})

test('a workshop board has no line under it echoing a card: the words are read aloud, and what a move adds shows for a moment', async ({ browser }) => {
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } })
    let id: string | null = null
    try {
      await page.goto(origin.origin + '/workshops?format=map&example=customer-import')
      await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
      id = await userId(page)
      await dismissWelcome(page)
      await workshopReady(page)
      // Still there for a screen reader, but drawn nowhere.
      await expect(standing(page)).toContainText('Customer file · Customer CSV')
      const drawn = await standing(page).evaluate((el) => { const b = el.parentElement!.getBoundingClientRect(); return b.width * b.height })
      expect(drawn).toBeLessThanOrEqual(1)
      await expect(page.locator('.sb-workshop-notice')).toHaveCount(0)
      if (width < 600) continue
      // A card moved into a stop: the stop's outcome shows beside the board, then goes.
      const from = (await card(page, 'batch').boundingBox())!
      const to = (await lane(page, 'import').boundingBox())!
      await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
      await page.mouse.down()
      for (let i = 1; i <= 12; i++) await page.mouse.move(from.x + from.width / 2 + (to.x + to.width / 2 - from.x - from.width / 2) * i / 12,
        from.y + from.height / 2 + (to.y + to.height * 0.75 - from.y - from.height / 2) * i / 12)
      await page.mouse.up()
      await expect(standing(page)).toContainText('Customer file · Import 47 rows')
      const notice = page.locator('.sb-workshop-notice')
      await expect(notice).toContainText('Import 47 rows')
      await expect(notice).not.toContainText('Customer file')
      const box = (await notice.boundingBox())!
      expect(box.width).toBeLessThanOrEqual(420)
      expect(box.height).toBeLessThan(60)
      await expect(notice).toHaveCount(0, { timeout: 9000 })
    } finally { if (id) await removeTestGuest(page, id); await page.close() }
  }
})

test('the people at the foot of the canvas: you once, whatever your tabs; each other person once, told apart', async ({ browser }) => {
  const { page, id } = await guestAt(browser)
  const other = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  let otherId: string | null = null
  try {
    const link = await shareAs(page, 'edit')
    const tab = await page.context().newPage()
    await tab.goto(page.url())
    await tab.locator('#slateCanvas [data-node-id]').first().waitFor()
    const visitor = await other.newPage()
    await visitor.goto(link.href)
    await visitor.waitForURL(/\/canvas\//)
    await dismissWelcome(visitor)
    otherId = await userId(visitor)
    const chips = (p: Page) => p.getByRole('region', { name: 'Huddle' }).locator('.MuiChip-label').allTextContents()
    for (const p of [page, tab]) await expect.poll(() => chips(p), { timeout: 20000 }).toEqual(['You', 'Guest 1'])
    await expect.poll(() => chips(visitor), { timeout: 20000 }).toEqual(['You', 'Guest 1'])
    await expect(header(page).getByRole('button', { name: 'People on this slate: you and 1 other' })).toBeVisible()
  } finally {
    if (otherId) await removeTestGuest(await other.pages()[0], otherId).catch(() => {})
    await other.close()
    await removeTestGuest(page, id)
    await page.context().close()
  }
})

test('Ask Slatebox toggles every time: after a note\'s Ask, after ×, with the settings open, after a reload, and under a narrow canvas', async ({ browser }) => {
  for (const width of [1440, 390]) {
    const { page, id } = await guestAt(browser, width, width < 600 ? 844 : 900)
    try {
      const toggle = async (open: boolean) => {
        await askToggle(page).click()
        await expect(askPanel(page)).toHaveCount(open ? 1 : 0)
        await expect(askToggle(page)).toHaveAttribute('aria-pressed', String(open))
      }
      if (await askPanel(page).count()) await toggle(false)
      await toggle(true)
      await toggle(false)
      // A note's own Ask Slatebox opens it; the header closes it.
      const box = (await noteNamed(page, 'Welcome!').boundingBox())!
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
      await page.getByRole('toolbar', { name: 'Note', exact: true }).getByRole('button', { name: /Ask Slatebox/ }).click()
      await expect(askPanel(page)).toBeVisible()
      await toggle(false)
      await toggle(true)
      // ×, then the header. From the keyboard, × hands the keyboard back to the toggle.
      await askPanel(page).getByRole('button', { name: 'Close conversation', exact: true }).focus()
      await page.keyboard.press('Enter')
      await expect(askPanel(page)).toHaveCount(0)
      await expect(askToggle(page)).toBeFocused()
      await toggle(true)
      // One side panel at a time: the settings close Ask Slatebox and take the keyboard...
      await slateMenu(page).click()
      await page.getByRole('menuitem', { name: 'Slate settings', exact: true }).click()
      await expect(settingsPanel(page)).toBeVisible()
      await expect(askPanel(page)).toHaveCount(0)
      await expect(settingsPanel(page)).toBeFocused()
      // ...and Ask Slatebox, opened while they are open, closes them in one press.
      await toggle(true)
      await expect(settingsPanel(page)).toBeHidden()
      // Escape closes the settings and the keyboard goes back to the slate menu.
      await slateMenu(page).click()
      await page.getByRole('menuitem', { name: 'Slate settings', exact: true }).click()
      await expect(settingsPanel(page)).toBeFocused()
      await page.keyboard.press('Escape')
      await expect(settingsPanel(page)).toBeHidden()
      await expect(askPanel(page)).toHaveCount(0)
      await toggle(true)
      // After a reload.
      await page.reload()
      await dismissWelcome(page)
      await expect(noteNamed(page, 'Welcome!')).toBeVisible()
      const open = (await askPanel(page).count()) > 0
      await toggle(!open)
      await toggle(open)
    } finally { await removeTestGuest(page, id); await page.context().close() }
  }
})

test('Export and Embed open from the slate menu only; the slate settings hold neither', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const actor: Actor = { page, email: `staging-ui-${Date.now()}@example.com`, id: null }
  try {
    const key = await register(actor, '/new')
    await page.goto(new URL('/canvas/' + key, origin).href)
    await dismissWelcome(page)
    await header(page).waitFor()
    await slateMenu(page).click()
    await page.getByRole('menuitem', { name: 'Slate settings', exact: true }).click()
    const settings = settingsPanel(page)
    await expect(settings.getByRole('textbox', { name: 'Name' })).toBeVisible()
    await expect(settings.getByRole('button', { name: /Backgrounds/ })).toBeVisible()
    await expect(settings.getByRole('button', { name: /^Export/ })).toHaveCount(0)
    await expect(settings.getByRole('button', { name: /^Embed/ })).toHaveCount(0)
    await settings.getByRole('button', { name: 'Close slate settings' }).click()
    await expect(settings).toBeHidden()

    await slateMenu(page).click()
    await page.getByRole('menuitem', { name: 'Export', exact: true }).click()
    const exportDialog = page.getByRole('dialog', { name: 'Export' })
    await expect(exportDialog.getByRole('button', { name: 'Download PNG' })).toBeVisible()
    await exportDialog.getByRole('button', { name: 'Close' }).click()
    await expect(exportDialog).toHaveCount(0)
    await slateMenu(page).click()
    await page.getByRole('menuitem', { name: 'Embed', exact: true }).click()
    const embedDialog = page.getByRole('dialog', { name: 'Embed' })
    await expect(embedDialog).toContainText('Publish a presentation of this slate')
    await page.keyboard.press('Escape')
    await expect(embedDialog).toHaveCount(0)
    await expect(settingsPanel(page)).toBeHidden()
  } finally { await retire(actor).catch(() => {}); await page.close() }
})
