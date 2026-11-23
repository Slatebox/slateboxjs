import { expect, test, type Page } from '@playwright/test'
import { randomBytes } from 'node:crypto'
import { register, retire, type Actor } from './agent-principals.shared'
import { getSlate } from './workshop-guests.shared'
import { conversation, messageBox, resting, slateKey } from './app-native-workshop.shared'

/**
 * Boards S4a (work-multiboard plan §2.4, §3): many boards on one slate, in the real Meteor app with the
 * local engine. A Retro, then a team board (Sprint) added beside it from the chat: the second lands past
 * the first board's room, 160 or more to its right, and a second browser on the slate sees it arrive live.
 * A note dropped on each board becomes a card there; "add a column" with Retro in focus changes Retro alone,
 * a rename with Sprint in focus changes Sprint alone; after a reload the boards are where they were, named
 * as they were. An exec call that names no board is refused with board_required, listing both.
 * SLATEBOX_SHOTS: keep a picture of each step there.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable accounts and slates; local app only.')

type Box = { x: number; y: number; width: number; height: number }
const centre = (box: Box) => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 })
const shot = async (page: Page, name: string) => {
  if (!process.env.SLATEBOX_SHOTS) return
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${process.env.SLATEBOX_SHOTS}/${name}-${page.viewportSize()?.width}.png` })
}
const gear = (page: Page) => page.locator('[data-board-gear]')
const focusChip = (page: Page) => conversation(page).locator('[data-board-focus]')
const stored = (page: Page) => getSlate(page, slateKey(page))

/** The world box of a board's notes (its lanes' headers and columns): the first board's are unprefixed, b2's are b2:… */
const boardBox = (page: Page, scope: string | null) => page.evaluate(scope => {
  const v2 = (window as any).slate.v2
  const parts = v2.getAllNodes().filter((n: any) => {
    const id = String(n.id)
    const named = scope ? id.startsWith(scope + ':') ? id.slice(scope.length + 1) : null : id.includes(':') ? null : id
    return named !== null && /^(lane|column)-/.test(named)
  }).map((n: any) => n.options)
  if (!parts.length) return null
  const left = Math.min(...parts.map((o: any) => o.x)), top = Math.min(...parts.map((o: any) => o.y))
  return { x: left, y: top, width: Math.max(...parts.map((o: any) => o.x + o.width)) - left, height: Math.max(...parts.map((o: any) => o.y + o.height)) - top }
}, scope)
/** Every board note's world place, by id: what a reload must give back. */
const places = (page: Page) => page.evaluate(() => Object.fromEntries((window as any).slate.v2.getAllNodes()
  .filter((n: any) => /^(b\d+:)?(lane|column|card)-/.test(String(n.id))).map((n: any) => [n.id, [Math.round(n.options.x), Math.round(n.options.y), n.options.text]])))

async function say(page: Page, text: string) {
  await messageBox(page).fill(text)
  await messageBox(page).press('Enter')
}
async function keep(page: Page) {
  await conversation(page).getByRole('button', { name: 'Keep changes', exact: true }).click({ timeout: 60000 })
}
/** A note made as a person makes one: a double-click on open canvas below the boards, its words typed. */
async function addNote(page: Page, text: string, under: Box) {
  const before = await page.evaluate(() => (window as any).slate.v2.freeNodes().map((n: any) => n.id))
  const at = await page.evaluate(({ x, y }) => (window as any).slate.v2.worldToClient({ x, y }), { x: under.x + 40, y: under.y + under.height + 160 })
  await page.mouse.dblclick(at.x, at.y)
  await page.keyboard.type(text)
  await page.keyboard.press('Enter')
  await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
  await page.waitForTimeout(500)
  return page.evaluate(known => (window as any).slate.v2.freeNodes().map((n: any) => n.id).find((id: string) => !known.includes(id)) as string, before)
}
async function carry(page: Page, id: string, to: { x: number; y: number }) {
  const from = centre(await resting(page, id))
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 14 })
  await page.waitForTimeout(80)
  await page.mouse.up()
}
/** A point low in a lane's column, clear of its header and cards. */
async function inColumn(page: Page, id: string) {
  const column = await resting(page, id)
  return { x: column.x + column.width / 2, y: column.y + column.height - 16 }
}
/** Whether a note is wholly on the canvas's screen. */
const inView = (page: Page, id: string) => page.evaluate(id => {
  const node = document.querySelector('#slateCanvas [data-node-id="' + id + '"]')?.getBoundingClientRect()
  const area = document.querySelector('#slateCanvas')!.getBoundingClientRect()
  return Boolean(node) && node!.left >= area.left - 1 && node!.right <= area.right + 1 && node!.top >= area.top - 1 && node!.bottom <= area.bottom + 1
}, id)
/** Bring a board into view (world box), at 70%. */
const look = (page: Page, box: Box) => page.evaluate(box => (window as any).slate.v2.fitToWidth({ x: box.x - 80, y: box.y - 120, width: box.width + 160, height: box.height + 460 }, 0, 0.7), box)

test.describe('many boards, 1440 by 900', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('a Retro, then a Sprint beside it; a note on each; focus changes one board; a reload keeps them; live on another browser; exec names the board', async ({ page, browser }) => {
    test.setTimeout(420_000)
    const owner: Actor = { page, id: null, email: 'boards-s4a-' + randomBytes(6).toString('hex') + '@qa.slatebox.invalid' }
    const errors: string[] = []
    page.on('pageerror', error => errors.push('A: ' + error.message))
    let second: Awaited<ReturnType<typeof browser.newContext>> | null = null
    try {
      const key = await register(owner, '/new')
      await page.goto(new URL('/canvas/' + key, origin).href)
      await page.waitForURL(/\/canvas\/[a-zA-Z0-9]{10}$/)
      const cookies = page.getByRole('button', { name: 'Accept cookies' })
      if (await cookies.isVisible().catch(() => false)) await cookies.click()
      if (!await conversation(page).isVisible()) await page.getByRole('button', { name: 'Ask Slatebox', exact: true }).click()
      await expect(conversation(page)).toBeVisible()

      // 1. A Retro from the chat: the slate's first board.
      await say(page, 'Add a retro')
      // A Retro's rules are all column limits, said by its counters ("0 / 3"): its preview says what Keep does instead.
      await expect(conversation(page).getByText('Drag notes onto it after Keep: each becomes a card.')).toBeVisible({ timeout: 60000 })
      await keep(page)
      await expect(page.locator('#slateCanvas [data-node-id="lane-well"]')).toBeVisible({ timeout: 60000 })
      await expect(conversation(page).getByRole('button', { name: 'What can this do?' })).toBeVisible({ timeout: 30000 })
      await page.waitForTimeout(4000) // past the page's own framing of a new board

      // A second browser on the slate (the same person on another device), open before the second board exists.
      second = await browser.newContext({ storageState: await page.context().storageState(), viewport: { width: 1440, height: 900 } })
      const other = await second.newPage()
      other.on('pageerror', error => errors.push('B: ' + error.message))
      await other.goto(page.url())
      await expect(other.locator('#slateCanvas [data-node-id="lane-well"]')).toBeVisible({ timeout: 60000 })
      await other.waitForTimeout(4000) // past that page's own framing
      let reloaded = 0
      other.on('framenavigated', frame => { if (frame === other.mainFrame()) reloaded++ })

      // 2. A Sprint (a team board) beside it, from the same chat: previewed where it goes, then kept. No "new slate".
      await expect(conversation(page).getByText(/new slate/i)).toHaveCount(0)
      await say(page, 'Add a team board about Sprint')
      await expect(conversation(page).getByText('Team board: Sprint, beside the board')).toBeVisible({ timeout: 60000 })
      await shot(page, 's4a-1-second-board-preview')
      await keep(page)
      await expect(conversation(page).getByText(/^Added Team board: Sprint beside the board/)).toBeVisible({ timeout: 60000 })
      await expect(page.locator('#slateCanvas [data-node-id="b2:lane-doing"]')).toBeAttached({ timeout: 60000 })
      await expect(page.locator('#slateCanvas [data-node-id="lane-well"]')).toBeAttached()

      // Stored: the first board where it was, the second at boards.b2, 160 past the first board's room (five lanes).
      const slate = await stored(page)
      expect(slate.creative.model.workshop.title).toBe('Retro')
      expect(slate.boards.b2.model.workshop.title).toBe('Team board: Sprint')
      expect(slate.boardSeq).toBe(2)
      expect(slate.boards.b2.origin).toEqual({ x: slate.options.workshopOrigin.x + 1220 + 160, y: slate.options.workshopOrigin.y })
      const retroBox = (await boardBox(page, null))!
      const sprintBox = (await boardBox(page, 'b2'))!
      expect(sprintBox.x - (retroBox.x + retroBox.width)).toBeGreaterThanOrEqual(160)
      // The board just added is brought into view, so the person sees where it went.
      await expect.poll(() => inView(page, 'b2:lane-doing'), { timeout: 10000 }).toBe(true)
      await shot(page, 's4a-2-new-board-in-view')
      await page.evaluate(({ a, b }) => (window as any).slate.v2.fitToWidth({ x: a.x - 60, y: a.y - 80, width: b.x + b.width - a.x + 120, height: Math.max(a.height, b.height) + 300 }, 0, 1), { a: retroBox, b: sprintBox })
      await shot(page, 's4a-2-two-boards')

      // The other browser drew it live, with no reload.
      await expect(other.locator('#slateCanvas [data-node-id="b2:lane-doing"]')).toBeAttached({ timeout: 30000 })
      expect(reloaded).toBe(0)
      await expect(other.getByText('A teammate updated this drawing')).toHaveCount(0)
      await other.evaluate(({ a, b }) => (window as any).slate.v2.fitToWidth({ x: a.x - 60, y: a.y - 80, width: b.x + b.width - a.x + 120, height: Math.max(a.height, b.height) + 300 }, 0, 1), { a: retroBox, b: sprintBox })
      await shot(other, 's4a-3-live-on-another-browser')

      // 3. A note dropped on each board becomes a card there, on that board only.
      await look(page, retroBox)
      const forRetro = await addNote(page, 'Kind reviews', retroBox)
      await carry(page, forRetro, await inColumn(page, 'column-well'))
      await expect.poll(async () => (await stored(page)).creative.model.workshop.cards.map((c: any) => c.label)).toContain('Kind reviews')
      await look(page, sprintBox)
      const forSprint = await addNote(page, 'Fix login', sprintBox)
      await carry(page, forSprint, await inColumn(page, 'b2:column-doing'))
      await expect.poll(async () => (await stored(page)).boards.b2.model.workshop.cards.find((c: any) => c.label === 'Fix login')?.laneId).toBe('doing')
      expect((await stored(page)).creative.model.workshop.cards.map((c: any) => c.label)).not.toContain('Fix login')
      await expect(page.locator('#slateCanvas [data-node-id^="b2:card-"]', { hasText: 'Fix login' })).toBeVisible()
      await shot(page, 's4a-4-note-on-sprint')

      // 3b. A Retro card let go on a Sprint lane joins that lane: released from Retro and adopted by Sprint,
      // saved in that order; it is then on exactly one board (plan §2.4).
      const both = { x: retroBox.x - 40, y: retroBox.y - 80, width: sprintBox.x + sprintBox.width - retroBox.x + 80, height: Math.max(retroBox.height, sprintBox.height) + 300 }
      await page.evaluate(box => (window as any).slate.v2.fitToWidth(box, 0, 1), both)
      await page.waitForTimeout(600)
      const kindCard = (await stored(page)).creative.model.workshop.cards.find((c: any) => c.label === 'Kind reviews')
      await carry(page, 'card-' + kindCard.id, await inColumn(page, 'b2:column-todo'))
      await expect.poll(async () => (await stored(page)).boards.b2.model.workshop.cards.filter((c: any) => c.label === 'Kind reviews').map((c: any) => c.laneId), { timeout: 20000 }).toEqual(['todo'])
      expect((await stored(page)).creative.model.workshop.cards.map((c: any) => c.label)).not.toContain('Kind reviews')
      expect((await stored(page)).nodes.filter((n: any) => n.options?.text === 'Kind reviews')).toEqual([])
      await expect(page.locator('#slateCanvas [data-node-id^="b2:card-"]', { hasText: 'Kind reviews' })).toBeVisible()
      // The other browser draws it on Sprint too, and on Sprint only.
      await expect(other.locator('#slateCanvas [data-node-id^="b2:card-"]', { hasText: 'Kind reviews' })).toBeAttached({ timeout: 30000 })
      await expect(other.locator('#slateCanvas [data-node-id^="card-"]', { hasText: 'Kind reviews' })).toHaveCount(0)
      await shot(page, 's4a-4b-retro-card-joins-sprint')

      // 4. With Retro in focus, "add a column" changes Retro alone.
      await look(page, retroBox)
      const column = await resting(page, 'column-change')
      await page.mouse.move(column.x + column.width / 2, column.y + column.height / 2, { steps: 4 })
      await expect(gear(page)).toHaveCount(1)
      await gear(page).click()
      await expect(focusChip(page)).toContainText('Retro')
      const before = await stored(page)
      await messageBox(page).fill('add a column called Blocked')
      await conversation(page).getByRole('button', { name: 'Preview changes', exact: true }).click()
      await keep(page)
      await expect.poll(async () => (await stored(page)).creative.model.workshop.lanes.map((l: any) => l.label)).toContain('Blocked')
      const afterRetro = await stored(page)
      expect(afterRetro.boards.b2.model.workshop.lanes).toEqual(before.boards.b2.model.workshop.lanes)
      expect(afterRetro.boards.b2.revision).toBe(before.boards.b2.revision)
      await shot(page, 's4a-5-retro-in-focus-new-column')

      // With Sprint in focus (its gear), a rename changes Sprint alone.
      await conversation(page).getByRole('button', { name: 'Stop editing this board' }).click()
      await look(page, sprintBox)
      const sprintColumn = await resting(page, 'b2:column-review')
      await page.mouse.move(sprintColumn.x + sprintColumn.width / 2, sprintColumn.y + sprintColumn.height / 2, { steps: 4 })
      await expect(gear(page)).toHaveCount(1)
      await gear(page).click()
      await expect(focusChip(page)).toContainText('Sprint')
      // "add a column" with Sprint in focus changes Sprint alone. A team board starts with five lanes, the most a
      // board holds, so one goes first (Done, empty).
      const beforeSprint = await stored(page)
      await messageBox(page).fill('remove the Done lane')
      await conversation(page).getByRole('button', { name: 'Preview changes', exact: true }).click()
      await keep(page)
      await expect.poll(async () => (await stored(page)).boards.b2.model.workshop.lanes.map((l: any) => l.label)).not.toContain('Done')
      await messageBox(page).fill('add a column called Parked')
      await conversation(page).getByRole('button', { name: 'Preview changes', exact: true }).click()
      await keep(page)
      await expect.poll(async () => (await stored(page)).boards.b2.model.workshop.lanes.map((l: any) => l.label)).toContain('Parked')
      const afterSprint = await stored(page)
      expect(afterSprint.creative.model.workshop.lanes).toEqual(beforeSprint.creative.model.workshop.lanes)
      expect(afterSprint.creative.revision).toBe(beforeSprint.creative.revision)
      expect(afterSprint.creative.model.workshop.lanes.map((l: any) => l.label)).not.toContain('Parked')
      await shot(page, 's4a-6a-sprint-in-focus-new-column')
      await messageBox(page).fill('rename Review to QA')
      await conversation(page).getByRole('button', { name: 'Preview changes', exact: true }).click()
      await keep(page)
      await expect.poll(async () => (await stored(page)).boards.b2.model.workshop.lanes.map((l: any) => l.label)).toContain('QA')
      expect((await stored(page)).creative.model.workshop.lanes.map((l: any) => l.label)).toEqual(afterRetro.creative.model.workshop.lanes.map((l: any) => l.label))
      await shot(page, 's4a-6-sprint-in-focus-renamed')
      await conversation(page).getByRole('button', { name: 'Stop editing this board' }).click()

      // Out of focus, with nothing selected, the chat asks which board, one chip per board.
      await page.mouse.click(200, 860)
      await say(page, 'add a card called Retro idea to Went well')
      await expect(conversation(page).getByText('Which board, Retro or Team board: Sprint?')).toBeVisible({ timeout: 30000 })
      await conversation(page).locator('[data-pick-board="main"]').click()
      await keep(page)
      await expect.poll(async () => (await stored(page)).creative.model.workshop.cards.map((c: any) => c.label)).toContain('Retro idea')
      await shot(page, 's4a-7-which-board')

      // Notes for the slate itself, out of focus: drawn on the slate, with no "Which board?" (that is only for a board change).
      const asked = await conversation(page).getByText(/^Which board/).count()
      await page.mouse.click(200, 860)
      await say(page, 'add two notes')
      await keep(page)
      await expect.poll(async () => (await stored(page)).nodes.filter((n: any) => n.options?.text === 'New note').length, { timeout: 30000 }).toBe(2)
      await expect(conversation(page).getByText(/^Which board/)).toHaveCount(asked)
      await shot(page, 's4a-7b-notes-for-the-slate')

      // 5. A reload draws both boards where they were, named as they were.
      await page.waitForTimeout(2500)
      const placed = await places(page)
      await page.reload()
      await expect(page.locator('#slateCanvas [data-node-id="b2:lane-doing"]')).toBeAttached({ timeout: 60000 })
      await expect.poll(() => places(page), { timeout: 20000 }).toEqual(placed)

      // 6. Exec: a workshop edit that names no board is refused with the boards; naming one saves on it alone.
      const token = await page.evaluate(async () => (await (window as any).Meteor.callAsync('apiTokens.create', { name: 'Many boards fixture', scopes: ['slates:read', 'slates:write'] })).token)
      const call = (operation: Record<string, unknown>) => page.request.post(new URL('/api/v1/slates/' + key + '/operations', origin).href, {
        headers: { Authorization: 'Bearer ' + token, 'Idempotency-Key': randomBytes(8).toString('hex') }, data: { plan: { message: 'Move', operations: [operation] } } })
      const now = await stored(page)
      const card = now.boards.b2.model.workshop.cards.find((c: any) => c.label === 'Fix login')
      const unnamed = await call({ kind: 'move_workshop_card', cardId: card.id, laneId: 'done', expectedRevision: now.boards.b2.revision })
      expect(unnamed.status(), await unnamed.text()).toBe(400)
      const refusal = await unnamed.json()
      expect(refusal.error.code).toBe('board_required')
      expect(refusal.error.details.boards.map((b: any) => [b.id, b.title])).toEqual([['main', 'Retro'], ['b2', 'Team board: Sprint']])
      // (A team board's path rule: Doing goes on to Review, renamed QA above.)
      const named = await call({ kind: 'move_workshop_card', boardId: 'b2', cardId: card.id, laneId: 'review', expectedRevision: now.boards.b2.revision })
      expect(named.status(), await named.text()).toBe(201)
      await expect.poll(async () => (await stored(page)).boards.b2.model.workshop.cards.find((c: any) => c.id === card.id)?.laneId).toBe('review')
      // The agent's edit raises the slate's counter for all boards in the same write, as a person's does.
      expect((await stored(page)).boardsRevision).toBeGreaterThan(now.boardsRevision)
      // The page draws an agent's move on the board it was made on.
      await expect.poll(() => page.locator('#slateCanvas [data-node-id="b2:card-' + card.id + '"]').getAttribute('aria-label')).toMatch(/in QA$/)
      await shot(page, 's4a-8-exec-move-on-sprint')
      expect(errors).toEqual([])
    } finally {
      await second?.close()
      await retire(owner).catch(() => {})
    }
  })
})

test.describe('many boards on a phone, 390 by 844', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('a second board is added beside the first in its narrow layout; selecting its lane offers "Change this board" for it', async ({ page }) => {
    test.setTimeout(300_000)
    const owner: Actor = { page, id: null, email: 'boards-s4a-phone-' + randomBytes(6).toString('hex') + '@qa.slatebox.invalid' }
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    try {
      const key = await register(owner, '/new')
      await page.goto(new URL('/canvas/' + key, origin).href)
      await page.waitForURL(/\/canvas\/[a-zA-Z0-9]{10}$/)
      const cookies = page.getByRole('button', { name: 'Accept cookies' })
      if (await cookies.isVisible().catch(() => false)) await cookies.click()
      const open = async () => {
        if (!await conversation(page).isVisible()) await page.getByRole('button', { name: 'Ask Slatebox', exact: true }).first().click()
        await expect(conversation(page)).toBeVisible()
      }
      await open()
      await say(page, 'Add a retro')
      await keep(page)
      await expect(page.locator('#slateCanvas [data-node-id="lane-well"]')).toBeAttached({ timeout: 60000 })
      await page.waitForTimeout(4000)
      await open()
      await say(page, 'Add a team board about Sprint')
      await expect(conversation(page).getByText('Team board: Sprint, beside the board')).toBeVisible({ timeout: 60000 })
      await keep(page)
      await expect(page.locator('#slateCanvas [data-node-id="b2:lane-doing"]')).toBeAttached({ timeout: 60000 })
      // On a phone each board keeps its narrow layout (one lane to a row), always inside the room it keeps: they never meet.
      const retroBox = (await boardBox(page, null))!
      const sprintBox = (await boardBox(page, 'b2'))!
      expect(sprintBox.x - (retroBox.x + retroBox.width)).toBeGreaterThanOrEqual(160)
      expect(retroBox.width).toBeLessThan(1220)
      // Close the sheet: the board just added is in view.
      await page.getByRole('button', { name: /close/i }).first().click().catch(() => {})
      await expect.poll(() => inView(page, 'b2:lane-todo'), { timeout: 10000 }).toBe(true)
      await shot(page, 's4a-9-phone-second-board')
      // Tap the Sprint board's lane header: its bar offers "Change this board", for Sprint.
      const header = centre(await resting(page, 'b2:lane-todo'))
      await page.touchscreen.tap(header.x, header.y)
      const change = page.locator('.sb-style-layer').getByRole('button', { name: 'Change this board' })
      await expect(change).toBeVisible()
      await shot(page, 's4a-10-phone-board-bar')
      await change.click()
      await expect(focusChip(page)).toContainText('Sprint')
      await shot(page, 's4a-11-phone-sprint-in-focus')
      expect(errors).toEqual([])
    } finally {
      await retire(owner).catch(() => {})
    }
  })
})
