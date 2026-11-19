import { expect, test, type Browser, type Page } from '@playwright/test'

// Two people on one slate, in isolated browser contexts joined through the standalone
// relay (tests/collab-server-standalone.cjs, started by playwright.config.ts).
//
// When A creates a connected note its editor opens for A alone. B receives the note
// and its connection, then the name once A commits it, and never sees an editor.

async function join(browser: Browser, room: string, userName: string) {
  const context = await browser.newContext({ viewport: { width: 1000, height: 700 } })
  const page = await context.newPage()
  await page.goto('/test.html')
  await page.waitForFunction(() => (window as any).Slatebox)
  await page.evaluate(async ({ room, userName }) => {
    const host = document.createElement('div')
    host.id = 'slateCanvas'
    host.style.cssText = 'width:900px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff'
    document.body.appendChild(host)
    const w = window as any
    w.received = [] as any[]
    w.sent = [] as any[]
    w.editorsOpened = 0
    new MutationObserver(records => {
      for (const record of records) for (const added of record.addedNodes) {
        if ((added as Element).querySelector?.('.sb-inline-editor')) w.editorsOpened++
      }
    }).observe(host, { childList: true, subtree: true })
    const facade = await new w.Slatebox.slate(
      { container: 'slateCanvas', id: room, allowCollaboration: true },
      {
        onInitCollaboration: async () => ({
          websocketUrl: 'ws://localhost:1234',
          websocketParams: {},
          userName,
          color: '#3366ff',
        }),
        onCollaboration: (pkg: any) => w.received.push(pkg),
      }
    ).init()
    const slate = facade.v2
    w.slate = slate
    // Everything this client sends to the room goes through collab.send.
    const send = slate.collab.send.bind(slate.collab)
    slate.collab.send = (packages: any) => {
      w.sent.push(...(Array.isArray(packages) ? packages : [packages]))
      return send(packages)
    }
  }, { room, userName })
  await page.waitForFunction(() => (window as any).slate.collab.isCollabConnected(), undefined, { timeout: 20000 })
  // The same starting note on both sides (the host application's job in production).
  await page.evaluate(async () => {
    const slate = (window as any).slate
    slate.beginRemoteApply() // seeding is not a local edit
    const seed = slate.addNode({ id: 'seed', x: 380, y: 200, width: 130, height: 70, text: 'Field recording' })
    slate.endRemoteApply()
    await seed.ready
  })
  return { context, page }
}

const types = (page: Page, list: 'sent' | 'received') =>
  page.evaluate(list => (window as any)[list].map((pkg: any) => pkg.type), list)

const peerView = (page: Page) => page.evaluate(() => {
  const slate = (window as any).slate
  const child = slate.getAllNodes().find((n: any) => n.id !== 'seed')
  return {
    notes: slate.getAllNodes().length,
    childText: child?.options.text,
    childLabel: child?.svgGroup?.node.getAttribute('aria-label'),
    edges: slate.getNode('seed').relationships.getAssociations().map((edge: any) => edge.childId === child?.id),
    editors: document.querySelectorAll('.sb-inline-editor').length,
    editorsOpened: (window as any).editorsOpened,
    selected: slate.getSelectedNodes().length,
    focusInEditor: !!document.activeElement?.closest?.('.sb-inline-editor'),
  }
})

for (const gesture of ['click', 'keyboard'] as const) {
  test(`a note created by ${gesture} opens for naming only for its author; the peer gets the note, then its name`, async ({ browser }) => {
    test.setTimeout(90_000)
    const room = 'type-to-name-' + Math.random().toString(36).slice(2)
    const A = await join(browser, room, 'Author')
    const B = await join(browser, room, 'Peer')
    try {
      await A.page.waitForTimeout(500)
      for (const { page } of [A, B]) await page.evaluate(() => { (window as any).sent.length = 0; (window as any).received.length = 0 })

      // A creates a connected note.
      if (gesture === 'click') {
        const box = (await A.page.locator('#slateCanvas g[data-node-id="seed"]').boundingBox())!
        await A.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
        const plug = await A.page.waitForFunction(() => {
          const source = (window as any).slate.getNode('seed')
          const dot = source.connectionHandles.bottom?.node as SVGCircleElement | undefined
          if (!dot || !source.isConnectionHandlesEnabled()) return
          const r = dot.getBoundingClientRect()
          const x = r.left + r.width / 2, y = r.top + r.height / 2
          return r.width && document.elementFromPoint(x, y) === dot ? { x, y } : undefined
        })
        const { x, y } = (await plug.jsonValue()) as { x: number; y: number }
        await A.page.mouse.click(x, y)
      } else {
        await A.page.locator('#slateCanvas').getByRole('button', { name: 'Field recording', exact: true }).focus()
        await A.page.keyboard.press('Space')
        await A.page.keyboard.press('Tab')
        await A.page.keyboard.press('Enter')
      }
      const editor = A.page.locator('#slateCanvas .sb-inline-editor')
      await expect(editor).toBeFocused()

      // B receives the blank note and its connection, and nothing else.
      await expect.poll(() => peerView(B.page)).toEqual({
        notes: 2, childText: '', childLabel: 'Unnamed node', edges: [true],
        editors: 0, editorsOpened: 0, selected: 0, focusInEditor: false,
      })
      expect(await types(A.page, 'sent')).toEqual(['onNodeAdded', 'addRelationship'])
      expect(await types(B.page, 'received')).toEqual(['onNodeAdded', 'addRelationship'])
      // The creating client's package is the plain node-added package: the new note's
      // id and its options, with empty text.
      const added = await A.page.evaluate(() => (window as any).sent[0])
      expect(Object.keys(added.data).sort()).toEqual(['id', 'nodeOptions'])
      expect(added.data.nodeOptions.id).toBe(added.data.id)
      expect(added.data.nodeOptions.text).toBe('')

      // Typing is local until it is committed.
      await A.page.keyboard.type('Transcript')
      await expect(editor).toHaveText('Transcript')
      await A.page.waitForTimeout(600)
      expect(await types(A.page, 'sent')).toEqual(['onNodeAdded', 'addRelationship'])
      expect(await types(B.page, 'received')).toEqual(['onNodeAdded', 'addRelationship'])
      expect((await peerView(B.page)).childText).toBe('')

      // Enter commits: one text change goes out, and B shows the name.
      await A.page.keyboard.press('Enter')
      await expect.poll(() => peerView(B.page)).toEqual({
        notes: 2, childText: 'Transcript', childLabel: 'Transcript', edges: [true],
        editors: 0, editorsOpened: 0, selected: 0, focusInEditor: false,
      })
      await A.page.waitForTimeout(400)
      expect(await types(A.page, 'sent')).toEqual(['onNodeAdded', 'addRelationship', 'onNodeTextChanged'])
      expect(await types(B.page, 'received')).toEqual(['onNodeAdded', 'addRelationship', 'onNodeTextChanged'])
      // A's own editor opened exactly once, and nothing B sent came back to open another.
      expect(await A.page.evaluate(() => (window as any).editorsOpened)).toBe(1)
      expect(await types(B.page, 'sent')).toEqual([])
    } finally {
      await A.context.close()
      await B.context.close()
    }
  })
}
