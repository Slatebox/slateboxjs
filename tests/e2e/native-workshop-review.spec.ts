import { expect, test, type Browser, type Page } from '@playwright/test'

/**
 * What two hostile reviews of the native workshop found in the engine: keys pressed
 * on a control outside the canvas reaching the canvas, a note of the slate's own
 * that already carries a workshop name, a package with no data, and a phone whose
 * canvas one finger could not move. Same fixture as native-workshop.spec.ts.
 */

async function open(page: Page, query = '') {
  await page.goto('/tests/fixtures/native-workshop.html' + query)
  await page.waitForFunction(() => (window as any).native?.ready === true)
}
const box = (page: Page, id: string) =>
  page.evaluate(key => (window as any).native.box(key) as { x: number; y: number; width: number; height: number }, id)
const cards = (page: Page) =>
  page.evaluate(() => (window as any).native.board.value.cards.map((c: any) => c.id + '@' + c.laneId).join(' ') as string)
const view = (page: Page) => page.evaluate(() => {
  const v = (window as any).native.slate.canvas.viewbox()
  return { x: Math.round(v.x), y: Math.round(v.y), width: Math.round(v.width) }
})
const noteIds = (page: Page) => page.evaluate(() => (window as any).native.slate.nodes.allNodes.map((n: any) => n.id) as string[])

/** A button and a dialog beside the canvas, as a host page has them. */
async function hostControls(page: Page) {
  await page.evaluate(() => {
    const button = document.createElement('button')
    button.id = 'host-button'
    button.textContent = 'Discard preview'
    button.style.cssText = 'position:fixed;right:8px;top:8px;z-index:9999'
    const dialog = document.createElement('div')
    dialog.setAttribute('role', 'dialog')
    dialog.setAttribute('aria-label', 'Share')
    dialog.style.cssText = 'position:fixed;right:8px;top:60px;z-index:9999'
    const inside = document.createElement('button')
    inside.id = 'dialog-button'
    inside.textContent = 'Copy link'
    dialog.append(inside)
    document.body.append(button, dialog)
    // Some browsers go back a page on Backspace when no field has it. That is the page's to stop,
    // after the canvas has had its say: this listener runs once the engine's own has returned.
    window.addEventListener('keydown', event => { if (event.key === 'Backspace') event.preventDefault() })
  })
}

test.describe('keys pressed on a control outside the canvas', () => {
  test('Delete and Backspace on a host button or in a dialog leave the selected note alone', async ({ page }) => {
    await open(page)
    await hostControls(page)
    await page.evaluate(() => { const { slate } = (window as any).native; slate.selectNodes([slate.nodes.one('plain')]) })
    for (const control of ['#host-button', '#dialog-button']) {
      await page.focus(control)
      await page.keyboard.press('Backspace')
      await page.keyboard.press('Delete')
    }
    await page.waitForTimeout(150)
    expect(await noteIds(page)).toContain('plain')
    expect(await page.evaluate(() => JSON.parse((window as any).native.slate.exportJSON()).nodes.map((n: any) => n.options.id))).toEqual(['plain'])
    // With the keyboard back on the canvas the same key deletes the note, as it always has.
    const plain = await box(page, 'plain')
    await page.mouse.click(plain.x + plain.width / 2, plain.y + plain.height / 2)
    await page.keyboard.press('Delete')
    await expect.poll(() => noteIds(page)).not.toContain('plain')
  })

  test('arrows on a host button do not stage a card move, and Escape there does not clear the selection', async ({ page }) => {
    await open(page)
    await hostControls(page)
    await page.evaluate(() => { const { slate } = (window as any).native; slate.selectNodes([slate.nodes.one('card-alpha')]) })
    await page.focus('#host-button')
    const before = await page.evaluate(() => (window as any).native.log.previews.length)
    for (const key of ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Escape']) await page.keyboard.press(key)
    await page.waitForTimeout(150)
    const after = await page.evaluate(() => {
      const { log, slate } = (window as any).native
      return { previews: log.previews.length, selected: slate.getSelectedNodes().map((n: any) => n.id) }
    })
    expect(after).toEqual({ previews: before, selected: ['card-alpha'] })
    expect(await cards(page)).toBe('alpha@now beta@now gamma@now')
    // From the card itself the arrow stages the move and Enter makes it.
    const alpha = await box(page, 'card-alpha')
    await page.mouse.click(alpha.x + alpha.width / 2, alpha.y + alpha.height / 2)
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('Enter')
    await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
  })
})

test('while a card is held each lane\'s column says whether it takes the card, and stops saying so when the card is put down', async ({ page }) => {
  await open(page)
  const drops = () => page.evaluate(() => Object.fromEntries([...document.querySelectorAll('#slate [data-node-id^="column-"]')]
    .map(column => [column.getAttribute('data-node-id'), column.getAttribute('data-workshop-drop')])))
  expect(await drops()).toEqual({ 'column-now': null, 'column-later': null })
  const alpha = await box(page, 'card-alpha')
  const later = await box(page, 'column-later')
  await page.mouse.move(alpha.x + alpha.width / 2, alpha.y + alpha.height / 2)
  await page.mouse.down()
  await page.mouse.move(alpha.x + alpha.width / 2 + 12, alpha.y + alpha.height / 2 + 12, { steps: 4 })
  await expect.poll(drops).toEqual({ 'column-now': null, 'column-later': 'open' })
  await page.mouse.move(later.x + later.width / 2, later.y + later.height * 0.8, { steps: 10 })
  await expect.poll(drops).toEqual({ 'column-now': null, 'column-later': 'over' })
  await page.mouse.up()
  await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
  await expect.poll(drops).toEqual({ 'column-now': null, 'column-later': null })
  // Later is full now: Beta is offered nothing, and a drop there is refused on the lane.
  const beta = await box(page, 'card-beta')
  await page.mouse.move(beta.x + beta.width / 2, beta.y + beta.height / 2)
  await page.mouse.down()
  await page.mouse.move(beta.x + beta.width / 2 + 12, beta.y + beta.height / 2 + 12, { steps: 4 })
  await page.waitForTimeout(150)
  expect(await drops()).toEqual({ 'column-now': null, 'column-later': null })
  await page.mouse.move(later.x + later.width / 2, later.y + later.height * 0.8, { steps: 10 })
  await expect.poll(drops).toEqual({ 'column-now': null, 'column-later': 'refused' })
  await page.mouse.up()
  expect(await cards(page)).toBe('alpha@later beta@now gamma@now')
  // The refusal's cue goes with its outline.
  await expect.poll(drops, { timeout: 4000 }).toEqual({ 'column-now': null, 'column-later': null })
  // A viewer picks nothing up, so nothing is offered.
  await page.evaluate(() => (window as any).native.board.setReadOnly(true))
  const gamma = await box(page, 'card-gamma')
  await page.mouse.move(gamma.x + gamma.width / 2, gamma.y + gamma.height / 2)
  await page.mouse.down()
  await page.mouse.move(gamma.x + 40, gamma.y + 60, { steps: 4 })
  await page.waitForTimeout(150)
  expect(await drops()).toEqual({ 'column-now': null, 'column-later': null })
  await page.mouse.up()
})

test('a package with no data still runs, with and without a workshop on the slate', async ({ page }) => {
  await open(page)
  const run = () => page.evaluate(() => {
    const { slate } = (window as any).native
    const seen: string[] = []
    const exe = slate.collab.exe.bind(slate.collab)
    slate.collab.exe = (pkg: any) => { seen.push(pkg.type); return exe(pkg) }
    try {
      slate.collab.invoke([{ type: 'onProbeNull', data: null }, { type: 'onProbeUndefined', data: undefined }, { type: 'onProbeEmpty', data: {} }])
    } finally { slate.collab.exe = exe }
    return seen
  })
  const all = ['onProbeNull', 'onProbeUndefined', 'onProbeEmpty']
  expect(await run()).toEqual(all)
  await page.evaluate(() => (window as any).native.board.destroy())
  expect(await run()).toEqual(all)
})

test.describe('a slate whose own document already has a note with a workshop name', () => {
  test('attaching keeps that note the document\'s own and draws the whole workshop beside it', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(String(error)))
    await open(page, '?map')
    const state = await page.evaluate(async () => {
      const n = (window as any).native
      n.board.destroy()
      n.slate.addNode({ id: 'card-token', x: 60, y: 300, width: 160, height: 80, text: 'My own note' })
      n.slate.addNode({ id: 'lane-request', x: 60, y: 420, width: 160, height: 80, text: 'Also mine' })
      await n.slate.nodes.one('lane-request').ready
      n.log.changes.length = 0
      n.board = await n.attach(n.models.map())
      const { slate } = n
      const governed = (id: string) => !!slate.governanceOf(slate.nodes.one(id))
      return {
        mine: ['card-token', 'lane-request'].map(id => [slate.nodes.one(id).options.text, governed(id)]),
        saved: JSON.parse(slate.exportJSON()).nodes.map((x: any) => x.options.id),
        workshop: slate.nodes.allNodes.filter((x: any) => slate.governanceOf(x)).map((x: any) => [x.id, x.options.text]),
      }
    })
    // Both notes are still ordinary notes of the document, and still saved.
    expect(state.mine).toEqual([['My own note', false], ['Also mine', false]])
    expect(state.saved).toEqual(['plain', 'card-token', 'lane-request'])
    // The workshop drew every lane and its token, under other ids where the names were taken.
    const labels = state.workshop.map(([, text]) => text)
    for (const label of ['Refund request', 'Finance approves', 'Issue refund', 'Team']) expect(labels).toContain(label)
    const ids = state.workshop.map(([id]) => id)
    expect(ids).not.toContain('card-token')
    expect(ids).not.toContain('lane-request')
    const token = state.workshop.find(([, text]) => text === 'Team')![0]

    // The token still plays under the workshop's rules: one hop is allowed, two are not.
    const drop = async (laneId: string) => {
      const from = await box(page, token)
      const column = await box(page, 'column-' + laneId)
      await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
      await page.mouse.down()
      await page.mouse.move(column.x + column.width / 2, column.y + column.height * 0.8, { steps: 12 })
      await page.mouse.up()
    }
    await drop('refund')
    await page.waitForTimeout(400)
    expect(await cards(page)).toBe('token@request')
    await drop('finance')
    await expect.poll(() => cards(page)).toBe('token@finance')
    // The person's own note of that name did not move, and is not a card.
    const after = await page.evaluate(() => {
      const n = (window as any).native
      const mine = n.slate.nodes.one('card-token').options
      n.board.destroy()
      return { at: [mine.x, mine.y], left: n.slate.nodes.allNodes.map((x: any) => x.id) }
    })
    expect(after).toEqual({ at: [60, 300], left: ['plain', 'card-token', 'lane-request'] })
    expect(errors).toEqual([])
  })
})

test.describe('a phone: one finger on empty canvas pans it', () => {
  async function phone(browser: Browser, baseURL: string | undefined, query: string) {
    const context = await browser.newContext({ baseURL, hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })
    const page = await context.newPage()
    const device = await context.newCDPSession(page)
    await open(page, query)
    const touch = (type: string, points: { x: number; y: number }[]) =>
      device.send('Input.dispatchTouchEvent', { type: type as any, touchPoints: points })
    async function swipe(from: { x: number; y: number }, to: { x: number; y: number }, steps = 8) {
      await touch('touchStart', [from])
      for (let i = 1; i <= steps; i++) await touch('touchMove', [{ x: from.x + (to.x - from.x) * i / steps, y: from.y + (to.y - from.y) * i / steps }])
      await touch('touchEnd', [])
    }
    return { context, page, swipe }
  }

  test('a swipe up from a lane\'s empty space or from the margin brings the lanes below into view; a swipe on a card moves the card', async ({ browser, browserName, baseURL }) => {
    test.skip(browserName !== 'chromium', 'Uses Chromium device input for real touch events')
    const { context, page, swipe } = await phone(browser, baseURL, '?tall&empty&perRow=1&fitwidth')
    try {
      const start = await view(page)
      const done = await box(page, 'column-done')
      expect(done.y).toBeGreaterThan(844)
      // From the empty lower part of the first lane's column.
      const inbox = await box(page, 'column-inbox')
      await swipe({ x: inbox.x + inbox.width / 2, y: inbox.y + inbox.height - 20 }, { x: inbox.x + inbox.width / 2, y: inbox.y + inbox.height - 320 })
      const first = await view(page)
      expect(first.y - start.y).toBeGreaterThan(250)
      expect(first.y - start.y).toBeLessThan(350)
      expect(first.width).toBe(start.width)
      // From the margin beside the lanes (above the phone's zoom control, which now stands at the bottom of that margin).
      await swipe({ x: 372, y: 620 }, { x: 372, y: 220 })
      const second = await view(page)
      expect(second.y - first.y).toBeGreaterThan(330)
      // No selection rectangle was drawn and nothing was selected or moved by the swipes.
      expect(await page.evaluate(() => (window as any).native.slate.getSelectedNodes().length)).toBe(0)
      expect(await cards(page)).toBe('alpha@inbox beta@inbox gamma@inbox omega@done')
      expect(await page.evaluate(() => (window as any).native.log.changes.length)).toBe(0)
      // A finger that starts on a card still moves the card, not the canvas.
      await swipe({ x: 372, y: 300 }, { x: 372, y: 700 })
      await swipe({ x: 372, y: 300 }, { x: 372, y: 620 })
      const beforeCard = await view(page)
      const alpha = await box(page, 'card-alpha')
      const doing = await box(page, 'column-doing')
      await swipe({ x: alpha.x + alpha.width / 2, y: alpha.y + alpha.height / 2 }, { x: doing.x + doing.width / 2, y: doing.y + doing.height - 30 }, 12)
      await expect.poll(() => cards(page)).toBe('alpha@doing beta@inbox gamma@inbox omega@done')
      expect((await view(page)).width).toBe(beforeCard.width)
    } finally { await context.close() }
  })
})
