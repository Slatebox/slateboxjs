import { expect, test, type Locator, type Page } from '@playwright/test'
import { dismissWelcome, removeTestGuest, userId } from './workshop-guests.shared'
import { conversation, messageBox, workshopReady } from './app-native-workshop.shared'

// A request in the conversation is shown on the canvas before it is kept: native notes and
// connectors, marked as a preview, that nobody can move, select or save. Keep makes them the
// slate's own notes where the preview stood; Discard takes them away. The message box stays at
// the foot of the panel throughout, disabled with its reason while a preview waits.

const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
const writable = ['localhost', '127.0.0.1', 'test.slatebox.com'].includes(new URL(origin).hostname)
const previewNotes = (page: Page) => page.locator('#slateCanvas [data-conversation-preview]')
const previewNote = (page: Page, text: string) => previewNotes(page).filter({ hasText: text })
const caption = (page: Page) => page.locator('#slateCanvas [data-node-id="preview-caption"]')
const composer = (page: Page) => conversation(page).getByRole('form', { name: 'Message Slatebox' })
const reason = (page: Page) => composer(page).getByRole('status')
const button = (page: Page, name: string) => conversation(page).getByRole('button', { name, exact: true })

/** The document the page would save: never a preview note, never a line to one. */
const savedIds = (page: Page) => page.evaluate(() => {
  const nodes = JSON.parse((window as any).slate.exportJSON()).nodes
  return nodes.flatMap((n: any) => [n.options.id, ...(n.relationships?.associations ?? []).flatMap((a: any) => [a.parentId, a.childId])]) as string[]
})

/** The message box is the last thing in the panel and sits at its foot, whatever is above it. */
async function pinned(page: Page) {
  const panel = await conversation(page).boundingBox()
  const box = await composer(page).boundingBox()
  expect(panel && box).toBeTruthy()
  const viewport = page.viewportSize()!
  const panelBottom = Math.min(panel!.y + panel!.height, viewport.height)
  expect(box!.y + box!.height, 'the message box ends at the foot of the panel').toBeGreaterThan(panelBottom - 32)
  expect(box!.y + box!.height).toBeLessThanOrEqual(panelBottom + 1)
  await expect(messageBox(page)).toBeInViewport()
}

async function disabledFor(page: Page, why: RegExp) {
  await expect(messageBox(page)).toBeVisible()
  await expect(messageBox(page)).toBeDisabled()
  await expect(reason(page)).toHaveText(why)
  // The reason is the box's accessible description, so a screen reader hears why it is off.
  await expect(messageBox(page)).toHaveAccessibleDescription(why)
  await pinned(page)
}

async function enabledAndFocused(page: Page) {
  await expect(messageBox(page)).toBeEnabled()
  await expect(messageBox(page)).toBeFocused()
  await expect(reason(page)).toHaveCount(0)
  await pinned(page)
}

async function newDrawing(page: Page) {
  await page.goto(origin + '/new')
  await page.waitForURL(/\/canvas\/[a-zA-Z0-9]+$/)
  await expect.poll(() => userId(page)).toBeTruthy()
  await dismissWelcome(page)
  if (!await conversation(page).isVisible()) await page.getByRole('button', { name: 'Ask Slatebox', exact: true }).click()
  await expect(messageBox(page)).toBeVisible({ timeout: 20000 })
  guests.set(page, await userId(page))
  return new URL(page.url()).pathname.split('/').pop()!
}
const guests = new WeakMap<Page, string | null>()
const cleanUp = (page: Page) => removeTestGuest(page, guests.get(page) ?? null).catch(() => undefined)

async function ask(page: Page, message: string) {
  await messageBox(page).fill(message)
  await button(page, 'Preview changes').click()
  await expect(button(page, 'Keep changes')).toBeVisible({ timeout: 20000 })
}

/** Nothing on the canvas reacts to a preview note: a press selects nothing and moves nothing. */
async function inert(page: Page, target: Locator) {
  const before = await target.boundingBox()
  const box = before!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2 + 40, { steps: 6 })
  await page.mouse.up()
  expect(await page.evaluate(() => (window as any).slate.v2.getSelectedNodes().map((n: any) => n.id))).toEqual([])
  expect(await target.boundingBox()).toEqual(before)
}

for (const width of [1440, 390]) test(`${width}px: typed steps are previewed on the canvas, discarded, previewed again and kept in place`, async ({ browser }) => {
  test.skip(!writable, 'Creates a disposable guest and private slate')
  const phone = width < 600
  const context = await browser.newContext({ viewport: { width, height: phone ? 844 : 900 }, hasTouch: phone, reducedMotion: 'reduce' })
  const page = await context.newPage()
  try {
    const key = await newDrawing(page)
    await pinned(page)
    const stored = () => page.evaluate(async id => (await (window as any).Meteor.callAsync('slates.get', { shareId: id })).slateBase.nodes, key)
    const original = await stored()
    const first = original.find((n: any) => n.options.text)?.options.text as string
    expect(first, 'a new slate has a named note to continue from').toBeTruthy()

    await ask(page, first + ' → Next step')
    // The preview is on the canvas, plainly marked, and nowhere in what the slate saves.
    await expect(previewNote(page, 'Next step')).toBeVisible()
    await expect(caption(page)).toBeVisible()
    await expect(caption(page)).toContainText('Preview')
    await expect(previewNote(page, 'Next step')).toBeInViewport()
    expect((await savedIds(page)).filter(id => id.startsWith('preview-'))).toEqual([])
    expect(await stored()).toEqual(original)
    // A connector from the existing note to the new step is part of the preview.
    expect(await page.evaluate(() => (window as any).slate.v2.nodes.allNodes
      .filter((n: any) => n.id.startsWith('preview-'))
      .flatMap((n: any) => n.relationships.associations ?? []).length)).toBeGreaterThan(0)
    if (!phone) await inert(page, previewNote(page, 'Next step'))
    await disabledFor(page, /Keep or discard the preview/)
    await expect(composer(page).getByRole('button', { name: 'Keep changes', exact: true })).toBeVisible()
    await expect(composer(page).getByRole('button', { name: 'Discard preview', exact: true })).toBeVisible()

    await button(page, 'Discard preview').click()
    await expect(previewNotes(page)).toHaveCount(0)
    await expect(caption(page)).toHaveCount(0)
    await enabledAndFocused(page)
    expect(await stored()).toEqual(original)

    await ask(page, first + ' → Next step')
    const placed = await page.evaluate(() => (window as any).slate.v2.nodes.allNodes
      .filter((n: any) => n.id.startsWith('preview-') && n.id !== 'preview-caption' && !n.id.startsWith('preview-over-'))
      .map((n: any) => ({ id: n.id.slice('preview-'.length), x: Math.round(n.options.x), y: Math.round(n.options.y), text: n.options.text })))
    expect(placed.map(n => n.text)).toEqual(['Next step'])
    await button(page, 'Keep changes').click()
    // Keeping turns the preview into the slate's own notes, where the preview stood.
    await expect.poll(async () => (await stored().catch(() => original)).length, { timeout: 20000 }).toBe(original.length + 1)
    await expect(page.locator('#slateCanvas [data-node-id="' + placed[0].id + '"]')).toBeVisible({ timeout: 20000 })
    await expect(previewNotes(page)).toHaveCount(0)
    const kept = await page.evaluate(id => { const o = (window as any).slate.v2.nodes.one(id).options; return { x: Math.round(o.x), y: Math.round(o.y) } }, placed[0].id)
    expect(kept).toEqual({ x: placed[0].x, y: placed[0].y })
    expect(await savedIds(page)).toContain(placed[0].id)
    await expect(conversation(page).getByLabel('Kept conversation')).toContainText('Next step')
    if (!phone) await enabledAndFocused(page)
    else await pinned(page)
  } finally {
    await cleanUp(page)
    await context.close()
  }
})

test('while a preview is being prepared the box says so and Cancel leaves it', async ({ browser }) => {
  test.skip(!writable, 'Creates a disposable guest and private slate')
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  try {
    await newDrawing(page)
    // Hold the request so the preparing state can be seen; its answer arrives after Cancel.
    await page.evaluate(() => {
      const m = (window as any).Meteor, call = m.callAsync.bind(m)
      ;(window as any).__release = null
      m.callAsync = (name: string, ...args: any[]) => name !== 'nativeCanvas.preview' ? call(name, ...args)
        : new Promise((resolve, reject) => { (window as any).__release = () => call(name, ...args).then(resolve, reject) })
    })
    await conversation(page).getByLabel('Starter messages').getByRole('button', { name: 'Draw a flow', exact: true }).click()
    await button(page, 'Preview changes').click()
    await disabledFor(page, /Preparing the preview/)
    await expect(composer(page).getByRole('button', { name: 'Cancel', exact: true })).toBeVisible()
    await composer(page).getByRole('button', { name: 'Cancel', exact: true }).click()
    await enabledAndFocused(page)
    await page.evaluate(() => (window as any).__release())
    // The answer to a cancelled request is dropped: nothing is previewed.
    await page.waitForTimeout(1500)
    await expect(previewNotes(page)).toHaveCount(0)
    await expect(button(page, 'Keep changes')).toHaveCount(0)
    await expect(messageBox(page)).toBeEnabled()
  } finally {
    await cleanUp(page)
    await context.close()
  }
})

for (const [kind, message, shows] of [
  ['pasted lines', 'Intake → Review\nReview → Send a reply', ['Intake', 'Review', 'Send a reply']],
  ['a workshop', 'Make a workshop with Now, Next and Later', ['Now', 'Next', 'Later']],
  ['interactive behaviour', 'Make this interactive: Intake → Review', ['Intake', 'Review']],
] as const) test(`${kind} are previewed on the canvas and discarded without a trace`, async ({ browser }) => {
  test.skip(!writable, 'Creates a disposable guest and private slate')
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  try {
    const key = await newDrawing(page)
    const stored = () => page.evaluate(async id => (await (window as any).Meteor.callAsync('slates.get', { shareId: id })).slateBase, key)
    const before = await stored()
    const notes = await page.evaluate(() => (window as any).slate.v2.nodes.allNodes.length)
    await ask(page, message)
    for (const text of shows) await expect(previewNote(page, text).first()).toBeVisible()
    await expect(caption(page)).toBeVisible()
    expect((await savedIds(page)).filter(id => id.startsWith('preview-'))).toEqual([])
    await disabledFor(page, /Keep or discard the preview/)
    await button(page, 'Discard preview').click()
    await expect(previewNotes(page)).toHaveCount(0)
    expect(await page.evaluate(() => (window as any).slate.v2.nodes.allNodes.length)).toBe(notes)
    await enabledAndFocused(page)
    const after = await stored()
    expect(after.nodes).toEqual(before.nodes)
    expect(after.creative ?? null).toEqual(before.creative ?? null)
  } finally {
    await cleanUp(page)
    await context.close()
  }
})

test('a workshop proposal is marked as a preview on the canvas and the box waits for Keep or Discard', async ({ browser }) => {
  test.skip(!writable, 'Creates a disposable guest and private slate')
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  try {
    await newDrawing(page)
    await ask(page, 'Make a workshop with Now, Next and Later')
    await button(page, 'Keep changes').click()
    await workshopReady(page)
    await expect(messageBox(page)).toBeVisible({ timeout: 20000 })
    await pinned(page)
    await messageBox(page).fill('Add a card called Draft')
    await button(page, 'Preview changes').click()
    await expect(button(page, 'Keep changes')).toBeVisible({ timeout: 20000 })
    await expect(caption(page)).toBeVisible()
    await expect(caption(page)).toContainText('Preview')
    expect((await savedIds(page)).filter(id => id.startsWith('preview-'))).toEqual([])
    await disabledFor(page, /Keep or discard the preview/)
    await button(page, 'Discard preview').click()
    await expect(caption(page)).toHaveCount(0)
    await enabledAndFocused(page)
  } finally {
    await cleanUp(page)
    await context.close()
  }
})

for (const width of [1440, 390]) test(`${width}px: the presentation-ended notice covers neither a toolbar control nor the conversation`, async ({ browser }) => {
  test.skip(!writable, 'Creates a disposable guest and private slate')
  const phone = width < 600
  const context = await browser.newContext({ viewport: { width, height: phone ? 844 : 900 }, hasTouch: phone, reducedMotion: 'reduce' })
  const page = await context.newPage()
  try {
    await newDrawing(page)
    await page.getByRole('button', { name: 'Present notes together', exact: true }).click()
    const deck = page.getByRole('dialog', { name: 'Live presentation' })
    await deck.getByRole('button', { name: 'End presentation', exact: true }).click()
    const notice = page.getByRole('status').filter({ hasText: 'The live presentation has ended.' })
    await expect(notice).toBeVisible()
    if (!await conversation(page).isVisible()) await page.getByRole('button', { name: 'Ask Slatebox', exact: true }).click()
    const overlap = (a: { x: number; y: number; width: number; height: number }, b: typeof a) =>
      a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height
    const n = (await notice.boundingBox())!
    expect(overlap(n, (await conversation(page).boundingBox())!), 'the notice sits clear of the conversation').toBe(false)
    // It covers no control of the toolbar, and each is still the topmost thing at its centre.
    for (const control of await page.locator('.sb-board-toolbar button:visible, .sb-board-toolbar a:visible').all()) {
      expect(overlap(n, (await control.boundingBox())!), 'the notice sits clear of ' + await control.textContent()).toBe(false)
      expect(await control.evaluate(el => { const r = el.getBoundingClientRect(); return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)) })).toBe(true)
    }
  } finally {
    await cleanUp(page)
    await context.close()
  }
})
