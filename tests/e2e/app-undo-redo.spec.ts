import { expect, test, type Browser, type Page } from '@playwright/test'
import { openGuestCanvas } from './app-host.shared'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'

// First-class undo and redo in the app: an Undo and a Redo control on every slate (a pill at the
// canvas's bottom-left from a tablet up, a column at the left on a phone), Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z
// and Ctrl+Y, each person's own steps only, saved through the save core and seen by everyone in the
// room. Screenshots of the controls go to SLATEBOX_UNDO_SHOTS when it is set.

const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
const writable = ['localhost', '127.0.0.1'].includes(new URL(origin).hostname)
const shots = process.env.SLATEBOX_UNDO_SHOTS || ''

const undoButton = (page: Page) => page.getByRole('group', { name: 'Undo and redo' }).getByRole('button', { name: 'Undo', exact: true })
const redoButton = (page: Page) => page.getByRole('group', { name: 'Undo and redo' }).getByRole('button', { name: 'Redo', exact: true })
const shareKey = (page: Page) => new URL(page.url()).pathname.split('/').pop()!
const texts = (page: Page) => page.evaluate(() => (window as any).slate.v2.getAllNodes().map((n: any) => n.options.text).sort())
const storedTexts = async (page: Page) => ((await getSlate(page, shareKey(page)))?.nodes ?? []).map((n: any) => n.options.text).sort()

/** A note made as the welcome's "Add a note" makes one: an edit of this person's own. */
async function addNote(page: Page, text: string, dy = 0) {
  await page.evaluate(({ text, dy }) => {
    const v2 = (window as any).slate.v2
    const box = document.getElementById('slateCanvas')!.getBoundingClientRect()
    const at = v2.canvas.point(box.left + box.width / 2, box.top + box.height / 3)
    v2.addNode({ x: Math.round(at.x - 80), y: Math.round(at.y - 34 + dy), width: 160, height: 68, text, shape: 'roundedrectangle' })
  }, { text, dy })
  await expect.poll(() => texts(page)).toContain(text)
  // The step is recorded once the burst's pause has passed.
  await page.waitForTimeout(700)
}

/** The text of a note changed as the editor changes it on Enter. */
async function retype(page: Page, from: string, to: string) {
  await page.evaluate(({ from, to }) => {
    const node = (window as any).slate.v2.getAllNodes().find((n: any) => n.options.text === from)
    const pkg = [{ type: 'onNodeTextChanged', data: { id: node.id, text: to } }]
    ;(window as any).slate.collab.invoke(pkg)
    ;(window as any).slate.collab.send(pkg)
  }, { from, to })
  await page.waitForTimeout(700)
}

async function closeConversation(page: Page) {
  const chat = page.getByRole('complementary', { name: 'Ask Slatebox' })
  const close = chat.getByRole('button', { name: /close/i }).first()
  if (await close.isVisible().catch(() => false)) await close.click()
}

async function guestPair(browser: Browser) {
  const ownerContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const owner = await ownerContext.newPage()
  await openGuestCanvas(owner, origin)
  await closeConversation(owner)
  const invite = await shareAs(owner, 'edit')
  await owner.keyboard.press('Escape')
  const peerContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const peer = await peerContext.newPage()
  await peer.goto(invite.href)
  await dismissWelcome(peer)
  await peer.waitForFunction(() => Boolean((window as any).slate?.v2?.canvas))
  await expect.poll(() => texts(peer)).toContain('Welcome!')
  await closeConversation(peer)
  return { owner, peer, ownerContext, peerContext }
}

for (const [width, height, name] of [[1440, 900, 'desktop'], [390, 844, 'phone']] as const) {
  test(`the ${name} canvas has Undo and Redo controls that take back and redo this person's steps, saved`, async ({ browser }) => {
    test.skip(!writable, 'Creates a disposable guest slate')
    const phone = width < 600
    const context = await browser.newContext({ viewport: { width, height }, isMobile: phone, hasTouch: phone })
    const page = await context.newPage()
    let uid: string | null = null
    try {
      await openGuestCanvas(page, origin)
      uid = await userId(page)
      await closeConversation(page)
      await expect(undoButton(page)).toBeVisible()
      await expect(redoButton(page)).toBeDisabled()
      // The control sits inside the canvas, clear of the zoom control: bottom-left on a wide screen, a column at the left on a phone.
      const group = await page.getByRole('group', { name: 'Undo and redo' }).boundingBox()
      const canvasBox = await page.locator('#slateCanvas').boundingBox()
      expect(group!.x - canvasBox!.x).toBeLessThan(24)
      expect(canvasBox!.y + canvasBox!.height - (group!.y + group!.height)).toBeLessThan(phone ? 400 : 40)
      if (phone) expect(group!.height).toBeGreaterThan(group!.width)

      await addNote(page, 'Second note', 90)
      await expect(undoButton(page)).toBeEnabled()
      if (shots) await page.screenshot({ path: `${shots}/app-undo-redo-${width}.png` })

      if (phone) await undoButton(page).tap()
      else await undoButton(page).click()
      await expect.poll(() => texts(page)).toEqual(['Welcome!'])
      await expect(redoButton(page)).toBeEnabled()
      // Saved through the save core: the stored slate lost the note too.
      await expect.poll(() => storedTexts(page)).toEqual(['Welcome!'])

      if (phone) await redoButton(page).tap()
      else await redoButton(page).click()
      await expect.poll(() => texts(page)).toEqual(['Second note', 'Welcome!'])
      await expect.poll(() => storedTexts(page)).toEqual(['Second note', 'Welcome!'])

      if (!phone) {
        // The keyboard: Ctrl+Z, then Ctrl+Shift+Z, and Ctrl+Z, then Ctrl+Y.
        await page.locator('#slateCanvas').click({ position: { x: 300, y: 120 } })
        await page.keyboard.press('Control+Z')
        await expect.poll(() => texts(page)).toEqual(['Welcome!'])
        await page.keyboard.press('Control+Shift+Z')
        await expect.poll(() => texts(page)).toEqual(['Second note', 'Welcome!'])
        await page.keyboard.press('Meta+Z')
        await expect.poll(() => texts(page)).toEqual(['Welcome!'])
        await page.keyboard.press('Control+Y')
        await expect.poll(() => texts(page)).toEqual(['Second note', 'Welcome!'])
        // A new edit clears what could be redone.
        await page.keyboard.press('Control+Z')
        await expect(redoButton(page)).toBeEnabled()
        await addNote(page, 'Third note', 180)
        await expect(redoButton(page)).toBeDisabled()
      }
      // Kept after a reload.
      await page.reload()
      await dismissWelcome(page)
      await page.waitForFunction(() => Boolean((window as any).slate?.v2?.canvas))
      await expect.poll(() => texts(page)).toEqual(phone ? ['Second note', 'Welcome!'] : ['Third note', 'Welcome!'])
    } finally {
      await removeTestGuest(page, uid).catch(() => {})
      await context.close()
    }
  })
}

test("each person's undo takes back only their own steps, in both browsers and in what is saved", async ({ browser }) => {
  test.skip(!writable, 'Creates disposable guest slates')
  const { owner, peer, ownerContext, peerContext } = await guestPair(browser)
  try {
    await addNote(owner, 'Owner idea', 90)
    await expect.poll(() => texts(peer)).toContain('Owner idea')
    await addNote(peer, 'Peer idea', 180)
    await expect.poll(() => texts(owner)).toContain('Peer idea')

    // The owner's undo takes back the owner's note, never the peer's later one.
    await undoButton(owner).click()
    await expect.poll(() => texts(owner)).toEqual(['Peer idea', 'Welcome!'])
    await expect.poll(() => texts(peer)).toEqual(['Peer idea', 'Welcome!'])
    await expect.poll(() => storedTexts(owner)).toEqual(['Peer idea', 'Welcome!'])
    // Redo brings it back everywhere.
    await redoButton(owner).click()
    await expect.poll(() => texts(peer)).toEqual(['Owner idea', 'Peer idea', 'Welcome!'])
    await expect.poll(() => storedTexts(owner)).toEqual(['Owner idea', 'Peer idea', 'Welcome!'])

    // The peer's undo is the peer's: their note goes, the owner's stays.
    await undoButton(peer).click()
    await expect.poll(() => texts(owner)).toEqual(['Owner idea', 'Welcome!'])
    await expect.poll(() => storedTexts(peer)).toEqual(['Owner idea', 'Welcome!'])

    // The owner renames a note, then the peer renames it again: the owner's undo has nothing of theirs
    // to take back there, says so, and takes back the owner's step before it instead.
    await retype(owner, 'Welcome!', 'Owner title')
    await expect.poll(() => texts(peer)).toContain('Owner title')
    await retype(peer, 'Owner title', 'Peer title')
    await expect.poll(() => texts(owner)).toContain('Peer title')
    await undoButton(owner).click()
    await expect(owner.locator('[data-undo-notice]')).toContainText('Someone else changed that since')
    await expect.poll(() => texts(owner)).toEqual(['Peer title'])
    await expect.poll(() => texts(peer)).toEqual(['Peer title'])
    await expect.poll(() => storedTexts(peer)).toEqual(['Peer title'])
  } finally {
    await removeTestGuest(peer, await userId(peer)).catch(() => {})
    await removeTestGuest(owner, await userId(owner)).catch(() => {})
    await ownerContext.close()
    await peerContext.close()
  }
})

test('a Keep in Ask Slatebox is drawn without a reload and is one step its person can undo; on the other page it is not theirs', async ({ browser }) => {
  test.skip(!writable, 'Creates disposable guest slates')
  const { owner, peer, ownerContext, peerContext } = await guestPair(browser)
  try {
    const marker = await owner.evaluate(() => ((window as any).__undoMarker = Math.random()))
    await owner.getByRole('button', { name: 'Ask Slatebox' }).first().click()
    const chat = owner.getByRole('complementary', { name: 'Ask Slatebox' })
    await chat.getByRole('textbox').fill('Intake → Review → Notify')
    await chat.getByRole('button', { name: 'Preview changes' }).click()
    await chat.getByRole('button', { name: 'Keep changes' }).click()
    await expect.poll(() => texts(owner), { timeout: 20000 }).toEqual(['Intake', 'Notify', 'Review', 'Welcome!'])
    // Drawn in place: the page was not reloaded.
    expect(await owner.evaluate(() => (window as any).__undoMarker)).toBe(marker)
    await expect.poll(() => texts(peer)).toEqual(['Intake', 'Notify', 'Review', 'Welcome!'])
    // On the peer's page the kept notes are not the peer's to undo.
    await expect(undoButton(peer)).toBeDisabled()

    // One undo takes back the whole Keep, saved, and seen by the peer; redo brings it back.
    await undoButton(owner).click()
    await expect.poll(() => texts(owner)).toEqual(['Welcome!'])
    await expect.poll(() => storedTexts(owner)).toEqual(['Welcome!'])
    await expect.poll(() => texts(peer)).toEqual(['Welcome!'])
    await redoButton(owner).click()
    await expect.poll(() => storedTexts(owner)).toEqual(['Intake', 'Notify', 'Review', 'Welcome!'])
    await expect.poll(() => texts(peer)).toEqual(['Intake', 'Notify', 'Review', 'Welcome!'])
    // The owner's page goes on saving its own edits after the Keep.
    await addNote(owner, 'After the keep', 220)
    await expect.poll(() => storedTexts(peer)).toContain('After the keep')
  } finally {
    await removeTestGuest(peer, await userId(peer)).catch(() => {})
    await removeTestGuest(owner, await userId(owner)).catch(() => {})
    await ownerContext.close()
    await peerContext.close()
  }
})
