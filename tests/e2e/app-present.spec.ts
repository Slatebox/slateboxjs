import { expect, test, type BrowserContext, type Page } from '@playwright/test'
import { openGuestCanvas } from './app-host.shared'
import { presentToEveryone } from './app-header.shared'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'
import { workshopReady } from './app-native-workshop.shared'
import {
  camera, chromeText, exitWithEscape, expectFramed, livePresenter, nextView, openPresenter, presenter, readoutWords, stepCounter,
} from './app-presenter.shared'

// Present on any slate opens the presenter: full screen, the slate's presentation (its viewpoints,
// from the slate's analysis) played over the slate's own SVG with camera moves. A workshop on the
// slate is presented as part of it: each lane with its cards, then the slate's other notes.

const app = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
const writable = ['localhost', '127.0.0.1', 'test.slatebox.com'].includes(new URL(app).hostname)
const shots = process.env.SLATEBOX_PRESENT_SHOTS
const shotLabel = process.env.SLATEBOX_PRESENT_SHOTS_LABEL || 'run'
const shot = async (page: Page, name: string) => {
  if (shots) await page.screenshot({ path: shots + '/' + shotLabel + '-' + name + '.png' })
}

const keyOf = (page: Page) => new URL(page.url()).pathname.split('/').pop()!
/** A lane's viewpoint frames the lane and the cards in it. */
const laneView = (workshop: { cards: { id: string, laneId: string }[] }, lane: { id: string }) =>
  ['lane-' + lane.id, ...workshop.cards.filter(card => card.laneId === lane.id).map(card => 'card-' + card.id)]
const counterTotal = async (dialog: ReturnType<typeof presenter>) => Number((await stepCounter(dialog).textContent())!.split('/')[1])

/** What Esc must leave untouched: the stored slate, and the canvas's notes where they were drawn. */
async function board(page: Page, key: string) {
  const stored = await getSlate(page, key)
  const drawn = await page.evaluate(() => [...document.querySelectorAll('#slateCanvas [data-node-id]')].map(node => {
    const rect = node.getBoundingClientRect()
    return [node.getAttribute('data-node-id'), Math.round(rect.x), Math.round(rect.y), Math.round(rect.width)]
  }))
  return { nodes: stored.nodes, creative: stored.creative?.model ?? null, drawn }
}

/** A slate like the reported one: "Welcome!" drawn into a two-step route beside the slate's notes. */
async function workshopSlate(page: Page) {
  await page.goto(app + '/new')
  await page.waitForURL(/\/canvas\/[a-zA-Z0-9]+$/)
  const chat = page.getByRole('complementary', { name: 'Ask Slatebox' })
  const ask = page.getByRole('button', { name: 'Ask Slatebox', exact: true })
  // A wide canvas opens the conversation beside it; a phone puts it behind Ask Slatebox.
  await expect(chat.or(ask).first()).toBeVisible({ timeout: 30_000 })
  await dismissWelcome(page)
  if (!await chat.isVisible() && await page.evaluate(() => innerWidth < 1000)) await ask.click()
  await expect(chat).toBeVisible({ timeout: 20_000 })
  await chat.getByRole('textbox').fill('Welcome! → Next step')
  await chat.getByRole('button', { name: 'Preview changes' }).click()
  await chat.getByRole('button', { name: 'Keep changes' }).click()
  await expect(chat.getByLabel('Kept conversation')).toContainText('Next step', { timeout: 20_000 })
  await chat.getByRole('button', { name: 'Add interactive behavior' }).click()
  await chat.getByRole('button', { name: 'Preview changes' }).click()
  await chat.getByRole('button', { name: 'Keep changes' }).click()
  const key = keyOf(page)
  await expect.poll(async () => Boolean((await getSlate(page, key).catch(() => null))?.creative), { timeout: 20_000 }).toBe(true)
  await workshopReady(page)
  const stored = await getSlate(page, key)
  expect(stored.creative.model.workshop.lanes.map((lane: { label: string }) => lane.label)).toEqual(['Welcome!', 'Next step'])
  expect(stored.nodes.length).toBeGreaterThan(0)
  return key
}

async function cleanUp(context: BrowserContext, uid: string | null) {
  if (!uid) return
  const clean = await context.newPage()
  try {
    await clean.goto(app + '/plans')
    await clean.waitForFunction(id => (window as any).Meteor?.userId() === id, uid)
    await removeTestGuest(clean, uid)
  } finally { await clean.close() }
}

test('Present on a plain slate plays its viewpoints full screen over the slate, and Esc returns to the board unchanged', async ({ browser }) => {
  test.skip(!writable, 'Creates a disposable guest slate on local or staging only.')
  const context = await browser.newContext({ viewport: { width: 1360, height: 860 } })
  const page = await context.newPage()
  let uid: string | null = null
  try {
    await openGuestCanvas(page, app)
    uid = await userId(page)
    const key = keyOf(page)
    const before = await board(page, key)
    await shot(page, 'plain-board')
    const dialog = await openPresenter(page)
    // Full screen: the Fullscreen API where the browser allows it, otherwise the whole viewport.
    const box = (await dialog.boundingBox())!
    expect(box.x).toBeLessThanOrEqual(1)
    expect(box.y).toBeLessThanOrEqual(1)
    expect(box.width).toBeGreaterThanOrEqual(1358)
    expect(box.height).toBeGreaterThanOrEqual(858)
    // The slate's own drawing: every note of the slate is in the presented SVG.
    for (const node of before.nodes) await expect(camera(dialog).locator('[data-node-id="' + node.options.id + '"]').first()).toBeAttached()
    await expect(stepCounter(dialog)).toHaveText(/^0 \/ \d+$/, { timeout: 30_000 })
    const total = await counterTotal(dialog)
    expect(total).toBeGreaterThanOrEqual(before.nodes.length)
    // The camera moves to each viewpoint, in reduced motion without a transition.
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await expect(camera(dialog)).toHaveCSS('transition-property', 'transform')
    await expect(camera(dialog)).not.toHaveCSS('transition-duration', '0s')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(camera(dialog)).toHaveCSS('transition-duration', '0s')
    const overview = await camera(dialog).evaluate(element => (element as HTMLElement).style.transform)
    await nextView(page, dialog)
    await expect.poll(() => camera(dialog).evaluate(element => (element as HTMLElement).style.transform)).not.toBe(overview)
    await shot(page, 'plain-presenter')
    if (total > 1) {
      await nextView(page, dialog)
      await page.keyboard.press('ArrowLeft')
      await expect(stepCounter(dialog)).toHaveText(new RegExp('^1 / ' + total + '$'))
    }
    // Space plays and pauses.
    await page.keyboard.press('Space')
    await expect(dialog.getByRole('button', { name: 'Pause presentation' })).toBeVisible()
    await page.keyboard.press('Space')
    await expect(dialog.getByRole('button', { name: 'Play presentation' })).toBeVisible()
    expect(await chromeText(dialog)).not.toMatch(readoutWords)
    await exitWithEscape(page, dialog)
    expect(await board(page, key)).toEqual(before)
  } finally {
    try { await cleanUp(context, uid) } finally { await context.close() }
  }
})

test('Present on a slate with a workshop plays each lane with its cards, then the slate\'s other notes', async ({ browser }) => {
  test.skip(!writable, 'Creates a disposable guest slate on local or staging only.')
  const context = await browser.newContext({ viewport: { width: 1360, height: 860 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  let uid: string | null = null
  try {
    const key = await workshopSlate(page)
    uid = await userId(page)
    const before = await board(page, key)
    const { lanes } = before.creative.workshop
    await shot(page, 'workshop-board')
    const dialog = await openPresenter(page)
    await expect(page.getByRole('region', { name: 'Decision presentation' })).toHaveCount(0)
    await expect(stepCounter(dialog)).toHaveText(/^0 \/ \d+$/, { timeout: 30_000 })
    // One viewpoint per lane, then one per other note.
    expect(await counterTotal(dialog)).toBe(lanes.length + before.nodes.length)
    for (const lane of lanes) {
      await nextView(page, dialog)
      await expectFramed(dialog, laneView(before.creative.workshop, lane))
      await expect(dialog.getByText(lane.label, { exact: true }).last()).toBeVisible()
      if (lane === lanes[0]) await shot(page, 'workshop-presenter')
    }
    for (const node of before.nodes) {
      await nextView(page, dialog)
      await expectFramed(dialog, [node.options.id])
    }
    expect(await chromeText(dialog)).not.toMatch(readoutWords)
    await exitWithEscape(page, dialog)
    expect(await board(page, key)).toEqual(before)
  } finally {
    try { await cleanUp(context, uid) } finally { await context.close() }
  }
})

test('on a phone the presenter fills the screen and a swipe moves between viewpoints', async ({ browser }) => {
  test.skip(!writable, 'Creates a disposable guest slate on local or staging only.')
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' })
  const page = await context.newPage()
  let uid: string | null = null
  try {
    const key = await workshopSlate(page)
    uid = await userId(page)
    const before = await board(page, key)
    await shot(page, 'phone-board')
    const dialog = await openPresenter(page)
    const box = (await dialog.boundingBox())!
    expect(Math.round(box.width)).toBe(390)
    expect(Math.round(box.height)).toBeGreaterThanOrEqual(840)
    await expect(stepCounter(dialog)).toHaveText(/^0 \/ \d+$/, { timeout: 30_000 })
    // Nothing in the presenter is wider than the phone.
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
    const cdp = await context.newCDPSession(page)
    const swipe = async (from: number, to: number) => {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from, y: 420 }] })
      for (let step = 1; step <= 5; step++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from + (to - from) * step / 5, y: 424 }] })
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    }
    await swipe(330, 60)
    await expect(stepCounter(dialog)).toHaveText(/^1 \/ \d+$/)
    await expectFramed(dialog, laneView(before.creative.workshop, before.creative.workshop.lanes[0]))
    await shot(page, 'phone-presenter')
    await swipe(330, 60)
    await expect(stepCounter(dialog)).toHaveText(/^2 \/ \d+$/)
    await swipe(60, 330)
    await expect(stepCounter(dialog)).toHaveText(/^1 \/ \d+$/)
    expect(await chromeText(dialog)).not.toMatch(readoutWords)
    await dialog.getByRole('button', { name: 'Exit presentation', exact: true }).tap()
    await expect(dialog).toHaveCount(0)
    expect(await board(page, key)).toEqual(before)
  } finally {
    try { await cleanUp(context, uid) } finally { await context.close() }
  }
})

test('a read-only phone follows a live presentation step by step in the same presenter, and leaves to an unchanged board', async ({ browser }) => {
  test.skip(!writable, 'Creates a disposable guest slate on local or staging only.')
  const ownerContext = await browser.newContext({ viewport: { width: 1360, height: 860 }, reducedMotion: 'reduce' })
  const readerContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' })
  const owner = await ownerContext.newPage()
  const reader = await readerContext.newPage()
  let uid: string | null = null
  try {
    const key = await workshopSlate(owner)
    uid = await userId(owner)
    const before = await board(owner, key)
    const [firstLane, secondLane] = before.creative.workshop.lanes
    const invite = await shareAs(owner, 'read')
    await reader.goto(invite.href)
    await dismissWelcome(reader)
    await workshopReady(reader)
    expect(await userId(reader)).toBeNull()
    await presentToEveryone(owner)
    const lead = livePresenter(owner)
    await expect(lead).toBeVisible()
    await expect(stepCounter(lead)).toHaveText(/^0 \/ \d+$/, { timeout: 30_000 })
    const total = Number((await stepCounter(lead).textContent())!.split('/')[1])
    expect(total).toBe(before.creative.workshop.lanes.length + before.nodes.length)
    await nextView(owner, lead)
    const follow = reader.getByRole('button', { name: 'Follow presentation', exact: true })
    await expect(follow).toBeVisible()
    await follow.tap()
    const watching = livePresenter(reader)
    await expect(watching).toBeVisible()
    await expect(watching.getByRole('status')).toContainText('1 of ' + total)
    await expectFramed(watching, laneView(before.creative.workshop, firstLane))
    await shot(reader, 'follower-phone')
    // A follower does not steer.
    await expect(watching.getByRole('button', { name: 'Next', exact: true })).toHaveCount(0)
    await reader.keyboard.press('ArrowRight')
    await expect(watching.getByRole('status')).toContainText('1 of ' + total)
    await nextView(owner, lead)
    await expect(watching.getByRole('status')).toContainText('2 of ' + total)
    await expectFramed(watching, laneView(before.creative.workshop, secondLane))
    // A reload keeps following the same presentation.
    await reader.reload()
    await expect(livePresenter(reader).getByRole('status')).toContainText('2 of ' + total)
    // Two quick steps both reach the follower.
    await owner.keyboard.press('ArrowRight')
    await owner.keyboard.press('ArrowRight')
    await expect(stepCounter(lead)).toHaveText('4 / ' + total)
    await expect(livePresenter(reader).getByRole('status')).toContainText('4 of ' + total)
    expect(await chromeText(livePresenter(reader))).not.toMatch(readoutWords)
    expect(await chromeText(lead)).not.toMatch(readoutWords)
    await livePresenter(reader).getByRole('button', { name: 'Leave presentation', exact: true }).tap()
    await expect(livePresenter(reader)).toHaveCount(0)
    await expect(follow).toBeVisible()
    await lead.getByRole('button', { name: 'End presentation', exact: true }).click()
    await expect(lead).toHaveCount(0)
    await expect(follow).toHaveCount(0)
    await expect(reader.locator('.sb-board-toolbar').getByRole('button', { name: 'Present', exact: true })).toBeVisible()
    expect(await board(owner, key)).toEqual(before)
  } finally {
    try { await readerContext.close(); await cleanUp(ownerContext, uid) } finally { await ownerContext.close() }
  }
})

test('a slate with a workshop publishes its presentation, and the link and its embed play it in the presenter', async ({ browser }) => {
  test.skip(!writable, 'Creates a disposable guest slate on local or staging only.')
  const context = await browser.newContext({ viewport: { width: 1360, height: 860 }, permissions: ['clipboard-read', 'clipboard-write'] })
  const viewerContext = await browser.newContext({ viewport: { width: 1024, height: 768 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  let uid: string | null = null
  try {
    const key = await workshopSlate(page)
    uid = await userId(page)
    const lanes = (await getSlate(page, key)).creative.model.workshop.lanes
    const dialog = await openPresenter(page)
    const publish = dialog.getByRole('button', { name: 'Publish presentation', exact: true })
    await expect(publish).toBeEnabled({ timeout: 40_000 })
    await publish.click()
    await expect(page.getByText(/^Published!/)).toBeVisible()
    await exitWithEscape(page, dialog)
    const viewer = await viewerContext.newPage()
    const link = app + '/present/' + key
    await viewer.goto(link)
    await expect(viewer.getByRole('region', { name: 'Decision presentation' })).toHaveCount(0)
    await expect(camera(viewer).locator('svg [data-node-id="lane-' + lanes[0].id + '"]')).toBeAttached({ timeout: 30_000 })
    await viewer.keyboard.press('ArrowRight')
    await expect(stepCounter(viewer)).toHaveText(/^1 \/ \d+$/)
    await expect(viewer.getByText(lanes[0].label, { exact: true }).last()).toBeVisible()
    await shot(viewer, 'published-link')
    const host = await viewerContext.newPage()
    await host.setContent(`<!doctype html><main><iframe title="deck" src="${link}" style="width:960px;height:540px" allowfullscreen></iframe></main>`)
    const frame = host.frameLocator('iframe')
    await expect(camera(frame).locator('svg [data-node-id="lane-' + lanes[0].id + '"]')).toBeAttached({ timeout: 30_000 })
    await expect(frame.getByRole('region', { name: 'Decision presentation' })).toHaveCount(0)
  } finally {
    try { await viewerContext.close(); await cleanUp(context, uid) } finally { await context.close() }
  }
})
