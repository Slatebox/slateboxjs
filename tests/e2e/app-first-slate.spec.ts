import { expect, test, type Browser, type Page } from '@playwright/test'
import { getSlate, removeTestGuest, userId } from './workshop-guests.shared'
import { conversation, dragCardNamed, slateKey, storedWorkshop, workshopReady } from './app-native-workshop.shared'

// The signed-out "Create slate" first run: /new asks "What should your first slate do?" (8 jobs, a second
// one-click question for some, their own words, Skip) and opens a real working board for the answer, with
// a "How this board works" note and three Ask Slatebox starters, and no agent call anywhere.
const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
test.skip(!/localhost|127\.0\.0\.1|test\.slatebox\.com/.test(origin), 'Creates disposable guests and slates; local or staging only.')
const at = (path: string) => new URL(path, origin).href
const AGENT_METHODS = /"method":"(?:workshops\.(?:laneChat|mapChat|draft)|canvasConversation\.draft|aiChatCompletion)"/

/** A virgin browser: no cookies, no storage, no Meteor login token. Records every DDP method it calls. */
async function virgin(browser: Browser, viewport = { width: 1440, height: 900 }) {
  const phone = viewport.width < 600
  const context = await browser.newContext({ viewport, hasTouch: phone, isMobile: phone })
  const page = await context.newPage()
  const sent: string[] = []
  page.on('websocket', socket => socket.on('framesent', frame => { if (typeof frame.payload === 'string') sent.push(frame.payload) }))
  await page.goto(at('/new'))
  expect(await page.evaluate(() => localStorage.getItem('Meteor.loginToken') ?? localStorage.getItem('meteor_token'))).toBeNull()
  return { context, page, sent }
}
const heading = (page: Page) => page.getByRole('heading', { name: 'What should your first slate do?', level: 1 })
const jobs = (page: Page) => page.getByRole('group', { name: 'Pick a job' }).getByRole('button')
const starters = (page: Page) => conversation(page).getByRole('group', { name: 'Starter messages' })
async function onCanvas(page: Page) {
  await page.waitForURL(/\/canvas\/[a-zA-Z0-9]{10}$/, { timeout: 30000 })
  await expect.poll(() => userId(page)).toBeTruthy()
  return (await userId(page))!
}

test('(a)(b)(c) a virgin visitor picks ship → My team and gets a working launch plan, its note and three starters; starter 2 changes it with no agent call', async ({ browser }) => {
  const { context, page, sent } = await virgin(browser)
  let id: string | null = null
  try {
    await expect(heading(page)).toBeVisible()
    await expect(jobs(page)).toHaveCount(8)
    await expect(page.getByRole('button', { name: /^Ship something by a date\. Tasks on real workdays/ })).toBeVisible()
    await page.getByRole('button', { name: /^Ship something by a date/ }).click()
    await expect(page).toHaveURL(/\?job=ship$/)
    await expect(page.getByRole('heading', { name: 'Who’s it with?', level: 2 })).toBeFocused()
    await page.getByRole('button', { name: 'My team', exact: true }).click()
    id = await onCanvas(page)
    await workshopReady(page)
    const stored = await getSlate(page, slateKey(page))
    expect(stored.creative.model.workshop.kind).toBe('launch-plan')
    expect(stored.creative.model.workshop.title).toBe('Launch plan')
    expect(stored.options.firstRun).toMatchObject({ job: 'ship', with: 'team', share: 'team', v: 1 })
    await expect(page.locator('#slateCanvas [data-node-id="first-run-how"]')).toContainText('How this board works')
    await expect(conversation(page).getByText('This board is yours. Try a starter, or just say what to change.')).toBeVisible()
    await expect(starters(page).getByRole('button', { name: /^Plan a launch for day 18/ })).toBeVisible()
    await expect(starters(page).getByRole('button', { name: 'Make Build 8 days' })).toBeVisible()
    await expect(starters(page).getByRole('button', { name: 'Add a retro' })).toBeVisible()
    await expect(page.getByText('Sign in to use AI')).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Invite your team' })).toBeVisible()
    // Remembered on the guest (no other personal data).
    expect(await page.evaluate(() => (window as any).Meteor.user()?.profile?.start)).toMatchObject({ job: 'ship', with: 'team', via: 'card', resolved: 'ship.team', v: 1 })

    const before = (await storedWorkshop(page, slateKey(page))).cards.find((card: any) => card.label === 'Build').duration
    await starters(page).getByRole('button', { name: 'Make Build 8 days' }).click()
    await conversation(page).getByRole('textbox').press('Enter')
    await conversation(page).getByRole('button', { name: 'Keep changes' }).click()
    await expect.poll(async () => (await storedWorkshop(page, slateKey(page))).cards.find((card: any) => card.label === 'Build').duration).toBe(8)
    expect(before).toBe(6)
    expect(sent.filter(frame => AGENT_METHODS.test(frame))).toEqual([])
  } finally { await removeTestGuest(page, id); await context.close() }
})

test('(d) Skip opens This week with four cards, and Doing refuses a fourth card', async ({ browser }) => {
  const { context, page } = await virgin(browser)
  let id: string | null = null
  try {
    await page.getByRole('button', { name: 'Skip', exact: true }).click()
    id = await onCanvas(page)
    await workshopReady(page)
    const board = await storedWorkshop(page, slateKey(page))
    expect(board.title).toBe('This week')
    expect(board.cards).toHaveLength(4)
    await dragCardNamed(page, 'Drag me to Doing', 'Doing')
    await expect.poll(async () => (await storedWorkshop(page, slateKey(page))).cards.filter((card: any) => card.laneId === 'doing').length).toBe(3)
    await dragCardNamed(page, 'Write your first task here', 'Doing')
    await page.waitForTimeout(800)
    expect((await storedWorkshop(page, slateKey(page))).cards.filter((card: any) => card.laneId === 'doing').length).toBe(3)
    expect(await page.evaluate(() => (window as any).Meteor.user()?.profile?.start?.via)).toBe('skip')
  } finally { await removeTestGuest(page, id); await context.close() }
})

test('(e) their own words with arrows draw a native diagram of three notes', async ({ browser }) => {
  const { context, page } = await virgin(browser)
  let id: string | null = null
  try {
    await page.getByLabel('Or say it in your own words').fill('Request comes in → Triage → Close')
    await page.getByRole('button', { name: 'Make it', exact: true }).click()
    id = await onCanvas(page)
    // The steps, to the right of the "How this board works" note every first slate has.
    await expect.poll(async () => ((await getSlate(page, slateKey(page)))?.nodes ?? []).map((node: any) => node.options.text.split('\n')[0]))
      .toEqual(['How this board works', 'Request comes in', 'Triage', 'Close'])
    await expect(page.locator('#slateCanvas g[data-node-id]')).toHaveCount(4)
  } finally { await removeTestGuest(page, id); await context.close() }
})

test('(f) a retired Friday link lands on the first run', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  try {
    await page.goto(at('/new#brief=x&source=friday-launch'))
    await expect(heading(page)).toBeVisible()
    await expect(page).toHaveURL(/\/new$/)
    await expect(page.getByText('could not be found')).toHaveCount(0)
  } finally { await context.close() }
})

test('(g) on a phone the jobs are one column with no sideways scroll', async ({ browser }) => {
  const { context, page } = await virgin(browser, { width: 390, height: 844 })
  try {
    await expect(jobs(page)).toHaveCount(8)
    const lefts = new Set(await jobs(page).evaluateAll(buttons => buttons.map(button => Math.round(button.getBoundingClientRect().left))))
    expect(lefts.size).toBe(1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    for (const box of await jobs(page).evaluateAll(buttons => buttons.map(button => button.getBoundingClientRect().height))) expect(box).toBeGreaterThanOrEqual(48)
  } finally { await context.close() }
})

test('(h) once answered, a reload and Create slate open a blank slate', async ({ browser }) => {
  const { context, page } = await virgin(browser)
  let id: string | null = null
  try {
    await page.getByRole('button', { name: /^Track deals to a target/ }).click()
    id = await onCanvas(page)
    await workshopReady(page)
    expect((await storedWorkshop(page, slateKey(page))).kind).toBe('pipeline')
    const first = page.url()
    await page.reload()
    await page.goto(at('/new'))
    await page.waitForURL(/\/canvas\/[a-zA-Z0-9]{10}$/)
    expect(page.url()).not.toBe(first)
    await expect(page.getByRole('region', { name: 'Your slate is ready' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Start from a job' })).toHaveAttribute('href', '/new?again=1')
  } finally { await removeTestGuest(page, id); await context.close() }
})

test('Make it yours: starter 1 on an untouched launch plan rebuilds it in place from the visitor’s own tasks', async ({ browser }) => {
  const { context, page, sent } = await virgin(browser)
  let id: string | null = null
  try {
    await page.goto(at('/new?job=ship&with=team'))
    id = await onCanvas(page)
    await workshopReady(page)
    await starters(page).getByRole('button', { name: /^Plan a launch for day 18/ }).click()
    await conversation(page).getByRole('textbox').press('Enter')
    // The preview says what Keep does: this board, rebuilt (not an interactive route).
    await expect(conversation(page).getByText('Preview · This board, rebuilt from your words')).toBeVisible()
    // Kept, the page takes the rebuilt board live, with no reload, and the turn stays in the conversation.
    let loads = 0
    page.on('load', () => { loads++ })
    await conversation(page).getByRole('button', { name: 'Keep changes' }).click()
    await expect(conversation(page).getByText(/^Rebuilt the board from your words/)).toBeVisible()
    await expect.poll(async () => (await storedWorkshop(page, slateKey(page))).cards.map((card: any) => card.label), { timeout: 15000 }).toEqual(['Design', 'Build', 'QA'])
    await expect(page.locator('#slateCanvas').getByText('QA · 2d', { exact: true }).first()).toBeVisible()
    // Its note names the new board's tasks, on the canvas and as stored.
    // (The note wraps its lines, so its words are read without the spaces at the breaks.)
    await expect.poll(async () => ((await page.locator('#slateCanvas [data-node-id="first-run-how"]').textContent()) ?? '').replace(/\s+/g, '')).toContain('DragDesignlaterandBuildandQAmovewithit.')
    expect(loads).toBe(0)
    const stored = await getSlate(page, slateKey(page))
    expect(stored.creative.model.workshop.title).toBe('Launch plan')
    expect(stored.nodes.find((node: any) => node.options.id === 'first-run-how').options.text).toContain('Drag Design later and Build and QA move with it.')
    expect(Object.keys(stored.boards ?? {})).toEqual([])
    expect(sent.filter(frame => AGENT_METHODS.test(frame))).toEqual([])
    expect(await page.evaluate(() => (window as any).Meteor.user()?.profile?.start?.via)).toBe('deeplink')
  } finally { await removeTestGuest(page, id); await context.close() }
})

test('Back from a board made through a second answer leaves /new: no second, empty slate', async ({ browser }) => {
  const { context, page } = await virgin(browser)
  let id: string | null = null
  try {
    await page.goto('about:blank')
    await page.goto(at('/new'))
    await page.getByRole('button', { name: /^Run our week/ }).click()
    await page.getByRole('button', { name: 'My team', exact: true }).click()
    id = await onCanvas(page)
    const board = page.url()
    const made = await page.evaluate(() => (window as any).Meteor.user()?._id)
    await page.goBack()
    await page.waitForTimeout(1500)
    expect(page.url()).not.toMatch(/\/canvas\/|\/new/)
    await page.goForward()
    await page.waitForURL(board)
    // The same guest, on the same board: the Back made no other slate.
    await expect.poll(() => page.evaluate(() => (window as any).Meteor.user()?._id)).toBe(made)
  } finally { await removeTestGuest(page, id); await context.close() }
})

test('a typed list is their own cards, even with job words in it', async ({ browser }) => {
  const { context, page } = await virgin(browser)
  let id: string | null = null
  try {
    await page.getByLabel('Or say it in your own words').fill('Hire a designer, Fix billing, Write docs')
    await page.getByRole('button', { name: 'Make it', exact: true }).click()
    id = await onCanvas(page)
    await workshopReady(page)
    expect((await storedWorkshop(page, slateKey(page))).cards.map((card: any) => card.label)).toEqual(['Hire a designer', 'Fix billing', 'Write docs'])
    expect(await page.evaluate(() => (window as any).Meteor.user()?.profile?.start)).toMatchObject({ job: null, via: 'text', resolved: 'text.list' })
  } finally { await removeTestGuest(page, id); await context.close() }
})

test('on a phone the one-time Share label stays short, and the title keeps its room', async ({ browser }) => {
  const { context, page } = await virgin(browser, { width: 390, height: 844 })
  let id: string | null = null
  try {
    await page.goto(at('/new?job=lookback&with=broke'))
    id = await onCanvas(page)
    await expect(page.getByRole('button', { name: 'Invite', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Invite your team' })).toHaveCount(0)
  } finally { await removeTestGuest(page, id); await context.close() }
})

test('Browse all boards opens the library once: a reload of the slate does not open it again', async ({ browser }) => {
  const { context, page } = await virgin(browser)
  let id: string | null = null
  try {
    await page.getByRole('button', { name: 'Browse all boards' }).click()
    id = await onCanvas(page)
    await expect.poll(() => page.evaluate(() => window.history.state?.usr?.openLibrary ?? null)).toBeNull()
    await page.reload()
    await page.waitForTimeout(2500)
    expect(await page.evaluate(() => window.history.state?.usr?.openLibrary ?? null)).toBeNull()
  } finally { await removeTestGuest(page, id); await context.close() }
})

test('firstSlate.create: every job builds for a guest, a retry with the same request id is the same slate, and five a minute is the limit', async ({ browser }) => {
  const { context, page } = await virgin(browser)
  let id: string | null = null
  try {
    await page.getByRole('button', { name: /^Get a customer live/ }).click()
    id = await onCanvas(page)
    const call = (answer: Record<string, unknown>) => page.evaluate(async answer => {
      try { return { shareId: await (window as any).Meteor.callAsync('firstSlate.create', answer) } } catch (error: any) { return { error: error.error } }
    }, answer)
    const requestId = 'aB3dE6gH9jK2mN5pQ'
    const first = await call({ job: 'week', with: 'me', via: 'card', requestId })
    const again = await call({ job: 'week', with: 'me', via: 'card', requestId })
    expect(first.shareId).toBeTruthy()
    expect(again.shareId).toBe(first.shareId)
    const made = await getSlate(page, first.shareId!)
    expect(made.options.firstRun).toMatchObject({ job: 'week', with: 'me', v: 1 })
    expect((await call({ job: 'nope', via: 'card', requestId: 'zzzzzzzzzzzzzzzzz' })).error).toBe(400)
    // The page's own call and these three: the next ones are refused within the minute.
    const results = []
    for (let i = 0; i < 4; i++) results.push(await call({ via: 'skip', requestId: 'rate' + 'x'.repeat(12) + i }))
    expect(results.some(result => result.error === 'too-many-requests')).toBe(true)
  } finally { await removeTestGuest(page, id); await context.close() }
})
