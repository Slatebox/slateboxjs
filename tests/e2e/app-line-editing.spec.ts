import { expect, test, type Page } from '@playwright/test'
import { openGuestCanvas } from './app-host.shared'
import { removeTestGuest, userId, dismissWelcome } from './workshop-guests.shared'

/**
 * Editing lines already drawn, in the running Meteor app (owner, 2026-11-21): a selected line
 * shows a handle at each end (hollow circle = follows its note, filled square = pinned to a spot
 * on its edge, diamond = free); dragging an end moves it, onto a note or onto empty canvas; the
 * line bar switches both ends between follow and pinned; the note bar's Line button draws a line
 * from a note without making a note; and the conversation does the same in plain words. Every
 * change is saved, shared with the room and undoable. No padlocks.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')
const shots = process.env.LINE_SHOTS || ''

const engine = (page: Page) => page.evaluate(() => Boolean((window as any).slate?.v2))
const noteNamed = (page: Page, text: string) => page.locator('#slateCanvas [data-node-id]').filter({ hasText: text }).first()
const bar = (page: Page, name: string) => page.getByRole('toolbar', { name, exact: true })

async function openSlate(page: Page) {
  await openGuestCanvas(page, origin.origin)
  const cookies = page.locator('[data-cookie-notice] button')
  if (await cookies.isVisible()) await cookies.click()
  await expect.poll(() => userId(page)).toBeTruthy()
  await expect.poll(() => engine(page)).toBe(true)
  await expect(noteNamed(page, 'Welcome!')).toBeVisible()
  // Ask Slatebox opens beside a new slate a moment after it loads; close it for room.
  const panel = page.getByRole('complementary', { name: 'Ask Slatebox' })
  if (await panel.waitFor({ state: 'visible', timeout: 4000 }).then(() => true, () => false)) {
    await panel.getByRole('button', { name: /close/i }).click()
    await panel.waitFor({ state: 'hidden' })
  }
  return (await userId(page))!
}

async function addNote(page: Page, text: string, x: number, y: number) {
  await page.mouse.dblclick(x, y)
  await page.keyboard.type(text)
  await page.keyboard.press('Enter')
  await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
  await expect(noteNamed(page, text)).toBeVisible()
}

/** Every line on the slate, with the note that holds it and its ends. */
const lines = (page: Page) => page.evaluate(() => {
  const v2 = (window as any).slate.v2
  const text = (id: string) => v2.getNode?.(id)?.options?.text ?? null
  return v2.getAllNodes().flatMap((n: any) => n.relationships.getAssociations().map((a: any) => ({
    id: a.id, from: n.options.text, to: text(a.childId), free: Boolean(a.targetPoint), targetPoint: a.targetPoint ?? null,
    sourceAnchor: a.sourceAnchor ?? null, targetAnchor: a.targetAnchor ?? null,
  })))
})

async function connect(page: Page, from: string, to: string) {
  await page.evaluate(([from, to]) => {
    const v2 = (window as any).slate.v2
    const [a, b] = [from, to].map((t) => v2.getAllNodes().find((n: any) => n.options.text === t))
    a.relationships.addAssociation(b)
  }, [from, to])
  await expect.poll(async () => (await lines(page)).some((l) => l.from === from && l.to === to)).toBe(true)
}

async function selectTheLine(page: Page) {
  const pt = await page.evaluate(() => {
    const p = document.querySelector('#slateCanvas path[connectortype="default"]') as SVGGeometryElement
    const m = p.getPointAtLength(p.getTotalLength() / 2).matrixTransform(p.getScreenCTM()!)
    return { x: m.x, y: m.y }
  })
  await page.mouse.click(pt.x, pt.y)
  await expect(bar(page, 'Line')).toBeVisible()
}

const centre = async (page: Page, selector: string) => {
  const box = (await page.locator(selector).first().boundingBox())!
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

async function drag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }) {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  for (let i = 1; i <= 14; i++) {
    await page.mouse.move(from.x + ((to.x - from.x) * i) / 14, from.y + ((to.y - from.y) * i) / 14)
    await page.waitForTimeout(15)
  }
  await page.mouse.up()
}

async function reload(page: Page) {
  await page.waitForTimeout(1500)
  await page.reload()
  await dismissWelcome(page)
  await expect.poll(() => engine(page)).toBe(true)
  await expect(noteNamed(page, 'Welcome!')).toBeVisible()
}

test.describe('editing a line already drawn', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('its ends have handles, no padlocks; an end dropped on empty canvas stays free, for the room, after undo/redo and a reload', async ({ page }) => {
    let id: string | null = null
    try {
      id = await openSlate(page)
      await addNote(page, 'Beta', 900, 560)
      await connect(page, 'Welcome!', 'Beta')
      // A second tab of the same slate: the room.
      const peer = await page.context().newPage()
      await peer.goto(page.url())
      await dismissWelcome(peer)
      await expect.poll(() => engine(peer)).toBe(true)
      await expect.poll(async () => (await lines(peer)).length).toBe(1)

      await selectTheLine(page)
      await expect(page.locator('#slateCanvas .endpoint-lock')).toHaveCount(0)
      const end = page.locator('#slateCanvas .connector-handle-target')
      await expect(end).toHaveAttribute('aria-label', /End of the line: follows “Beta”/)
      await expect(page.locator('#slateCanvas .connector-handle[role="button"]')).toHaveCount(2)
      if (shots) await page.screenshot({ path: `${shots}/after-line-selected-1440.png` })

      const drop = { x: 700, y: 780 }
      await drag(page, await centre(page, '#slateCanvas .connector-handle-target'), drop)
      await expect.poll(async () => (await lines(page))[0]?.free).toBe(true)
      const [line] = await lines(page)
      expect(line.from).toBe('Welcome!')
      await expect(page.locator('#slateCanvas .connector-handle-glyph[data-end="target"]')).toHaveAttribute('data-state', 'free')
      if (shots) await page.screenshot({ path: `${shots}/after-end-free-1440.png` })
      // The room sees it.
      await expect.poll(async () => (await lines(peer))[0]?.free).toBe(true)

      // Undo puts the end back on Beta; redo frees it again.
      await page.mouse.click(300, 820)
      await page.keyboard.press('ControlOrMeta+z')
      await expect.poll(async () => (await lines(page))[0]?.to).toBe('Beta')
      await page.keyboard.press('ControlOrMeta+Shift+z')
      await expect.poll(async () => (await lines(page))[0]?.free).toBe(true)

      await reload(page)
      const [kept] = await lines(page)
      expect(kept).toMatchObject({ from: 'Welcome!', free: true })
      expect(kept.targetPoint).toEqual(line.targetPoint)
      await peer.close()
    } finally { await removeTestGuest(page, id) }
  })

  test('the bar switches both ends between follow and pinned; a free end dropped on a note attaches', async ({ page }) => {
    let id: string | null = null
    try {
      id = await openSlate(page)
      await addNote(page, 'Beta', 900, 560)
      await addNote(page, 'Gamma', 760, 250)
      await connect(page, 'Welcome!', 'Beta')
      await selectTheLine(page)
      const ends = bar(page, 'Line').getByRole('radiogroup', { name: /^Ends/ })
      await expect(ends.getByRole('radio', { name: 'Ends follow the notes' })).toHaveAttribute('aria-checked', 'true')
      await ends.getByRole('radio', { name: 'Ends pinned' }).click()
      await expect.poll(async () => { const [l] = await lines(page); return Boolean(l.sourceAnchor && l.targetAnchor) }).toBe(true)
      await expect(page.locator('#slateCanvas .connector-handle-glyph[data-end="source"]')).toHaveAttribute('data-state', 'pinned')
      await expect(ends.getByRole('radio', { name: 'Ends pinned' })).toHaveAttribute('aria-checked', 'true')
      if (shots) await page.screenshot({ path: `${shots}/after-ends-pinned-1440.png` })
      await reload(page)
      expect((await lines(page))[0].targetAnchor).not.toBeNull()

      await selectTheLine(page)
      await bar(page, 'Line').getByRole('radio', { name: 'Ends follow the notes' }).click()
      await expect.poll(async () => { const [l] = await lines(page); return [l.sourceAnchor, l.targetAnchor] }).toEqual([null, null])

      // The end onto Gamma's middle: it follows Gamma.
      await drag(page, await centre(page, '#slateCanvas .connector-handle-target'), await centre(page, `#slateCanvas [data-node-id]:has-text("Gamma")`))
      await expect.poll(async () => (await lines(page))[0]?.to).toBe('Gamma')
      expect((await lines(page))[0].targetAnchor).toBeNull()
    } finally { await removeTestGuest(page, id) }
  })

  test("the note bar's Line button draws a line to a note, or to anywhere, without making a note; Esc cancels", async ({ page }) => {
    let id: string | null = null
    try {
      id = await openSlate(page)
      await addNote(page, 'Beta', 900, 560)
      const notes = () => page.evaluate(() => (window as any).slate.v2.getAllNodes().length)
      const before = await notes()
      await page.mouse.click(...Object.values(await centre(page, `#slateCanvas [data-node-id]:has-text("Welcome!")`)) as [number, number])
      const line = bar(page, 'Note').getByRole('button', { name: 'Line', exact: true })
      await expect(line).toBeVisible()
      await line.click()
      await expect(line).toHaveAttribute('aria-pressed', 'true')
      // The canvas says the tool is on, and how to stop it.
      const drawing = page.getByRole('status', { name: 'Drawing a line' })
      await expect(drawing).toBeVisible()
      await expect(drawing.getByRole('button', { name: 'Cancel' })).toBeVisible()
      await page.mouse.move(700, 760)
      await expect(page.locator('#slateCanvas .line-tool-preview')).toHaveCount(1)
      if (shots) await page.screenshot({ path: `${shots}/after-line-tool-1440.png` })
      const beta = await centre(page, `#slateCanvas [data-node-id]:has-text("Beta")`)
      await page.mouse.click(beta.x, beta.y)
      await expect.poll(async () => (await lines(page)).map((l) => `${l.from}>${l.to}`)).toEqual(['Welcome!>Beta'])
      // The new line is selected, ready to edit.
      await expect(bar(page, 'Line')).toBeVisible()
      await expect(drawing).toHaveCount(0)

      await page.mouse.click(...Object.values(await centre(page, `#slateCanvas [data-node-id]:has-text("Welcome!")`)) as [number, number])
      await bar(page, 'Note').getByRole('button', { name: 'Line', exact: true }).click()
      await page.mouse.click(420, 760)
      await expect.poll(async () => (await lines(page)).filter((l) => l.free).length).toBe(1)

      await page.mouse.click(...Object.values(await centre(page, `#slateCanvas [data-node-id]:has-text("Welcome!")`)) as [number, number])
      await bar(page, 'Note').getByRole('button', { name: 'Line', exact: true }).click()
      await page.mouse.move(500, 700)
      await page.keyboard.press('Escape')
      await expect(page.locator('#slateCanvas .line-tool-preview')).toHaveCount(0)
      expect((await lines(page)).length).toBe(2)
      expect(await notes()).toBe(before)
    } finally { await removeTestGuest(page, id) }
  })

  test('the conversation edits lines in plain words: connect, unpin, detach', async ({ page }) => {
    let id: string | null = null
    try {
      id = await openSlate(page)
      await addNote(page, 'sing', 900, 560)
      await addNote(page, 'asfd', 760, 250)
      const ask = async (words: string) => {
        const panel = page.getByRole('complementary', { name: 'Ask Slatebox' })
        if (!(await panel.isVisible().catch(() => false))) await page.getByRole('banner').getByRole('button', { name: 'Ask Slatebox', exact: true }).click()
        await expect(panel).toBeVisible()
        await panel.getByRole('textbox', { name: 'Message Slatebox' }).fill(words)
        await panel.getByRole('button', { name: 'Preview changes' }).click()
        const keep = panel.getByRole('button', { name: 'Keep changes' })
        await expect(keep).toBeEnabled({ timeout: 30_000 })
        // Keeping reloads the canvas.
        await Promise.all([page.waitForEvent('load', { timeout: 30_000 }), keep.click()])
        await dismissWelcome(page)
        await expect.poll(() => engine(page), { timeout: 30_000 }).toBe(true)
        await expect(noteNamed(page, 'asfd')).toBeVisible()
      }
      await ask('connect sing to asfd')
      await expect.poll(async () => (await lines(page)).map((l) => `${l.from}>${l.to}`)).toEqual(['sing>asfd'])
      await ask('pin the line ends')
      await expect.poll(async () => Boolean((await lines(page))[0]?.targetAnchor)).toBe(true)
      await ask('unpin the line ends')
      await expect.poll(async () => (await lines(page))[0]?.targetAnchor ?? null).toBeNull()
      await ask('detach this line from asfd')
      await expect.poll(async () => (await lines(page))[0]?.free).toBe(true)
      expect((await lines(page))[0].from).toBe('sing')
    } finally { await removeTestGuest(page, id) }
  })
})
