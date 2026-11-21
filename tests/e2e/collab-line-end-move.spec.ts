import { expect, test, type Browser, type Page } from '@playwright/test'

// Two people moving the same line's end at once (lines review M1), through the
// standalone relay (tests/collab-server-standalone.cjs, started by playwright.config.ts).
//
// A line keeps its id when one of its ends moves, and a move is the line's remove and
// its add again. Both people move the end of A->B while out of touch with the room
// (so the moves are truly at the same moment), then come back: both see one line, the
// same one, and so does someone who joins afterwards.

const RELAY = process.env.SLATEBOX_COLLAB_WS || 'ws://localhost:1234'

type Store = { json: string | null }

/** One person on the slate: the application loads the slate it stored, then the room is replayed over it. */
async function join(browser: Browser, room: string, store: Store) {
  const context = await browser.newContext({ viewport: { width: 1000, height: 700 } })
  const page = await context.newPage()
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(String(error)))
  await page.exposeFunction('hostSave', (json: string) => { store.json = json })
  await page.goto('/test.html')
  await page.waitForFunction(() => (window as any).Slatebox)
  await page.evaluate(async ({ room, load, relay }) => {
    const host = document.createElement('div')
    host.id = 'slateCanvas'
    host.style.cssText = 'width:900px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff'
    document.body.appendChild(host)
    const w = window as any
    const facade = await new w.Slatebox.slate(
      { container: 'slateCanvas', id: room, allowCollaboration: true },
      {
        onInitCollaboration: async () => ({ websocketUrl: relay, websocketParams: {}, userName: 'x', color: '#3366ff' }),
        // The application stores the whole slate after each change this person makes.
        onSlateChanged: () => w.hostSave(facade.exportJSON()),
      }
    ).init()
    w.slate = facade.v2
    if (load) return facade.loadJSON(load)
    // A new slate: four notes and a line from A to B, stored, then loaded from the store.
    const slate = w.slate
    slate.beginRemoteApply()
    const at = { A: [100, 100], B: [500, 100], C: [500, 380], D: [100, 380] } as Record<string, number[]>
    const notes = Object.entries(at).map(([id, [x, y]]) => slate.addNode({ id, x, y, width: 140, height: 80, text: id }))
    await Promise.all(notes.map((n: any) => n.ready))
    slate.getNode('A').relationships.addAssociation(slate.getNode('B'), { id: 'A->B' })
    slate.endRemoteApply()
    const json = facade.exportJSON()
    await w.hostSave(json)
    await facade.loadJSON(json)
  }, { room, load: store.json, relay: RELAY })
  await page.waitForFunction(() => (window as any).slate.collab.isCollabConnected(), undefined, { timeout: 20000 })
  await page.waitForTimeout(500)
  return { context, page, errors }
}

const lines = (page: Page) =>
  page.evaluate(() =>
    (window as any).slate.getAllNodes().flatMap((n: any) =>
      n.relationships.getAssociations().map((a: any) => `${n.id}:${a.id}:${a.childId}`)
    ).sort()
  )

const drawnLines = (page: Page) => page.evaluate(() => document.querySelectorAll('#slateCanvas path[connectortype="default"]').length)

/** Drop the far end of A->B onto a note, as letting go of its handle there does. */
const moveEndTo = (page: Page, id: string) =>
  page.evaluate(async (id) => {
    const slate = (window as any).slate
    const conn = slate.getNode('A').connector.getConnections().find((c: any) => c.id === 'A->B')
    const o = slate.getNode(id).options
    conn.connectable.onEndpointChange({ which: 'target', targetNodeId: id, isPhantom: false, point: { x: o.x + o.width / 2, y: o.y + o.height / 2 } })
    await new Promise((r) => setTimeout(r, 100))
  }, id)

test('two people moving the same line\'s end at once see the same line, and so does someone who joins', async ({ browser }) => {
  test.setTimeout(90_000)
  const room = 'line-end-move-' + Math.random().toString(36).slice(2)
  const store: Store = { json: null }
  const one = await join(browser, room, store)
  const two = await join(browser, room, store)
  try {
    expect(await lines(one.page)).toEqual(['A:A->B:B'])
    await Promise.all([one, two].map((c) => c.page.evaluate(() => (window as any).slate.collab.provider.disconnect())))
    await moveEndTo(one.page, 'C')
    await moveEndTo(two.page, 'D')
    expect(await lines(one.page)).toEqual(['A:A->B:C'])
    expect(await lines(two.page)).toEqual(['A:A->B:D'])
    await Promise.all([one, two].map((c) => c.page.evaluate(() => (window as any).slate.collab.provider.connect())))
    await Promise.all([one, two].map((c) => c.page.waitForFunction(() => (window as any).slate.collab.isCollabConnected(), undefined, { timeout: 20000 })))
    await one.page.waitForTimeout(1500)

    const seen = await lines(one.page)
    expect(seen).toHaveLength(1)
    expect(await lines(two.page), 'both people see the same line').toEqual(seen)
    expect(await drawnLines(one.page)).toBe(1)
    expect(await drawnLines(two.page)).toBe(1)

    // Someone joining replays the room over the slate as last stored.
    const three = await join(browser, room, store)
    try {
      await expect.poll(() => lines(three.page), { timeout: 10_000 }).toEqual(seen)
      expect(await drawnLines(three.page)).toBe(1)
      expect(three.errors).toEqual([])
    } finally {
      await three.context.close()
    }
    expect(one.errors).toEqual([])
    expect(two.errors).toEqual([])
  } finally {
    await Promise.all([one, two].map((c) => c.context.close()))
  }
})
