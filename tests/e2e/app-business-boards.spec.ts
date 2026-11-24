import { randomBytes, randomUUID } from 'node:crypto'
import { expect, test, type Browser, type Page, type Request } from '@playwright/test'
import { dismissWelcome, shareAs, userId } from './workshop-guests.shared'
import { announced, conversation, note, openConversation, resting, slateKey, storedWorkshop, workshopReady, workshopStatus, canvasUndo } from './app-native-workshop.shared'

/**
 * The launch plan, the sales pipeline and the budget in the real Meteor app, at a laptop's width
 * and a phone's. Each board is made the way people make it (the chat phrase on a new slate, or
 * its starter route), drawn as the slate's own notes by its kit, dragged through Dragology,
 * refused with its rule's sentence, undone, reloaded, seen by a second person live, and edited by
 * an agent through exec, whose refusal is the same sentence.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable accounts and slates; local app only.')

type Workshop = { cards: any[]; lanes: any[]; launch?: { day: number } }
interface Board {
  kind: 'launch-plan' | 'pipeline' | 'budget'
  phrase: string
  said: string
  /** A person's change the rules take, and how it reads stored. */
  accept(page: Page): Promise<void>
  accepted(board: Workshop): boolean
  /** A person's change the rules refuse, and the sentence. */
  refuse(page: Page): Promise<void>
  refusal: string
  original(board: Workshop): boolean
  /** An agent's edits: refused with the same sentence a person gets, then taken. */
  agentRefused: unknown[]
  agentRefusal: string
  agentEdits: unknown[]
  agentDid(board: Workshop): boolean
  /** What a second person sees on screen once the agent's edit is saved. */
  seen(page: Page): Promise<void>
  /** The second person's own change after it, and what the owner then sees. */
  together(page: Page): Promise<void>
  togetherSeen(page: Page): Promise<void>
}

/** With SLATEBOX_SHOTS set, keep a picture of each step there. */
const shot = async (page: Page, name: string) => {
  if (!process.env.SLATEBOX_SHOTS) return
  await page.waitForTimeout(900) // past the glides and fades
  await page.screenshot({ path: `${process.env.SLATEBOX_SHOTS}/${name}-${page.viewportSize()?.width}.png` })
}
const centre = (box: { x: number; y: number; width: number; height: number }) => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 })
async function drag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }) {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 16 })
  await page.waitForTimeout(80)
  await page.mouse.up()
}
const narrow = (page: Page) => page.evaluate(() => innerWidth < 600)
/** Stretch a task by whole days with its end grip. */
async function stretch(page: Page, task: string, days: number, duration: number) {
  const bar = await resting(page, 'card-' + task)
  const grip = centre(await resting(page, 'handle-' + task))
  await drag(page, grip, { x: grip.x + (bar.width / duration) * days, y: grip.y })
}
/** Carry a card into a column, just inside its top, where a phone shows it without panning. */
async function carry(page: Page, card: string, lane: string) {
  const column = await resting(page, 'column-' + lane)
  await drag(page, centre(await resting(page, 'card-' + card)), { x: column.x + column.width / 2, y: column.y + Math.min(column.height / 2, 50) })
}
/** Move the divider after a team by an amount: across on a laptop, down on a phone. */
async function divide(page: Page, team: string, allocation: number, amount: number) {
  const column = await resting(page, 'column-' + team)
  const grip = centre(await resting(page, 'handle-' + team))
  const along = await narrow(page)
  const per = (along ? column.height : column.width) / allocation
  await drag(page, grip, along ? { x: grip.x, y: grip.y + amount * per } : { x: grip.x + amount * per, y: grip.y })
}
const task = (board: Workshop, id: string) => board.cards.find(card => card.id === id)

const boards: Board[] = [
  {
    kind: 'launch-plan',
    phrase: 'Plan a launch for day 14: Design 4 days, Build 6 days after Design, Copy 2 days, QA 2 days after Build',
    said: 'Added a launch plan · Product → Engineering · launch day 14',
    accept: page => stretch(page, 'build', 2, 6),
    accepted: board => task(board, 'build').duration === 8,
    refuse: page => stretch(page, 'build', 1, 8),
    refusal: 'That pushes QA to day 15, after launch on day 14.',
    original: board => task(board, 'build').duration === 6,
    agentRefused: [{ kind: 'set_task', card: 'Build', duration: 9 }],
    agentRefusal: 'That pushes QA to day 15, after launch on day 14.',
    agentEdits: [{ kind: 'set_task', card: 'Copy', lag: 3 }],
    agentDid: board => task(board, 'copy').lag === 3,
    seen: async page => {
      // Copy now starts on day 3: its bar begins three days to the right of where Design's does (day 0).
      await expect.poll(async () => {
        const design = await resting(page, 'card-design'), copy = await resting(page, 'card-copy')
        return Math.round((copy.x - design.x) / (design.width / 4))
      }).toBe(3)
    },
    together: page => stretch(page, 'build', 2, 6),
    togetherSeen: page => expect(page.locator('#slateCanvas [data-board-layer="header"]')).toHaveText('Done day 14 · launch day 14'),
  },
  {
    kind: 'pipeline',
    phrase: 'Make a sales pipeline',
    said: 'Added a sales pipeline · Lead → Qualified → Proposal → Won → Lost · target $250k',
    accept: page => carry(page, 'globex', 'qualified'),
    accepted: board => task(board, 'globex').laneId === 'qualified',
    refuse: page => carry(page, 'northwind', 'proposal'),
    refusal: 'Deals move one stage at a time. Northwind is in Lead, so Qualified comes first.',
    original: board => task(board, 'globex').laneId === 'lead',
    agentRefused: [{ kind: 'move_card', card: 'Northwind', lane: 'Won' }],
    agentRefusal: 'Deals move one stage at a time. Northwind is in Lead, so Qualified comes first.',
    agentEdits: [{ kind: 'move_card', card: 'Northwind', lane: 'Qualified' }],
    agentDid: board => task(board, 'northwind').laneId === 'qualified',
    seen: page => expect(note(page, 'caption-qualified')).toContainText('2 deals · $65k · 30%'),
    together: page => carry(page, 'globex', 'qualified'),
    togetherSeen: page => expect(note(page, 'caption-qualified')).toContainText('3 deals · $125k · 30%'),
  },
  {
    kind: 'budget',
    phrase: 'Split a 1.2M budget across Product, Sales and Design; Product at least 300k; with Contractor 45k in Product, Hires 320k in Sales, Research panel 370k in Design',
    said: 'Added a budget · Product → Sales → Design · $1.2M · balanced',
    accept: page => divide(page, 'product', 400000, 50000),
    accepted: board => board.lanes.find(lane => lane.id === 'product').allocation === 450000,
    refuse: page => carry(page, 'contractor', 'design'),
    refusal: 'Design has $30k left. Contractor costs $45k.',
    original: board => board.lanes.find(lane => lane.id === 'product').allocation === 400000,
    agentRefused: [{ kind: 'shift_budget', from: 'Sales', to: 'Product', amount: 100000 }],
    agentRefusal: 'Sales already commits $320k.',
    agentEdits: [{ kind: 'shift_budget', from: 'Sales', to: 'Product', amount: 50000 }],
    agentDid: board => board.lanes.find(lane => lane.id === 'product').allocation === 450000,
    seen: page => expect(note(page, 'caption-product')).toContainText('$450k'),
    together: page => divide(page, 'product', 450000, -50000),
    togetherSeen: page => expect(note(page, 'caption-product')).toContainText('$400k'),
  },
]

/** What a page asks Meteor's dynamic-import server for: the module paths in each request. */
function dynamicImports(page: Page) {
  const asked: string[] = []
  page.on('request', (request: Request) => {
    if (request.url().includes('/__meteor__/dynamic-import/')) asked.push(request.postData() ?? '')
  })
  return asked
}
// The request names the modules as a tree: {"node_modules":{"slateboxjs":{"dist":{"boards.cjs":1}}}}.
const loadsBoards = (asked: string[]) => asked.some(body => /"(?:boards|dragology|workshop-rules)\.c?js"/.test(body))

/** Claim the guest as an account and issue a token, as a person does before connecting an agent. */
async function agentToken(page: Page) {
  const back = page.url()
  await page.goto(new URL('/profile', origin).href)
  const claim = page.getByTestId('guest-account-claim')
  await claim.getByLabel('Email address').fill(`boards-${randomUUID().slice(0, 8)}@example.test`)
  await claim.locator('input[type=password]').fill(randomBytes(18).toString('base64url'))
  await claim.getByRole('button', { name: 'Save my Slatebox' }).click()
  await page.waitForFunction(() => (window as any).Meteor?.user()?.isAnonymous === false)
  const { token } = await page.evaluate(() => (window as any).Meteor.callAsync('apiTokens.create', { name: 'Boards agent', scopes: ['slates:read', 'slates:write'] }))
  await page.goto(back)
  await workshopReady(page)
  return token as string
}

/** Run an exec script that makes these edits on the board; the result, or the refusal it met. */
async function agentEdit(token: string, shareId: string, edits: unknown[]) {
  const code = `const { workshop } = await slatebox.slates.get({ shareId: ${JSON.stringify(shareId)} })
try {
  const saved = await slatebox.slates.applyOperations({ shareId: ${JSON.stringify(shareId)}, plan: { message: "Edit the board", operations: [{ kind: "workshop_edits", expectedRevision: workshop.revision, edits: ${JSON.stringify(edits)} }] } })
  return { saved: true, receiptId: saved.receiptId }
} catch (error) { return { saved: false, code: error.code, reason: error.details?.reason ?? error.message, limits: error.details?.limits ?? null } }`
  const response = await fetch(new URL('/api/v1/exec', origin).href, {
    method: 'POST', headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
    body: JSON.stringify({ intent: 'Edit the board', code }),
  })
  const body = await response.json()
  expect(response.status, JSON.stringify(body)).toBeLessThan(300)
  return body.result as { saved: boolean; code?: string; reason?: string; receiptId?: string }
}

/** A second person, joined through the owner's edit link, in a fresh browser session. */
async function secondPerson(browser: Browser, owner: Page, viewport: { width: number; height: number }) {
  const link = await shareAs(owner, 'edit')
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()
  await page.goto(link.href)
  await dismissWelcome(page)
  await workshopReady(page)
  return { context, page }
}

/** Make the board the way a person does: the chat phrase on a new slate, or the board's starter route. */
async function make(page: Page, board: Board, how: 'chat' | 'starter') {
  const asked = dynamicImports(page)
  if (how === 'starter') {
    await page.goto(new URL('/new/' + board.kind, origin).href)
    await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await dismissWelcome(page)
    await workshopReady(page)
    return asked
  }
  await page.goto(new URL('/new', origin).href)
  await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
  await dismissWelcome(page)
  await expect.poll(() => userId(page)).toBeTruthy()
  // A plain slate: nothing of the boards, their rules or Dragology is fetched.
  await page.waitForTimeout(1500)
  expect(loadsBoards(asked), 'a plain slate loads no board code').toBe(false)
  const panel = await openConversation(page)
  await panel.getByRole('textbox').fill(board.phrase)
  await panel.getByRole('button', { name: 'Preview changes', exact: true }).click()
  await expect(panel.getByRole('button', { name: 'Keep changes', exact: true })).toBeEnabled({ timeout: 30000 })
  await expect(panel).toContainText(board.said.replace(/^Added /, 'Keep this to add '))
  // The preview is drawn on the canvas before anything is kept: by the board renderer itself (board polish), its notes
  // in the draft scope `pv`, see-through, in a dashed frame tagged "Preview · not added yet".
  await expect(page.locator('#slateCanvas [data-node-id^="pv:"][data-workshop-draft]').first()).toBeAttached()
  await expect(page.locator('#slateCanvas [data-board-layer="draft-tag"]')).toHaveText('Preview · not added yet')
  await panel.getByRole('button', { name: 'Keep changes', exact: true }).click()
  await page.waitForEvent('load')
  await dismissWelcome(page)
  await workshopReady(page)
  return asked
}

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const wide = viewport.width > 600
  test.describe(`${viewport.width} by ${viewport.height}`, () => {
    test.use({ viewport })
    for (const board of boards) {
      test(`${board.kind}: made ${wide ? 'from chat' : 'from its starter'}, dragged, refused, undone, reloaded, seen live by a second person, edited by an agent`, async ({ page, browser }) => {
        test.setTimeout(240_000)
        const asked = await make(page, board, wide ? 'chat' : 'starter')
        const key = slateKey(page)
        // Drawn by its kit as the slate's own notes: the kit (and its rules) were fetched for it.
        expect(loadsBoards(asked), 'a board slate loads its kit').toBe(true)
        await expect(page.locator('#slateCanvas [data-board-layer]').first()).toBeAttached()
        await expect(page.locator('#slateCanvas [data-node-id^="card-"]').first()).toBeVisible()
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
        await shot(page, board.kind + '-1-made')
        const start = await storedWorkshop(page, key)
        expect(start.kind).toBe(board.kind)
        expect(board.original(start)).toBe(true)

        // A drag the rules take is saved as the edit it makes.
        await board.accept(page)
        await expect.poll(async () => board.accepted(await storedWorkshop(page, key))).toBe(true)
        // A drag they refuse says why, and saves nothing.
        await board.refuse(page)
        await expect(announced(page)).toContainText(board.refusal)
        await shot(page, board.kind + '-2-refused')
        await page.waitForTimeout(600)
        expect(board.accepted(await storedWorkshop(page, key))).toBe(true)

        // Undo puts the board back.
        await canvasUndo(page).click()
        await expect.poll(async () => board.original(await storedWorkshop(page, key))).toBe(true)

        // A reload opens it as saved.
        await page.reload()
        await dismissWelcome(page)
        await workshopReady(page)
        await expect(page.locator('#slateCanvas [data-board-layer]').first()).toBeAttached()
        expect(board.original(await storedWorkshop(page, key))).toBe(true)

        // Present: a scene per team or stage, with the caption and the numbers the canvas shows.
        const first = (await storedWorkshop(page, key)).lanes[0]
        // The caption's lines, as the note wraps them, read as one sentence.
        const shownCaption = await note(page, 'caption-' + first.id).evaluate(element => {
          const lines = [...element.querySelectorAll('tspan')].map(line => line.textContent ?? '')
          return (lines.length ? lines.join(' ') : element.textContent ?? '').replace(/\s+/g, ' ').trim()
        })
        await page.getByRole('button', { name: 'Present', exact: true }).click()
        // On a phone, Present asks where: this screen.
        if (!wide) await page.getByText('Present on this screen', { exact: true }).click()
        const presentation = page.getByRole('region', { name: 'Decision presentation' })
        await expect(presentation.getByRole('heading', { level: 1 })).toHaveText(first.label)
        // (A phone's caption may break where the laptop's has a "·".)
        const plain = (text: string) => text.replace(/·/g, ' ').replace(/\s+/g, ' ').trim()
        await expect.poll(async () => plain(await presentation.innerText())).toContain(plain(shownCaption))
        await shot(page, board.kind + '-3-presented')
        await presentation.getByRole('button', { name: 'Next lane', exact: true }).click()
        await expect(presentation.getByRole('heading', { level: 1 })).toHaveText((await storedWorkshop(page, key)).lanes[1].label)
        await presentation.getByRole('button', { name: 'Back to board', exact: true }).click()
        await workshopReady(page)

        // A second person sees the board, then the owner's next change live.
        const second = await secondPerson(browser, page, viewport)
        try {
          await expect(second.page.locator('#slateCanvas [data-board-layer]').first()).toBeAttached()
          // An agent's edit: the refusal is the canvas's sentence and nothing saves; then one the rules take.
          const token = await agentToken(page)
          const refused = await agentEdit(token, key, board.agentRefused)
          expect(refused).toMatchObject({ saved: false, code: 'edit_refused', reason: board.agentRefusal })
          expect(board.original(await storedWorkshop(page, key))).toBe(true)
          const saved = await agentEdit(token, key, board.agentEdits)
          expect(saved.saved, JSON.stringify(saved)).toBe(true)
          await expect.poll(async () => board.agentDid(await storedWorkshop(page, key))).toBe(true)
          await board.seen(second.page)
          await shot(second.page, board.kind + '-4-second-person-sees-agent-edit')
          await board.seen(page)
          // The second person joins to edit and makes a change of their own: the owner sees it without reloading.
          await workshopStatus(second.page).getByRole('button', { name: 'Join to edit', exact: true }).click()
          await expect(second.page.getByRole('button', { name: 'Ask Slatebox', exact: true }).or(conversation(second.page)).first()).toBeVisible()
          await board.together(second.page)
          await board.togetherSeen(page)
          await shot(page, board.kind + '-5-owner-sees-second-person')
        } finally { await second.context.close() }
      })
    }
  })
}
