import { expect, type FrameLocator, type Locator, type Page } from '@playwright/test'

// The presenter: Present on any slate (and a published /present link, and a live presentation)
// plays the slate's presentation, a sequence of viewpoints, over the slate's own SVG. The camera
// frames each viewpoint and dims the rest; the narrative is shown beside it.

export const presenter = (page: Page) => page.getByRole('dialog', { name: 'Presentation', exact: true })
export const livePresenter = (page: Page) => page.getByRole('dialog', { name: 'Live presentation', exact: true })
/** The "3 / 7" step counter in the presenter's controls. */
// The presenter's own step counter (its label), not any "2 / 2" a board draws (a lane's count and limit).
export const stepCounter = (scope: Page | Locator | FrameLocator) => scope.getByLabel('Presentation steps', { exact: true })
export const camera = (scope: Page | Locator | FrameLocator) => scope.locator('.sb-presentation-camera, .sb-live-stage')
/**
 * Restated 2026-11-23 (styled presentations): a slate of plain notes plays as a styled deck on a
 * live canvas (.sb-live-stage): its notes are the slate's own, around them the style's stage notes
 * (ids sb-stage-* and sb-deco-*: titles, stickers, pictures), and its caption is the live
 * caption. A workshop, and a slate of one or two notes, still play over the slate's SVG.
 */
export const isLive = (scope: Page | Locator | FrameLocator) => scope.locator('.sb-live-stage').count().then(count => count > 0)
/** The step's words: the narrative over the SVG, or the live deck's caption. */
export const narrative = (scope: Page | Locator | FrameLocator) => scope.locator('.sb-presentation-narrative, .sbp-cap .t')

/** Present on this screen: the header's Present button, or its menu item where Present opens a menu. */
export async function openPresenter(page: Page) {
  const present = page.locator('.sb-board-toolbar').getByRole('button', { name: 'Present', exact: true })
  await present.click()
  const item = page.getByRole('menu', { name: 'Present' }).getByRole('menuitem', { name: 'Present on this screen', exact: true })
  if (await item.waitFor({ timeout: 1500 }).then(() => true, () => false)) await item.click()
  const dialog = presenter(page)
  await expect(dialog).toBeVisible()
  await expect(camera(dialog).locator('svg [data-node-id]').first()).toBeAttached({ timeout: 30_000 })
  // An editor can step through the local plan at once; Slatebox's plan takes its place at the
  // start, or is offered past it. Wait for the deck the presenter settles on: the presenter says
  // "Planning with Slatebox…" while it plans (the name of its progress indicator everywhere; a
  // phone shows "Planning…"), never for longer than its time limit, and the label is never cut off.
  const planning = dialog.getByRole('progressbar', { name: PLANNING, exact: true })
  if (await planning.isVisible().catch(() => false)) await expectWhole(dialog.locator('.sb-presentation-planning'))
  await expect(planning).toHaveCount(0, { timeout: 25_000 })
  return dialog
}

/** What the presenter says while Slatebox plans the slate. */
export const PLANNING = 'Planning with Slatebox…'

/** Every visible word of this element is shown whole: nothing clipped, wrapped away or off screen. */
export async function expectWhole(element: Locator) {
  expect(await element.evaluate(root => {
    const cut: string[] = []
    for (const node of [root, ...root.querySelectorAll<HTMLElement>('*')] as HTMLElement[]) {
      if (!node.getClientRects().length || getComputedStyle(node).display === 'none') continue
      if (node.scrollWidth > node.clientWidth + 1 && getComputedStyle(node).overflowX !== 'visible') cut.push('clipped: ' + node.textContent)
      const box = node.getBoundingClientRect()
      if (box.width && (box.left < -1 || box.right > innerWidth + 1)) cut.push('off screen: ' + node.textContent)
    }
    return cut
  })).toEqual([])
}

/** The presenter's own words: everything it shows except the slate's artwork. */
export const chromeText = (dialog: Locator) => dialog.evaluate(element => {
  const copy = element.cloneNode(true) as Element
  copy.querySelectorAll('.sb-presentation-camera').forEach(art => art.remove())
  return copy.textContent ?? ''
})

/** Words from the replaced workshop readout. The presenter never says them. */
export const readoutWords = /\bstations?\b|\btokens?\b|Next station|Decision presentation/i

/**
 * The camera frames exactly these notes: each is lit and painted inside the presenter, and every
 * other lane or card is dimmed. A lane's own column, caption and picture stay lit with it.
 */
export async function expectFramed(dialog: Page | Locator, nodeIds: string[]) {
  await expect.poll(() => camera(dialog).evaluate((surface, expected) => {
    const bounds = surface.parentElement!.getBoundingClientRect()
    const nodes = [...surface.querySelectorAll<SVGGraphicsElement>('svg [data-node-id]')].filter(node => !/^sb-(stage|deco)-/.test(node.dataset.nodeId!))
    const lit = (node: Element) => Number(getComputedStyle(node).opacity) > 0.95
    const want = new Set(expected)
    for (const id of expected) {
      const node = nodes.find(item => item.dataset.nodeId === id)
      if (!node || !lit(node)) return 'not lit: ' + id
      // Measure the painted shape and its label (a group's own box can include a nested SVG viewport).
      const art = [...node.querySelectorAll('[data-node-background-path], text')]
      for (const rect of (art.length ? art : [node]).map(item => item.getBoundingClientRect())) {
        if (rect.left < bounds.left - 2 || rect.right > bounds.right + 2 ||
          rect.top < bounds.top - 2 || rect.bottom > bounds.bottom + 2) return 'off screen: ' + id
      }
    }
    const stray = nodes.filter(node => /^(lane|card)-/.test(node.dataset.nodeId!) && !want.has(node.dataset.nodeId!) && lit(node))
    if (stray.length) return 'also lit: ' + stray.map(node => node.dataset.nodeId).join(',')
    for (const id of expected.filter(id => id.startsWith('lane-'))) {
      for (const part of ['column-', 'caption-']) {
        const node = nodes.find(item => item.dataset.nodeId === part + id.slice(5))
        if (node && !lit(node)) return 'dimmed: ' + part + id.slice(5)
      }
    }
    return 'ok'
  }, nodeIds), { timeout: 10_000 }).toBe('ok')
}

/**
 * The whole slate's viewpoint (a plan's opening and closing overview): its narrative is shown,
 * every note is lit and nothing drawn is cut off, a lane's column (the backdrop behind its cards)
 * included: every box sits inside the presenter.
 */
export async function expectWholeSlate(dialog: Page | Locator) {
  await expect(narrative(dialog)).not.toHaveText('')
  await expect.poll(() => camera(dialog).evaluate(surface => {
    const bounds = surface.parentElement!.getBoundingClientRect()
    const nodes = [...surface.querySelectorAll<SVGGraphicsElement>('svg [data-node-id]')].filter(node => !/^sb-(stage|deco)-/.test(node.dataset.nodeId!))
    if (!nodes.length) return 'no notes'
    for (const node of nodes) {
      if (Number(getComputedStyle(node).opacity) <= 0.95) return 'dimmed: ' + node.dataset.nodeId
      const art = [...node.querySelectorAll('[data-node-background-path], text')]
      for (const rect of (art.length ? art : [node]).map(item => item.getBoundingClientRect())) {
        if (rect.left < bounds.left - 2 || rect.right > bounds.right + 2 ||
          rect.top < bounds.top - 2 || rect.bottom > bounds.bottom + 2) return 'off screen: ' + node.dataset.nodeId
      }
    }
    return 'ok'
  }), { timeout: 10_000 }).toBe('ok')
}

/** The slate's own notes the camera lights now: every note but a workshop's lanes and cards and their parts. */
export const litNotes = (dialog: Page | Locator) => camera(dialog).evaluate(surface =>
  [...new Set([...surface.querySelectorAll<SVGGraphicsElement>('svg [data-node-id]')]
    .filter(node => !/^(lane|card|column|caption|image)-|^sb-(stage|deco)-/.test(node.dataset.nodeId!) && Number(getComputedStyle(node).opacity) > 0.95)
    .map(node => node.dataset.nodeId!))])

/** The stage notes the live deck lights now (its title, headlines, pictures, details). */
export const litStageNotes = (dialog: Page | Locator) => camera(dialog).evaluate(surface =>
  [...surface.querySelectorAll<SVGGraphicsElement>('svg [data-node-id^="sb-stage-"]')]
    .filter(node => Number(getComputedStyle(node).opacity) > 0.95)
    .map(node => node.dataset.nodeId!))

/**
 * Where a deck starts: over the SVG, the overview of the whole slate; a styled deck opens on its
 * title card, a stage note lit and the counter at 0.
 */
export async function expectDeckStart(dialog: Page | Locator) {
  if (!(await isLive(dialog))) return expectWholeSlate(dialog)
  await expect(stepCounter(dialog)).toHaveText(/^0 \/ \d+$/)
  await expect.poll(async () => (await litStageNotes(dialog)).some(id => id.endsWith('-title'))).toBe(true)
}

/**
 * Where a deck ends: over the SVG, the closing overview; a styled deck's homecoming lands on its
 * title card with the call to action, every one of the slate's notes lit around it.
 */
export async function expectDeckEnd(dialog: Page | Locator) {
  if (!(await isLive(dialog))) return expectWholeSlate(dialog)
  await expect.poll(async () => (await litStageNotes(dialog)).some(id => id.endsWith('-cta'))).toBe(true)
  const lit = await litNotes(dialog)
  const all = await camera(dialog).evaluate(surface => [...new Set([...surface.querySelectorAll<SVGGraphicsElement>('svg [data-node-id]')]
    .map(node => node.dataset.nodeId!).filter(id => !/^sb-(stage|deco)-/.test(id)))])
  expect(lit.sort()).toEqual(all.sort())
}

/**
 * A plan played from its start to its last step, as a slate of plain notes is presented: the
 * start ("0 / N") is the overview of the whole slate with its narrative; each segment after it has
 * a narrative and lights some of the slate's notes, framed; the last step (the closing overview)
 * is the whole slate again; together the segments show every note. A plan that is its overview
 * alone ("0 / 0", a slate of one or two notes) shows every note at the start. → the step count N.
 */
export async function expectPlanShows(page: Page, dialog: Locator, noteIds: string[]) {
  await expect(stepCounter(dialog)).toHaveText(/^0 \/ \d+$/, { timeout: 30_000 })
  const total = Number((await stepCounter(dialog).textContent())!.split('/')[1])
  await expectDeckStart(dialog)
  const live = await isLive(dialog)
  const shown = new Set<string>()
  if (total === 0) (await litNotes(dialog)).forEach(id => shown.add(id))
  for (let step = 1; step < total; step++) {
    await nextView(page, dialog)
    await expect(narrative(dialog)).not.toHaveText('')
    const lit = await litNotes(dialog)
    // A styled deck's deep zoom lights a nested detail (a stage note), not the slate's notes.
    if (live && !lit.length) expect((await litStageNotes(dialog)).length).toBeGreaterThan(0)
    else {
      expect(lit.length).toBeGreaterThan(0)
      await expectFramed(dialog, lit)
    }
    lit.forEach(id => shown.add(id))
  }
  if (total > 0) {
    // A plan with steps has at least one segment before its closing overview.
    expect(total).toBeGreaterThanOrEqual(2)
    await nextView(page, dialog)
    await expect(stepCounter(dialog)).toHaveText(total + ' / ' + total)
    await expectDeckEnd(dialog)
  }
  expect([...shown].sort()).toEqual([...noteIds].sort())
  return total
}

/** A presented viewpoint: its narrative is shown and the camera frames its notes. */
export async function expectScene(dialog: Locator, words: string | RegExp, nodeIds: string[]) {
  await expect(narrative(dialog)).toHaveText(words)
  await expectFramed(dialog, nodeIds)
}

/** A workshop lane's viewpoint: its narrative starts with the lane's name; it frames the lane and its cards. */
export async function expectLane(dialog: Page | Locator, label: string, laneId: string, cardIds: string[] = []) {
  await expect(dialog.locator('.sb-presentation-narrative')).toHaveText(new RegExp('^' + label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '( — .*)?$'))
  await expectFramed(dialog, ['lane-' + laneId, ...cardIds.map(id => 'card-' + id)])
}

/** Move to the next viewpoint with the keyboard and wait for the counter to reach it. */
export async function nextView(page: Page, dialog: Locator) {
  const before = Number((await stepCounter(dialog).textContent())!.split('/')[0])
  await page.keyboard.press('ArrowRight')
  await expect(stepCounter(dialog)).toHaveText(new RegExp('^' + (before + 1) + ' / \\d+$'))
}

/** Leave the presenter with Escape (out of full screen too) and wait for the board. */
export async function exitWithEscape(page: Page, dialog: Locator) {
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(false)
}
