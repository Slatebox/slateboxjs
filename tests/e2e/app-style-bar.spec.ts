import { expect, test, type Page, type Locator } from '@playwright/test'
import { openGuestCanvas } from './app-host.shared'
import { removeTestGuest, userId, dismissWelcome } from './workshop-guests.shared'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { cardIdNamed, card, workshopReady, slateKey, storedWorkshop } from './app-native-workshop.shared'

/**
 * The style bar over a selection, in the running Meteor app. It replaces the docked note and
 * line panes and the group toolbar. Every change it makes is an ordinary package through the
 * canvas page's updateNode / updateLine: saved, undoable and shared.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')
test.use({ viewport: { width: 1440, height: 900 } })

const engine = (page: Page) => page.evaluate(() => Boolean((window as any).slate?.v2))
const opt = (page: Page, text: string, name: string) => page.evaluate(([text, name]) =>
  (window as any).slate.v2.getAllNodes().find((n: any) => n.options.text === text)?.options[name], [text, name])
const opts = (page: Page, name: string) => page.evaluate((name) =>
  Object.fromEntries((window as any).slate.v2.getAllNodes().map((n: any) => [n.options.text, n.options[name]])), name)
const noteNamed = (page: Page, text: string) => page.locator('#slateCanvas [data-node-id]').filter({ hasText: text }).first()
const bar = (page: Page, name: string | RegExp = 'Note') => page.getByRole('toolbar', { name, exact: typeof name === 'string' })
const group = (page: Page, name: string) => page.getByRole('group', { name, exact: true })

async function openSlate(page: Page) {
  await openGuestCanvas(page, origin.origin)
  const cookies = page.locator('[data-cookie-notice] button')
  if (await cookies.isVisible()) await cookies.click()
  await expect.poll(() => userId(page)).toBeTruthy()
  await expect.poll(() => engine(page)).toBe(true)
  await expect(noteNamed(page, 'Welcome!')).toBeVisible()
  // Ask Slatebox opens beside a new slate; close it for room (tests that need it open it).
  const close = page.getByRole('complementary', { name: 'Conversation with Slatebox' }).getByRole('button', { name: /close/i })
  if (await close.isVisible().catch(() => false)) await close.click()
  return (await userId(page))!
}

async function addNote(page: Page, text: string, x: number, y: number) {
  await page.mouse.dblclick(x, y)
  await page.keyboard.type(text)
  await page.keyboard.press('Enter')
  await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
  await expect(noteNamed(page, text)).toBeVisible()
}

async function select(page: Page, text: string) {
  const box = (await noteNamed(page, text).boundingBox())!
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  await expect.poll(() => page.evaluate(() => (window as any).slate.v2.getSelectedNodes().map((n: any) => n.options.text))).toEqual([text])
}

async function selectAll(page: Page, texts: string[]) {
  await page.evaluate((texts) => {
    const v2 = (window as any).slate.v2
    v2.selectNodes(v2.getAllNodes().filter((n: any) => texts.includes(n.options.text)))
  }, texts)
  await expect(bar(page, `${texts.length} notes`)).toBeVisible()
}

/** Save is debounced; wait until the stored slate has the value, then reload and read it again. */
async function reloadAndRead(page: Page, text: string, name: string) {
  await page.waitForTimeout(1200)
  await page.reload()
  await dismissWelcome(page)
  await expect.poll(() => engine(page)).toBe(true)
  await expect(noteNamed(page, text)).toBeVisible()
  return opt(page, text, name)
}

const tooltipFine = (label: string) => !/[⌘⌥⇧⌃]|\b(ctrl|cmd|command|alt|option|shift)\s*\+/i.test(label)

test('one note: the bar sits above it, clear of the top connect dot, with no engine pill; every icon has its name; no shortcuts', async ({ page }) => {
  let id: string | null = null
  try {
    id = await openSlate(page)
    await select(page, 'Welcome!')
    const toolbar = bar(page)
    await expect(toolbar).toBeVisible()
    await expect(page.locator('#slateCanvas .node-toolbar, #slateCanvas .node-cog')).toHaveCount(0)
    // Above the note and clear of the connect dot above it.
    const barBox = (await toolbar.boundingBox())!
    const dot = (await page.locator('#slateCanvas .connection-handle-top').first().boundingBox())!
    const noteBox = (await noteNamed(page, 'Welcome!').boundingBox())!
    expect(barBox.y + barBox.height).toBeLessThanOrEqual(dot.y - 8)
    expect(barBox.y + barBox.height).toBeLessThan(noteBox.y)
    // Every button has a name; icon-only ones show it on hover, the same words; none names a shortcut.
    const names = await toolbar.getByRole('button').evaluateAll(els => els.map(el => el.getAttribute('aria-label') || el.textContent || ''))
    expect(names.length).toBeGreaterThan(6)
    for (const n of names) { expect(n.trim()).not.toBe(''); expect(tooltipFine(n)).toBe(true) }
    await toolbar.getByRole('button', { name: 'Border', exact: true }).hover()
    await expect(page.getByRole('tooltip')).toHaveText('Border')
    // The old pane and group toolbar are gone.
    await expect(page.locator('[aria-label="Node Properties"], [aria-label="groupToolbar"]')).toHaveCount(0)
    // Keyboard: Tab from the canvas reaches the bar; the arrows move along it; focus is visible.
    await toolbar.getByRole('button', { name: 'Fill colour' }).focus()
    await page.keyboard.press('ArrowRight')
    await expect(toolbar.getByRole('button', { name: 'Border', exact: true })).toBeFocused()
  } finally { await removeTestGuest(page, id) }
})

test('fill, text Auto, size and the custom picker: saved, undone and kept after a reload; the text is never touched', async ({ page }) => {
  let id: string | null = null
  try {
    id = await openSlate(page)
    await select(page, 'Welcome!')
    const before = await opt(page, 'Welcome!', 'backgroundColor')
    await bar(page).getByRole('button', { name: 'Fill colour' }).click()
    const colours = group(page, 'Colour')
    await expect(colours.getByRole('tab', { name: 'Fill' })).toHaveAttribute('aria-selected', 'true')
    await colours.getByRole('radio', { name: 'Forest' }).click()
    await expect.poll(() => opt(page, 'Welcome!', 'backgroundColor')).toBe('#24493a')
    // Text on Auto turns white on the dark fill.
    await expect.poll(() => opt(page, 'Welcome!', 'fontColor')).toBe('#ffffff')
    await colours.getByRole('tab', { name: 'Text' }).click()
    await expect(colours.getByRole('radio', { name: /Auto/ })).toHaveAttribute('aria-checked', 'true')
    // Custom colour beside the panel.
    await colours.getByRole('tab', { name: 'Fill' }).click()
    await colours.getByRole('button', { name: 'Custom colour…' }).click()
    const custom = group(page, 'Custom colour')
    await expect(custom).toBeVisible()
    await custom.getByRole('textbox', { name: 'Hex colour' }).fill('#123456')
    await custom.getByRole('button', { name: 'Use colour' }).click()
    await expect.poll(() => opt(page, 'Welcome!', 'backgroundColor')).toBe('#123456')
    await page.keyboard.press('Escape')
    // Size: Large; the text and the box are not changed by it.
    await bar(page).getByRole('radio', { name: 'Large text', exact: true }).click()
    await expect.poll(() => opt(page, 'Welcome!', 'fontSize')).toBe(28)
    expect(await opt(page, 'Welcome!', 'text')).toBe('Welcome!')
    await expect(bar(page).getByRole('radio', { name: 'Large text', exact: true })).toHaveAttribute('aria-checked', 'true')
    // Undo takes back the size.
    // Empty canvas, clear of the Undo and Redo controls in its bottom-left corner.
    await page.mouse.click(40, 700)
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(() => opt(page, 'Welcome!', 'fontSize')).not.toBe(28)
    await page.keyboard.press('ControlOrMeta+Shift+z')
    await expect.poll(() => opt(page, 'Welcome!', 'fontSize')).toBe(28)
    // Saved.
    expect(await reloadAndRead(page, 'Welcome!', 'backgroundColor')).toBe('#123456')
    expect(await opt(page, 'Welcome!', 'fontSize')).toBe(28)
    expect(before).not.toBe('#123456')
  } finally { await removeTestGuest(page, id) }
})

test('More: values in the rows, the font grid and bold, Locked, a bad link said in place, effects None really clears', async ({ page }) => {
  let id: string | null = null
  try {
    id = await openSlate(page)
    await select(page, 'Welcome!')
    await bar(page).getByRole('button', { name: 'More', exact: true }).click()
    const more = group(page, 'More')
    await expect(more.getByRole('button', { name: /^Font: / })).toBeVisible()
    await expect(more.getByRole('button', { name: 'Picture: None' })).toBeVisible()
    await expect(more.getByRole('switch', { name: 'Locked' })).toHaveAttribute('aria-checked', 'false')
    await expect(more.getByRole('button', { name: /Paste style/ })).toHaveCount(0)
    // Font grid and bold.
    await more.getByRole('button', { name: /^Font: / }).click()
    await page.getByRole('radio', { name: 'Book' }).click()
    await expect.poll(() => opt(page, 'Welcome!', 'fontFamily')).toBe('Lora')
    await page.getByRole('switch', { name: 'Bold' }).click()
    await expect.poll(() => opt(page, 'Welcome!', 'fontWeight')).toBe('bold')
    await page.getByRole('button', { name: 'Back to More' }).click()
    await expect(more.getByRole('button', { name: 'Font: Book, bold' })).toBeVisible()
    // Effects: Shadow, then None clears it (an empty id, not 'none').
    await more.getByRole('button', { name: /^Effects and animation/ }).click()
    await page.getByRole('radiogroup', { name: 'Note effect' }).getByRole('radio', { name: 'Shadow' }).click()
    await expect.poll(async () => (await opt(page, 'Welcome!', 'filters'))?.vect).toBe('dropShadow')
    await page.getByRole('radiogroup', { name: 'Note effect' }).getByRole('radio', { name: 'None' }).click()
    await expect.poll(async () => (await opt(page, 'Welcome!', 'filters'))?.vect || '').toBe('')
    await page.getByRole('radiogroup', { name: 'Text effect' }).getByRole('radio', { name: 'None' }).click()
    await expect.poll(async () => (await opt(page, 'Welcome!', 'filters'))?.text || '').toBe('')
    expect(await page.evaluate(() => document.querySelectorAll('#slateCanvas [filter*="none"]').length)).toBe(0)
    await page.getByRole('button', { name: 'Back to More' }).click()
    // A bad link is said in place.
    await more.getByRole('button', { name: 'Link: Add' }).click()
    await page.getByRole('textbox', { name: 'Web address' }).fill('ftp://nope')
    await page.getByRole('button', { name: 'Save link' }).click()
    await expect(page.getByRole('alert')).toContainText('http')
    await page.getByRole('textbox', { name: 'Web address' }).fill('https://example.com/x')
    await page.getByRole('button', { name: 'Save link' }).click()
    await expect.poll(async () => (await opt(page, 'Welcome!', 'link'))?.data).toBe('https://example.com/x')
    // Locked: the bar keeps only what does not edit.
    await bar(page).getByRole('button', { name: 'More', exact: true }).click()
    await group(page, 'More').getByRole('switch', { name: 'Locked' }).click()
    await expect.poll(() => opt(page, 'Welcome!', 'isLocked')).toBe(true)
    await expect(bar(page).getByRole('button', { name: 'Fill colour' })).toHaveCount(0)
    await expect(bar(page).getByRole('button', { name: 'Delete' })).toHaveCount(0)
    await expect(group(page, 'More').getByRole('switch', { name: 'Locked' })).toHaveAttribute('aria-checked', 'true')
  } finally { await removeTestGuest(page, id) }
})

test('copy style goes to the selection only, is saved and undone, and needs no filters or picture on the notes', async ({ page }) => {
  let id: string | null = null
  try {
    id = await openSlate(page)
    await addNote(page, 'Alpha', 200, 260)
    await addNote(page, 'Beta', 200, 460)
    await addNote(page, 'Gamma', 200, 660)
    await select(page, 'Welcome!')
    await bar(page).getByRole('button', { name: 'Fill colour' }).click()
    await group(page, 'Colour').getByRole('radio', { name: 'Ink' }).click()
    await expect.poll(() => opt(page, 'Welcome!', 'backgroundColor')).toBe('#1f2a2a')
    await page.keyboard.press('Escape')
    await bar(page).getByRole('button', { name: 'More', exact: true }).click()
    await group(page, 'More').getByRole('button', { name: 'Copy style' }).click()
    await selectAll(page, ['Alpha', 'Beta'])
    await bar(page, '2 notes').getByRole('button', { name: 'More', exact: true }).click()
    await group(page, 'More').getByRole('button', { name: 'Paste style on 2 notes' }).click()
    await expect.poll(() => opts(page, 'backgroundColor')).toMatchObject({ Alpha: '#1f2a2a', Beta: '#1f2a2a' })
    expect((await opts(page, 'backgroundColor')).Gamma).not.toBe('#1f2a2a')
    expect(await opts(page, 'text')).toMatchObject({ Alpha: 'Alpha', Beta: 'Beta' })
    // Undo takes back the paste in one step; redo puts it back.
    // Empty canvas, clear of the Undo and Redo controls in its bottom-left corner.
    await page.mouse.click(40, 700)
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(async () => (await opts(page, 'backgroundColor')).Alpha).not.toBe('#1f2a2a')
    await page.keyboard.press('ControlOrMeta+Shift+z')
    await expect.poll(async () => (await opts(page, 'backgroundColor')).Alpha).toBe('#1f2a2a')
    expect(await reloadAndRead(page, 'Beta', 'backgroundColor')).toBe('#1f2a2a')
  } finally { await removeTestGuest(page, id) }
})

test('several notes: "3 notes", mixed shows as mixed, a size never copies one note\'s text or box; arrange and group; no shape', async ({ page }) => {
  let id: string | null = null
  try {
    id = await openSlate(page)
    await addNote(page, 'Alpha', 200, 260)
    await addNote(page, 'Beta', 420, 420)
    // New notes all start as the same 160 by 68 note (first minute): Beta is given its own wider box,
    // so a size that copied one note's box to the others would show.
    await page.evaluate(() => { const beta = (window as any).slate.v2.getAllNodes().find((n: any) => n.options.text === 'Beta'); beta.setSize(260, beta.options.height) })
    await expect.poll(() => page.evaluate(() => Math.round((window as any).slate.v2.getAllNodes().find((n: any) => n.options.text === 'Beta').options.width))).toBe(260)
    const sizes = () => page.evaluate(() => Object.fromEntries((window as any).slate.v2.getAllNodes().map((n: any) => [n.options.text, [Math.round(n.options.width), Math.round(n.options.height)]])))
    await select(page, 'Alpha')
    await bar(page).getByRole('radio', { name: 'Extra large text' }).click()
    await expect.poll(() => opt(page, 'Alpha', 'fontSize')).toBe(44)
    const before = await sizes()
    await selectAll(page, ['Welcome!', 'Alpha', 'Beta'])
    const several = bar(page, '3 notes')
    await expect(several.getByText('3 notes')).toBeVisible()
    for (const s of ['Small text', 'Medium text', 'Large text', 'Extra large text']) {
      await expect(several.getByRole('radio', { name: s, exact: true })).toHaveAttribute('aria-checked', 'false')
    }
    await expect(several.getByRole('button', { name: 'Shape' })).toHaveCount(0)
    await several.getByRole('radio', { name: 'Large text', exact: true }).click()
    await expect.poll(() => opts(page, 'fontSize')).toMatchObject({ 'Welcome!': 28, Alpha: 28, Beta: 28 })
    expect(await opts(page, 'text')).toMatchObject({ 'Welcome!': 'Welcome!', Alpha: 'Alpha', Beta: 'Beta' })
    const after = await sizes()
    // No note took another's box.
    expect(new Set(Object.values(after).map(v => v.join('x'))).size).toBeGreaterThan(1)
    expect(after.Beta[0]).toBe(before.Beta[0])
    // Arrange and group, from the bar.
    await several.getByRole('button', { name: 'Arrange' }).click()
    await group(page, 'Arrange').getByRole('button', { name: 'Line up left edges' }).click()
    await expect.poll(async () => new Set(await page.evaluate(() => (window as any).slate.v2.getSelectedNodes().map((n: any) => Math.round(n.options.x)))).size).toBeLessThanOrEqual(2)
    await page.keyboard.press('Escape')
    await several.getByRole('button', { name: 'Group', exact: true }).click()
    await expect(several.getByRole('button', { name: 'Ungroup', exact: true })).toBeVisible()
    await expect(page.getByLabel('arrange-align-left', { exact: true })).toHaveCount(0)
  } finally { await removeTestGuest(page, id) }
})

test('a line: its own bar with its own values, no dashed button on the bar, Pattern in More; Delete removes it', async ({ page }) => {
  let id: string | null = null
  try {
    id = await openSlate(page)
    await addNote(page, 'Beta', 900, 520)
    await page.evaluate(() => {
      const v2 = (window as any).slate.v2
      const [a, b] = ['Welcome!', 'Beta'].map((t) => v2.getAllNodes().find((n: any) => n.options.text === t))
      a.relationships.addAssociation(b)
    })
    // Give the line a colour of its own, unlike its note's default.
    await page.evaluate(() => {
      const s = (window as any).slate
      const a = s.v2.getAllNodes().find((n: any) => n.options.text === 'Welcome!')
      const assoc = a.relationships.getAssociations()[0]
      const pkg = { type: 'onLinePropertiesChanged', data: { id: a.id, prop: 'lineColor', val: '#cc0000', associationId: assoc.id } }
      s.collab.invoke([pkg]); s.collab.send([pkg])
    })
    const pt = await page.evaluate(() => {
      const p = document.querySelector('#slateCanvas path[connectortype="default"]') as SVGGeometryElement
      const m = p.getPointAtLength(p.getTotalLength() / 2).matrixTransform(p.getScreenCTM()!)
      return { x: m.x, y: m.y }
    })
    await page.mouse.click(pt.x, pt.y)
    const line = bar(page, 'Line')
    await expect(line).toBeVisible()
    await expect(page.locator('#slateCanvas .line-toolbar')).toHaveCount(0)
    await line.getByRole('button', { name: 'Line colour' }).click()
    const ticked = page.getByRole('radiogroup', { name: 'Line colour' }).locator('[aria-checked="true"]')
    await expect(ticked).toHaveCount(1)
    await expect(ticked).toHaveAttribute('aria-label', 'Current colour, Red')
    await page.keyboard.press('Escape')
    expect(await line.getByRole('button', { name: /dash/i }).count()).toBe(0)
    await line.getByRole('radio', { name: 'Thick' }).click()
    await expect.poll(() => page.evaluate(() => (window as any).slate.v2.getAllNodes().find((n: any) => n.options.text === 'Welcome!').relationships.getAssociations()[0].lineWidth)).toBe(8)
    await line.getByRole('button', { name: 'More', exact: true }).click()
    await page.getByRole('radiogroup', { name: 'Pattern' }).getByRole('radio', { name: 'Dashed' }).click()
    await expect.poll(() => page.evaluate(() => document.querySelector('#slateCanvas path[connectortype="default"]')!.getAttribute('stroke-dasharray'))).toBeTruthy()
    await page.keyboard.press('Escape')
    await line.getByRole('button', { name: 'Delete line' }).click()
    await expect.poll(() => page.evaluate(() => (window as any).slate.v2.getAllNodes().find((n: any) => n.options.text === 'Welcome!').relationships.getAssociations().length)).toBe(0)
  } finally { await removeTestGuest(page, id) }
})

test('a hidden tab takes its control with it: no gap, no empty panel', async ({ page }) => {
  let id: string | null = null
  try {
    id = await openSlate(page)
    await page.evaluate(() => {
      // A template hides tabs with these flags (chat and exec set them as hiddenControls); set here directly.
      const n = (window as any).slate.v2.getAllNodes().find((x: any) => x.options.text === 'Welcome!')
      n.options.showColorTab = false
      n.options.showShapeTab = false
    })
    await select(page, 'Welcome!')
    await expect(bar(page)).toBeVisible()
    await expect(bar(page).getByRole('button', { name: 'Fill colour' })).toHaveCount(0)
    await expect(bar(page).getByRole('button', { name: 'Border', exact: true })).toHaveCount(0)
    await expect(bar(page).getByRole('button', { name: 'Shape' })).toHaveCount(0)
    await expect(bar(page).getByRole('radio', { name: 'Large text', exact: true })).toBeVisible()
    // No empty slot where they were: no two separators side by side.
    expect(await bar(page).evaluate(el => [...el.children].some((c, i, all) => c.classList.contains('sb-sep') && all[i + 1]?.classList.contains('sb-sep')))).toBe(false)
  } finally { await removeTestGuest(page, id) }
})

test('picture search is the server\'s: a guest is asked to register, and the browser never calls the search provider', async ({ page }) => {
  let id: string | null = null
  const outside: string[] = []
  page.on('request', (r) => { if (/googleapis\.com\/customsearch/.test(r.url())) outside.push(r.url()) })
  try {
    id = await openSlate(page)
    await select(page, 'Welcome!')
    await bar(page).getByRole('button', { name: 'More', exact: true }).click()
    await group(page, 'More').getByRole('button', { name: 'Picture: None' }).click()
    await page.getByRole('searchbox', { name: 'Search for a picture' }).fill('dogs')
    await page.getByRole('button', { name: 'Search', exact: true }).click()
    // Said in place (the registration dialog also opens, as for any guest-only action).
    await expect(page.locator('.sb-pop [role="alert"]')).toContainText(/register/i)
    // One picture search method, metered (switch day: the style bar's and the meter's were joined as images.search).
    const refused = await page.evaluate(() => (window as any).Meteor.callAsync('images.search', { query: 'dogs' }).then(() => 'ok', (e: any) => e.error))
    expect(refused).toBe('register')
    expect(outside).toEqual([])
  } finally { await removeTestGuest(page, id) }
})

// Two lanes with rules: Gamma may only be in Now.
const ruled: Workshop = {
  version: 1, title: 'Card bar proof',
  lanes: [{ id: 'now', label: 'Now' }, { id: 'next', label: 'Next' }, { id: 'later', label: 'Later' }],
  cards: [{ id: 'alpha', label: 'Alpha', laneId: 'now' }, { id: 'gamma', label: 'Gamma', laneId: 'now', allowedLaneIds: ['now'] }],
}

test('a workshop card: Edit, Move to (only lanes it may go to), Ask; no colour or shape; the bar sits above the lane', async ({ page }) => {
  let id: string | null = null
  try {
    await page.goto(new URL('/new/workshop' + encodeWorkshopFragment(ruled), origin).href)
    await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await expect.poll(() => userId(page)).toBeTruthy()
    id = await userId(page)
    await dismissWelcome(page)
    await workshopReady(page)
    const key = slateKey(page)
    const alpha = card(page, await cardIdNamed(page, 'Alpha'))
    const box = (await alpha.boundingBox())!
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    const cardBar = bar(page, 'Card: Alpha')
    await expect(cardBar).toBeVisible()
    await expect(cardBar.getByRole('button', { name: /Fill|Border|Shape|Text colour/ })).toHaveCount(0)
    // Above the lane, so its title stays readable.
    const laneBox = (await page.locator('#slateCanvas [data-node-id^="lane-now"]').first().boundingBox())!
    const barBox = (await cardBar.boundingBox())!
    expect(barBox.y + barBox.height).toBeLessThanOrEqual(laneBox.y + 1)
    await cardBar.getByRole('button', { name: 'Move to: Now' }).click()
    const lanes = page.getByRole('radiogroup', { name: 'Move Alpha to' })
    await expect(lanes.getByRole('radio')).toHaveText([/Now/, /Next/, /Later/])
    await lanes.getByRole('radio', { name: /Later/ }).click()
    await expect.poll(async () => (await storedWorkshop(page, key)).cards.find((c: any) => c.id === 'alpha').laneId).toBe('later')
    // Gamma may only be in Now: no Move at all.
    const gamma = card(page, await cardIdNamed(page, 'Gamma'))
    const g = (await gamma.boundingBox())!
    await page.mouse.click(g.x + g.width / 2, g.y + g.height / 2)
    await expect(bar(page, 'Card: Gamma')).toBeVisible()
    await expect(bar(page, 'Card: Gamma').getByRole('button', { name: /Move to/ })).toHaveCount(0)
  } finally { await removeTestGuest(page, id) }
})

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })
  test('five buttons over the note, Style and More as sheets, "+ Add" instead of the tool dock', async ({ page }) => {
    let id: string | null = null
    try {
      id = await openSlate(page)
      await expect(page.getByRole('region', { name: 'Slate tools' }).getByRole('button', { name: 'Add' })).toBeVisible()
      await expect(page.getByLabel(/quickly add a node/)).toHaveCount(0)
      await page.evaluate(() => { const v2 = (window as any).slate.v2; v2.selectNodes([v2.getAllNodes().find((n: any) => n.options.text === 'Welcome!')]) })
      const toolbar = bar(page)
      await expect(toolbar).toBeVisible()
      const names = await toolbar.getByRole('button').evaluateAll(els => els.map(el => el.getAttribute('aria-label')))
      expect(names).toEqual(['Colour', 'Style', 'Ask Slatebox about this note', 'More', 'Delete'])
      for (const b of await toolbar.getByRole('button').all()) {
        const r = (await b.boundingBox())!
        expect(r.height).toBeGreaterThanOrEqual(44)
        expect(r.width).toBeGreaterThanOrEqual(44)
      }
      const barBox = (await toolbar.boundingBox())!
      expect(barBox.x).toBeGreaterThanOrEqual(0)
      expect(barBox.x + barBox.width).toBeLessThanOrEqual(390)
      await toolbar.getByRole('button', { name: 'Style' }).click()
      const style = page.getByRole('dialog', { name: 'Style' })
      await expect(style.getByRole('radiogroup', { name: 'Fill colour' })).toBeVisible()
      await expect(style.getByRole('radiogroup', { name: 'Text size' })).toBeVisible()
      await style.getByRole('radio', { name: 'Large text', exact: true }).click()
      await expect.poll(() => opt(page, 'Welcome!', 'fontSize')).toBe(28)
      await style.getByRole('button', { name: 'Close' }).click()
      await toolbar.getByRole('button', { name: 'More' }).click()
      const more = page.getByRole('dialog', { name: /Welcome/ })
      await expect(more.getByRole('button', { name: /^Border: / })).toBeVisible()
      await expect(more.getByRole('switch', { name: 'Locked' })).toBeVisible()
      await more.getByRole('button', { name: 'Close' }).click()
      // + Add: a sheet of tools; the new note is selected with its own bar.
      await page.getByRole('region', { name: 'Slate tools' }).getByRole('button', { name: 'Add' }).click()
      await page.getByRole('dialog', { name: 'Add to the slate' }).getByRole('button', { name: 'Note', exact: true }).click()
      await expect.poll(() => page.evaluate(() => (window as any).slate.v2.getAllNodes().length)).toBe(2)
      await expect(bar(page)).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
    } finally { await removeTestGuest(page, id) }
  })
})
