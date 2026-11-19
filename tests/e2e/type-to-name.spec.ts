import { expect, test, type Page } from '@playwright/test'

// A connected note is ready to type into the moment it is created, and typing on a
// selected note edits it. Nobody has to find a rename key first.
//
// Every gesture is driven with real input (mouse, touch or keys) against the engine's
// own test page, at a desktop viewport and at a 390x844 touch viewport.

type Permission = 'edit' | 'read' | 'comment' | 'locked'

async function openBoard(page: Page, options: { width?: number; height?: number; permission?: Permission; enabled?: boolean } = {}) {
  const { width = 900, height = 560, permission = 'edit', enabled = true } = options
  await page.goto('/test.html')
  await page.evaluate(async ({ width, height, permission, enabled }) => {
    const { Slate } = await import('/src/index.ts')
    const host = document.createElement('div')
    host.id = 'board'
    host.style.cssText = `position:fixed;left:0;top:0;width:${width}px;height:${height}px;background:white`
    const after = document.createElement('input')
    after.setAttribute('aria-label', 'After canvas')
    after.style.cssText = `position:fixed;left:8px;top:${height + 12}px`
    document.body.replaceChildren(host, after)
    const w = window as any
    w.permission = permission
    w.sent = [] as any[]
    const board = new Slate(host, {
      enabled,
      viewPort: { originalWidth: width, originalHeight: height },
      showBirdsEye: false, showZoom: false, showMultiSelect: false,
      events: {
        isReadOnly: () => w.permission === 'read',
        isCommentOnly: () => w.permission === 'comment',
        onSlateChanged: (pkg: any) => w.sent.push(pkg),
      },
    })
    w.board = board
    const root = board.addNode({ id: 'root', x: 140, y: 230, width: 110, height: 64, text: 'Field recording', isLocked: permission === 'locked' })
    const other = board.addNode({ id: 'other', x: 20, y: 460, width: 100, height: 56, text: 'Rain on copper' })
    await Promise.all([root.ready, other.ready])
    // Let the two programmatic "Node added" announcements pass, then record the live region.
    await new Promise(resolve => setTimeout(resolve, 250))
    w.spoken = [] as string[]
    const live = host.querySelector('[aria-live]')!
    new MutationObserver(() => { if (live.textContent) w.spoken.push(live.textContent) })
      .observe(live, { childList: true, characterData: true, subtree: true })
    // Any editor that ever appears is recorded, however briefly it lives.
    w.editorsOpened = 0
    new MutationObserver(records => {
      for (const record of records) for (const added of record.addedNodes) {
        if ((added as Element).querySelector?.('.sb-inline-editor')) w.editorsOpened++
      }
    }).observe(host, { childList: true, subtree: true })
    w.sent.length = 0
  }, { width, height, permission, enabled })
}

const editor = (page: Page) => page.locator('#board .sb-inline-editor')
const note = (page: Page, id: string) => page.locator(`#board g[data-node-id="${id}"]`)
const selectedIds = (page: Page) => page.evaluate(() => (window as any).board.getSelectedNodes().map((n: any) => n.id))
const sentTypes = (page: Page) => page.evaluate(() => (window as any).sent.map((p: any) => p.type))

/** The saved document: every note's text and the notes each one points at. */
const saved = (page: Page) => page.evaluate(() => {
  const nodes = JSON.parse((window as any).board.exportJSON()).nodes
  return nodes.map((n: any) => ({
    id: n.options.id as string,
    text: n.options.text as string,
    children: (n.relationships?.associations ?? []).map((edge: any) => edge.childId as string),
  }))
})

async function selectByPointer(page: Page, id: string, touch: boolean) {
  const box = (await note(page, id).boundingBox())!
  if (touch) await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2)
  else await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  await expect.poll(() => selectedIds(page)).toEqual([id])
}

/** Centre of one of the selected note's round connectors, once it is really on screen. */
async function plug(page: Page, side: 'top' | 'right' | 'bottom' | 'left') {
  const handle = await page.waitForFunction(side => {
    const source = (window as any).board.getNode('root')
    const dot = source.connectionHandles[side]?.node as SVGCircleElement | undefined
    if (!dot || !source.isConnectionHandlesEnabled()) return
    const r = dot.getBoundingClientRect()
    if (!r.width) return
    const x = r.left + r.width / 2, y = r.top + r.height / 2
    return document.elementFromPoint(x, y) === dot ? { x, y } : undefined
  }, side)
  return handle.jsonValue() as Promise<{ x: number; y: number }>
}

type Gesture = 'click' | 'drag' | 'keyboard'

/**
 * Create a connected note from "Field recording" the way a person would. Returns nothing: the test then just types.
 * `beforeCreating` runs once the source is selected, immediately before the input that creates the note.
 */
async function createConnectedNote(page: Page, gesture: Gesture, touch: boolean, beforeCreating?: () => Promise<void>) {
  if (gesture === 'keyboard') {
    await page.getByRole('button', { name: 'Field recording', exact: true }).focus()
    await page.keyboard.press('Space')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Add connected note above', exact: true })).toBeFocused()
    await beforeCreating?.()
    await page.keyboard.press('Enter')
    return
  }
  await selectByPointer(page, 'root', touch)
  const { x, y } = await plug(page, 'bottom')
  await beforeCreating?.()
  if (gesture === 'click') {
    if (touch) await page.touchscreen.tap(x, y)
    else await page.mouse.click(x, y)
    return
  }
  // Drag the connector into open space and let go.
  if (touch) {
    const session = await page.context().newCDPSession(page)
    const contact = (x: number, y: number) => [{ x, y, radiusX: 1, radiusY: 1 }]
    try {
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: contact(x, y) })
      for (let step = 1; step <= 8; step++) {
        await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: contact(x + step * 11, y + step * 13) })
      }
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    } finally { await session.detach() }
  } else {
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + 44, y + 52, { steps: 6 })
    await page.mouse.move(x + 88, y + 104, { steps: 6 })
    await page.mouse.up()
  }
}

/** The one new note, proven connected from "Field recording". */
async function newChild(page: Page) {
  await expect.poll(async () => (await saved(page)).length).toBe(3)
  const nodes = await saved(page)
  const child = nodes.find(n => n.id !== 'root' && n.id !== 'other')!
  await expect.poll(async () => (await saved(page)).find(n => n.id === 'root')!.children).toEqual([child.id])
  await expect(page.locator('#board path[connectortype="default"]')).toHaveCount(1)
  return child.id
}

const viewports = [
  { name: 'desktop', touch: false, use: { viewport: { width: 1200, height: 800 } }, board: { width: 900, height: 560 } },
  { name: '390x844 touch', touch: true, use: { viewport: { width: 390, height: 844 }, hasTouch: true }, board: { width: 390, height: 560 } },
] as const

for (const device of viewports) {
  test.describe(`a new connected note is ready to name (${device.name})`, () => {
    test.use(device.use)

    for (const gesture of ['click', 'drag', 'keyboard'] as const) {
      const touchDrag = device.touch && gesture === 'drag'

      test(`${gesture}: the editor is open and focused at once; typing then Enter names the note`, async ({ page, browserName }) => {
        test.skip(touchDrag && browserName !== 'chromium', 'A native touch drag is driven through Chromium input.')
        await openBoard(page, device.board)
        await createConnectedNote(page, gesture, device.touch)

        // Nothing between creating and typing: no key to find, no second click.
        await expect(editor(page)).toBeFocused()
        await expect(editor(page)).toHaveCount(1)
        const child = await newChild(page)
        expect(await selectedIds(page)).toEqual([child])
        expect(await page.evaluate(() => {
          const selection = window.getSelection()!
          return document.activeElement!.contains(selection.anchorNode) && selection.isCollapsed
        })).toBe(true)
        // Until it is named the note is blank, on screen and in the saved document.
        await expect(note(page, child)).toHaveAttribute('aria-label', 'Unnamed node')
        expect((await saved(page)).find(n => n.id === child)!.text).toBe('')
        // The editor sits inside the canvas, not somewhere off screen.
        const box = (await editor(page).boundingBox())!
        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.y).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width).toBeLessThanOrEqual(device.board.width + 1)
        expect(box.y + box.height).toBeLessThanOrEqual(device.board.height + 1)

        await page.keyboard.type('Transcript')
        await page.keyboard.press('Enter')

        await expect(editor(page)).toHaveCount(0)
        await expect(note(page, child)).toHaveAttribute('aria-label', 'Transcript')
        await expect(note(page, child).locator('text').first()).toHaveText('Transcript')
        await expect(note(page, child).locator('text').first()).toBeVisible()
        expect(await saved(page)).toEqual([
          { id: 'root', text: 'Field recording', children: [child] },
          { id: 'other', text: 'Rain on copper', children: [] },
          { id: child, text: 'Transcript', children: [] },
        ])
        await expect(page.locator('#board path[connectortype="default"]')).toHaveCount(1)
        // The host hears about the note, its connection, and then one text change.
        expect(await sentTypes(page)).toEqual(['onNodeAdded', 'addRelationship', 'onNodeTextChanged'])
        expect(await selectedIds(page)).toEqual([child])
        expect(await page.evaluate(() => (window as any).editorsOpened)).toBe(1)
      })

      test(`${gesture}: Escape straight after creating leaves a blank, connected note`, async ({ page, browserName }) => {
        test.skip(touchDrag && browserName !== 'chromium', 'A native touch drag is driven through Chromium input.')
        await openBoard(page, device.board)
        await createConnectedNote(page, gesture, device.touch)
        await expect(editor(page)).toBeFocused()
        const child = await newChild(page)

        await page.keyboard.press('Escape')

        await expect(editor(page)).toHaveCount(0)
        await expect(note(page, child)).toHaveAttribute('aria-label', 'Unnamed node')
        await expect(note(page, child).locator('text').first()).toHaveText('')
        expect(await saved(page)).toEqual([
          { id: 'root', text: 'Field recording', children: [child] },
          { id: 'other', text: 'Rain on copper', children: [] },
          { id: child, text: '', children: [] },
        ])
        await expect(page.locator('#board path[connectortype="default"]')).toHaveCount(1)
        // Escape only closed the editor: the note stays selected, and no text change went out.
        expect(await selectedIds(page)).toEqual([child])
        expect(await sentTypes(page)).toEqual(['onNodeAdded', 'addRelationship'])
      })
    }

    test('a double activation of an existing note still opens its editor, and a press inside keeps it', async ({ page, browserName }) => {
      test.skip(device.touch && browserName !== 'chromium', 'A double tap is driven through native Chromium touch input.')
      await openBoard(page, device.board)
      const box = (await note(page, 'other').boundingBox())!
      const x = box.x + box.width / 2, y = box.y + box.height / 2
      if (device.touch) {
        await page.touchscreen.tap(x, y)
        await page.touchscreen.tap(x, y)
      } else {
        await page.mouse.dblclick(x, y)
      }
      await expect(editor(page)).toBeFocused()
      await page.waitForTimeout(200) // any trailing synthesized mouse events have landed by now
      await expect(editor(page)).toBeFocused()
      if (device.touch) await page.touchscreen.tap(x + 4, y)
      else await page.mouse.click(x + 4, y)
      await page.waitForTimeout(200)
      await expect(editor(page)).toBeFocused()
      expect(await page.evaluate(() => (window as any).editorsOpened)).toBe(1)
      await editor(page).fill('Rain on slate')
      await page.keyboard.press('Enter')
      await expect(note(page, 'other')).toHaveAttribute('aria-label', 'Rain on slate')
    })

    test('typing with one note selected appends to its text; it never replaces it', async ({ page }) => {
      await openBoard(page, device.board)
      await selectByPointer(page, 'root', device.touch)
      await expect(editor(page)).toHaveCount(0)

      await page.keyboard.press('x')

      await expect(editor(page)).toBeFocused()
      await expect(editor(page)).toHaveText('Field recordingx')
      // The caret is after the existing text, so the next keys carry on from there.
      await page.keyboard.type(' 2')
      await expect(editor(page)).toHaveText('Field recordingx 2')
      await page.keyboard.press('Enter')
      await expect(note(page, 'root')).toHaveAttribute('aria-label', 'Field recordingx 2')
      expect((await saved(page)).find(n => n.id === 'root')!.text).toBe('Field recordingx 2')
      expect(await sentTypes(page)).toEqual(['onNodeTextChanged'])
    })
  })
}

test.describe('typing on a selected note', () => {
  test.use({ viewport: { width: 1200, height: 800 } })

  test('typing immediately after the click, with no wait at all, names the note', async ({ page }) => {
    await openBoard(page)
    await selectByPointer(page, 'root', false)
    const { x, y } = await plug(page, 'bottom')
    await page.mouse.click(x, y)
    await page.keyboard.type('Transcript')
    await page.keyboard.press('Enter')
    const child = await newChild(page)
    await expect(note(page, child)).toHaveAttribute('aria-label', 'Transcript')
    expect((await saved(page)).find(n => n.id === child)!.text).toBe('Transcript')
  })

  test('clicking away with nothing typed leaves the new note blank', async ({ page }) => {
    await openBoard(page)
    await createConnectedNote(page, 'click', false)
    await expect(editor(page)).toBeFocused()
    const child = await newChild(page)
    await page.mouse.click(700, 80) // open canvas
    await expect(editor(page)).toHaveCount(0)
    await expect(note(page, child)).toHaveAttribute('aria-label', 'Unnamed node')
    await expect(note(page, child).locator('text').first()).toHaveText('')
    expect((await saved(page)).find(n => n.id === child)).toEqual({ id: child, text: '', children: [] })
    expect((await saved(page)).find(n => n.id === 'root')!.children).toEqual([child])
    expect(await sentTypes(page)).toEqual(['onNodeAdded', 'addRelationship'])
  })

  test('clicking inside the open editor keeps it open, and its right-click menu is the text one', async ({ page }) => {
    await openBoard(page)
    // With no editor open, a right-click on a note is the note's own menu.
    const other = (await note(page, 'other').boundingBox())!
    await page.mouse.click(other.x + other.width / 2, other.y + other.height / 2, { button: 'right' })
    await expect(page.locator('.sb-context-menu')).toHaveCount(1)
    await page.keyboard.press('Escape')
    await expect(page.locator('.sb-context-menu')).toHaveCount(0)

    await createConnectedNote(page, 'click', false)
    await expect(editor(page)).toBeFocused()
    const child = await newChild(page)
    const box = (await editor(page).boundingBox())!
    // The natural thing to do with a note you were just handed: click it, then type.
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.click(box.x + box.width / 2 + 6, box.y + box.height / 2)
    await expect(editor(page)).toBeFocused()
    expect(await page.evaluate(() => (window as any).editorsOpened)).toBe(1)
    await page.keyboard.type('Transcript')
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { button: 'right' })
    await expect(page.locator('.sb-context-menu')).toHaveCount(0)
    await expect(editor(page)).toHaveText('Transcript')
    await page.keyboard.press('Enter')
    await expect(note(page, child)).toHaveAttribute('aria-label', 'Transcript')
  })

  test('a capital letter, a digit and a space each start an edit from the page', async ({ page }) => {
    await openBoard(page)
    await selectByPointer(page, 'other', false)
    for (const [key, typed] of [['Shift+T', 'T'], ['7', '7'], ['Space', ' ']] as const) {
      await page.keyboard.press(key)
      await expect(editor(page)).toBeFocused()
      expect(await editor(page).evaluate(element => element.textContent)).toBe('Rain on copper' + typed)
      await page.keyboard.press('Escape')
      await expect(editor(page)).toHaveCount(0)
    }
    expect((await saved(page)).find(n => n.id === 'other')!.text).toBe('Rain on copper')
  })

  test('Space on a focused note still selects it, and Enter still opens its editor with the text selected', async ({ page }) => {
    await openBoard(page)
    const source = page.getByRole('button', { name: 'Field recording', exact: true })
    await source.focus()
    await page.keyboard.press('Space')
    expect(await selectedIds(page)).toEqual(['root'])
    await page.keyboard.press('Space') // already selected: still "select", never "type a space"
    await expect(editor(page)).toHaveCount(0)
    expect(await selectedIds(page)).toEqual(['root'])
    // Type-to-edit from the focused, selected note: focus comes back to it afterwards.
    await page.keyboard.press('s')
    await expect(editor(page)).toHaveText('Field recordings')
    await page.keyboard.press('Enter')
    await expect(page.getByRole('button', { name: 'Field recordings', exact: true })).toBeFocused()
    // Enter is the rename gesture: everything selected, so typing replaces.
    await page.keyboard.press('Enter')
    await expect(editor(page)).toBeFocused()
    await page.keyboard.type('Tape')
    await page.keyboard.press('Enter')
    await expect(page.getByRole('button', { name: 'Tape', exact: true })).toBeFocused()
  })

  for (const mode of ['read', 'comment', 'locked'] as const) {
    test(`a ${mode === 'locked' ? 'locked note' : mode === 'read' ? 'read-only viewer' : 'comment-only viewer'} cannot type into a note`, async ({ page }) => {
      // Open editable first so the same keys are known to work on this very board.
      await openBoard(page, { permission: mode === 'locked' ? 'locked' : 'edit' })
      await page.evaluate(() => (window as any).board.selectNodes([(window as any).board.getNode('other')]))
      await page.keyboard.press('x')
      await expect(editor(page)).toHaveText('Rain on copperx')
      await page.keyboard.press('Escape')
      await expect(editor(page)).toHaveCount(0)

      if (mode !== 'locked') await page.evaluate(mode => { (window as any).permission = mode }, mode)
      await page.evaluate(() => { (window as any).editorsOpened = 0; (window as any).board.selectNodes([(window as any).board.getNode('root')]) })
      await page.keyboard.type('xyz')
      await page.waitForTimeout(150)
      await expect(editor(page)).toHaveCount(0)
      expect(await page.evaluate(() => (window as any).editorsOpened)).toBe(0)
      expect((await saved(page)).find(n => n.id === 'root')!.text).toBe('Field recording')
      expect(await sentTypes(page)).toEqual([])
      // Enter and F2 follow the same permission as typing and double-click.
      for (const key of ['Enter', 'F2']) {
        await page.keyboard.press(key)
        await page.waitForTimeout(120)
        await expect(editor(page)).toHaveCount(0)
      }
      expect(await page.evaluate(() => (window as any).editorsOpened)).toBe(0)
      expect((await saved(page)).find(n => n.id === 'root')!.text).toBe('Field recording')
      expect(await sentTypes(page)).toEqual([])
    })
  }

  test('two selected notes ignore typing; one selected note takes it', async ({ page }) => {
    await openBoard(page)
    await page.evaluate(() => {
      const board = (window as any).board
      board.selectNodes([board.getNode('root'), board.getNode('other')])
    })
    expect((await selectedIds(page)).sort()).toEqual(['other', 'root'])
    await page.keyboard.type('xyz')
    await page.waitForTimeout(150)
    await expect(editor(page)).toHaveCount(0)
    expect(await page.evaluate(() => (window as any).editorsOpened)).toBe(0)
    expect((await saved(page)).map(n => n.text)).toEqual(['Field recording', 'Rain on copper'])

    await page.evaluate(() => (window as any).board.selectNodes([(window as any).board.getNode('other')]))
    await page.keyboard.press('x')
    await expect(editor(page)).toHaveText('Rain on copperx')
  })

  test('a slate that is not enabled never opens an editor', async ({ page }) => {
    await openBoard(page, { enabled: false })
    await page.evaluate(() => (window as any).board.selectNodes([(window as any).board.getNode('root')]))
    await page.keyboard.type('xyz')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(150)
    expect(await page.evaluate(() => (window as any).editorsOpened)).toBe(0)
    expect((await saved(page)).find(n => n.id === 'root')!.text).toBe('Field recording')
  })

  test('typing in a control outside the canvas stays in that control', async ({ page }) => {
    await openBoard(page)
    await page.evaluate(() => (window as any).board.selectNodes([(window as any).board.getNode('root')]))
    const field = page.getByRole('textbox', { name: 'After canvas' })
    await field.focus()
    await page.keyboard.type('hello')
    await expect(field).toHaveValue('hello')
    expect(await page.evaluate(() => (window as any).editorsOpened)).toBe(0)
    // A button outside the canvas keeps its keys too.
    await page.evaluate(() => {
      const button = document.createElement('button')
      button.textContent = 'Host button'
      button.style.cssText = 'position:fixed;left:8px;top:640px'
      document.body.append(button)
      button.focus()
    })
    await page.keyboard.press('x')
    expect(await page.evaluate(() => (window as any).editorsOpened)).toBe(0)
    expect((await saved(page)).find(n => n.id === 'root')!.text).toBe('Field recording')
  })

  test('Delete, arrow keys, the shortcuts reference and undo behave as before on a selected note', async ({ page }) => {
    await openBoard(page)
    const mod = 'ControlOrMeta'
    const position = () => page.evaluate(() => {
      const n = (window as any).board.getNode('root')
      return n ? [n.options.x, n.options.y] : null
    })
    await page.evaluate(() => (window as any).board.undoRedo.forceSnapshot())
    await selectByPointer(page, 'root', false)

    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('Shift+ArrowDown')
    expect(await position()).toEqual([145, 250])
    await expect.poll(() => sentTypes(page)).toEqual(['onNodesMove'])
    await page.waitForTimeout(700) // the debounced undo checkpoint for the nudge

    // "?" is still the shortcuts reference, not the first character of an edit.
    const logged: string[] = []
    page.on('console', message => { if (message.text().includes('SlateboxJS Keyboard Shortcuts')) logged.push(message.text()) })
    await page.keyboard.press('Shift+?')
    await expect.poll(() => logged.length).toBe(1)
    expect(logged[0]).not.toMatch(/F2/)

    // Ctrl/Cmd chords are shortcuts, never text.
    await page.keyboard.press(`${mod}+c`)
    await page.keyboard.press(`${mod}+z`)
    await expect.poll(position).toEqual([140, 230])
    await page.keyboard.press(`${mod}+y`)
    await expect.poll(position).toEqual([145, 250])
    expect(await page.evaluate(() => (window as any).editorsOpened)).toBe(0)

    await page.evaluate(() => (window as any).board.selectNodes([(window as any).board.getNode('root')]))
    await page.keyboard.press('Delete')
    await expect(note(page, 'root')).toHaveCount(0)
    expect((await saved(page)).map(n => n.id)).toEqual(['other'])
    await page.keyboard.press(`${mod}+z`)
    await expect(note(page, 'root')).toHaveCount(1)
    expect(await page.evaluate(() => (window as any).editorsOpened)).toBe(0)
  })

  test('notes that arrive without a connector gesture never open an editor', async ({ page }) => {
    await openBoard(page)
    const mod = 'ControlOrMeta'
    const count = () => page.evaluate(() => (window as any).board.getAllNodes().length)

    // The API, with and without selecting the result.
    await page.evaluate(async () => {
      const board = (window as any).board
      const blank = board.addNode({ id: 'api', x: 420, y: 60, width: 110, height: 64, text: '' })
      await blank.ready
      board.selectNodes([blank])
      const viaManager = board.nodes.add({ id: 'manager', x: 560, y: 60, width: 110, height: 64, text: '' })
      await viaManager.ready
    })
    // Copy, paste and duplicate from the keyboard.
    await page.keyboard.press(`${mod}+c`)
    await page.keyboard.press(`${mod}+v`)
    await expect.poll(count).toBe(5)
    await page.keyboard.press(`${mod}+d`)
    await expect.poll(count).toBe(6)
    await page.waitForTimeout(300)
    // A package from another person.
    await page.evaluate(() => (window as any).board.collab.exe({
      type: 'onNodeAdded',
      data: { id: 'remote', nodeOptions: { id: 'remote', xPos: 420, yPos: 300, width: 110, height: 64, text: '' } },
    }))
    await expect.poll(count).toBe(7)
    // Undo and redo of all that.
    await page.keyboard.press(`${mod}+z`)
    await page.waitForTimeout(300)
    await page.keyboard.press(`${mod}+y`)
    await page.waitForTimeout(300)
    // A loaded document.
    await page.evaluate(async () => {
      const board = (window as any).board
      await board.loadJSON(board.exportJSON())
    })
    await page.waitForTimeout(400)
    await expect(editor(page)).toHaveCount(0)
    expect(await page.evaluate(() => (window as any).editorsOpened)).toBe(0)

    // The same board still opens one for a real connector gesture.
    await createConnectedNote(page, 'click', false)
    await expect(editor(page)).toBeFocused()
  })
})

test.describe('accessibility of naming a new note', () => {
  test.use({ viewport: { width: 1200, height: 800 } })

  for (const gesture of ['click', 'drag', 'keyboard'] as const) {
    test(`${gesture}: the new note is announced once`, async ({ page }) => {
      await openBoard(page)
      // Selecting the source is announced before the gesture. Let that finish, so that
      // everything spoken from here on is about the new note.
      await createConnectedNote(page, gesture, false, async () => {
        await page.waitForTimeout(300)
        await page.evaluate(() => { (window as any).spoken.length = 0 })
      })
      await expect(editor(page)).toBeFocused()
      await page.waitForTimeout(500)
      const spoken = await page.evaluate(() => (window as any).spoken)
      expect(spoken).toEqual(['Connected note added. Type its name, then press Enter.'])
      expect(spoken.join(' ')).not.toMatch(/F2/)
    })
  }

  test('keyboard: focus is in the editor, then back on the note after Enter and after Escape', async ({ page }) => {
    await openBoard(page)
    await createConnectedNote(page, 'keyboard', false)
    await expect(editor(page)).toBeFocused()
    await page.keyboard.type('Transcript')
    await page.keyboard.press('Enter')
    const named = page.getByRole('button', { name: 'Transcript', exact: true })
    await expect(named).toBeFocused()

    // From there the keyboard carries straight on: Tab reaches this note's own connectors.
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Add connected note above', exact: true })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(editor(page)).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Unnamed node', exact: true })).toBeFocused()
    expect((await saved(page)).map(n => n.text)).toEqual(['Field recording', 'Rain on copper', 'Transcript', ''])
  })

  test('a key held down to create the note neither commits nor types into its editor', async ({ page }) => {
    for (const [index, key] of ['Enter', 'Space'].entries()) {
      await openBoard(page)
      await page.getByRole('button', { name: 'Field recording', exact: true }).focus()
      await page.keyboard.press('Space')
      for (let tab = 0; tab <= index; tab++) await page.keyboard.press('Tab')
      await page.keyboard.down(key)
      await expect(editor(page)).toBeFocused()
      await page.keyboard.down(key) // auto-repeat while still held
      await page.keyboard.down(key)
      await page.keyboard.up(key)
      await expect(editor(page)).toBeFocused()
      expect(await editor(page).evaluate(element => element.textContent)).toBe('')
      expect(await page.evaluate(() => (window as any).board.getAllNodes().length)).toBe(3)
      await page.keyboard.type('Transcript')
      await page.keyboard.press('Enter')
      await expect(page.getByRole('button', { name: 'Transcript', exact: true })).toBeFocused()
    }
  })
})

test.describe('a new note that lands outside the view', () => {
  test.use({ viewport: { width: 1200, height: 800 } })

  test('the view moves only as far as the new note needs, so the note it came from stays in sight', async ({ page }) => {
    // A canvas as small as an embedded example: 900 x 252, with "Field recording" near its lower edge.
    await openBoard(page, { height: 252 })
    await page.evaluate(() => (window as any).board.pan({ x: 0, y: 80 }))
    const board = (await page.locator('#board').boundingBox())!
    const inside = async (id: string) => {
      const box = (await note(page, id).boundingBox())!
      return box.x >= board.x && box.y >= board.y &&
        box.x + box.width <= board.x + board.width && box.y + box.height <= board.y + board.height
    }
    await expect.poll(() => inside('root')).toBe(true)

    await createConnectedNote(page, 'click', false)
    const child = await newChild(page)
    await expect(editor(page)).toBeFocused()
    await expect.poll(() => inside(child), { message: 'the new note is fully in view' }).toBe(true)
    await expect.poll(() => inside('root'), { message: 'the note it was created from is still fully in view' }).toBe(true)

    await page.keyboard.type('Transcript')
    await page.keyboard.press('Enter')
    await expect(page.getByRole('button', { name: 'Transcript', exact: true })).toBeVisible()
    expect(await inside(child)).toBe(true)
    expect(await inside('root')).toBe(true)
  })

  test('a new note already in view leaves the view where it was', async ({ page }) => {
    await openBoard(page)
    const before = await page.evaluate(() => { const v = (window as any).board.canvas.viewbox(); return [v.x, v.y, v.width, v.height] })
    await createConnectedNote(page, 'click', false)
    await newChild(page)
    await expect(editor(page)).toBeFocused()
    expect(await page.evaluate(() => { const v = (window as any).board.canvas.viewbox(); return [v.x, v.y, v.width, v.height] })).toEqual(before)
  })
})
