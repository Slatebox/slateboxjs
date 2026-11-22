import { expect, test, type Page } from '@playwright/test'

/**
 * The business boards (launch plan, sales pipeline, budget) attached to a live slate as native
 * notes, with their kits loaded from the boards entry only when a board is opened.
 */

async function open(page: Page, query: string) {
  await page.goto('/tests/fixtures/native-boards.html?' + query)
  await page.waitForFunction(() => (window as any).boards?.ready === true)
}
const box = (page: Page, id: string) => page.evaluate(key => (window as any).boards.box(key) as { x: number; y: number; width: number; height: number }, id)
const center = async (page: Page, id: string) => { const b = await box(page, id); return { x: b.x + b.width / 2, y: b.y + b.height / 2 } }
const refusals = (page: Page) => page.evaluate(() => (window as any).boards.log.refusals.map((r: any) => r.reason) as string[])
const edits = (page: Page) => page.evaluate(() => (window as any).boards.log.changes.map((c: any) => c.change.edits) as any[])
const value = (page: Page) => page.evaluate(() => (window as any).boards.board.value)
const layer = (page: Page, role: string) => page.locator(`#slate [data-board-layer="${role}"]`)

/** Press at `from`, carry to `to` in steps, then let go (or not). */
async function drag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }, release = true) {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 14 })
  await page.waitForTimeout(60)
  if (release) await page.mouse.up()
}

test.describe('desktop, 1440 by 900', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('an ordinary slate fetches neither the boards entry, the boards\' rules nor Dragology; a board slate fetches each once', async ({ page }) => {
    const seen: string[] = []
    page.on('request', request => seen.push(new URL(request.url()).pathname))
    await open(page, 'plain')
    await page.waitForTimeout(300)
    expect(seen.filter(path => /\/src\/boards\/|dragology|\/src\/workshops\/(?:rules|launchPlan|pipeline|budget|numbers)\.ts/.test(path))).toEqual([])
    seen.length = 0
    await open(page, 'board=launch-plan')
    expect(seen.filter(path => path.endsWith('/src/boards/index.ts'))).toHaveLength(1)
    expect(seen.filter(path => path.endsWith('/src/workshops/launchPlan.ts'))).toHaveLength(1)
    expect(seen.filter(path => /\/deps\/dragology\.js$|\/dragology\/dist-lib\/index\.js$/.test(path))).toHaveLength(1)
  })

  for (const board of ['launch-plan', 'pipeline', 'budget']) {
    test(`draws the ${board} as notes on the slate, not as a drawing of its own`, async ({ page }) => {
      await open(page, 'board=' + board)
      const cards = await page.evaluate(() => (window as any).boards.board.value.cards.map((card: any) => card.id) as string[])
      for (const id of cards) await expect(page.locator(`#slate g[data-node-id="card-${id}"]`)).toHaveCount(1)
      // Every card is a note of the slate's own canvas; nothing else draws the board.
      expect(await page.evaluate(ids => ids.every(id => (window as any).boards.slate.nodes.one('card-' + id)?.svgGroup?.node.parentNode === (window as any).boards.slate.canvas.node), cards)).toBe(true)
      expect(await page.locator('#slate [data-workshop-card], #slate foreignObject').count()).toBe(0)
    })
  }

  test('launch plan: a length grip stops at launch, says why while held, and refuses the drop past it', async ({ page }) => {
    await open(page, 'board=launch-plan')
    const bar = await box(page, 'card-build')
    const day = bar.width / 6
    const grip = await center(page, 'handle-build')
    await drag(page, grip, { x: grip.x + 3 * day, y: grip.y }, false)
    await expect(layer(page, 'clamp')).toHaveText('Launch is day 14.')
    await expect(layer(page, 'header')).toHaveAttribute('fill', '#c2410c')
    await page.mouse.up()
    expect(await refusals(page)).toEqual(['That pushes QA to day 15, after launch on day 14.'])
    // Said on screen, not only aloud: the sentence stays beside the grip, above every note.
    await expect(layer(page, 'clamp')).toHaveText('That pushes QA to day 15, after launch on day 14.')
    expect(await page.evaluate(() => document.querySelector('#slate svg')?.lastElementChild?.hasAttribute('data-board-layer-top'))).toBe(true)
    expect((await value(page)).cards.find((card: any) => card.id === 'build').duration).toBe(6)
    // The grip glides back to the end of the bar.
    await page.waitForTimeout(400)
    const again = await center(page, 'handle-build')
    await drag(page, again, { x: again.x + 2 * day, y: again.y })
    expect((await value(page)).cards.find((card: any) => card.id === 'build').duration).toBe(8)
    expect((await edits(page)).at(-1)).toEqual([{ kind: 'set_task', card: { id: 'build' }, duration: 8, lag: 0 }])
    await expect(layer(page, 'header')).toHaveText('Done day 14 · launch day 14')
  })

  test('launch plan: a bar dropped on another task waits on it, the arrow draws, and a click on the arrow removes it', async ({ page }) => {
    await open(page, 'board=launch-plan')
    await drag(page, await center(page, 'card-copy'), await center(page, 'card-qa'))
    expect((await value(page)).cards.find((card: any) => card.id === 'copy').dependsOn).toEqual(['qa'])
    const arrow = page.locator('#slate [data-board-link="qa>copy"]')
    await expect(arrow).toHaveCount(1)
    await drag(page, await center(page, 'card-design'), await center(page, 'card-qa'))
    expect((await refusals(page)).at(-1)).toBe('QA already waits on Design, so Design can\'t wait on QA.')
    // Partway along the arrow, clear of the grips at either end.
    const path = await arrow.evaluate(element => {
      const line = element as SVGPathElement
      const at = line.getPointAtLength(line.getTotalLength() * 0.4)
      const screen = new DOMPoint(at.x, at.y).matrixTransform(line.getScreenCTM()!)
      return { x: screen.x, y: screen.y }
    })
    await page.mouse.click(path.x, path.y)
    await expect.poll(async () => (await value(page)).cards.find((card: any) => card.id === 'copy').dependsOn).toBeUndefined()
  })

  test('launch plan by keyboard: L on a bar offers what it may wait on, Enter links it, and the arrow is a button Enter removes', async ({ page }) => {
    await open(page, 'board=launch-plan')
    await page.locator('#slate [data-node-id="card-copy"]').click()
    const said = () => page.evaluate(() => (window as any).boards.log.said.at(-1) as string)
    for (let i = 0; i < 6 && !/^Copy waits on QA/.test(await said()); i++) await page.keyboard.press('l')
    expect(await said()).toMatch(/^Copy waits on QA.*Enter to make it, Escape to cancel\.$/)
    // Shown, not saved, until Enter.
    expect((await value(page)).cards.find((card: any) => card.id === 'copy').dependsOn).toBeUndefined()
    await page.keyboard.press('Enter')
    await expect.poll(async () => (await value(page)).cards.find((card: any) => card.id === 'copy').dependsOn).toEqual(['qa'])
    expect((await edits(page)).at(-1)).toEqual(expect.arrayContaining([{ kind: 'link_tasks', card: { id: 'copy' }, waitsOn: { id: 'qa' } }]))
    const arrow = page.locator('#slate [data-board-link="qa>copy"]')
    await expect(arrow).toHaveAttribute('tabindex', '0')
    await expect(arrow).toHaveAttribute('aria-label', 'Remove the link: Copy waits on QA')
    await arrow.focus()
    await page.keyboard.press('Enter')
    await expect.poll(async () => (await value(page)).cards.find((card: any) => card.id === 'copy').dependsOn).toBeUndefined()
    // Escape puts back what a choice showed.
    await page.locator('#slate [data-node-id="card-qa"]').click()
    await page.keyboard.press('l')
    expect(await said()).toMatch(/^QA /)
    await page.keyboard.press('Escape')
    expect(await said()).toBe('Cancelled. Nothing changed.')
    expect((await value(page)).cards.find((card: any) => card.id === 'qa').dependsOn).toEqual(['build'])
  })

  test('pipeline: a skipped stage and a full stage refuse; one stage on moves the deal and the forecast', async ({ page }) => {
    await open(page, 'board=pipeline')
    await drag(page, await center(page, 'card-northwind'), await center(page, 'column-won'))
    expect((await refusals(page)).at(-1)).toBe('Deals move one stage at a time. Northwind is in Lead, so Qualified comes first.')
    await drag(page, await center(page, 'card-acme'), await center(page, 'column-proposal'))
    expect((await refusals(page)).at(-1)).toBe('Proposal already holds 3 of 3 deals.')
    await drag(page, await center(page, 'card-globex'), await center(page, 'column-qualified'))
    expect((await value(page)).cards.find((card: any) => card.id === 'globex').laneId).toBe('qualified')
    await expect.poll(() => page.evaluate(() => (window as any).boards.text('gauge-forecast'))).toBe('Forecast $201.5k of $250k')
  })

  // Boards S1 (2026-11-22, owner): a diamond dropped on a board becomes the board's card, and gets
  // its diamond back when it is dragged off. A business board used to drop the shape on the way in.
  for (const [board, lane, words] of [['pipeline', 'lead', 'Pick vendor $20k'], ['launch-plan', 'product', 'Pick vendor 3 days']]) {
    test(`${board}: a diamond dropped on it is a card that keeps its shape, and dragged off it is a diamond again`, async ({ page }) => {
      await open(page, 'board=' + board)
      // A diamond beside the board, below it, and the view takes in both.
      await page.evaluate(({ words }) => {
        const { board, slate } = (window as any).boards
        slate.addNode({ id: 'pick', x: board.origin.x + 40, y: board.origin.y + board.bounds.height + 60, width: 140, height: 90, text: words, shape: 'diamond', backgroundColor: '#f0d399' })
        const view = board.bounds
        slate.fitToWidth({ x: view.x ?? board.origin.x, y: view.y ?? board.origin.y, width: view.width, height: view.height + 220 })
      }, { words })
      await page.waitForTimeout(300)
      await drag(page, await center(page, 'pick'), await center(page, 'column-' + lane))
      await expect.poll(() => page.evaluate(() => (window as any).boards.board.value.cards.find((card: any) => card.id === 'pick')?.asNote?.shape ?? null)).toBe('diamond')
      const change = await page.evaluate(() => (window as any).boards.log.changes.at(-1).change)
      expect(change).toMatchObject({ cardId: 'pick', laneId: lane, noteToCard: { noteId: 'pick', asNote: { shape: 'diamond' }, look: { backgroundColor: '#f0d399' } } })
      expect(change.via).toBeUndefined()
      await page.waitForTimeout(400)
      // Off the board, onto open canvas below it: a diamond again, in its own colour.
      const out = await page.evaluate(() => {
        const { board, slate } = (window as any).boards
        return slate.worldToClient({ x: board.origin.x + 60, y: board.origin.y + board.bounds.height + 140 })
      })
      await drag(page, await center(page, 'card-pick'), out)
      await expect.poll(() => page.evaluate(() => (window as any).boards.slate.nodes.one('pick')?.options?.shape ?? null)).toBe('diamond')
      expect(await page.evaluate(() => (window as any).boards.slate.nodes.one('pick').options.backgroundColor)).toBe('#f0d399')
      expect(await page.evaluate(() => (window as any).boards.log.changes.at(-1).change)).toEqual({ cardId: 'pick', cardToNote: { noteId: 'pick' } })
      // Undo puts the card back, and says the change came from an undo.
      await page.mouse.click(5, 5)
      await page.keyboard.press('ControlOrMeta+z')
      await expect.poll(() => page.evaluate(() => (window as any).boards.board.value.cards.some((card: any) => card.id === 'pick'))).toBe(true)
      expect(await page.evaluate(() => (window as any).boards.log.changes.at(-1).change)).toMatchObject({ cardId: 'pick', noteToCard: { noteId: 'pick', asNote: { shape: 'diamond' } }, via: 'undo' })
    })
  }

  test('budget: a divider moves money and the total balances; held past what a team commits it stops and says so', async ({ page }) => {
    await open(page, 'board=budget')
    await drag(page, await center(page, 'card-contractor'), await center(page, 'column-design'))
    expect((await refusals(page)).at(-1)).toBe('Design has $30k left. Contractor costs $45k.')
    await page.waitForTimeout(400)
    const envelope = (await box(page, 'column-product')).width + 2
    const perDollar = envelope / 400000
    const grip = await center(page, 'handle-product')
    await drag(page, grip, { x: grip.x + 50000 * perDollar, y: grip.y })
    expect((await value(page)).lanes.map((lane: any) => lane.allocation)).toEqual([450000, 350000, 150000, 250000])
    await expect(layer(page, 'header')).toHaveText('$1.2M · balanced')
    const sales = await center(page, 'handle-sales')
    await drag(page, sales, { x: sales.x - 200000 * perDollar, y: sales.y }, false)
    await expect(layer(page, 'clamp')).toHaveText('Sales already commits $320k.')
    await page.mouse.up()
    expect((await value(page)).lanes.find((lane: any) => lane.id === 'sales').allocation).toBe(320000)
  })
})

test.describe('a phone: 390 by 844, touch', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  for (const board of ['launch-plan', 'pipeline', 'budget']) {
    test(`the ${board} fits the screen width with notes large enough to read`, async ({ page }) => {
      await open(page, 'board=' + board)
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
      const lanes = await page.evaluate(() => (window as any).boards.board.value.lanes.map((lane: any) => lane.id) as string[])
      for (const id of lanes) {
        const lane = await box(page, 'lane-' + id)
        expect(lane.x).toBeGreaterThanOrEqual(0)
        expect(lane.x + lane.width).toBeLessThanOrEqual(390)
        expect(lane.height).toBeGreaterThanOrEqual(24)
      }
    })
  }

  test('a press in the middle of a short bar slides it, never stretches it; its bar is 44px and its grip is past its end (review M2)', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Uses Chromium device input for real touch events')
    await open(page, 'board=launch-plan')
    const bar = await box(page, 'card-copy'), grip = await box(page, 'handle-copy')
    expect(bar.height).toBeGreaterThanOrEqual(43.5)
    expect(grip.x).toBeGreaterThanOrEqual(bar.x + bar.width - 0.5)
    const day = bar.width / 2
    const device = await page.context().newCDPSession(page)
    const touch = (type: string, points: { x: number; y: number }[]) => device.send('Input.dispatchTouchEvent', { type: type as any, touchPoints: points })
    const from = { x: bar.x + bar.width / 2, y: bar.y + bar.height / 2 }
    await touch('touchStart', [from])
    for (let i = 1; i <= 12; i++) await touch('touchMove', [{ x: from.x + day * 2 * i / 12, y: from.y + i }])
    await touch('touchEnd', [])
    await expect.poll(async () => (await value(page)).cards.find((card: any) => card.id === 'copy').lag ?? 0).toBeGreaterThan(0)
    expect((await value(page)).cards.find((card: any) => card.id === 'copy').duration).toBe(2)
  })

  test('a tap on a link selects it and says so; a second tap removes it (review M2)', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Uses Chromium device input for real touch events')
    await open(page, 'board=launch-plan')
    const arrow = page.locator('#slate [data-board-link="design>build"]')
    const point = () => arrow.evaluate(element => {
      const line = element as SVGPathElement
      const at = line.getPointAtLength(line.getTotalLength() * 0.5)
      const screen = new DOMPoint(at.x, at.y).matrixTransform(line.getScreenCTM()!)
      return { x: screen.x, y: screen.y }
    })
    expect(await arrow.getAttribute('stroke-width')).toBe('24')
    await page.touchscreen.tap((await point()).x, (await point()).y)
    await expect(arrow).toHaveAttribute('data-armed', '')
    expect(await page.evaluate(() => (window as any).boards.log.said.at(-1))).toBe('Link selected. Tap it again to remove it.')
    expect((await value(page)).cards.find((card: any) => card.id === 'build').dependsOn).toEqual(['design'])
    await page.touchscreen.tap((await point()).x, (await point()).y)
    await expect.poll(async () => (await value(page)).cards.find((card: any) => card.id === 'build').dependsOn).toBeUndefined()
  })

  test('a touch drag on a 44px grip changes a task\'s length', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Uses Chromium device input for real touch events')
    await open(page, 'board=launch-plan')
    const grip = await box(page, 'handle-build')
    expect(Math.min(grip.width, grip.height)).toBeGreaterThanOrEqual(43.5)
    const day = (await box(page, 'card-build')).width / 6
    const device = await page.context().newCDPSession(page)
    const touch = (type: string, points: { x: number; y: number }[]) => device.send('Input.dispatchTouchEvent', { type: type as any, touchPoints: points })
    const from = { x: grip.x + grip.width / 2, y: grip.y + grip.height / 2 }
    await touch('touchStart', [from])
    for (let i = 1; i <= 12; i++) await touch('touchMove', [{ x: from.x + day * i / 12, y: from.y }])
    await touch('touchEnd', [])
    await expect.poll(async () => (await value(page)).cards.find((card: any) => card.id === 'build').duration).toBe(7)
  })
})
