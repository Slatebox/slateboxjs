import { expect, test, type Page } from '@playwright/test'
import { dismissWelcome, removeTestGuest, userId } from './workshop-guests.shared'
import { conversation, workshopReady } from './app-native-workshop.shared'

/**
 * How a workshop slate opens in the running Meteor app.
 *
 * On a wide canvas the workshop is fitted and centred in what a person can see (the canvas
 * beside the open conversation and below the toolbar), with room around it, at no more than
 * 100%, and the minimap is not drawn over it. A slate that holds a drawing and a workshop shows
 * both. A phone keeps full-size lanes, one to a row, starting below the toolbar's own buttons,
 * and a cookie notice not yet answered covers neither a lane nor the conversation.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')

type Box = { left: number; top: number; right: number; bottom: number }
/** Where things are on screen, once the opening view has settled. */
const seen = (page: Page) => page.evaluate(() => {
  const box = (item: Element | null) => {
    if (!item) return null
    const { left, top, right, bottom } = item.getBoundingClientRect()
    return { left, top, right, bottom }
  }
  const around = (items: Element[]) => {
    const boxes = items.map(item => item.getBoundingClientRect())
    return boxes.length ? { left: Math.min(...boxes.map(b => b.left)), top: Math.min(...boxes.map(b => b.top)),
      right: Math.max(...boxes.map(b => b.right)), bottom: Math.max(...boxes.map(b => b.bottom)) } : null
  }
  const canvas = document.getElementById('slateCanvas')!
  // The slate's own drawing surface (the minimap draws the notes a second time).
  const surface = canvas.querySelector(':scope > svg')!
  const minimap = canvas.querySelector('.slateboxjs-birdseye')
  const engine = (window as any).slate.v2
  return {
    canvas: box(canvas)!,
    // The board: its lanes and its title row above them (its chrome, board polish), which the opening view fits too.
    lanes: around([...surface.querySelectorAll('[data-node-id^="column-"], [data-node-id^="lane-"], g[data-board-chrome]:not([data-board-badges])')])!,
    everything: around([...surface.querySelectorAll('[data-node-id]')])!,
    firstLane: box(surface.querySelector('[data-node-id^="lane-"]'))!,
    minimap: minimap && getComputedStyle(minimap).display !== 'none' ? box(minimap) : null,
    zoomControl: box(canvas.querySelector('.slatebox-zoom-slider')),
    notice: box(document.querySelector('.sb-cookie')),
    conversation: box(document.querySelector('aside[aria-label="Ask Slatebox"]')),
    status: box(document.querySelector('[role="group"][aria-label="Workshop"]')),
    zoom: engine.getZoom() as number,
    laneWidth: engine.nodes.allNodes.find((node: any) => String(node.options.id).startsWith('lane-')).options.width as number,
  }
})
const overlap = (a: Box, b: Box) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
const settled = async (page: Page) => {
  // The opening view is put back if the slate's own first framing moves it; wait that out.
  await page.waitForTimeout(4200)
  return seen(page)
}

/** Answer the welcome and nothing else. */
async function welcomed(page: Page) {
  const welcome = page.getByRole('dialog', { name: /welcome/i }).getByRole('button', { name: 'OK', exact: true })
  if (await welcome.waitFor({ timeout: 4000 }).then(() => true, () => false)) await welcome.click()
}

async function open(page: Page, path: string) {
  await page.goto(new URL(path, origin).href)
  await page.waitForURL(/\/canvas\/[a-zA-Z0-9]+$/)
  await expect.poll(() => userId(page)).toBeTruthy()
  return (await userId(page))!
}

test.describe('beside an open conversation on a wide screen', () => {
  test.use({ viewport: { width: 1360, height: 900 } })

  test('the workshop opens fitted and centred in the visible canvas, at no more than 100%, with no minimap over it', async ({ page }) => {
    let id: string | null = null
    try {
      id = await open(page, '/new/pilot-budget')
      // The welcome is answered and the cookie notice is not, as on a first visit.
      await welcomed(page)
      await workshopReady(page)
      await expect(conversation(page)).toBeVisible()
      const view = await settled(page)
      // The visible canvas: beside the conversation, below the toolbar.
      expect(view.canvas.right).toBeLessThanOrEqual(view.conversation!.left + 1)
      expect(view.canvas.top).toBeGreaterThanOrEqual(64)
      expect(view.zoom).toBeLessThanOrEqual(1)
      expect(view.zoom, 'four lanes fit this canvas at very nearly full size').toBeGreaterThan(0.95)
      // Room on every side, and nothing cut off.
      expect(view.lanes.left - view.canvas.left).toBeGreaterThanOrEqual(24)
      expect(view.canvas.right - view.lanes.right).toBeGreaterThanOrEqual(24)
      expect(view.lanes.top - view.canvas.top).toBeGreaterThanOrEqual(24)
      expect(view.canvas.bottom - view.lanes.bottom).toBeGreaterThanOrEqual(24)
      // Centred across the canvas, and between its top and the row at its foot that the zoom control lies over.
      expect(Math.abs((view.lanes.left + view.lanes.right) / 2 - (view.canvas.left + view.canvas.right) / 2)).toBeLessThanOrEqual(2)
      const above = view.lanes.top - view.canvas.top, below = view.canvas.bottom - view.lanes.bottom
      expect(below - above, 'the space under the workshop is the space above it plus the row the zoom control lies over').toBeGreaterThanOrEqual(0)
      expect(below - above).toBeLessThanOrEqual(view.canvas.bottom - view.zoomControl!.top + 4)
      // The whole slate is on screen, so there is no minimap, and so none over a lane.
      expect(view.minimap).toBeNull()
      expect(overlap(view.lanes, view.zoomControl!)).toBe(false)
      // The cookie notice has not been answered: it lies over a corner of the canvas, and over no lane.
      expect(view.notice, 'the notice is still there').not.toBeNull()
      expect(overlap(view.lanes, view.notice!)).toBe(false)

      // Zoomed in, part of the workshop is off screen and the minimap is there to find it by.
      await page.locator('#slateCanvas .slatebox-zoom-slider').getByRole('button', { name: 'Zoom in', exact: true }).first().click()
      await page.locator('#slateCanvas .slatebox-zoom-slider').getByRole('button', { name: 'Zoom in', exact: true }).first().click()
      await expect.poll(async () => (await seen(page)).minimap, 'the minimap comes back when the workshop no longer fits').not.toBeNull()
      // Fitted again, it goes.
      await page.locator('#slateCanvas .slatebox-zoom-slider').getByRole('button', { name: 'Fit to screen' }).click()
      await expect.poll(async () => (await seen(page)).minimap).toBeNull()
    } finally { await removeTestGuest(page, id) }
  })

  test('a slate with a drawing and a workshop opens showing both', async ({ page }) => {
    let id: string | null = null
    try {
      id = await open(page, '/new?empty=1')
      const chat = conversation(page)
      await expect(chat).toBeVisible({ timeout: 20000 })
      await dismissWelcome(page)
      await chat.getByRole('textbox').fill('Intake → Review → Notify')
      await chat.getByRole('button', { name: 'Preview changes' }).click()
      await chat.getByRole('button', { name: 'Keep changes' }).click()
      await expect(chat.getByLabel('Kept conversation')).toContainText('Intake → Review → Notify', { timeout: 20000 })
      await chat.getByRole('button', { name: 'Build a workshop', exact: true }).click()
      await chat.getByRole('button', { name: 'Preview changes' }).click()
      await chat.getByRole('button', { name: 'Keep changes' }).click()
      await workshopReady(page)
      // Open it as a person coming back to it would.
      await page.reload()
      await workshopReady(page)
      const drawn = page.locator('#slateCanvas [data-node-id^="chat-"]')
      await expect(drawn).toHaveCount(3)
      const view = await settled(page)
      const notes = await drawn.evaluateAll(items => items.map(item => { const { left, top, right, bottom } = item.getBoundingClientRect(); return { left, top, right, bottom } }))
      const inside = (box: Box) => box.left >= view.canvas.left + 20 && box.right <= view.canvas.right - 20 && box.top >= view.canvas.top + 20 && box.bottom <= view.canvas.bottom - 20
      for (const box of notes) expect(inside(box), 'each note of the drawing is on screen').toBe(true)
      expect(inside(view.lanes), 'the whole workshop is on screen').toBe(true)
      for (const box of notes) expect(overlap(box, view.lanes), 'the drawing and the workshop sit side by side').toBe(false)
      expect(view.zoom).toBeLessThanOrEqual(1)
      expect(Math.abs((view.everything.left + view.everything.right) / 2 - (view.canvas.left + view.canvas.right) / 2), 'the two together are centred').toBeLessThanOrEqual(3)
      expect(view.minimap).toBeNull()
    } finally { await removeTestGuest(page, id) }
  })
})

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('lanes open full size below the toolbar buttons, and an unanswered cookie notice covers no lane and no part of the conversation', async ({ page }) => {
    let id: string | null = null
    try {
      id = await open(page, '/new/pilot-budget')
      await welcomed(page)
      await workshopReady(page)
      const view = await settled(page)
      // Full-size lanes, one to a row, from the top of the canvas. Ask Slatebox is in the bar under the canvas.
      expect(view.zoom).toBeCloseTo(1, 2)
      expect(Math.round(view.firstLane.right - view.firstLane.left)).toBe(Math.round(view.laneWidth))
      expect(view.firstLane.top).toBeGreaterThanOrEqual(view.canvas.top)
      const bar = (await page.getByRole('region', { name: 'Slate tools' }).boundingBox())!
      expect(bar.y).toBeGreaterThanOrEqual(view.canvas.bottom - 1)
      expect(view.lanes.bottom, 'the lanes wrap down the page').toBeGreaterThan(view.canvas.bottom)
      // The notice has a band of its own under the canvas until it is answered.
      const notice = page.locator('.sb-cookie')
      await expect(notice).toBeVisible()
      expect(view.notice!.top).toBeGreaterThanOrEqual(view.canvas.bottom)
      // With the conversation open under the canvas, the notice is below it too.
      await page.getByRole('button', { name: 'Ask Slatebox', exact: true }).tap()
      await expect(conversation(page)).toBeVisible()
      const talking = await seen(page)
      expect(talking.notice!.top).toBeGreaterThanOrEqual(talking.conversation!.bottom)
      expect(talking.canvas.bottom).toBeLessThanOrEqual(talking.conversation!.top + 1)
      // Answered, the room it took goes back to the slate.
      await page.locator('[data-cookie-notice] button').tap()
      await expect(notice).toHaveCount(0)
      await expect.poll(async () => (await seen(page)).conversation!.bottom).toBeGreaterThan(talking.conversation!.bottom + 40)
    } finally { await removeTestGuest(page, id) }
  })
})
