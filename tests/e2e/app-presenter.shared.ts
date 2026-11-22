import { expect, type FrameLocator, type Locator, type Page } from '@playwright/test'

// The presenter: Present on any slate (and a published /present link, and a live presentation)
// plays the slate's presentation, a sequence of viewpoints, over the slate's own SVG. The camera
// frames each viewpoint and dims the rest; the narrative is shown beside it.

export const presenter = (page: Page) => page.getByRole('dialog', { name: 'Presentation', exact: true })
export const livePresenter = (page: Page) => page.getByRole('dialog', { name: 'Live presentation', exact: true })
/** The "3 / 7" step counter in the presenter's controls. */
export const stepCounter = (scope: Page | Locator | FrameLocator) => scope.getByText(/^-?\d+ \/ \d+$/)
export const camera = (scope: Page | Locator | FrameLocator) => scope.locator('.sb-presentation-camera')

/** Present on this screen: the header's Present button, or its menu item where Present opens a menu. */
export async function openPresenter(page: Page) {
  const present = page.locator('.sb-board-toolbar').getByRole('button', { name: 'Present', exact: true })
  await present.click()
  const item = page.getByRole('menu', { name: 'Present' }).getByRole('menuitem', { name: 'Present on this screen', exact: true })
  if (await item.waitFor({ timeout: 1500 }).then(() => true, () => false)) await item.click()
  const dialog = presenter(page)
  await expect(dialog).toBeVisible()
  await expect(camera(dialog).locator('svg [data-node-id]').first()).toBeAttached({ timeout: 30_000 })
  // An editor can step through the local sequence at once; the AI's plan then replaces it and
  // the presenter starts again from the whole slate. Wait for the deck the presenter settles on
  // (the presenter says "Planning with AI…" while it plans; "Refining…" was its earlier word).
  await expect(dialog.getByText('Planning with AI…', { exact: true })).toHaveCount(0, { timeout: 90_000 })
  return dialog
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
    const nodes = [...surface.querySelectorAll<SVGGraphicsElement>('svg [data-node-id]')]
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
 * every note is lit and none is cut off. A lane's column (the backdrop behind its cards) is held
 * to being lit, as expectFramed holds it.
 */
export async function expectWholeSlate(dialog: Page | Locator) {
  await expect(dialog.locator('.sb-presentation-narrative')).not.toHaveText('')
  await expect.poll(() => camera(dialog).evaluate(surface => {
    const bounds = surface.parentElement!.getBoundingClientRect()
    const nodes = [...surface.querySelectorAll<SVGGraphicsElement>('svg [data-node-id]')]
    if (!nodes.length) return 'no notes'
    for (const node of nodes) {
      if (Number(getComputedStyle(node).opacity) <= 0.95) return 'dimmed: ' + node.dataset.nodeId
      if (node.dataset.nodeId!.startsWith('column-')) continue
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
    .filter(node => !/^(lane|card|column|caption|image)-/.test(node.dataset.nodeId!) && Number(getComputedStyle(node).opacity) > 0.95)
    .map(node => node.dataset.nodeId!))])

/** A presented viewpoint: its narrative is shown and the camera frames its notes. */
export async function expectScene(dialog: Locator, narrative: string | RegExp, nodeIds: string[]) {
  await expect(dialog.locator('.sb-presentation-narrative')).toHaveText(narrative)
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
