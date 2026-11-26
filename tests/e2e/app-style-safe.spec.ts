import { expect, test, type Browser, type Page } from '@playwright/test'
import { randomBytes } from 'node:crypto'

// A style never loses anything, and "Revert to original" is always there (owner, 2026-11-25). In a
// fresh session with a new account: a library copy and a slate of one's own each wear a style from
// Slate settings, switch twice, and go back with Revert to original: every note and word is still
// there at each step, and the slate comes back exactly as it was, after a reload too. Slate settings
// holds the styles, Revert to original and one background control (no legacy custom colors, no
// generated note colors, no layout section), and a cog beside the slate's name opens the slate menu.

const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
const local = ['localhost', '127.0.0.1'].includes(new URL(origin).hostname)
const header = (page: Page) => page.locator('.sb-board-toolbar')
const cog = (page: Page) => header(page).getByRole('button', { name: 'Slate settings and actions', exact: true })
const panel = (page: Page) => page.getByRole('complementary', { name: 'Slate settings' })

test.beforeEach(() => { test.skip(!local, 'Creates throwaway accounts and slates on a local app only.') })

async function freshAccount(browser: Browser) {
  // A virgin context: no login token carried over from another session (a "fresh" check in a reused
  // session silently resumes someone's login).
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto(origin + '/login')
  await page.waitForFunction(() => (window as any).Accounts && (window as any).Meteor.status().connected)
  expect(await page.evaluate(() => localStorage.getItem('Meteor.loginToken'))).toBeNull()
  await page.evaluate((credentials) => new Promise<void>((resolve, reject) => (window as any).Accounts.createUser(credentials, (error: Error) => (error ? reject(error) : resolve()))),
    { email: 'style-safe-' + randomBytes(8).toString('hex') + '@slatebox.invalid', password: randomBytes(20).toString('hex'), profile: { firstName: 'Style', lastName: 'Safe' } })
  await page.waitForFunction(() => Boolean((window as any).Meteor.userId()))
  return { context, page }
}

// The slate as the engine holds it: every note's id and words, and the whole document.
const exported = (page: Page) => page.evaluate(() => {
  const doc = JSON.parse((window as any).slate.exportJSON())
  const words = (t: unknown) => String(t ?? '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
  return {
    doc,
    texts: doc.nodes.map((n: any) => words(n.options.text)).filter(Boolean).sort(),
    ids: doc.nodes.map((n: any) => String(n.options.id)).sort(),
    // Content: every note but a style's wordless art (which the next style may replace).
    content: doc.nodes.filter((n: any) => !n.options.styleRole || words(n.options.text)).map((n: any) => String(n.options.id)).sort(),
    style: doc.options.style?.id ?? null,
    original: Boolean(doc.options.styleOriginal),
    background: doc.options.containerStyle?.backgroundColor ?? null,
  }
})
// What differs between two slates: their look, their notes (ids, order, every option, lines). Exact,
// but for the engine re-fitting a note's box by a few pixels once its face has loaded.
const GEOMETRY = new Set(['width', 'height', 'xPos', 'yPos'])
function differences(a: any, b: any): string[] {
  const out: string[] = []
  const top = (d: any) => JSON.stringify({ background: d.options.containerStyle ?? null, line: d.options.defaultLineColor ?? null, style: d.options.style ?? null })
  if (top(a) !== top(b)) out.push(`look ${top(a)} → ${top(b)}`)
  if (a.nodes.map((n: any) => n.options.id).join() !== b.nodes.map((n: any) => n.options.id).join()) out.push('notes (ids or order)')
  for (const n of a.nodes) {
    const m = b.nodes.find((x: any) => x.options.id === n.options.id)
    if (!m) continue
    for (const k of new Set([...Object.keys(n.options), ...Object.keys(m.options)])) {
      if (GEOMETRY.has(k) && Math.abs(Number(n.options[k]) - Number(m.options[k])) <= 3) continue
      if (JSON.stringify(n.options[k]) !== JSON.stringify(m.options[k])) out.push(`${n.options.id}.${k}`)
    }
    if (JSON.stringify(n.relationships?.associations ?? []) !== JSON.stringify(m.relationships?.associations ?? [])) out.push(`${n.options.id} lines`)
  }
  return out
}

// What the canvas draws against what the slate holds (owner, 2026-11-25: Revert to original left blue dots behind).
// Each line draws two end handles and their marks in the slate's shared markers layer, outside every note; a
// whole-slate replace (a style worn, switched, removed or reverted, undo, redo) must take the old ones away.
const drawn = (page: Page) => page.evaluate(() => {
  const s = (window as any).slate
  const engine = s.v2 ?? s
  // Every note the engine holds (a board's lanes and columns are drawn by its host and not saved with the slate).
  const notes = engine.nodes.allNodes
  const ids = new Set(notes.map((n: any) => String(n.id)))
  // What the lines on the slate draw: each one's two end handles and their marks, and its arrowheads.
  const owned = new Set<Element>()
  const ownedMarkers = new Set<Element>()
  for (const n of notes) {
    for (const c of n.connector?.connections?.values?.() ?? []) {
      const con = c.connectable
      for (const end of [con?.sourceHandle, con?.targetHandle]) for (const el of [end?.element, end?.glyph]) if (el?.node) owned.add(el.node)
      for (const head of [con?.markerSource, con?.markerTarget]) if (head?.element?.node) ownedMarkers.add(head.element.node)
    }
  }
  const root = document.getElementById('slateCanvas')!
  const ends = [...root.querySelectorAll('.connector-handle, .connector-handle-glyph')]
  return {
    ends: ends.length,
    orphanEnds: ends.filter((el) => !owned.has(el)).length,
    // A <marker> in the defs that no line on the slate draws (review, 2026-11-25: +1 per line per replace).
    orphanMarkers: [...root.querySelectorAll('marker')].filter((el) => !ownedMarkers.has(el)).length,
    strayGroups: [...root.querySelectorAll('[data-node-id]')].map((g) => g.getAttribute('data-node-id')).filter((id) => !ids.has(id!)),
    plugOwners: root.querySelectorAll('.connection-handle').length / 4,
    notes: notes.length,
  }
})
async function noOrphans(page: Page, label: string) {
  await expect.poll(async () => (await drawn(page)).orphanEnds, { message: `${label}: no line end left over from a line that is gone` }).toBe(0)
  await expect.poll(async () => (await drawn(page)).orphanMarkers, { message: `${label}: no arrowhead left over from a line that is gone` }).toBe(0)
  const d = await drawn(page)
  expect(d.ends, `${label}: the lines' ends are drawn`).toBeGreaterThan(0)
  expect(d.strayGroups, `${label}: no note drawn that the slate does not hold`).toEqual([])
  expect(d.plugOwners, `${label}: plugs only for notes on the slate`).toBeLessThanOrEqual(d.notes)
}

async function openSlateStyle(page: Page) {
  if (await page.locator('[data-slate-style-panel]').isVisible().catch(() => false)) return
  await cog(page).click()
  await page.getByRole('menu', { name: 'Slate' }).getByRole('menuitem', { name: 'Slate style', exact: true }).click()
  await expect(page.locator('[data-slate-style-panel]')).toBeVisible()
}
async function wear(page: Page, id: string) {
  await page.locator(`[data-slate-style-chip="${id}"]`).click()
  await expect(page.locator(`[data-slate-style-chip="${id}"]`)).toHaveAttribute('aria-checked', 'true')
  await expect.poll(async () => (await exported(page)).style).toBe(id)
}

async function proveNoLossAndRevert(page: Page, label: string) {
  const before = await exported(page)
  await openSlateStyle(page)
  const [first, second] = before.style === 'neon' ? ['calm', 'voyage'] : ['neon', 'voyage']
  await wear(page, first)
  const one = await exported(page)
  expect(one.texts, `${label}: ${first} keeps every word`).toEqual(before.texts)
  for (const id of before.content) expect(one.ids, `${label}: ${id} kept`).toContain(id)
  expect(one.original).toBe(true)
  await noOrphans(page, `${label}: ${first}`)
  await wear(page, second)
  const two = await exported(page)
  expect(two.texts, `${label}: ${second} keeps every word`).toEqual(before.texts)
  for (const id of before.content) expect(two.ids, `${label}: ${id} kept`).toContain(id)
  await noOrphans(page, `${label}: ${second}`)
  // The original survives a reload (it is saved with the slate).
  await page.waitForTimeout(2500)
  await page.reload()
  await page.locator('#slateCanvas [data-node-id]').first().waitFor({ timeout: 60_000 })
  await expect.poll(async () => (await exported(page)).style, { timeout: 30_000 }).toBe(second)
  expect((await exported(page)).original).toBe(true)
  await openSlateStyle(page)
  const revert = page.locator('[data-slate-style-revert]')
  await expect(revert).toBeEnabled()
  await revert.click()
  await expect.poll(async () => (await exported(page)).style).toBe(before.style)
  const back = await exported(page)
  expect(differences(before.doc, back.doc), `${label}: reverted exactly`).toEqual([])
  expect(back.original).toBe(false)
  await expect(revert).toBeDisabled()
  await noOrphans(page, `${label}: reverted`)
  return before
}

test('a library copy wears, switches twice and reverts with nothing lost, exactly, after a reload too', async ({ browser }) => {
  const { context, page } = await freshAccount(browser)
  try {
    await page.goto(origin + '/library/trial-research')
    await page.locator('[data-library-use]').click({ timeout: 60_000 })
    await page.waitForURL(/\/canvas\/[A-Za-z0-9]+/, { timeout: 60_000 })
    await page.locator('#slateCanvas [data-node-id]').first().waitFor({ timeout: 60_000 })
    await page.waitForTimeout(3000)
    const before = await proveNoLossAndRevert(page, 'library copy')
    expect(before.style, 'the copy wears the library\'s style as copied').toBe('sketch')
  } finally { await context.close() }
})

test('a slate of one\'s own wears, switches twice and reverts with nothing lost; the background is part of its style', async ({ browser }) => {
  const { context, page } = await freshAccount(browser)
  try {
    await page.goto(origin + '/new/map#brief=Style%20safety')
    await page.waitForURL(/\/canvas\/[A-Za-z0-9]{10}$/, { timeout: 60_000 })
    await page.locator('#slateCanvas [data-node-id]').first().waitFor({ timeout: 60_000 })
    await page.evaluate(async () => {
      const s = (window as any).slate
      const json = JSON.parse(s.exportJSON())
      const note = (id: string, text: string, x: number, y: number, associations: object[] = []) => ({ options: { id, text, xPos: x, yPos: y, width: 220, height: 90, backgroundColor: '#ffffff', fontColor: '#222222' }, relationships: { associations } })
      json.nodes = [
        note('idea', 'Our plan', 0, 0, [{ parentId: 'idea', childId: 'step1' }, { parentId: 'idea', childId: 'step2' }]),
        note('step1', 'Talk to customers', 320, -120), note('step2', 'Ship the beta', 320, 120),
      ]
      // A person's own change: one undo step, saved and sent like any.
      const engine = s.v2 ?? s
      const snapshot = JSON.stringify(json)
      await engine.ownStep(() => engine.invoker.onSlateReplaced({ type: 'onSlateReplaced', data: { snapshot } }))
      engine.broadcast?.('onSlateReplaced', { action: 'seed', snapshot })
    })
    await page.waitForTimeout(3000)
    expect((await exported(page)).texts).toEqual(['Our plan', 'Ship the beta', 'Talk to customers'])
    await proveNoLossAndRevert(page, 'own slate')
    // A background by hand: kept as part of the style, and Revert to original takes it back.
    const plain = await exported(page)
    await page.locator('[data-slate-background="#0b3b8c"]').click()
    await expect.poll(async () => (await exported(page)).background).toBe('#0b3b8c')
    const hex = page.getByRole('textbox', { name: 'Background color (hex)' })
    await hex.fill('#224466')
    await hex.press('Enter')
    await expect.poll(async () => (await exported(page)).background).toBe('#224466')
    await page.locator('[data-slate-style-revert]').click()
    await expect.poll(async () => (await exported(page)).background).toBe(plain.background)
  } finally { await context.close() }
})

// Owner, 2026-11-25: after Revert to original, blue dots stayed where the style's art had been, and a navy serif note
// still drew a dashed line to a ticket-shaped note (a note and a line made after the first style kept the last style's
// look). Each whole-slate replace (wear, switch, Remove style, Revert to original, undo, redo) leaves the canvas holding
// exactly what the slate's lines draw, and Revert gives notes made since their own look back.
test('Revert to original, undo, redo and Remove style leave no orphan dots, and notes made since get their own look back', async ({ browser }) => {
  const { context, page } = await freshAccount(browser)
  try {
    await page.goto(origin + '/new/map#brief=Orphan%20dots')
    await page.waitForURL(/\/canvas\/[A-Za-z0-9]{10}$/, { timeout: 60_000 })
    await page.locator('#slateCanvas [data-node-id]').first().waitFor({ timeout: 60_000 })
    const ownStep = (nodes: object[]) => page.evaluate(async (nodes) => {
      const s = (window as any).slate
      const engine = s.v2 ?? s
      const json = JSON.parse(s.exportJSON())
      json.nodes = nodes
      const snapshot = JSON.stringify(json)
      await engine.ownStep(() => engine.invoker.onSlateReplaced({ type: 'onSlateReplaced', data: { snapshot } }))
      engine.broadcast?.('onSlateReplaced', { action: 'seed', snapshot })
    }, nodes)
    const note = (id: string, text: string, x: number, y: number, associations: object[] = []) => ({ options: { id, text, xPos: x, yPos: y, width: 220, height: 90, backgroundColor: '#ffffff', fontColor: '#222222' }, relationships: { associations } })
    await ownStep([
      note('idea', 'Our plan', 0, 0, [{ parentId: 'idea', childId: 'step1' }, { parentId: 'idea', childId: 'step2' }]),
      note('step1', 'Talk to customers', 320, -120), note('step2', 'Ship the beta', 320, 120),
    ])
    await page.waitForTimeout(2500)
    const plainStyle = (await exported(page)).style
    await openSlateStyle(page)
    await wear(page, 'journey')
    await noOrphans(page, 'journey')
    // A note and a line made after the first style, in the slate's own look (as a person adds them).
    const now = (await exported(page)).doc
    const single = note('single', 'single', 700, 0, [{ parentId: 'single', childId: 'kid' }])
    const kid = note('kid', 'kid', 1000, 0)
    await ownStep([...now.nodes, single, kid])
    await page.waitForTimeout(1500)
    const made = (await exported(page)).doc.nodes
    const own = (id: string) => made.find((n: any) => n.options.id === id)
    const look = (n: any) => ({ backgroundColor: n.options.backgroundColor, fontFamily: n.options.fontFamily ?? null, vectorPath: n.options.vectorPath ?? null, shape: n.options.shape ?? null })
    const singleLook = look(own('single'))
    const line = (doc: any) => doc.nodes.find((n: any) => n.options.id === 'single').relationships.associations.find((a: any) => a.childId === 'kid')
    const lineLook = (a: any) => ({ lineColor: a.lineColor, lineDash: a.lineDash ?? 'solid', lineWidth: a.lineWidth })
    const singleLine = lineLook(line((await exported(page)).doc))
    // Hovered and selected, as someone working leaves them: plugs and line ends out.
    for (const g of await page.locator('#slateCanvas [data-node-id]').all()) await g.hover({ force: true, timeout: 2000 }).catch(() => {})
    await wear(page, 'calm')
    await noOrphans(page, 'calm')
    await wear(page, 'journey')
    await noOrphans(page, 'journey again')
    expect(look((await exported(page)).doc.nodes.find((n: any) => n.options.id === 'single')).vectorPath, 'journey restyled the note made since').not.toBeNull()
    await page.locator('[data-slate-style-revert]').click()
    await expect.poll(async () => (await exported(page)).style).toBe(plainStyle)
    await noOrphans(page, 'reverted')
    const back = (await exported(page)).doc
    expect(look(back.nodes.find((n: any) => n.options.id === 'single')), 'the note made since has its own look back').toEqual(singleLook)
    expect(look(back.nodes.find((n: any) => n.options.id === 'kid'))).toEqual(look(own('kid')))
    expect(lineLook(line(back)), 'its line has its own look back (no dashed style line)').toEqual(singleLine)
    // Undo and redo the revert: each a whole-slate replace, each leaving nothing behind.
    const undo = page.getByRole('group', { name: 'Undo and redo' }).getByRole('button', { name: 'Undo', exact: true })
    const redo = page.getByRole('group', { name: 'Undo and redo' }).getByRole('button', { name: 'Redo', exact: true })
    await undo.click()
    await expect.poll(async () => (await exported(page)).style).toBe('journey')
    await noOrphans(page, 'undo')
    await redo.click()
    await expect.poll(async () => (await exported(page)).style).toBe(plainStyle)
    await noOrphans(page, 'redo')
    // Remove style too.
    await wear(page, 'editorial')
    await noOrphans(page, 'editorial')
    await page.locator('[data-slate-style-off]').click()
    await expect.poll(async () => (await exported(page)).style).toBe(null)
    await noOrphans(page, 'style removed')
  } finally { await context.close() }
})

test('Slate settings holds General and Slate style only, with no legacy colors, and the cog opens the slate menu', async ({ browser }) => {
  const { context, page } = await freshAccount(browser)
  try {
    await page.goto(origin + '/new/map#brief=Settings%20proof')
    await page.waitForURL(/\/canvas\/[A-Za-z0-9]{10}$/, { timeout: 60_000 })
    await page.locator('#slateCanvas [data-node-id]').first().waitFor({ timeout: 60_000 })
    // The cog and the name open the same menu.
    await expect(cog(page)).toBeVisible()
    await cog(page).click()
    const menu = page.getByRole('menu', { name: 'Slate' })
    const items = await menu.getByRole('menuitem').allTextContents()
    await page.keyboard.press('Escape')
    await header(page).getByRole('button', { name: /slate menu$/ }).click()
    expect(await menu.getByRole('menuitem').allTextContents()).toEqual(items)
    await menu.getByRole('menuitem', { name: 'Slate settings', exact: true }).click()
    await expect(panel(page)).toBeVisible()
    await expect(panel(page).getByRole('button', { name: 'General', exact: true })).toBeVisible()
    await expect(panel(page).getByRole('button', { name: 'Slate style', exact: true })).toBeVisible()
    for (const gone of ['Generate Node Colors', 'Layout', 'Optimize Layout', 'As Gradient…', 'As Gradient...', 'Complementary', 'Shades', 'Repeat', 'Stretch', 'Relationships'])
      await expect(panel(page).getByText(gone, { exact: true })).toHaveCount(0)
    await panel(page).getByRole('button', { name: 'Slate style', exact: true }).click()
    await expect(panel(page).getByRole('radiogroup', { name: 'Background color' })).toBeVisible()
    await expect(page.locator('[data-slate-style-revert]')).toBeDisabled()
    // On a phone the cog stays.
    await page.setViewportSize({ width: 390, height: 800 })
    await expect(cog(page)).toBeVisible()
    await cog(page).click()
    await expect(page.getByRole('dialog', { name: 'Slate' })).toBeVisible()
  } finally { await context.close() }
})

test('Present\'s style picker switches a library copy twice with nothing lost, and Revert to original brings it back exactly', async ({ browser }) => {
  const { context, page } = await freshAccount(browser)
  try {
    await page.goto(origin + '/library/launch-war-room')
    await page.locator('[data-library-use]').click({ timeout: 60_000 })
    await page.waitForURL(/\/canvas\/[A-Za-z0-9]+/, { timeout: 60_000 })
    await page.locator('#slateCanvas [data-node-id]').first().waitFor({ timeout: 60_000 })
    await page.waitForTimeout(3000)
    const before = await exported(page)
    await header(page).getByRole('button', { name: 'Present', exact: true }).click()
    const here = page.getByRole('menu', { name: 'Present' }).getByRole('menuitem', { name: 'Present on this screen', exact: true })
    if (await here.waitFor({ timeout: 2000 }).then(() => true, () => false)) await here.click()
    await page.locator('[data-present-style-button]').click({ timeout: 60_000 })
    const revert = page.locator('[data-style-revert]')
    // A library copy's original is the slate as copied: nothing to go back to yet.
    await expect(revert).toBeDisabled()
    for (const id of ['voyage', 'calm']) {
      await page.locator(`[data-style-chip="${id}"]`).click()
      await expect.poll(async () => (await exported(page)).style, { timeout: 30_000 }).toBe(id)
      const now = await exported(page)
      for (const said of before.texts) expect(now.texts, `Present → ${id}: "${said}" kept`).toContain(said)
      for (const note of before.content) expect(now.ids, `Present → ${id}: ${note} kept`).toContain(note)
    }
    await expect(revert).toBeEnabled()
    await revert.click()
    await expect.poll(async () => (await exported(page)).style, { timeout: 30_000 }).toBe(before.style)
    await page.waitForTimeout(1500)
    expect(differences(before.doc, (await exported(page)).doc), 'reverted exactly').toEqual([])
  } finally { await context.close() }
})
