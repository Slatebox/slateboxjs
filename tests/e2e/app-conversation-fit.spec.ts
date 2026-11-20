import { expect, test, type Browser, type Page } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, removeTestGuest, userId } from './workshop-guests.shared'
import { conversation, messageBox, openConversation, resting, selectCard, slateKey, storedWorkshop, workshopReady } from './app-native-workshop.shared'

/**
 * Where "Ask Slatebox" meets the rest of the page (ui-fix, 2026-11-20): what a review of the
 * conversation polish, the canvas header and cards-are-notes together found.
 * - A cookie notice not yet answered covers neither the message box's button nor the canvas's
 *   quick add, at any width.
 * - The × gives keyboard focus back to the "Ask Slatebox" button it was opened with.
 * - The huddle strip stays on the canvas, clear of the conversation and the bar under it.
 * - A short screen (a phone held sideways) keeps some canvas, so a preview can be seen before Keep.
 * - A workshop's drawing review turns Keep off, with the reason, once the drawing has moved on.
 * - On a phone, what a workshop proposal adds is brought into view.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')

const guests = new WeakMap<Page, string | null>()
async function open(browser: Browser, width: number, height: number, { cookies = 'answer' as 'answer' | 'leave' } = {}) {
  const phone = width < 1000
  const context = await browser.newContext({ viewport: { width, height }, hasTouch: phone, reducedMotion: 'reduce', permissions: ['microphone'] })
  // Nothing leaves this machine: Daily and every other outside address are refused.
  await context.route('**/*', route => /^(https?|wss?):\/\/(localhost|127\.0\.0\.1)[:/]|^(data|blob):/.test(route.request().url()) ? route.continue() : route.abort())
  const page = await context.newPage()
  return { context, page, phone, cookies }
}
async function welcome(page: Page, cookies: 'answer' | 'leave') {
  await expect.poll(() => userId(page)).toBeTruthy()
  guests.set(page, await userId(page))
  if (cookies === 'answer') return dismissWelcome(page)
  const ok = page.getByRole('dialog', { name: /welcome/i }).getByRole('button', { name: 'OK', exact: true })
  if (await ok.waitFor({ timeout: 4000 }).then(() => true, () => false)) await ok.click()
  await expect(page.locator('.sb-cookie')).toBeVisible()
}
async function newDrawing(page: Page, cookies: 'answer' | 'leave') {
  await page.goto(new URL('/new', origin).href)
  await page.waitForURL(/\/canvas\/[a-zA-Z0-9]+$/)
  await welcome(page, cookies)
  const panel = conversation(page)
  if (!await panel.isVisible()) await askButton(page).click()
  await expect(messageBox(page)).toBeVisible({ timeout: 20000 })
}
const askButton = (page: Page) => page.getByRole('button', { name: 'Ask Slatebox', exact: true }).filter({ visible: true })
const cleanUp = (page: Page) => removeTestGuest(page, guests.get(page) ?? null).catch(() => undefined)
const keep = (page: Page) => conversation(page).getByRole('button', { name: 'Keep changes', exact: true })
const reason = (page: Page) => conversation(page).getByRole('form', { name: 'Message Slatebox' }).getByRole('status')
const previewNotes = (page: Page) => page.locator('#slateCanvas [data-conversation-preview]')

/** What is drawn at the middle of a control: the control itself, or what lies over it. */
const onTop = (page: Page, selector: string) => page.evaluate(selector => {
  const el = document.querySelector(selector)
  if (!el) return 'missing'
  const r = el.getBoundingClientRect()
  const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
  return el.contains(top) ? 'itself' : top?.closest('.sb-cookie') ? 'the cookie notice' : (top?.className?.toString?.().slice(0, 60) || top?.tagName || 'nothing')
}, selector)

/** The canvas a person can see: between the header and whatever is under the canvas (the panel, the bar). */
const visibleCanvas = (page: Page) => page.evaluate(() => {
  const header = document.querySelector('.sb-board-toolbar')!.getBoundingClientRect()
  const canvas = document.getElementById('slateCanvas')!.getBoundingClientRect()
  return { top: Math.max(header.bottom, canvas.top), bottom: Math.min(innerHeight, canvas.bottom), height: Math.round(Math.min(innerHeight, canvas.bottom) - Math.max(header.bottom, canvas.top)) }
})

for (const [width, height] of [[1000, 800], [1280, 800], [1440, 900], [1920, 1080]] as const) {
  test(`${width}px, first visit: the cookie notice covers neither the message box's button nor the quick add`, async ({ browser }) => {
    const { context, page } = await open(browser, width, height)
    try {
      await newDrawing(page, 'leave')
      await messageBox(page).fill('Intake → Review')
      expect(await onTop(page, 'aside[aria-label="Ask Slatebox"] form button[type="submit"]')).toBe('itself')
      expect(await onTop(page, '.MuiSpeedDial-fab')).toBe('itself')
      // The whole message form ends above the notice.
      const form = await conversation(page).getByRole('form', { name: 'Message Slatebox' }).boundingBox()
      const notice = await page.locator('.sb-cookie').boundingBox()
      expect(form!.y + form!.height).toBeLessThanOrEqual(notice!.y)
      // A click reaches it, and nothing on the page scrolls to make it: the panel's heading stays below the header.
      await conversation(page).getByRole('button', { name: 'Preview changes', exact: true }).click({ timeout: 5000 })
      await expect(keep(page)).toBeVisible({ timeout: 20000 })
      const header = await page.locator('.sb-board-toolbar').boundingBox()
      const heading = await conversation(page).getByRole('heading', { name: 'Ask Slatebox' }).boundingBox()
      expect(heading!.y).toBeGreaterThanOrEqual(header!.y + header!.height - 1)
    } finally { await cleanUp(page); await context.close() }
  })
}

for (const [width, height] of [[1440, 900], [390, 844]] as const) {
  test(`${width}px: closing the conversation with × from the keyboard gives focus back to Ask Slatebox`, async ({ browser }) => {
    const { context, page } = await open(browser, width, height)
    try {
      await newDrawing(page, 'answer')
      const close = conversation(page).getByRole('button', { name: 'Close conversation', exact: true })
      await close.focus()
      await page.keyboard.press('Enter')
      await expect(conversation(page)).toHaveCount(0)
      await expect(askButton(page)).toBeFocused()
      // And the button opens it again from the keyboard.
      await page.keyboard.press('Enter')
      await expect(conversation(page)).toBeVisible()
    } finally { await cleanUp(page); await context.close() }
  })
}

for (const [width, height] of [[390, 844], [820, 1180], [1440, 900]] as const) {
  test(`${width}px: the huddle strip stays on the canvas, clear of the conversation and the bar`, async ({ browser }) => {
    const { context, page } = await open(browser, width, height)
    try {
      await newDrawing(page, 'answer')
      const shareId = new URL(page.url()).pathname.split('/').pop()
      // The room the server would issue is stood in for, and the call joins nothing.
      await page.evaluate(id => {
        const m = (window as any).Meteor, call = m.callAsync.bind(m)
        m.callAsync = (name: string, ...args: any[]) => name === 'daily.join'
          ? Promise.resolve({ url: 'https://slatebox-local.daily.co/' + id, token: 'local-room-token', canTranscribe: false }) : call(name, ...args)
        const co = (window as any).require('@daily-co/daily-js').default.getCallInstance()
        co.join = () => Promise.resolve({ local: { session_id: 'local' } })
      }, shareId)
      await page.locator('[name="huddleEnabled"]').check()
      const strip = page.getByRole('region', { name: 'Huddle', exact: true })
      await expect(strip).toBeVisible()
      const check = () => page.evaluate(() => {
        const strip = document.querySelector('section[aria-label="Huddle"]')!.getBoundingClientRect()
        const canvas = document.getElementById('slateCanvas')!.getBoundingClientRect()
        const covers = [...document.querySelectorAll('aside[aria-label="Ask Slatebox"], .sb-canvas-bar')].map(el => el.getBoundingClientRect())
          .filter(r => r.left < strip.right - 1 && r.right > strip.left + 1 && r.top < strip.bottom - 1 && r.bottom > strip.top + 1).length
        const top = document.elementFromPoint(strip.x + 30, strip.y + strip.height / 2)
        return { covers, onCanvas: strip.top >= canvas.top - 1 && strip.bottom <= canvas.bottom + 1 && strip.left >= canvas.left - 1 && strip.right <= canvas.right + 1,
          seen: Boolean(top?.closest('section[aria-label="Huddle"]')) }
      })
      expect(await check()).toEqual({ covers: 0, onCanvas: true, seen: true })
      // With the conversation closed too.
      await conversation(page).getByRole('button', { name: 'Close conversation', exact: true }).click()
      await expect(conversation(page)).toHaveCount(0)
      await expect.poll(check).toEqual({ covers: 0, onCanvas: true, seen: true })
    } finally { await cleanUp(page); await context.close() }
  })
}

for (const [width, height, cookies] of [[844, 390, 'answer'], [360, 640, 'leave'], [390, 844, 'leave']] as const) {
  test(`${width}x${height}${cookies === 'leave' ? ', first visit' : ''}: with a preview waiting there is canvas to see it on, and Keep is on screen`, async ({ browser }) => {
    const { context, page } = await open(browser, width, height)
    try {
      await newDrawing(page, cookies)
      await messageBox(page).fill('Intake → Review → Send a reply')
      await messageBox(page).press('Enter')
      await expect(keep(page)).toBeVisible({ timeout: 20000 })
      await expect(keep(page)).toBeInViewport({ ratio: 1 })
      const seen = await visibleCanvas(page)
      expect(seen.height, 'canvas left above the conversation').toBeGreaterThanOrEqual(120)
      // At least one preview note is in the canvas a person can see.
      await expect.poll(async () => (await previewNotes(page).evaluateAll((els, seen) => els.map(el => el.getBoundingClientRect())
        .filter(r => r.bottom > seen.top + 4 && r.top < seen.bottom - 4 && r.right > 0 && r.left < innerWidth).length, seen))).toBeGreaterThan(0)
    } finally { await cleanUp(page); await context.close() }
  })
}

// A workshop slate (cards are notes).
const board: Workshop = {
  version: 1, title: 'Cards are notes',
  lanes: [{ id: 'now', label: 'Now' }, { id: 'next', label: 'Next', capacity: 1 }, { id: 'later', label: 'Later' }],
  cards: [{ id: 'alpha', label: 'Alpha', laneId: 'now' }, { id: 'beta', label: 'Beta', laneId: 'next' }],
}
async function openBoard(page: Page) {
  await page.goto(new URL('/new/workshop' + encodeWorkshopFragment(board), origin).href)
  await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
  await welcome(page, 'answer')
  await workshopReady(page)
  return slateKey(page)
}

for (const width of [1440, 390]) test(`${width}px: a workshop's drawing review turns Keep off, with the reason, once a card is traded under it`, async ({ browser }) => {
  const { context, page } = await open(browser, width, width < 600 ? 844 : 900)
  try {
    const key = await openBoard(page)
    await openConversation(page)
    await selectCard(page, 'alpha')
    await messageBox(page).fill('can you add a couple more regular notes')
    await messageBox(page).press('Enter')
    await expect(conversation(page).getByLabel('Review proposed drawing')).toContainText('2 notes for the slate')
    await expect(keep(page)).toBeEnabled()
    await expect(previewNotes(page).first()).toBeAttached()

    // A trade while the drawing waits: Beta leaves its lane and is a note on the canvas.
    const beta = await resting(page, 'card-beta'), now = await resting(page, 'column-now')
    await page.mouse.move(beta.x + beta.width / 2, beta.y + beta.height / 2)
    await page.mouse.down()
    await page.mouse.move(Math.max(20, now.x - 80), now.y + now.height + 60, { steps: 12 })
    await page.mouse.up()
    await expect.poll(async () => (await storedWorkshop(page, key)).cards.map((c: any) => c.id).join(' '), { timeout: 20000 }).toBe('alpha')

    // The preview was made on the drawing before the trade: it is not offered, and leaves the canvas.
    await expect(keep(page)).toBeDisabled()
    await expect(reason(page)).toHaveText(/drawing changed/i)
    await expect(previewNotes(page)).toHaveCount(0)
    await conversation(page).getByRole('button', { name: 'Discard preview', exact: true }).click()
    await expect(messageBox(page)).toBeEnabled()
    // The trade stands: Beta is a note of the slate, not a card.
    const slate = await getSlate(page, key)
    expect(slate.nodes.map((n: any) => n.options.text)).toContain('Beta')
  } finally { await cleanUp(page); await context.close() }
})

for (const width of [390, 360]) test(`${width}px: what a workshop proposal adds is brought into view on the stacked board`, async ({ browser }) => {
  const { context, page } = await open(browser, width, width === 360 ? 740 : 844)
  try {
    await openBoard(page)
    await openConversation(page)
    await messageBox(page).fill('add three cards to Later')
    await messageBox(page).press('Enter')
    await expect(keep(page)).toBeEnabled({ timeout: 20000 })
    const proposed = page.locator('#slateCanvas [data-workshop-proposed]')
    await expect.poll(() => proposed.count()).toBeGreaterThan(0)
    // Each proposed card is inside the canvas a person can see, not under the panel or below the fold.
    await expect.poll(async () => {
      const seen = await page.evaluate(() => {
        const header = document.querySelector('.sb-board-toolbar')!.getBoundingClientRect()
        const canvas = document.getElementById('slateCanvas')!.getBoundingClientRect()
        const below = [...document.querySelectorAll('aside[aria-label="Ask Slatebox"], .sb-canvas-bar, [role="group"][aria-label="Workshop"]')]
          .map(el => el.getBoundingClientRect().top).filter(top => top > header.bottom)
        return { top: Math.max(header.bottom, canvas.top), bottom: Math.min(canvas.bottom, ...below) }
      })
      return proposed.evaluateAll((els, seen) => els.filter(el => el.getAttribute('data-node-id')?.startsWith('card-'))
        .map(el => el.getBoundingClientRect()).map(r => r.top >= seen.top - 2 && r.bottom <= seen.bottom + 2 && r.left >= -2 && r.right <= innerWidth + 2), seen)
    }, { timeout: 10000 }).toEqual([true, true, true])
  } finally { await cleanUp(page); await context.close() }
})
