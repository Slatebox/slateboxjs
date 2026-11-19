import { expect, test, type Browser, type BrowserContext, type Page } from '@playwright/test'

// Undo, then keep working, then reload: what comes back must be what was on screen.
//
// Each client here does what the host application does: it loads the stored document, joins the
// slate's room on a real relay (tests/collab-server-standalone.cjs), and stores the whole slate
// again after every change it makes. `store` below stands for the application's database, shared
// by every client of one test, last save wins.

const RELAY = process.env.SLATEBOX_COLLAB_WS || 'ws://localhost:1234'

type Store = { json: string | null; saves: number }
type Client = { context: BrowserContext; page: Page; errors: string[] }
type Shape = { notes: [string, string][]; lines: string[] }

async function open(browser: Browser, room: string, userName: string, store: Store, load: string | null = store.json): Promise<Client> {
  const context = await browser.newContext({ viewport: { width: 1000, height: 800 } })
  const page = await context.newPage()
  const errors: string[] = []
  page.on('pageerror', error => errors.push(String(error)))
  page.on('console', message => {
    if (message.type() === 'error' && /Caught error while handling a Yjs update|Restore failed/.test(message.text())) errors.push(message.text())
  })
  await page.exposeFunction('hostSave', (json: string) => { store.json = json; store.saves++ })
  await page.goto('/test.html')
  await page.waitForFunction(() => (window as any).Slatebox)
  await page.evaluate(async ({ room, userName, relay, load }) => {
    const w = window as any
    document.body.replaceChildren()
    const host = document.createElement('div')
    host.id = 'slateCanvas'
    host.style.cssText = 'position:fixed;left:0;top:0;width:900px;height:700px;background:#fff'
    document.body.appendChild(host)
    const facade = await new w.Slatebox.slate(
      { container: 'slateCanvas', id: room, allowCollaboration: true },
      {
        onInitCollaboration: async () => ({ websocketUrl: relay, websocketParams: {}, userName, color: '#3366ff' }),
        // The application stores the whole slate after each change this client makes.
        onSlateChanged: () => w.hostSave(facade.exportJSON()),
      }
    ).init()
    w.facade = facade
    w.slate = facade.v2
    if (load) {
      await facade.loadJSON(load)
    } else {
      // A new slate: the application adds its first note, stores it, then loads what it stored.
      w.slate.beginRemoteApply()
      const first = w.slate.addNode({ id: 'welcome', x: 380, y: 320, width: 130, height: 70, text: 'Welcome!' })
      w.slate.endRemoteApply()
      await first.ready
      const json = facade.exportJSON()
      await w.hostSave(json)
      await facade.loadJSON(json)
    }
  }, { room, userName, relay: RELAY, load })
  await page.waitForFunction(() => {
    const collab = (window as any).slate.collab
    return collab.isCollabConnected() && collab.provider?.synced
  }, undefined, { timeout: 30_000 })
  return { context, page, errors }
}

/** What the slate holds: every note's id and name, and every line, in a stable order. */
const held = (page: Page): Promise<Shape> => page.evaluate(() => {
  const doc = JSON.parse((window as any).facade.exportJSON())
  return {
    notes: doc.nodes.map((n: any) => [n.options.id, n.options.text]).sort(),
    lines: doc.nodes.flatMap((n: any) => (n.relationships?.associations || []).map((a: any) => a.parentId + '>' + a.childId)).sort(),
  }
})

/** What is drawn: the name each note shows on the canvas. */
const drawn = (page: Page): Promise<[string, string][]> => page.evaluate(() =>
  [...document.querySelectorAll('#slateCanvas [data-node-id]')]
    .map(el => [el.getAttribute('data-node-id')!, [...el.querySelectorAll('text')].map(t => t.textContent).join('').trim()] as [string, string])
    .sort())

const stored = (store: Store): Shape => {
  const doc = JSON.parse(store.json!)
  return {
    notes: doc.nodes.map((n: any) => [n.options.id, n.options.text]).sort(),
    lines: doc.nodes.flatMap((n: any) => (n.relationships?.associations || []).map((a: any) => a.parentId + '>' + a.childId)).sort(),
  }
}

const names = (shape: Shape) => shape.notes.map(([, text]) => text).sort()

/** A pause long enough for the edits so far to become one undo step. */
const paused = (page: Page) => expect.poll(() => page.evaluate(() => {
  const history = (window as any).slate.undoRedo
  return !history.debounceTimer && !history.gestureRecordDue
})).toBe(true)

/** Double-click empty canvas, type a name, press Enter. */
async function addNote(page: Page, name: string, x: number, y: number) {
  const before = (await held(page)).notes.length
  await page.mouse.dblclick(x, y)
  await expect.poll(async () => (await held(page)).notes.length).toBe(before + 1)
  await page.keyboard.type(name) // typing on the new note opens its editor
  await page.locator('.sb-inline-editor').waitFor({ timeout: 10_000 })
  await page.keyboard.press('Enter')
  await expect.poll(async () => names(await held(page))).toContain(name)
  await paused(page)
}

async function centreOf(page: Page, name: string) {
  const point = await page.evaluate(name => {
    const note = (window as any).slate.nodes.allNodes.find((n: any) => n.options.text === name)
    const box = document.querySelector('#slateCanvas [data-node-id="' + note.options.id + '"]')!.getBoundingClientRect()
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 }
  }, name)
  return point
}

/** Select a note, press the connector on one of its sides, name the note that appears. */
async function addConnected(page: Page, from: string, side: 'right' | 'bottom' | 'left' | 'top', name: string) {
  const at = await centreOf(page, from)
  await page.mouse.click(at.x, at.y)
  await expect.poll(() => page.evaluate(() => (window as any).slate.getSelectedNodes().map((n: any) => n.options.text))).toEqual([from])
  await page.waitForTimeout(400) // the connectors settle beside the selected note
  const handle = await page.evaluate(side => {
    const box = (window as any).slate.getSelectedNodes()[0].connectionHandles[side].node.getBoundingClientRect()
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 }
  }, side)
  const before = (await held(page)).notes.length
  await page.mouse.click(handle.x, handle.y)
  await expect.poll(async () => (await held(page)).notes.length).toBe(before + 1)
  await page.locator('.sb-inline-editor').waitFor({ timeout: 10_000 }) // a connected note opens for naming
  await page.keyboard.type(name)
  await page.keyboard.press('Enter')
  await expect.poll(async () => names(await held(page))).toContain(name)
  await paused(page)
}

async function undo(page: Page) {
  await page.mouse.click(820, 660) // empty canvas: nothing selected, keys go to the slate
  await page.keyboard.press('ControlOrMeta+z')
}

/** Long enough for a room's replay to have been applied after a client joined. */
const settle = (page: Page) => page.waitForTimeout(1500)

test('one person: notes added after an undo keep their names through a reload, and through the next one', async ({ browser }) => {
  test.setTimeout(120_000)
  const room = 'undo-replay-solo-' + Math.random().toString(36).slice(2)
  const store: Store = { json: null, saves: 0 }
  let client = await open(browser, room, 'Solo', store)
  try {
    let page = client.page
    await addNote(page, 'Alpha', 150, 150)
    await addNote(page, 'Beta', 150, 520)
    await addNote(page, 'Quick', 650, 150)
    await undo(page)
    await expect.poll(async () => names(await held(page))).toEqual(['Alpha', 'Beta', 'Welcome!'])
    await addConnected(page, 'Alpha', 'right', 'Child')
    await page.mouse.click(820, 660)
    await settle(page)

    const before = await held(page)
    expect(names(before)).toEqual(['Alpha', 'Beta', 'Child', 'Welcome!'])
    expect(before.lines).toHaveLength(1)
    expect(stored(store), 'the stored document is what was on screen').toEqual(before)
    expect(client.errors).toEqual([])

    // Reload: a new page loads the stored document and joins the same room.
    await client.context.close()
    client = await open(browser, room, 'Solo', store)
    page = client.page
    await settle(page)
    expect(await held(page), 'the slate after a reload').toEqual(before)
    expect(await drawn(page), 'the names drawn after a reload').toEqual(before.notes)
    expect(client.errors).toEqual([])

    // The next edit stores what this client holds: it must not put a damaged slate over the good one.
    await addConnected(page, 'Child', 'bottom', 'Grandchild')
    await page.mouse.click(820, 660)
    await settle(page)
    const later = await held(page)
    expect(names(later)).toEqual(['Alpha', 'Beta', 'Child', 'Grandchild', 'Welcome!'])
    expect(stored(store), 'the stored document after an edit that followed the reload').toEqual(later)

    // A second reload replays a room written by two sessions of the same person.
    await client.context.close()
    client = await open(browser, room, 'Solo', store)
    page = client.page
    await settle(page)
    expect(await held(page), 'the slate after a second reload').toEqual(later)
    expect(await drawn(page)).toEqual(later.notes)
    expect(stored(store)).toEqual(later)
    expect(client.errors).toEqual([])
  } finally {
    await client.context.close()
  }
})

test('two people: after one of them undoes, both keep working and anyone who joins sees what they see', async ({ browser }) => {
  test.setTimeout(150_000)
  const room = 'undo-replay-pair-' + Math.random().toString(36).slice(2)
  const store: Store = { json: null, saves: 0 }
  const a = await open(browser, room, 'A', store)
  const b = await open(browser, room, 'B', store)
  const joiners: Client[] = []
  try {
    await addNote(a.page, 'Alpha', 150, 150)
    await addNote(a.page, 'Beta', 150, 520)
    const beforeUndo = store.json! // a document stored before the undo: what a failed later save leaves behind
    await addNote(a.page, 'Quick', 650, 150)
    await expect.poll(async () => names(await held(b.page))).toEqual(['Alpha', 'Beta', 'Quick', 'Welcome!'])

    await undo(a.page)
    for (const client of [a, b]) {
      await expect.poll(async () => names(await held(client.page))).toEqual(['Alpha', 'Beta', 'Welcome!'])
    }
    await addConnected(a.page, 'Alpha', 'right', 'Child')
    await expect.poll(async () => names(await held(b.page))).toEqual(['Alpha', 'Beta', 'Child', 'Welcome!'])
    // The other person works on what the undo left.
    await addConnected(b.page, 'Beta', 'right', 'From B')
    await a.page.mouse.click(820, 660)
    await b.page.mouse.click(820, 660)
    await settle(a.page)

    const seen = await held(a.page)
    expect(names(seen)).toEqual(['Alpha', 'Beta', 'Child', 'From B', 'Welcome!'])
    expect(seen.lines).toHaveLength(2)
    expect(await held(b.page), 'both people hold the same slate').toEqual(seen)
    expect(await drawn(a.page)).toEqual(seen.notes)
    expect(await drawn(b.page)).toEqual(seen.notes)
    expect(stored(store), 'the stored document is what both see').toEqual(seen)

    // Someone joins with the stored document.
    const c = await open(browser, room, 'C', store)
    joiners.push(c)
    await settle(c.page)
    expect(await held(c.page), 'a person who joins with the stored document').toEqual(seen)
    expect(await drawn(c.page)).toEqual(seen.notes)

    // Someone joins with a document stored before the undo (the later saves never arrived).
    const d = await open(browser, room, 'D', store, beforeUndo)
    joiners.push(d)
    await settle(d.page)
    expect(await held(d.page), 'a person who joins with a document from before the undo').toEqual(seen)
    expect(await drawn(d.page)).toEqual(seen.notes)

    // Nobody's slate moved while the others joined, and nothing was stored over the good document.
    expect(await held(a.page)).toEqual(seen)
    expect(await held(b.page)).toEqual(seen)
    expect(stored(store)).toEqual(seen)
    for (const client of [a, b, ...joiners]) expect(client.errors).toEqual([])
  } finally {
    await Promise.all([a, b, ...joiners].map(client => client.context.close()))
  }
})

async function select(page: Page, name: string) {
  const at = await centreOf(page, name)
  await page.mouse.click(at.x, at.y)
  await expect.poll(() => page.evaluate(() => (window as any).slate.getSelectedNodes().map((n: any) => n.options.text))).toEqual([name])
}

const redo = (page: Page) => page.keyboard.press('ControlOrMeta+Shift+z')

/** Someone opens the slate now, with the stored document: they must see exactly `expected`. */
async function joinsAndSees(browser: Browser, room: string, store: Store, expected: Shape, when: string) {
  expect(stored(store), 'the stored document ' + when).toEqual(expected)
  const reader = await open(browser, room, 'Reader', store)
  try {
    await settle(reader.page)
    expect(await held(reader.page), 'a person who joins ' + when).toEqual(expected)
    expect(await drawn(reader.page), 'the names drawn for a person who joins ' + when).toEqual(expected.notes)
    expect(reader.errors).toEqual([])
  } finally {
    await reader.context.close()
  }
}

test('undo and redo of a rename, a delete and a connected note: at every point a person who joins sees what is on screen', async ({ browser }) => {
  test.setTimeout(240_000)
  const room = 'undo-replay-kinds-' + Math.random().toString(36).slice(2)
  const store: Store = { json: null, saves: 0 }
  const author = await open(browser, room, 'Author', store)
  const page = author.page
  const checkpoint = async (expectedNames: string[], lines: number, when: string) => {
    await expect.poll(async () => names(await held(page)), { message: when }).toEqual(expectedNames)
    await page.waitForTimeout(700) // the restore and its save have landed
    const now = await held(page)
    expect(now.lines, 'lines ' + when).toHaveLength(lines)
    expect(await drawn(page), 'the names drawn ' + when).toEqual(now.notes)
    await joinsAndSees(browser, room, store, now, when)
  }
  try {
    await addNote(page, 'Alpha', 150, 150)
    await addNote(page, 'Beta', 150, 520)
    await addNote(page, 'Gamma', 650, 150)

    // A rename, undone and redone.
    await select(page, 'Beta')
    await page.keyboard.type('2')
    await page.locator('.sb-inline-editor').waitFor({ timeout: 10_000 })
    await page.keyboard.press('Enter')
    await expect.poll(async () => names(await held(page))).toContain('Beta2')
    await paused(page)
    await undo(page)
    await checkpoint(['Alpha', 'Beta', 'Gamma', 'Welcome!'], 0, 'after the rename is undone')
    await redo(page)
    await checkpoint(['Alpha', 'Beta2', 'Gamma', 'Welcome!'], 0, 'after the rename is redone')

    // A delete, undone.
    await select(page, 'Gamma')
    await page.keyboard.press('Delete')
    await expect.poll(async () => names(await held(page))).toEqual(['Alpha', 'Beta2', 'Welcome!'])
    await paused(page)
    await joinsAndSees(browser, room, store, await held(page), 'after a delete')
    await undo(page)
    await checkpoint(['Alpha', 'Beta2', 'Gamma', 'Welcome!'], 0, 'after the delete is undone')

    // A connected note (a note, its line and its name), undone step by step, then redone.
    await addConnected(page, 'Alpha', 'right', 'Child')
    await page.mouse.click(820, 660)
    await checkpoint(['Alpha', 'Beta2', 'Child', 'Gamma', 'Welcome!'], 1, 'after a connected note')
    for (let presses = 0; presses < 3 && names(await held(page)).length > 4; presses++) {
      await undo(page)
      await page.waitForTimeout(500)
    }
    await checkpoint(['Alpha', 'Beta2', 'Gamma', 'Welcome!'], 0, 'after the connected note is undone')
    for (let presses = 0; presses < 3 && !names(await held(page)).includes('Child'); presses++) {
      await redo(page)
      await page.waitForTimeout(500)
    }
    await checkpoint(['Alpha', 'Beta2', 'Child', 'Gamma', 'Welcome!'], 1, 'after the connected note is redone')

    // Work that follows a redo.
    await addConnected(page, 'Child', 'bottom', 'Grandchild')
    await page.mouse.click(820, 660)
    await checkpoint(['Alpha', 'Beta2', 'Child', 'Gamma', 'Grandchild', 'Welcome!'], 2, 'after work that followed the redo')
    expect(author.errors).toEqual([])
  } finally {
    await author.context.close()
  }
})

test('two notes deleted one after the other: undo brings back the last one only', async ({ browser }) => {
  test.setTimeout(120_000)
  const room = 'undo-replay-deletes-' + Math.random().toString(36).slice(2)
  const store: Store = { json: null, saves: 0 }
  const author = await open(browser, room, 'Author', store)
  const page = author.page
  try {
    await addNote(page, 'Alpha', 150, 150)
    await addNote(page, 'Beta', 150, 520)
    await addNote(page, 'Gamma', 650, 150)
    await select(page, 'Gamma')
    await page.keyboard.press('Delete')
    await select(page, 'Beta') // at once: no pause between the two deletes
    await page.keyboard.press('Backspace')
    await expect.poll(async () => names(await held(page))).toEqual(['Alpha', 'Welcome!'])
    await page.waitForTimeout(800)
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(async () => names(await held(page))).toEqual(['Alpha', 'Beta', 'Welcome!'])
    await page.waitForTimeout(700)
    const now = await held(page)
    expect(names(now)).toEqual(['Alpha', 'Beta', 'Welcome!'])
    await joinsAndSees(browser, room, store, now, 'after the last delete is undone')
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(async () => names(await held(page))).toEqual(['Alpha', 'Beta', 'Gamma', 'Welcome!'])
    expect(author.errors).toEqual([])
  } finally {
    await author.context.close()
  }
})

test('two people undo at the same moment: both end on the same slate, and so do the stored document and a person who joins', async ({ browser }) => {
  test.setTimeout(150_000)
  const room = 'undo-replay-both-' + Math.random().toString(36).slice(2)
  const store: Store = { json: null, saves: 0 }
  const a = await open(browser, room, 'A', store)
  const b = await open(browser, room, 'B', store)
  try {
    await addNote(a.page, 'Alpha', 150, 150)
    await expect.poll(async () => names(await held(b.page))).toEqual(['Alpha', 'Welcome!'])
    await addNote(b.page, 'Beta', 150, 520)
    await expect.poll(async () => names(await held(a.page))).toEqual(['Alpha', 'Beta', 'Welcome!'])
    await addNote(a.page, 'From A', 650, 150)
    await addNote(b.page, 'From B', 650, 520)
    await expect.poll(async () => names(await held(a.page))).toEqual(['Alpha', 'Beta', 'From A', 'From B', 'Welcome!'])
    await a.page.mouse.click(820, 660)
    await b.page.mouse.click(820, 660)
    await a.page.waitForTimeout(800)

    await Promise.all([a.page.keyboard.press('ControlOrMeta+z'), b.page.keyboard.press('ControlOrMeta+z')])
    await settle(a.page)
    await settle(b.page)

    const seen = await held(a.page)
    expect(await held(b.page), 'both people hold the same slate').toEqual(seen)
    expect(names(seen)).toContain('Alpha') // whichever undo came last, it is one of the two, not a mixture gone wrong
    expect(names(seen).length).toBeGreaterThanOrEqual(3)
    expect(await drawn(a.page)).toEqual(seen.notes)
    expect(await drawn(b.page)).toEqual(seen.notes)
    await joinsAndSees(browser, room, store, seen, 'after two undos at the same moment')

    // Both go on working on it.
    await addConnected(a.page, 'Alpha', 'right', 'After, by A')
    await expect.poll(async () => names(await held(b.page))).toContain('After, by A')
    await addConnected(b.page, 'Welcome!', 'bottom', 'After, by B')
    await expect.poll(async () => names(await held(a.page))).toContain('After, by B')
    await a.page.mouse.click(820, 660)
    await b.page.mouse.click(820, 660)
    await settle(a.page)
    const later = await held(a.page)
    expect(await held(b.page)).toEqual(later)
    await joinsAndSees(browser, room, store, later, 'after work that followed the two undos')
    expect(a.errors).toEqual([])
    expect(b.errors).toEqual([])
  } finally {
    await Promise.all([a, b].map(client => client.context.close()))
  }
})

test('a person who was offline while someone else undid keeps the work they did offline, and everyone sees the same slate', async ({ browser }) => {
  test.setTimeout(150_000)
  const room = 'undo-replay-offline-' + Math.random().toString(36).slice(2)
  const store: Store = { json: null, saves: 0 }
  const a = await open(browser, room, 'A', store)
  const b = await open(browser, room, 'B', store)
  try {
    await addNote(a.page, 'Alpha', 150, 150)
    await addNote(a.page, 'Beta', 150, 520)
    await expect.poll(async () => names(await held(b.page))).toEqual(['Alpha', 'Beta', 'Welcome!'])

    // B loses the connection to the room and goes on working.
    await b.page.evaluate(() => (window as any).slate.collab.provider.disconnect())
    await addNote(b.page, 'Offline', 650, 520)
    // Meanwhile A adds a note, undoes it, and adds another.
    await addNote(a.page, 'Quick', 650, 150)
    await undo(a.page)
    await expect.poll(async () => names(await held(a.page))).toEqual(['Alpha', 'Beta', 'Welcome!'])
    await addConnected(a.page, 'Alpha', 'right', 'Child')
    await a.page.mouse.click(820, 660)

    // B comes back.
    await b.page.evaluate(() => (window as any).slate.collab.provider.connect())
    const expected = ['Alpha', 'Beta', 'Child', 'Offline', 'Welcome!']
    await expect.poll(async () => names(await held(a.page)), { timeout: 20_000 }).toEqual(expected)
    await expect.poll(async () => names(await held(b.page)), { timeout: 20_000 }).toEqual(expected)
    await settle(b.page)
    const seen = await held(a.page)
    expect(await held(b.page), 'both people hold the same slate').toEqual(seen)
    expect(await drawn(a.page)).toEqual(seen.notes)
    expect(await drawn(b.page)).toEqual(seen.notes)

    // The next edit by either stores what both see.
    await addConnected(b.page, 'Offline', 'bottom', 'Back')
    await expect.poll(async () => names(await held(a.page))).toContain('Back')
    await b.page.mouse.click(820, 660)
    await settle(b.page)
    const later = await held(b.page)
    expect(await held(a.page)).toEqual(later)
    await joinsAndSees(browser, room, store, later, 'after the person came back')
    expect(a.errors).toEqual([])
    expect(b.errors).toEqual([])
  } finally {
    await Promise.all([a, b].map(client => client.context.close()))
  }
})

test('notes a host governs (a workshop) stay out of undo and of the stored document, and are still drawn after an undo', async ({ browser }) => {
  test.setTimeout(150_000)
  const room = 'undo-replay-governed-' + Math.random().toString(36).slice(2)
  const store: Store = { json: null, saves: 0 }
  // Each client's host draws its own card from its own state, as the workshop host does.
  const host = (page: Page) => page.evaluate(async () => {
    const slate = (window as any).slate
    const draw = () => {
      if (slate.nodes.one('card-budget')) return
      slate.withPolicyAuthority(() => slate.addNode({ id: 'card-budget', x: 380, y: 80, width: 130, height: 60, text: 'Budget' }))
    }
    slate.setDragPolicy({
      governs: (node: any) => String(node.id).startsWith('card-'),
      onEnd: () => ({ accept: false }),
      onNotesReplaced: draw,
    })
    draw()
    await slate.nodes.one('card-budget').ready
  })
  const cards = (page: Page) => page.evaluate(() =>
    [...document.querySelectorAll('#slateCanvas [data-node-id="card-budget"]')].map(el => el.textContent!.trim()))
  const a = await open(browser, room, 'A', store)
  const b = await open(browser, room, 'B', store)
  try {
    await host(a.page)
    await host(b.page)
    await addNote(a.page, 'Alpha', 150, 150)
    await addNote(a.page, 'Beta', 150, 520)
    await addNote(a.page, 'Quick', 650, 150)
    await expect.poll(async () => names(await held(b.page))).toEqual(['Alpha', 'Beta', 'Quick', 'Welcome!'])
    await undo(a.page)
    for (const client of [a, b]) {
      await expect.poll(async () => names(await held(client.page))).toEqual(['Alpha', 'Beta', 'Welcome!'])
    }
    await addConnected(a.page, 'Alpha', 'right', 'Child')
    await a.page.mouse.click(820, 660)
    await expect.poll(async () => names(await held(b.page))).toEqual(['Alpha', 'Beta', 'Child', 'Welcome!'])
    await settle(a.page)

    const seen = await held(a.page)
    expect(await held(b.page)).toEqual(seen)
    // The card is drawn once for each person, and is in neither the stored document nor the room.
    expect(await cards(a.page)).toEqual(['Budget'])
    expect(await cards(b.page)).toEqual(['Budget'])
    expect(store.json).not.toContain('card-budget')
    expect(await a.page.evaluate(() => {
      const packages: string[] = []
      ;(window as any).slate.collab.collabMap.forEach((pkg: any) => packages.push(JSON.stringify(pkg)))
      return packages.some(text => text.includes('card-budget'))
    }), 'the room holds nothing about the card').toBe(false)
    expect(stored(store)).toEqual(seen)

    // A person who joins: the ordinary notes as they are, the card drawn by their own host.
    const c = await open(browser, room, 'C', store)
    try {
      await host(c.page)
      await settle(c.page)
      expect(await held(c.page)).toEqual(seen)
      expect(await cards(c.page)).toEqual(['Budget'])
      expect(c.errors).toEqual([])
    } finally {
      await c.context.close()
    }
    expect(a.errors).toEqual([])
    expect(b.errors).toEqual([])
  } finally {
    await Promise.all([a, b].map(client => client.context.close()))
  }
})

test('a note that was selected when undo replaced the slate is no longer selected, and selecting notes afterwards raises no error', async ({ browser }) => {
  test.setTimeout(120_000)
  const room = 'undo-replay-selection-' + Math.random().toString(36).slice(2)
  const store: Store = { json: null, saves: 0 }
  const author = await open(browser, room, 'Author', store)
  const page = author.page
  try {
    await addNote(page, 'Alpha', 150, 150)
    await addNote(page, 'Beta', 150, 520)
    await addNote(page, 'Gamma', 650, 150)
    await select(page, 'Beta')
    await page.keyboard.press('ControlOrMeta+z') // with Beta still selected
    await expect.poll(async () => names(await held(page))).toEqual(['Alpha', 'Beta', 'Welcome!'])
    await page.keyboard.press('ControlOrMeta+Shift+z')
    await expect.poll(async () => names(await held(page))).toEqual(['Alpha', 'Beta', 'Gamma', 'Welcome!'])
    await page.waitForTimeout(500)
    // Nothing is selected: every note was replaced, and none of them shows as selected.
    expect(await page.evaluate(() => (window as any).slate.getSelectedNodes().length)).toBe(0)
    // With the pointer off the notes, no note shows connectors: the replaced ones left none behind.
    await page.mouse.move(820, 660)
    await expect.poll(() => page.locator('#slateCanvas .connection-handle').evaluateAll(handles =>
      handles.filter(handle => (handle as SVGGraphicsElement).getBoundingClientRect().width > 0).length)).toBe(0)
    // Delete with nothing selected deletes nothing.
    await page.keyboard.press('Delete')
    await page.waitForTimeout(300)
    expect(names(await held(page))).toEqual(['Alpha', 'Beta', 'Gamma', 'Welcome!'])
    await select(page, 'Gamma')
    await select(page, 'Alpha')
    await select(page, 'Beta')
    // The selected note has its four connectors, and no other note left any behind.
    await expect.poll(() => page.locator('#slateCanvas .connection-handle').evaluateAll(handles =>
      handles.filter(handle => (handle as SVGGraphicsElement).getBoundingClientRect().width > 0).length)).toBe(4)
    expect(author.errors).toEqual([])
  } finally {
    await author.context.close()
  }
})

test('after a connector is dragged from one note onto another, typing goes to the note pressed next', async ({ browser }) => {
  test.setTimeout(120_000)
  const room = 'undo-replay-focus-' + Math.random().toString(36).slice(2)
  const store: Store = { json: null, saves: 0 }
  const author = await open(browser, room, 'Author', store)
  const page = author.page
  try {
    await addNote(page, 'Alpha', 150, 150)
    await addNote(page, 'Beta', 150, 520)
    await select(page, 'Alpha')
    await page.waitForTimeout(400)
    const handle = await page.evaluate(() => {
      const box = (window as any).slate.getSelectedNodes()[0].connectionHandles.bottom.node.getBoundingClientRect()
      return { x: box.left + box.width / 2, y: box.top + box.height / 2 }
    })
    const beta = await centreOf(page, 'Beta')
    await page.mouse.move(handle.x, handle.y)
    await page.mouse.down()
    await page.mouse.move(handle.x + 10, handle.y + 60, { steps: 6 })
    await page.mouse.move(beta.x, beta.y, { steps: 12 })
    await page.mouse.up()
    await expect.poll(async () => (await held(page)).lines.length).toBe(1)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    await select(page, 'Beta')
    await page.keyboard.type('xy')
    await page.locator('.sb-inline-editor').waitFor({ timeout: 10_000 })
    await page.keyboard.press('Enter')
    await expect.poll(async () => names(await held(page))).toEqual(['Alpha', 'Betaxy', 'Welcome!'])
    expect(author.errors).toEqual([])
  } finally {
    await author.context.close()
  }
})
