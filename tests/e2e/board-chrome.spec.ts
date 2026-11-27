import { expect, test, type Page } from '@playwright/test'

/**
 * Boards look designed (board polish, audit #3 #5 #7 #16), on a live slate: each board's chrome (its title and
 * its rules as a legend above it, badges where the rules act) is drawn from data under and over its notes and
 * never takes a pointer; two boards' title rows keep to their own room; a board in focus brings the rest of the
 * canvas down to 32% with the host's `focusing` class; the phone's zoom control stays off the board; and a
 * launch plan's words on a phone stay clear of its grips.
 */

type Box = { x: number; y: number; width: number; height: number }
const overlaps = (a: Box, b: Box) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height

/** The native-workshop fixture with a Team board (its rules: one column at a time, Doing holds 3, Won't do a bin) attached as the board. */
async function teamBoard(page: Page, query = '') {
  await page.goto('/tests/fixtures/native-workshop.html?empty' + query)
  await page.waitForFunction(() => (window as any).native?.ready === true)
  await page.evaluate(async () => {
    const n = (window as any).native
    await import('/src/workshops/behaviour.ts' as string)
    const { catalogPreset } = await import('/src/workshops/catalog.ts' as string)
    n.board.destroy()
    const team = catalogPreset('team-board')
    n.board = await n.attach(n.validateWorkshop({ ...team, cards: [{ id: 'a', label: 'Phone zoom', laneId: 'todo' }, { id: 'b', label: 'Board legend', laneId: 'doing' }] }),
      { origin: { x: 40, y: 120 } })
    n.slate.fitToWidth(n.board.frame)
  })
  await page.waitForTimeout(250)
}

test.describe('the chrome of a board', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('10. no rules note; the title and legend lie under the notes, the badges over them, and neither takes a pointer', async ({ page }) => {
    await teamBoard(page)
    await expect(page.locator('#slate [data-node-id$="rules-board"]')).toHaveCount(0)
    const under = page.locator('#slate g[data-board-chrome]:not([data-board-badges])')
    await expect(under).toHaveAttribute('aria-label', 'Team board: One column at a time, Won\'t do is a bin')
    await expect(under.locator('[data-board-layer="board-title"]')).toHaveText('Team board')
    await expect(under.locator('[data-board-layer="legend"]')).toHaveText(['One column at a time', 'Won\'t do is a bin'])
    const order = await page.evaluate(() => {
      const svg = document.querySelector('#slate svg')!
      const kids = [...svg.children]
      const index = (el: Element | null) => kids.indexOf(el!)
      const notes = kids.filter(el => el.hasAttribute('data-node-id')).map(index)
      return { under: index(svg.querySelector('g[data-board-chrome]:not([data-board-badges])')), over: index(svg.querySelector('g[data-board-badges]')),
        first: Math.min(...notes), last: Math.max(...notes),
        events: [...svg.querySelectorAll('g[data-board-chrome]')].map(g => getComputedStyle(g).pointerEvents) }
    })
    expect(order.under).toBeLessThan(order.first)
    expect(order.over).toBeGreaterThan(order.last)
    expect(order.events).toEqual(['none', 'none'])
    // Four seams (one column at a time) and the bin on Won't do.
    await expect(page.locator('#slate [data-board-layer^="seam-"]')).toHaveCount(4)
    await expect(page.locator('#slate [data-board-layer="badge-wont"]')).toHaveCount(1)
    // A press on a chip, the title or a badge lands on the canvas under it, never on the chrome.
    for (const role of ['legend', 'board-title', 'seam-todo>doing']) {
      const at = (await page.locator(`#slate [data-board-layer="${role}"]`).first().boundingBox())!
      const hit = await page.evaluate(([x, y]) => Boolean(document.elementFromPoint(x, y)?.closest('[data-board-chrome]')), [at.x + at.width / 2, at.y + at.height / 2])
      expect([role, hit]).toEqual([role, false])
    }
  })

  test('11. two boards: each title row lies inside its own room, clear of the other board', async ({ page }) => {
    await teamBoard(page)
    const boxes = await page.evaluate(async () => {
      const n = (window as any).native
      const first = n.board.bounds
      n.second = await n.attach(n.models.lanes(), { scope: 'b2', origin: { x: Math.round(first.x + 1220 + 160), y: Math.round(first.y) }, avoid: () => [n.board.frame] })
      n.slate.fitToContent()
      const world = (g: SVGGElement) => {
        const b = g.getBBox(), m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(g.getAttribute('transform')!)!
        return { x: b.x + +m[1], y: b.y + +m[2], width: b.width, height: b.height }
      }
      const [one, two] = ['main', 'b2'].map(scope => document.querySelector(`#slate g[data-board-chrome][data-board-scope="${scope}"]:not([data-board-badges])`) as SVGGElement)
      return { one: world(one), two: world(two), boardOne: n.board.bounds, boardTwo: n.second.bounds, frameOne: n.board.frame, frameTwo: n.second.frame }
    })
    for (const [chrome, frame] of [[boxes.one, boxes.frameOne], [boxes.two, boxes.frameTwo]] as [Box, Box][]) {
      expect(chrome.y).toBeGreaterThanOrEqual(frame.y - 1)
      expect(chrome.x + chrome.width).toBeLessThanOrEqual(frame.x + frame.width + 1)
    }
    expect(overlaps(boxes.two, boxes.boardOne)).toBe(false)
    expect(overlaps(boxes.one, boxes.boardTwo)).toBe(false)
    // The title row is above the board, not on it.
    expect(boxes.one.y + boxes.one.height).toBeLessThanOrEqual(boxes.boardOne.y)
  })

  test('12. in focus: the rest of the canvas at 32%, the board at full strength in its frame; Done (click or Enter) takes it out', async ({ page }) => {
    await teamBoard(page)
    await page.evaluate(async () => {
      const n = (window as any).native
      const { boardChromeStyles } = await import('/src/workshops/boardChrome.ts' as string)
      const style = document.createElement('style')
      style.textContent = boardChromeStyles
      document.head.appendChild(style)
      n.slate.addNode({ id: 'outside', x: -400, y: 160, width: 160, height: 80, text: 'Outside' })
      n.done = 0
      const value = n.board.value
      n.board.destroy()
      n.board = await n.attach(value, { origin: { x: 40, y: 120 }, onFocusDone: () => { n.done++; n.board.setFocused(false); document.querySelector('#slate')!.classList.remove('focusing') } })
      n.board.setFocused(true)
      document.querySelector('#slate')!.classList.add('focusing')
    })
    await page.waitForTimeout(400)
    const opacity = (selector: string) => page.locator(selector).first().evaluate(el => Number(getComputedStyle(el).opacity))
    expect(await opacity('#slate [data-node-id="outside"]')).toBeCloseTo(0.32, 2)
    expect(await opacity('#slate [data-node-id="card-a"]')).toBe(1)
    expect(await opacity('#slate g[data-board-chrome]')).toBe(1)
    await expect(page.locator('#slate [data-board-layer="focus-frame"]')).toHaveCount(1)
    const done = page.locator('#slate [data-board-layer="focus-done-box"]')
    await expect(done).toHaveAttribute('role', 'button')
    await done.click()
    await expect.poll(() => page.evaluate(() => (window as any).native.done)).toBe(1)
    await expect(page.locator('#slate [data-board-layer="focus-frame"]')).toHaveCount(0)
    await page.waitForTimeout(300)
    expect(await opacity('#slate [data-node-id="outside"]')).toBe(1)
    // Enter on Done does the same.
    await page.evaluate(() => { (window as any).native.board.setFocused(true); document.querySelector('#slate')!.classList.add('focusing') })
    await page.locator('#slate [data-board-layer="focus-done-box"]').focus()
    await page.keyboard.press('Enter')
    await expect.poll(() => page.evaluate(() => (window as any).native.done)).toBe(2)
  })
})

test.describe('a phone, 390 by 844', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('13. the zoom control stands clear of every column header and the legend, and +, − and fit work by tap', async ({ page }) => {
    await teamBoard(page, '&perRow=1')
    const control = page.locator('.slatebox-zoom-slider')
    await expect(control).toHaveAttribute('data-compact', '')
    const zoom = (await control.boundingBox())!
    const parts = await page.evaluate(() => [...document.querySelectorAll('#slate [data-node-id^="lane-"], #slate [data-board-chrome] [data-board-layer="legend"], #slate [data-board-layer="board-title"]')]
      .map(el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height } }))
    expect(parts.length).toBeGreaterThan(5)
    for (const part of parts) expect(overlaps(zoom, part)).toBe(false)
    const level = () => page.evaluate(() => (window as any).native.slate.getZoom())
    const start = await level()
    await page.locator('.slatebox-zoom-slider button[aria-label="Zoom in"]').tap()
    await expect.poll(level).toBeGreaterThan(start)
    const zoomed = await level()
    await page.locator('.slatebox-zoom-slider button[aria-label="Zoom out"]').tap()
    await expect.poll(level).toBeLessThan(zoomed)
    await page.locator('.slatebox-zoom-slider button[aria-label="Fit to screen"]').tap()
    await expect(control.locator('span')).toHaveText(/%$/)
  })

  test('14. a launch plan’s words on a phone are clear of every grip', async ({ page }) => {
    await page.goto('/tests/fixtures/native-boards.html?board=launch-plan')
    await page.waitForFunction(() => (window as any).boards?.ready === true)
    const clash = await page.evaluate(() => {
      const rect = (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, name: el.getAttribute('data-board-layer') } }
      const words = [...document.querySelectorAll('#slate text[data-board-layer^="words-"]')].map(rect)
      const grips = [...document.querySelectorAll('#slate rect[data-board-layer^="grip-"]')].map(rect)
      const hit = (a: any, b: any) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height
      return { words: words.length, grips: grips.length, clashes: words.flatMap(w => grips.filter(g => hit(w, g)).map(g => w.name + ' × ' + g.name)) }
    })
    expect(clash.words).toBeGreaterThan(3)
    expect(clash.grips).toBeGreaterThan(3)
    expect(clash.clashes).toEqual([])
  })
})
