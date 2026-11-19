import { expect, test, type Page } from '@playwright/test'

// A control that cannot do anything is not shown.
//
// The gear on a selected note asks the host to open its note settings
// (events.onMenuRequested) and the gear on a selected connector asks for its line
// settings (events.onLineMenuRequested). An embedding page that supplies neither,
// like the documentation's sample slates, gets no gear at all; everything left in
// the toolbars is the engine's own and does something when used. A host that
// supplies the callbacks sees exactly the controls it always did.

type Callbacks = { note?: boolean; line?: boolean; text?: boolean }

async function openBoard(page: Page, callbacks: Callbacks = {}) {
  await page.goto('/test.html')
  await page.evaluate(async callbacks => {
    const { Slate } = await import('/src/index.ts')
    const host = document.createElement('div')
    host.id = 'board'
    host.style.cssText = 'position:fixed;left:0;top:0;width:1000px;height:700px;background:white'
    document.body.replaceChildren(host)
    const w = window as any
    w.hostCalls = [] as any[]
    w.changes = [] as string[]
    // The documentation's embeds pass only onSlateChanged. Start from the same shape.
    const events: Record<string, Function> = { onSlateChanged: (pkg: any) => w.changes.push(pkg.type) }
    if (callbacks.note) events.onMenuRequested = (node: any) => w.hostCalls.push(['onMenuRequested', node.id])
    if (callbacks.line) events.onLineMenuRequested = (node: any, association: any) =>
      w.hostCalls.push(['onLineMenuRequested', node.id, association?.childId ?? association?.child?.options?.id])
    if (callbacks.text) events.onTextPaneRequested = (node: any) => w.hostCalls.push(['onTextPaneRequested', node.id])
    const board = new Slate(host, {
      viewPort: { originalWidth: 1000, originalHeight: 700 },
      showBirdsEye: false, showZoom: false, showMultiSelect: false,
      events,
    })
    w.board = board
    const rain = board.addNode({ id: 'rain', x: 160, y: 330, width: 150, height: 80, text: 'Rain on copper' })
    const recording = board.addNode({ id: 'recording', x: 620, y: 330, width: 150, height: 80, text: 'Field recording' })
    const chimes = board.addNode({ id: 'chimes', x: 400, y: 560, width: 150, height: 80, text: 'Glass chimes' })
    // A comment's text is edited in the host's pane, never on the canvas.
    const remark = board.addNode({ id: 'remark', x: 780, y: 560, width: 150, height: 80, text: 'Check the levels', isComment: true })
    await Promise.all([rain.ready, recording.ready, chimes.ready, remark.ready])
    rain.relationships.addAssociation(recording)
    await new Promise(resolve => setTimeout(resolve, 300))
    w.changes.length = 0
  }, callbacks)
}

const centre = async (page: Page, selector: string) => {
  const box = (await page.locator(selector).first().boundingBox())!
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

/**
 * Put the real pointer on a toolbar button and click it. The toolbar is redrawn when
 * its note is pressed, so wait until the button is on screen and holding still.
 */
async function clickTool(page: Page, selector: string) {
  await page.locator(selector).first().hover()
  await page.mouse.down()
  await page.mouse.up()
}

/** The buttons of a toolbar, left to right, by what they are. */
const tools = (page: Page, toolbar: 'node' | 'line') => page.evaluate(toolbar =>
  Array.from(document.querySelectorAll(`#board .${toolbar}-toolbar > g`))
    .map(button => (button.getAttribute('class') ?? '').replace(`${toolbar}-tool-`, '')), toolbar)

const edges = (page: Page) => page.evaluate(() =>
  (window as any).board.getAllNodes().flatMap((n: any) =>
    n.relationships.getAssociations().map((edge: any) => `${n.id}>${edge.childId}`)).sort())

async function selectNote(page: Page, id: string) {
  const { x, y } = await centre(page, `#board g[data-node-id="${id}"]`)
  await page.mouse.click(x, y)
  await expect.poll(() => page.evaluate(() => (window as any).board.getSelectedNodes().map((n: any) => n.id))).toEqual([id])
  await expect(page.locator('#board .node-toolbar')).toHaveCount(1)
}

async function selectLine(page: Page) {
  const point = await page.evaluate(() => {
    const path = document.querySelector('#board path[connectortype="default"]') as SVGPathElement
    const middle = path.getPointAtLength(path.getTotalLength() / 2)
    const matrix = path.getScreenCTM()!
    return { x: middle.x * matrix.a + middle.y * matrix.c + matrix.e, y: middle.x * matrix.b + middle.y * matrix.d + matrix.f }
  })
  await page.mouse.click(point.x, point.y)
  await expect(page.locator('#board .line-toolbar')).toHaveCount(1)
}

test.describe('a page that supplies no host callbacks', () => {
  test('a selected note has no gear, and each remaining button works', async ({ page }) => {
    await openBoard(page)
    await selectNote(page, 'rain')

    expect(await tools(page, 'node')).toEqual(['delete', 'plug'])
    await expect(page.locator('#board .node-tool-cog')).toHaveCount(0)
    // The pill is drawn for the buttons it holds: no empty slot where the gear was.
    const pill = (await page.locator('#board .node-toolbar > rect').boundingBox())!
    const last = (await page.locator('#board .node-tool-plug').boundingBox())!
    expect(pill.x + pill.width - (last.x + last.width)).toBeLessThan(12)

    // Plug: press it and drag onto another note to connect the two.
    await page.locator('#board .node-tool-plug').hover()
    const plug = await centre(page, '#board .node-tool-plug')
    const target = await centre(page, '#board g[data-node-id="chimes"]')
    await page.mouse.down()
    await page.mouse.move((plug.x + target.x) / 2, (plug.y + target.y) / 2, { steps: 6 })
    await page.mouse.move(target.x, target.y, { steps: 6 })
    await page.mouse.up()
    await expect.poll(() => edges(page)).toEqual(['rain>chimes', 'rain>recording'])
    await expect(page.locator('#board path[connectortype="default"]')).toHaveCount(2)

    // Delete: removes the note and its connections, and the toolbar goes with it.
    await selectNote(page, 'rain')
    await clickTool(page, '#board .node-tool-delete')
    await expect(page.locator('#board g[data-node-id="rain"]')).toHaveCount(0)
    await expect(page.locator('#board .node-toolbar')).toHaveCount(0)
    await expect(page.locator('#board path[connectortype="default"]')).toHaveCount(0)
    expect(await page.evaluate(() => (window as any).changes)).toContain('onNodeDeleted')
  })

  test('a plain click on the plug adds a connected note at the pointer', async ({ page }) => {
    await openBoard(page)
    await selectNote(page, 'chimes')
    await clickTool(page, '#board .node-tool-plug')
    await expect.poll(() => page.evaluate(() => (window as any).board.getAllNodes().length)).toBe(5)
    const added = await page.evaluate(() => {
      const board = (window as any).board
      const fresh = board.getAllNodes().find((n: any) => !['rain', 'recording', 'chimes', 'remark'].includes(n.id))
      return { id: fresh.id, connected: board.getNode('chimes').relationships.getAssociations().some((edge: any) => edge.childId === fresh.id) }
    })
    expect(added.connected).toBe(true)
  })

  test('a selected connector has no gear, and its delete button works', async ({ page }) => {
    await openBoard(page)
    await selectLine(page)

    expect(await tools(page, 'line')).toEqual(['delete'])
    await expect(page.locator('#board .line-tool-cog')).toHaveCount(0)
    // Nothing to reveal the line's settings means no half-open settings either.
    await expect(page.locator('#board .endpoint-lock')).toHaveCount(0)

    await clickTool(page, '#board .line-tool-delete')
    await expect.poll(() => edges(page)).toEqual([])
    await expect(page.locator('#board path[connectortype="default"]')).toHaveCount(0)
    await expect(page.locator('#board .line-toolbar')).toHaveCount(0)
    expect(await page.evaluate(() => (window as any).changes)).toContain('removeRelationship')
  })

  test('the routes to host settings that have no button do nothing rather than open something empty', async ({ page }) => {
    await openBoard(page)
    const snapshot = () => page.evaluate(() => ({
      outside: document.body.children.length,
      panels: document.querySelectorAll('[role="dialog"], dialog, .sb-context-menu, .sb-inline-editor').length,
      nodes: JSON.parse((window as any).board.exportJSON()).nodes.length,
    }))
    const before = await snapshot()

    // The API a keyboard shortcut or assistive tool would call for the note menu.
    const menu = await page.evaluate(() => {
      const note = (window as any).board.getNode('rain')
      ;(window as any).board.selectNodes([note])
      note.menu.open()
      note.requestTextPane()
      return note.menu.isMenuOpen()
    })
    expect(menu).toBe(false)
    // A comment's text is the host's to edit: a double-click asks the host, and with
    // no host there is nothing to open.
    const remark = await centre(page, '#board g[data-node-id="remark"]')
    await page.mouse.dblclick(remark.x, remark.y)
    await page.waitForTimeout(200)
    expect(await snapshot()).toEqual(before)
    expect(await page.evaluate(() => (window as any).hostCalls)).toEqual([])
  })
})

test.describe('a host that supplies the callbacks', () => {
  test('the note gear is present and asks the host for the note menu, once per click', async ({ page }) => {
    await openBoard(page, { note: true, line: true, text: true })
    await selectNote(page, 'rain')
    expect(await tools(page, 'node')).toEqual(['delete', 'plug', 'cog'])

    await clickTool(page, '#board .node-tool-cog')
    await expect.poll(() => page.evaluate(() => (window as any).hostCalls)).toEqual([['onMenuRequested', 'rain']])
    // Opening the host's menu changes nothing on the slate by itself.
    expect(await page.evaluate(() => (window as any).changes)).toEqual([])
    expect(await page.evaluate(() => (window as any).board.getNode('rain').menu.isMenuOpen())).toBe(true)

    // The other two buttons are the same engine controls as without a host.
    await clickTool(page, '#board .node-tool-delete')
    await expect(page.locator('#board g[data-node-id="rain"]')).toHaveCount(0)
  })

  test('the connector gear is present, asks the host for the line menu and shows the endpoint locks', async ({ page }) => {
    await openBoard(page, { note: true, line: true, text: true })
    await selectLine(page)
    expect(await tools(page, 'line')).toEqual(['delete', 'cog'])

    await clickTool(page, '#board .line-tool-cog')
    await expect.poll(() => page.evaluate(() => (window as any).hostCalls)).toEqual([['onLineMenuRequested', 'rain', 'recording']])
    await expect(page.locator('#board .endpoint-lock')).toHaveCount(2)

    await clickTool(page, '#board .line-tool-delete')
    await expect.poll(() => edges(page)).toEqual([])
  })

  test('a comment still hands its text to the host on a double-click', async ({ page }) => {
    await openBoard(page, { note: true, line: true, text: true })
    const remark = await centre(page, '#board g[data-node-id="remark"]')
    await page.mouse.dblclick(remark.x, remark.y)
    await expect.poll(() => page.evaluate(() => (window as any).hostCalls)).toContainEqual(['onTextPaneRequested', 'remark'])
    await expect(page.locator('#board .sb-inline-editor')).toHaveCount(0)
  })

  test('each gear follows its own callback', async ({ page }) => {
    await openBoard(page, { note: true })
    await selectNote(page, 'rain')
    expect(await tools(page, 'node')).toEqual(['delete', 'plug', 'cog'])
    await selectLine(page)
    expect(await tools(page, 'line')).toEqual(['delete'])

    await openBoard(page, { line: true })
    await selectNote(page, 'rain')
    expect(await tools(page, 'node')).toEqual(['delete', 'plug'])
    await selectLine(page)
    expect(await tools(page, 'line')).toEqual(['delete', 'cog'])
  })

  test('a callback the host registers later brings its gear with the next selection', async ({ page }) => {
    await openBoard(page)
    await selectNote(page, 'rain')
    expect(await tools(page, 'node')).toEqual(['delete', 'plug'])
    await page.evaluate(() => {
      const w = window as any
      w.board.options.events.onMenuRequested = (node: any) => w.hostCalls.push(['onMenuRequested', node.id])
      w.board.clearSelection()
    })
    await selectNote(page, 'rain')
    expect(await tools(page, 'node')).toEqual(['delete', 'plug', 'cog'])
  })
})
