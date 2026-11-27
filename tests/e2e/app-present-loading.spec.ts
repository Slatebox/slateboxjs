import { expect, test, type Page } from '@playwright/test'
import { openGuestCanvas } from './app-host.shared'
import { startPresentingToEveryone } from './app-header.shared'
import { resumeArchivedDraft } from './workshop-archive.shared'
import { dismissWelcome, removeTestGuest, userId } from './workshop-guests.shared'
import { workshopReady } from './app-native-workshop.shared'
import {
  camera, exitWithEscape, expectWhole, expectWholeSlate, livePresenter, openPresenter, PLANNING, presenter, stepCounter,
} from './app-presenter.shared'

// Present loads at once and is never stuck. The local plan plays immediately; Slatebox's plan
// takes its place at the start unseen, or past the start is offered ("Use it") without moving the
// viewer; planning stops at its time limit; a slate of one or two notes is not planned; and an
// overview frames everything drawn, a lane's column included. Slatebox's planner is played by a
// stub provider (tests/harness/stub-provider.mjs, the app's ai.stubEndpoint in development), so
// these run where one is set up: SLATEBOX_STUB_PROVIDER is its address.
const app = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
const stub = process.env.SLATEBOX_STUB_PROVIDER
const STUB_OPENING = 'Stub opening: the whole slate'

test.skip(!stub, 'Needs the stub provider (SLATEBOX_STUB_PROVIDER) behind a development app')

const planning = (page: Page) => presenter(page).getByRole('progressbar', { name: PLANNING, exact: true })
const narrative = (page: Page) => presenter(page).locator('.sb-presentation-narrative')
const total = async (page: Page) => Number((await stepCounter(presenter(page)).textContent())!.split('/')[1])
async function stubMode(page: Page, mode: { mode: 'fast' | 'slow' | 'hang', ms?: number }) {
  expect((await page.request.post(stub + '/mode', { data: mode })).ok()).toBe(true)
}
const stubRequests = async (page: Page) => (await (await page.request.get(stub + '/log')).json()).length

/** Present on this screen, without waiting for the plan: the local plan is there at once. */
async function startPresenting(page: Page, { counted = true } = {}) {
  await page.locator('.sb-board-toolbar').getByRole('button', { name: 'Present', exact: true }).click()
  const item = page.getByRole('menu', { name: 'Present' }).getByRole('menuitem', { name: 'Present on this screen', exact: true })
  if (await item.waitFor({ timeout: 1500 }).then(() => true, () => false)) await item.click()
  await expect(camera(presenter(page)).locator('svg [data-node-id]').first()).toBeAttached({ timeout: 30_000 })
  if (counted) await expect(stepCounter(presenter(page))).toHaveText(/^0 \/ \d+$/, { timeout: 30_000 })
}

async function mapSlate(page: Page) {
  await resumeArchivedDraft(page, app, 'map')
  await dismissWelcome(page)
  await workshopReady(page)
  return userId(page)
}

async function cleanUp(page: Page, uid: string | null) {
  if (!uid) return
  await page.goto(app + '/plans')
  await page.waitForFunction(id => (window as any).Meteor?.userId() === id, uid)
  await removeTestGuest(page, uid)
}

test('at the start, Slatebox\'s plan takes the local plan\'s place unseen; the overview frames every column', async ({ page }) => {
  let uid: string | null = null
  try {
    await stubMode(page, { mode: 'slow', ms: 2500 })
    uid = await mapSlate(page)
    const deck = await openPresenter(page)
    // Still at the start, now on Slatebox's overview: nothing offered, nothing moved.
    await expect(stepCounter(deck)).toHaveText(/^0 \/ \d+$/)
    await expect(narrative(page)).toHaveText(STUB_OPENING)
    await expect(deck.getByRole('button', { name: 'Use it', exact: true })).toHaveCount(0)
    // The whole drawing is framed, the lanes' columns included (expectWholeSlate holds every box
    // inside the presenter), at the start and at the close.
    await expectWholeSlate(deck)
    const steps = await total(page)
    for (let step = 1; step <= steps; step++) await page.keyboard.press('ArrowRight')
    await expect(stepCounter(deck)).toHaveText(steps + ' / ' + steps)
    await expectWholeSlate(deck)
    await exitWithEscape(page, deck)
  } finally {
    await cleanUp(page, uid)
  }
})

test('past the start, Slatebox\'s plan is offered and never moves the viewer; "Use it" plays it from its start', async ({ page }) => {
  let uid: string | null = null
  try {
    await stubMode(page, { mode: 'slow', ms: 6000 })
    uid = await mapSlate(page)
    await startPresenting(page)
    await expect(planning(page)).toBeVisible()
    // The local plan plays while Slatebox plans.
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect(stepCounter(presenter(page))).toHaveText(/^2 \/ \d+$/)
    const here = await narrative(page).textContent()
    const localTotal = await total(page)
    const offer = presenter(page).getByRole('button', { name: 'Use it', exact: true })
    await expect(offer).toBeVisible({ timeout: 15_000 })
    await expect(presenter(page).getByText("Slatebox's plan is ready", { exact: true })).toBeVisible()
    await expect(planning(page)).toHaveCount(0)
    // The viewer is where they were, on the local plan.
    await expect(stepCounter(presenter(page))).toHaveText('2 / ' + localTotal)
    await expect(narrative(page)).toHaveText(here!)
    await offer.click()
    await expect(stepCounter(presenter(page))).toHaveText(/^0 \/ \d+$/)
    await expect(narrative(page)).toHaveText(STUB_OPENING)
    await expect(offer).toHaveCount(0)
    await exitWithEscape(page, presenter(page))
  } finally {
    await cleanUp(page, uid)
  }
})

for (const size of [{ width: 2000, height: 1100 }, { width: 390, height: 844 }]) {
  test(`planning that never answers stops at its time limit; the label is whole at ${size.width}px`, async ({ browser }) => {
    test.setTimeout(120_000)
    // On a phone the slate is made on a computer first (a phone views slates and makes none: the app's phone
    // view); the same guest presents it on the phone.
    const phone = size.width < 600
    const desk = phone ? await browser.newContext({ viewport: { width: 1280, height: 800 } }) : null
    const maker = desk ? await desk.newPage() : null
    let uid: string | null = maker ? await mapSlate(maker) : null
    const context = await browser.newContext({ viewport: size, ...(desk ? { isMobile: true, hasTouch: true, storageState: await desk.storageState() } : {}) })
    const page = await context.newPage()
    try {
      await stubMode(page, { mode: 'hang' })
      if (maker) {
        await page.goto(maker.url())
        await maker.goto('about:blank')
        await workshopReady(page)
      } else uid = await mapSlate(page)
      const started = Date.now()
      await startPresenting(page)
      await expect(planning(page)).toBeVisible()
      // The words are whole: "Planning with Slatebox…", or "Planning…" on a phone.
      const label = presenter(page).locator('.sb-presentation-planning')
      await expect.poll(() => label.innerText()).toBe(size.width < 600 ? 'Planning…' : PLANNING)
      await expectWhole(label)
      // The local plan plays meanwhile.
      await page.keyboard.press('ArrowRight')
      await expect(stepCounter(presenter(page))).toHaveText(/^1 \/ \d+$/)
      // No longer than the time limit (the server stops at 17 s, the presenter at 20 s).
      await expect(planning(page)).toHaveCount(0, { timeout: 25_000 })
      expect(Date.now() - started).toBeLessThan(23_000)
      // Restated 2026-11-23: a styled deck plays Slatebox's own direction; why the AI did not plan
      // it is a chip (its words as its name), and the notice itself is in the More sheet.
      await expect(presenter(page).locator('.sb-presentation-plan-chip'))
        .toHaveAccessibleName("Slatebox's plan is unavailable: Slatebox took too long to plan this slate. Showing an automatic grouping of the slate.")
      await expect(stepCounter(presenter(page))).toHaveText(/^1 \/ \d+$/)
    } finally {
      await stubMode(page, { mode: 'fast' })
      await cleanUp(page, uid)
      await context.close()
      await desk?.close()
    }
  })
}

test('a slate of one or two notes is not planned: no planning, nothing sent, its overview at once', async ({ page }) => {
  let uid: string | null = null
  try {
    await stubMode(page, { mode: 'hang' })
    await openGuestCanvas(page, app)
    uid = await userId(page)
    const sent = await stubRequests(page)
    await startPresenting(page, { counted: false })
    // One overview, nothing to step through: no counter ("0 / 0" read as broken).
    await expect(stepCounter(presenter(page))).toHaveCount(0)
    // The note is framed on its own, large and centred: measured in the slate's SVG, never from
    // the origin (it was a speck in the top left at 6 %).
    await expectWholeSlate(presenter(page))
    await expect.poll(() => camera(presenter(page)).evaluate(surface => {
      const stage = surface.parentElement!.getBoundingClientRect()
      const art = surface.querySelector('svg [data-node-id] [data-node-background-path]') || surface.querySelector('svg [data-node-id]')
      const box = art!.getBoundingClientRect()
      const off = Math.abs((box.left + box.width / 2) - (stage.left + stage.width / 2)) / stage.width
      return box.width >= stage.width * 0.2 && off < 0.05 ? 'ok' : `${Math.round(box.width)}px wide, ${Math.round(off * 100)}% off centre`
    }), { timeout: 10_000 }).toBe('ok')
    // Planning never shows (watched for two seconds).
    for (let i = 0; i < 8; i++) {
      await expect(planning(page)).toHaveCount(0)
      await page.waitForTimeout(250)
    }
    await expect(narrative(page)).not.toHaveText('')
    expect(await stubRequests(page)).toBe(sent)
  } finally {
    await stubMode(page, { mode: 'fast' })
    await cleanUp(page, uid)
  }
})

test('presenting to everyone holds at the start while its deck is planned, then starts on Slatebox\'s plan', async ({ page }) => {
  let uid: string | null = null
  try {
    await stubMode(page, { mode: 'slow', ms: 4000 })
    uid = await mapSlate(page)
    await startPresentingToEveryone(page)
    const lead = livePresenter(page)
    const planningLive = lead.getByRole('progressbar', { name: PLANNING, exact: true })
    await expect(planningLive).toBeVisible({ timeout: 30_000 })
    await expect(stepCounter(lead)).toHaveText(/^0 \/ \d+$/)
    // Stepping does nothing yet: nobody follows before the deck is set.
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect(stepCounter(lead)).toHaveText(/^0 \/ \d+$/)
    await expect(planningLive).toHaveCount(0, { timeout: 25_000 })
    await expect(lead.locator('.sb-presentation-narrative')).toHaveText(STUB_OPENING)
    await expect(lead.getByRole('status')).toContainText('Presenting to everyone here · 0 of ')
    await page.keyboard.press('ArrowRight')
    await expect(stepCounter(lead)).toHaveText(/^1 \/ \d+$/)
    await lead.getByRole('button', { name: 'End presentation', exact: true }).click()
    await expect(lead).toHaveCount(0)
  } finally {
    await stubMode(page, { mode: 'fast' })
    await cleanUp(page, uid)
  }
})
