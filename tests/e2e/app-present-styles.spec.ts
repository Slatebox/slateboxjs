import { expect, test, type Page } from '@playwright/test'
import { openGuestCanvas } from './app-host.shared'
import { presenter, stepCounter } from './app-presenter.shared'

// Styled presentations: Present plays the slate on a live SlateboxJS canvas in a style chosen
// from the slate (the owner's "What is Slatebox" mind map plays as Voyage): a title card, real
// camera flights between steps (Prezi arcs that pull back and come in), stage notes with custom
// SVG path shapes and pictures, one-click styles that never ask the AI, reduced motion as cuts,
// a phone layout, and a published link that plays the same deck in a session with no sign-in.

const app = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
const writable = /localhost|127\.0\.0\.1|staging|test\./.test(app)

const BR = [
  ['b1', 'Free and open source', ['MIT licensed', 'Run it on your own server']],
  ['b2', 'Smart components', ['Boards that follow your rules', 'Drag to plan, budget and decide']],
  ['b3', 'Presentations', ['AI builds the story from your slate', 'Share with a link']],
  ['b4', 'Work together', ['Live editing and comments', 'Calls right on the slate']],
  ['b5', 'Agents', ['MCP server for Claude and ChatGPT', 'API and exec scripts']],
  ['b6', 'Diagrams', ['Mermaid in and out', 'Mind maps and flowcharts']],
] as const
const BY = [758, 854, 950, 1046, 1142, 1238]
const LY = [459, 555, 651, 747, 848, 950, 1046, 1142, 1243, 1346, 1442, 1537]

function mindMap() {
  const plain = { backgroundColor: '#6a9cc4', fontColor: '#ffffff', fontSize: 14, borderWidth: 0 }
  const nodes: any[] = []
  const box = (cx: number, cy: number, w: number, h: number) => ({ x: 5000 + cx - w / 2, y: 5000 + cy - h / 2, width: w, height: h })
  const add = (id: string, text: string, b: object, associations: object[] = []) => nodes.push({ options: { id, text, ...b, ...plain }, relationships: { associations } })
  add('n0', 'Slatebox', box(706, 998, 114, 114), BR.map(([id]) => ({ parentId: 'n0', childId: id, lineColor: '#7a8ca0', lineWidth: 2 })))
  BR.forEach(([id, text, kids], i) => {
    add(id, text, box(926, BY[i], 180, 56), kids.map((_, j) => ({ parentId: id, childId: `l${i * 2 + j + 1}`, lineColor: '#7a8ca0', lineWidth: 2 })))
    kids.forEach((k, j) => add(`l${i * 2 + j + 1}`, k, box(1219, LY[i * 2 + j], 230, 56)))
  })
  return nodes
}

async function slateOfIdeas(page: Page) {
  await openGuestCanvas(page, app)
  await page.evaluate(async (nodes) => {
    const s = (window as any).slate
    const json = JSON.parse(s.exportJSON())
    json.nodes = nodes
    await s.loadJSON(JSON.stringify(json))
    s.options.name = 'What is Slatebox'
    if (s.v2?.options) s.v2.options.name = 'What is Slatebox'
  }, mindMap())
  await page.waitForFunction(() => (window as any).slate.v2.nodes.allNodes.length >= 19)
}

async function openStyledPresenter(page: Page) {
  const present = page.locator('.sb-board-toolbar').getByRole('button', { name: 'Present', exact: true })
  await present.click()
  const item = page.getByRole('menu', { name: 'Present' }).getByRole('menuitem', { name: 'Present on this screen', exact: true })
  if (await item.waitFor({ timeout: 1500 }).then(() => true, () => false)) await item.click()
  const dialog = presenter(page)
  await expect(dialog.locator('.sb-live-stage svg [data-node-id]').first()).toBeAttached({ timeout: 60_000 })
  await expect(dialog.getByRole('progressbar', { name: 'Planning with Slatebox…' })).toHaveCount(0, { timeout: 30_000 })
  await expect(stepCounter(dialog)).toHaveText(/^0 \/ \d+$/, { timeout: 30_000 })
  return dialog
}

/** The canvas camera, sampled every frame for `ms`: the distinct viewBoxes and roll seen. */
const sampleCamera = (page: Page, ms: number) => page.evaluate((duration) => new Promise<{ boxes: string[]; rolls: string[] }>((resolve) => {
  const boxes: string[] = []
  const rolls: string[] = []
  const svg = () => document.querySelector('.sb-live-stage svg')
  const start = performance.now()
  const tick = () => {
    const box = svg()?.getAttribute('viewBox') || ''
    if (box !== boxes.at(-1)) boxes.push(box)
    const roll = (document.querySelector('.sbp-roll') as HTMLElement | null)?.style.transform || ''
    if (roll !== rolls.at(-1)) rolls.push(roll)
    if (performance.now() - start < duration) requestAnimationFrame(tick)
    else resolve({ boxes, rolls })
  }
  requestAnimationFrame(tick)
}), ms)
const width = (box: string) => Number(box.split(/[ ,]+/)[2])

/** A note of the live canvas that shows these words, lit. */
const litText = (page: Page, words: RegExp) => page.evaluate((source) => {
  const pattern = new RegExp(source)
  return [...document.querySelectorAll<SVGGElement>('.sb-live-stage g[data-node-id]')]
    .some((g) => pattern.test(g.textContent || '') && Number(getComputedStyle(g).opacity) > 0.95)
}, words.source)

test('a mind map plays as a styled deck on the live canvas: title, real flights, a Prezi pull-back, custom shapes and pictures', async ({ browser }) => {
  test.skip(!writable, 'Creates a disposable guest slate on local or staging only.')
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
  const page = await context.newPage()
  try {
    await slateOfIdeas(page)
    const dialog = await openStyledPresenter(page)
    const stage = dialog.locator('.sb-live-stage')
    // The slate's kind picks the style: a tree of ideas flies as Voyage.
    await expect(stage).toHaveAttribute('data-presentation-style', 'voyage')
    // Step 0 is the title card: a real stage note, lit, the slate's own notes behind it.
    await expect.poll(() => litText(page, /What is Slatebox/)).toBe(true)
    // Custom SVG path shapes and pictures are real notes on the canvas.
    const kit = await page.evaluate(() => {
      const nodes = (window as any).__slateboxInstances.find((s: any) => s.element?.closest?.('.sb-live-stage')).nodes.allNodes
      return { paths: nodes.filter((n: any) => n.options.vectorPath).length, pictures: nodes.filter((n: any) => n.options.image).length, slate: nodes.filter((n: any) => /^(n0|b\d|l\d+)$/.test(n.id)).length }
    })
    expect(kit.slate).toBe(19)
    expect(kit.paths).toBeGreaterThanOrEqual(19)
    expect(kit.pictures).toBeGreaterThanOrEqual(3)
    // Next flies the camera: many frames between the framings, and the counter moves.
    const total = Number((await stepCounter(dialog).textContent())!.split('/')[1])
    expect(total).toBeGreaterThanOrEqual(6)
    const [flight] = await Promise.all([sampleCamera(page, 2600), page.keyboard.press('ArrowRight')])
    expect(flight.boxes.length).toBeGreaterThanOrEqual(3)
    await expect(stepCounter(dialog)).toHaveText(new RegExp(`^1 / ${total}$`))
    // The homecoming finale pulls back through the whole map mid-flight, then lands close.
    for (let step = 2; step < total; step += 1) await page.keyboard.press('ArrowRight')
    await expect(stepCounter(dialog)).toHaveText(new RegExp(`^${total - 1} / ${total}$`))
    await page.waitForTimeout(3000)
    const [home] = await Promise.all([sampleCamera(page, 3200), page.keyboard.press('ArrowRight')])
    const widths = home.boxes.map(width)
    const widest = Math.max(...widths)
    expect(widest).toBeGreaterThan(widths[0])
    expect(widest).toBeGreaterThan(widths.at(-1)!)
    await expect.poll(() => litText(page, /Open the slate/)).toBe(true)
  } finally {
    await context.close()
  }
})

test('one click restyles the deck: no AI call, the same step, a new look; the chat refines it', async ({ browser }) => {
  test.skip(!writable, 'Creates a disposable guest slate on local or staging only.')
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  const sent: string[] = []
  page.on('websocket', (socket) => socket.on('framesent', (frame) => { if (typeof frame.payload === 'string') sent.push(frame.payload) }))
  try {
    await slateOfIdeas(page)
    const dialog = await openStyledPresenter(page)
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect(stepCounter(dialog)).toHaveText(/^2 \/ \d+$/)
    const before = await dialog.locator('.sbp-host').evaluate((el) => getComputedStyle(el).backgroundColor)
    sent.length = 0
    await dialog.getByRole('button', { name: 'Presentation style' }).click()
    const sheet = page.getByRole('radiogroup', { name: 'Presentation style' })
    await expect(sheet.getByRole('radio')).toHaveCount(8)
    await sheet.locator('[data-style-chip="sketch"]').click()
    await expect(sheet.locator('[data-style-chip="sketch"]')).toHaveAttribute('aria-checked', 'true')
    await page.keyboard.press('Escape')
    await expect(dialog.locator('.sb-live-stage')).toHaveAttribute('data-presentation-style', 'sketch')
    // The same step, in the new look.
    await expect(stepCounter(dialog)).toHaveText(/^2 \/ \d+$/)
    await expect.poll(() => dialog.locator('.sbp-host').evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe(before)
    // Saved with no AI call: the switch is an update, never a plan.
    await expect.poll(() => sent.some((frame) => frame.includes('presentations.update') && frame.includes('sketch'))).toBe(true)
    expect(sent.some((frame) => frame.includes('presentations.analyze'))).toBe(false)
    // The chat offers its suggestions in plain words.
    await expect(stepCounter(dialog)).toHaveText(/^2 \/ \d+$/)
    await dialog.getByRole('button', { name: 'Presentation style' }).click()
    for (const pill of ['Bolder', 'Darker', 'More playful', 'Calmer', 'Add images']) await expect(page.getByRole('button', { name: pill })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Tell Slatebox how to change the presentation' })).toBeVisible()
  } finally {
    await context.close()
  }
})

test('reduced motion: a cut with a short fade, no roll, no kinetic words', async ({ browser }) => {
  test.skip(!writable, 'Creates a disposable guest slate on local or staging only.')
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  try {
    await slateOfIdeas(page)
    const dialog = await openStyledPresenter(page)
    await expect(dialog.locator('.sbp-host')).toHaveClass(/sbp-reduced/)
    for (let step = 1; step <= 3; step += 1) {
      const [cut] = await Promise.all([sampleCamera(page, 900), page.keyboard.press('ArrowRight')])
      // One change of framing per step: no tween.
      expect(cut.boxes.length).toBeLessThanOrEqual(2)
      expect(cut.rolls.every((roll) => roll === '' || roll === 'rotate(0deg)')).toBe(true)
    }
    const words = dialog.locator('.sbp-cap .t span').first()
    await expect(words).toHaveCSS('animation-name', 'none')
  } finally {
    await context.close()
  }
})

test('on a phone the published deck is composed for portrait: captions in the bottom band, big pictures, tap goes on and a swipe goes back', async ({ browser }) => {
  test.skip(!writable, 'Creates a disposable guest slate on local or staging only.')
  const author = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  try {
    const page = await author.newPage()
    await slateOfIdeas(page)
    const dialog = await openStyledPresenter(page)
    // Restated 2026-11-23: a styled deck's bar is one small pill; publishing is in its More sheet.
    await dialog.getByRole('button', { name: 'More presenter options' }).click()
    await page.getByRole('button', { name: 'Publish presentation', exact: true }).click()
    await expect(page.getByText(/Published!/)).toBeVisible({ timeout: 20_000 })
    await page.keyboard.press('Escape')
    const shareId = new URL(page.url()).pathname.split('/').pop()
    const viewer = await phone.newPage()
    await viewer.goto(app + '/present/' + shareId)
    const stage = viewer.locator('.sb-live-stage')
    await expect(stage.locator('svg [data-node-id="n0"]')).toBeAttached({ timeout: 60_000 })
    await expect(stepCounter(viewer)).toHaveText(/^0 \/ \d+$/, { timeout: 30_000 })
    // Tap moves on.
    const stageBox = (await stage.boundingBox())!
    await viewer.touchscreen.tap(stageBox.x + stageBox.width / 2, stageBox.y + stageBox.height * 0.35)
    await expect(stepCounter(viewer)).toHaveText(/^1 \/ \d+$/)
    await viewer.touchscreen.tap(stageBox.x + stageBox.width / 2, stageBox.y + stageBox.height * 0.35)
    await expect(stepCounter(viewer)).toHaveText(/^2 \/ \d+$/)
    await viewer.waitForTimeout(3200)
    // The caption sits in the bottom band, whole.
    const caption = (await viewer.locator('.sbp-cap').boundingBox())!
    expect(caption.y).toBeGreaterThan(stageBox.y + stageBox.height * 0.35)
    expect(caption.y + caption.height).toBeLessThanOrEqual(stageBox.y + stageBox.height + 1)
    expect(caption.x).toBeGreaterThanOrEqual(0)
    expect(caption.x + caption.width).toBeLessThanOrEqual(390 + 1)
    // The dive's picture is big on the phone: at least 60% of the screen's width.
    const picture = await viewer.evaluate(() => {
      const shown = [...document.querySelectorAll<SVGGElement>('.sb-live-stage g[data-node-id*="-image"]')].filter((g) => Number(getComputedStyle(g).opacity) > 0.95)
      return Math.max(0, ...shown.map((g) => g.getBoundingClientRect().width))
    })
    expect(picture).toBeGreaterThanOrEqual(390 * 0.6)
    // A swipe right goes back.
    await stage.evaluate((el) => {
      const touch = (x: number) => new Touch({ identifier: 1, target: el, clientX: x, clientY: 400 })
      el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [touch(60)], changedTouches: [touch(60)] }))
      el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches: [], changedTouches: [touch(300)] }))
    })
    await expect(stepCounter(viewer)).toHaveText(/^1 \/ \d+$/)
  } finally {
    await phone.close()
    await author.close()
  }
})

test('the published link plays the same styled deck in a session with no sign-in', async ({ browser }) => {
  test.skip(!writable, 'Creates a disposable guest slate on local or staging only.')
  const author = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await author.newPage()
  const viewer = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  try {
    await slateOfIdeas(page)
    const dialog = await openStyledPresenter(page)
    await dialog.getByRole('button', { name: 'Presentation style' }).click()
    await page.locator('[data-style-chip="neon"]').click()
    await page.keyboard.press('Escape')
    await expect(dialog.locator('.sb-live-stage')).toHaveAttribute('data-presentation-style', 'neon')
    // Restated 2026-11-23: a styled deck's bar is one small pill; publishing is in its More sheet.
    await dialog.getByRole('button', { name: 'More presenter options' }).click()
    await page.getByRole('button', { name: 'Publish presentation', exact: true }).click()
    await expect(page.getByText(/Published!/)).toBeVisible({ timeout: 20_000 })
    await page.keyboard.press('Escape')
    const shareId = new URL(page.url()).pathname.split('/').pop()
    const visitor = await viewer.newPage()
    await visitor.goto(app + '/present/' + shareId)
    expect(await visitor.evaluate(() => localStorage.getItem('Meteor.loginToken'))).toBeNull()
    const stage = visitor.locator('.sb-live-stage')
    await expect(stage).toHaveAttribute('data-presentation-style', 'neon', { timeout: 60_000 })
    await expect(stage.locator('svg [data-node-id="n0"]')).toBeAttached()
    await expect.poll(() => litText(visitor, /What is Slatebox/), { timeout: 20_000 }).toBe(true)
  } finally {
    await viewer.close()
    await author.close()
  }
})
