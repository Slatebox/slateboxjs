import { expect, test, type Browser, type Page } from '@playwright/test'
import { openGuestCanvas } from './app-host.shared'
import { dismissWelcome, removeTestGuest, shareAs, userId } from './workshop-guests.shared'
import { register, retire, type Actor } from './agent-principals.shared'
import { card, conversation, lane, messageBox, standing, workshopReady, canvasUndo } from './app-native-workshop.shared'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'

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

    // Typing into an aligned note keeps its text where it is drawn: the editor is Left and Bottom too.
    {
      const at = (await noteNamed(page, 'Welcome!').boundingBox())!
      await page.mouse.click(at.x + at.width / 2, at.y + at.height / 2)
      await alignWith(page, 'Left')
      await alignWith(page, 'Bottom')
      await page.keyboard.press('Escape')
      await page.mouse.dblclick(at.x + at.width / 2, at.y + at.height / 2)
      const editor = page.locator('#slateCanvas .sb-inline-editor')
      await expect(editor).toBeVisible()
      expect(await editor.evaluate((el) => { const s = getComputedStyle(el); return [s.textAlign, s.justifyContent, s.alignItems] }))
        .toEqual(['left', 'flex-start', 'flex-end'])
      // The typed text starts at the note's left edge, not its centre.
      const range = await editor.evaluate((el) => { const r = document.createRange(); r.selectNodeContents(el); const b = r.getBoundingClientRect(); const e = el.getBoundingClientRect(); return { left: b.left - e.left, bottom: e.bottom - b.bottom } })
      expect(range.left).toBeLessThan(12)
      expect(range.bottom).toBeLessThan(12)
      await page.keyboard.press('Escape')
      await expect(editor).toHaveCount(0)
      await page.mouse.click(at.x + at.width / 2, at.y + at.height / 2)
      await alignWith(page, 'Centre')
      await alignWith(page, 'Middle')
      await page.keyboard.press('Escape')
    }

    // Undo takes back an alignment; a second screen and a reload show it.
    const box = (await noteNamed(page, 'Welcome!').boundingBox())!
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    await alignWith(page, 'Right')
    await page.keyboard.press('Escape')
    // Empty canvas, clear of the Undo and Redo controls in its bottom-left corner.
    await page.mouse.click(40, 700)
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
      // Taken back before the notice goes: the card is no longer at that stop, so the notice no longer
      // names it. The newest change wins: it says what the stop the card is back at says.
      await canvasUndo(page).click()
      await expect(standing(page)).toContainText('Customer file · Customer CSV')
      await expect(notice).not.toContainText('Import 47 rows', { timeout: 1500 })
      await expect(notice).toContainText('Customer CSV')
      // Moved there again, and left alone: it goes after its time.
      await expect(page.getByRole('group', { name: 'Workshop' }).getByText('Saving…')).toHaveCount(0)
      const again = (await card(page, 'batch').boundingBox())!
      await page.mouse.move(again.x + again.width / 2, again.y + again.height / 2)
      await page.mouse.down()
      for (let i = 1; i <= 12; i++) await page.mouse.move(again.x + again.width / 2 + (to.x + to.width / 2 - again.x - again.width / 2) * i / 12,
        again.y + again.height / 2 + (to.y + to.height * 0.75 - again.y - again.height / 2) * i / 12)
      await page.mouse.up()
      await expect(standing(page)).toContainText('Customer file · Import 47 rows')
      await expect(notice).toContainText('Import 47 rows')
      await expect(notice).toHaveCount(0, { timeout: 9000 })
    } finally { if (id) await removeTestGuest(page, id); await page.close() }
  }
})

test('placement outcomes, drawn nowhere on the board, are listed from an Outcomes button at any time, also after a reload', async ({ page }) => {
  const board: Workshop = {
    version: 1, title: 'Owner check',
    lanes: [{ id: 'notes', label: 'Interview notes' }, { id: 'test', label: 'Prototype test' }],
    cards: [{ id: 'owner', label: 'Owner', laneId: 'notes' }],
    signals: [{ id: 'who', label: 'Owner', cardId: 'owner', laneId: 'test',
      whenPresent: 'Mara will test whether Jo can import a list.', whenAbsent: 'Still in the interview notes.' }],
  }
  let id: string | null = null
  try {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(new URL('/new/workshop' + encodeWorkshopFragment(board), origin).href)
    await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    id = await userId(page)
    await dismissWelcome(page)
    await workshopReady(page)
    for (const pass of [1, 2]) {
      const outcomes = page.locator('.sb-workshop-outcomes').getByRole('button', { name: 'Outcomes (1)' })
      await expect(outcomes).toBeVisible()
      await expect(outcomes).toHaveAttribute('aria-expanded', 'false')
      await outcomes.click()
      const list = page.getByRole('list', { name: 'Outcomes on this board' })
      await expect(list).toBeVisible()
      await expect(list).toContainText('Owner — Still in the interview notes.')
      await outcomes.click()
      await expect(list).toHaveCount(0)
      if (pass === 1) { await page.reload(); await dismissWelcome(page); await workshopReady(page) }
    }
  } finally { if (id) await removeTestGuest(page, id) }
})

test('the people at the foot of the canvas: you once, whatever your tabs; each other person once, told apart', async ({ browser }) => {
  const { page, id } = await guestAt(browser)
  const other = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  let otherId: string | null = null
  let thirdId: string | null = null
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
    const guestName = /^[A-Z][a-z]+ [A-Z][a-z]+ \(guest\)$/
    // The owner's two tabs are one person; each sees You and the visitor, by the visitor's name.
    await expect.poll(async () => (await chips(page)).length, { timeout: 20000 }).toBe(2)
    const [, visitorName] = await chips(page)
    expect(visitorName).toMatch(guestName)
    await expect.poll(() => chips(tab), { timeout: 20000 }).toEqual(['You', visitorName])
    await expect.poll(async () => (await chips(visitor)).length, { timeout: 20000 }).toBe(2)
    const [, ownerName] = await chips(visitor)
    expect(ownerName).toMatch(guestName)
    expect(ownerName).not.toBe(visitorName)
    await expect(header(page).getByRole('button', { name: 'People on this slate: you and 1 other' })).toBeVisible()
    // A third viewer calls each of them by the same name the others do.
    const third = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
    try {
      await third.goto(link.href)
      await third.waitForURL(/\/canvas\//)
      await dismissWelcome(third)
      thirdId = await userId(third)
      await expect.poll(async () => (await chips(third)).slice(1).sort(), { timeout: 20000 }).toEqual([ownerName, visitorName].sort())
      // The name on a person's pointer is the same name.
      await visitor.mouse.move(500, 400)
      await visitor.mouse.move(520, 420, { steps: 5 })
      await expect(third.locator('#slateCanvas text').filter({ hasText: visitorName })).toHaveCount(1, { timeout: 15000 })
      await expect(page.locator('#slateCanvas text').filter({ hasText: visitorName })).toHaveCount(1, { timeout: 15000 })
    } finally {
      if (thirdId) await removeTestGuest(third, thirdId).catch(() => {})
      await third.context().close()
    }
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
      // Escape closes the settings and the keyboard goes back to the slate menu. They only covered
      // Ask Slatebox, so it is back.
      await slateMenu(page).click()
      await page.getByRole('menuitem', { name: 'Slate settings', exact: true }).click()
      await expect(settingsPanel(page)).toBeFocused()
      await page.keyboard.press('Escape')
      await expect(settingsPanel(page)).toBeHidden()
      await expect(slateMenu(page)).toBeFocused()
      await expect(askPanel(page)).toBeVisible()
      await expect(askToggle(page)).toHaveAttribute('aria-pressed', 'true')
      // Closed by the person, the settings opened and closed bring nothing back.
      await toggle(false)
      await slateMenu(page).click()
      await page.getByRole('menuitem', { name: 'Slate settings', exact: true }).click()
      await expect(settingsPanel(page)).toBeVisible()
      await settingsPanel(page).getByRole('button', { name: 'Close slate settings' }).click()
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

test('the settings opened over a preview waiting for Keep only cover it: the preview, Keep and the typed words are there after', async ({ browser }) => {
  for (const width of [1440, 390]) {
    const { page, id } = await guestAt(browser, width, width < 600 ? 844 : 900)
    try {
      if (!(await askPanel(page).count())) await askToggle(page).click()
      await expect(messageBox(page)).toBeVisible({ timeout: 20000 })
      await messageBox(page).fill('Welcome! → Next step')
      await conversation(page).getByRole('button', { name: 'Preview changes', exact: true }).click()
      const keep = conversation(page).getByRole('button', { name: 'Keep changes', exact: true })
      await expect(keep).toBeVisible({ timeout: 20000 })
      const previewed = page.locator('#slateCanvas [data-conversation-preview]')
      const drawn = await previewed.count()
      expect(drawn).toBeGreaterThan(0)
      // The settings take Ask Slatebox's place; the preview stays on the canvas, under the settings' changes.
      await slateMenu(page).click()
      await page.getByRole('menuitem', { name: 'Slate settings', exact: true }).click()
      await expect(settingsPanel(page)).toBeVisible()
      await expect(askPanel(page)).toHaveCount(0)
      await expect(previewed).toHaveCount(drawn)
      // The settings sit beside (or under) the canvas, not over it: the canvas gives them its room.
      const canvas = (await page.locator('#slateCanvas').boundingBox())!
      const panel = (await settingsPanel(page).boundingBox())!
      if (width >= 1000) expect(canvas.x + canvas.width).toBeLessThanOrEqual(panel.x + 1)
      else expect(canvas.y + canvas.height).toBeLessThanOrEqual(panel.y + 1)
      await settingsPanel(page).getByRole('button', { name: 'Close slate settings' }).click()
      // Back as it was: Keep is offered and the preview is drawn.
      await expect(askPanel(page)).toBeVisible()
      await expect(keep).toBeEnabled()
      await expect(previewed).toHaveCount(drawn)
      // Words typed and not sent stay too.
      await conversation(page).getByRole('button', { name: 'Discard preview', exact: true }).click()
      await messageBox(page).fill('add three steps for onboarding')
      await slateMenu(page).click()
      await page.getByRole('menuitem', { name: 'Slate settings', exact: true }).click()
      await expect(askPanel(page)).toHaveCount(0)
      await askToggle(page).click()
      await expect(settingsPanel(page)).toBeHidden()
      await expect(messageBox(page)).toHaveValue('add three steps for onboarding')
      // Closed by the person, Ask Slatebox lets go of what it held.
      await askPanel(page).getByRole('button', { name: 'Close conversation', exact: true }).click()
      await askToggle(page).click()
      await expect(messageBox(page)).toHaveValue('')
    } finally { await removeTestGuest(page, id); await page.context().close() }
  }
})

test('Export or Embed left open does not follow to another slate', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const actor: Actor = { page, email: `staging-ui-out-${Date.now()}@example.com`, id: null }
  try {
    const first = await register(actor, '/new?empty=1')
    await page.goto(new URL('/canvas/' + first, origin).href)
    await dismissWelcome(page)
    await page.goto(new URL('/new?empty=1', origin).href)
    await page.waitForURL(/\/canvas\/[a-zA-Z0-9]+$/)
    await dismissWelcome(page)
    await slateMenu(page).click()
    await page.getByRole('menuitem', { name: 'Export', exact: true }).click()
    await expect(page.getByRole('dialog', { name: 'Export' })).toBeVisible()
    // To the first slate inside the app, as the browser's back button does: the page is not reloaded.
    await page.evaluate((key) => { history.pushState({}, '', '/canvas/' + key); dispatchEvent(new PopStateEvent('popstate')) }, first)
    await page.waitForURL(new RegExp('/canvas/' + first + '$'))
    await dismissWelcome(page)
    await expect.poll(() => page.evaluate(() => (window as any).slate?.shareId)).toBe(first)
    await page.waitForTimeout(1000)
    await expect(page.getByRole('dialog', { name: 'Export' })).toHaveCount(0)
  } finally { await retire(actor).catch(() => {}); await page.close() }
})

test('Export and Embed open from the slate menu only; the slate settings hold neither', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const actor: Actor = { page, email: `staging-ui-${Date.now()}@example.com`, id: null }
  try {
    const key = await register(actor, '/new?empty=1')
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
