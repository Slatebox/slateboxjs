import { expect, test, type Page } from '@playwright/test'
import { openGuestCanvas } from './app-host.shared'
import { removeTestGuest, userId, dismissWelcome } from './workshop-guests.shared'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { cardIdNamed, card, workshopReady, slateKey, storedWorkshop } from './app-native-workshop.shared'

/**
 * The style bar after its hostile review: a card is not removed on one press, a collaborator's
 * change reaches an open bar (and a locked note takes no style), a line's bar covers neither
 * of its notes, the bar is the next keyboard stop after its note, fields opened by mouse take
 * the keyboard, and values on the bar follow the note.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')
test.use({ viewport: { width: 1440, height: 900 } })

const engine = (page: Page) => page.evaluate(() => Boolean((window as any).slate?.v2))
const opt = (page: Page, text: string, name: string) => page.evaluate(([text, name]) =>
  (window as any).slate.v2.getAllNodes().find((n: any) => n.options.text === text)?.options[name], [text, name])
const noteNamed = (page: Page, text: string) => page.locator('#slateCanvas [data-node-id]').filter({ hasText: text }).first()
const bar = (page: Page, name: string | RegExp = 'Note') => page.getByRole('toolbar', { name, exact: typeof name === 'string' })
const group = (page: Page, name: string) => page.getByRole('group', { name, exact: true })
const focused = (page: Page) => page.evaluate(() => {
  const e = document.activeElement as HTMLElement | null
  return {
    label: e?.getAttribute('aria-label') ?? '',
    tag: e?.tagName ?? '',
    inBar: Boolean(e?.closest('.sb-style-bar')),
    inPop: Boolean(e?.closest('.sb-pop')),
    node: e?.closest('[data-node-id]')?.getAttribute('data-node-id') ?? null,
    group: e?.closest('[role="radiogroup"]')?.getAttribute('aria-label') ?? null,
  }
})
const overlaps = (a: { x: number, y: number, width: number, height: number }, b: { x: number, y: number, width: number, height: number }) =>
  a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y

async function openSlate(page: Page) {
  await openGuestCanvas(page, origin.origin)
  const cookies = page.getByRole('button', { name: 'Accept cookies' })
  if (await cookies.isVisible()) await cookies.click()
  await expect.poll(() => userId(page)).toBeTruthy()
  await expect.poll(() => engine(page)).toBe(true)
  await expect(noteNamed(page, 'Welcome!')).toBeVisible()
  await closeConversation(page)
  return (await userId(page))!
}
async function closeConversation(page: Page) {
  const close = page.getByRole('complementary', { name: 'Conversation with Slatebox' }).getByRole('button', { name: /close/i })
  if (await close.isVisible().catch(() => false)) await close.click()
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

async function connectAndSelectLine(page: Page) {
  await page.evaluate(() => {
    const v2 = (window as any).slate.v2
    const [a, b] = ['Welcome!', 'Beta'].map((t) => v2.getAllNodes().find((n: any) => n.options.text === t))
    a.relationships.addAssociation(b)
  })
  await selectLine(page)
}
async function selectLine(page: Page) {
  const pt = await page.evaluate(() => {
    const p = document.querySelector('#slateCanvas path[connectortype="default"]') as SVGGeometryElement
    const m = p.getPointAtLength(p.getTotalLength() / 2).matrixTransform(p.getScreenCTM()!)
    return { x: m.x, y: m.y }
  })
  await page.mouse.click(pt.x, pt.y)
  await expect(bar(page, 'Line')).toBeVisible()
  await expect(page.locator('.sb-style-anchor')).toHaveAttribute('data-placement-ready', 'true')
}
const assoc = (page: Page, name: string) => page.evaluate((name) =>
  (window as any).slate.v2.getAllNodes().find((n: any) => n.options.text === 'Welcome!').relationships.getAssociations()[0]?.[name], name)

test('a collaborator\'s change reaches an open bar (a note, a line\'s More); a note someone else locked offers no style', async ({ page, browser }) => {
  let id: string | null = null
  try {
    id = await openSlate(page)
    await addNote(page, 'Beta', 1000, 650)
    await page.evaluate(() => {
      const v2 = (window as any).slate.v2
      const [a, b] = ['Welcome!', 'Beta'].map((t) => v2.getAllNodes().find((n: any) => n.options.text === t))
      a.relationships.addAssociation(b)
    })
    await page.waitForTimeout(2500)
    const b = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: await page.context().storageState() })).newPage()
    await b.goto(page.url())
    await dismissWelcome(b)
    await expect.poll(() => engine(b)).toBe(true)
    await expect(noteNamed(b, 'Welcome!')).toBeVisible()
    await closeConversation(b)
    await select(b, 'Welcome!')
    await expect(bar(b)).toBeVisible()
    // A makes it Extra large and locks it.
    await select(page, 'Welcome!')
    await bar(page).getByRole('radio', { name: 'Extra large text' }).click()
    await bar(page).getByRole('button', { name: 'More', exact: true }).click()
    await page.getByRole('switch', { name: 'Locked' }).click()
    await expect.poll(() => opt(b, 'Welcome!', 'isLocked')).toBe(true)
    // B's open bar reads the note again: XL, and only what a locked note offers.
    await expect(bar(b).getByRole('button', { name: 'Fill colour' })).toHaveCount(0)
    await expect(bar(b).getByRole('button', { name: 'Delete' })).toHaveCount(0)
    await expect(bar(b).getByRole('button', { name: 'More', exact: true })).toBeVisible()
    // A unlocks: B gets its controls back, with XL ticked.
    await page.getByRole('switch', { name: 'Locked' }).click()
    await expect.poll(() => opt(b, 'Welcome!', 'isLocked')).toBeFalsy()
    await expect(bar(b).getByRole('radio', { name: 'Extra large text' })).toHaveAttribute('aria-checked', 'true')
    await page.keyboard.press('Escape')
    // A line: A has its More open while B makes it thick; A's exact thickness follows.
    await selectLine(page)
    await bar(page, 'Line').getByRole('button', { name: 'More', exact: true }).click()
    await selectLine(b)
    await bar(b, 'Line').getByRole('radio', { name: 'Thick' }).click()
    await expect.poll(() => assoc(page, 'lineWidth')).toBe(8)
    await expect(page.getByRole('slider', { name: 'Exact thickness' })).toHaveValue('8')
    await b.context().close()
  } finally { await removeTestGuest(page, id) }
})

test('a line\'s bar covers neither the line nor the notes at its ends; its colours are line colours with names', async ({ page }) => {
  let id: string | null = null
  try {
    id = await openSlate(page)
    // The review's case: Welcome! where a new slate puts it, Beta to its lower right.
    await addNote(page, 'Beta', 1000, 650)
    await connectAndSelectLine(page)
    const barBox = (await bar(page, 'Line').boundingBox())!
    for (const text of ['Welcome!', 'Beta']) {
      const box = (await noteNamed(page, text).boundingBox())!
      expect(overlaps(barBox, box), `the line bar covers ${text}`).toBe(false)
    }
    // Colours that show as lines, each with a readable name.
    await bar(page, 'Line').getByRole('button', { name: 'Line colour' }).click()
    const names = await page.locator('#sb-pop-line-colour [role="radio"]').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label') ?? ''))
    expect(names.length).toBeGreaterThan(6)
    for (const n of names) expect(n).not.toMatch(/#|rgb/)
    expect(names).not.toContain('Sky')
  } finally { await removeTestGuest(page, id) }
})

test('keyboard: Tab goes note, its connect dots, then the bar; Escape goes back to the note; a swatch group is one stop', async ({ page }) => {
  let id: string | null = null
  try {
    id = await openSlate(page)
    await select(page, 'Welcome!')
    const nodeId = await page.evaluate(() => (window as any).slate.v2.getSelectedNodes()[0].id)
    await noteNamed(page, 'Welcome!').focus()
    // Focusing a note can scroll the view a little; the bar is back once the view is still.
    await expect(bar(page)).toBeVisible()
    // Note, its four connect dots, then the bar: before the zoom controls and the rest of the page.
    const stops: string[] = []
    for (let i = 0; i < 6 && !(await focused(page)).inBar; i++) {
      await page.keyboard.press('Tab')
      const f = await focused(page)
      stops.push(f.inBar ? 'BAR' : f.label)
    }
    expect(stops.at(-1)).toBe('BAR')
    for (const s of stops.slice(0, -1)) expect(s).toMatch(/connected note/i)
    expect(stops.length).toBeLessThanOrEqual(5)
    expect((await focused(page)).label).toBe('Fill colour')
    await page.keyboard.press('Shift+Tab')
    await expect.poll(async () => (await focused(page)).label).toMatch(/connected note/i)
    await page.keyboard.press('Tab')
    await expect.poll(async () => (await focused(page)).inBar).toBe(true)
    await page.keyboard.press('ArrowRight')
    expect((await focused(page)).label).toBe('Border')
    // Escape on a bar button: back to the note, still selected.
    await page.keyboard.press('Escape')
    await expect.poll(async () => (await focused(page)).node).toBe(nodeId)
    expect(await page.evaluate(() => (window as any).slate.v2.getSelectedNodes().length)).toBe(1)
    // The colour panel: each swatch group is one Tab stop, and the arrows move in it.
    await bar(page).getByRole('button', { name: 'Border', exact: true }).focus()
    await page.keyboard.press('Enter')
    await expect.poll(async () => (await focused(page)).inPop).toBe(true)
    let guard = 0
    while ((await focused(page)).group !== 'Slate colours' && guard++ < 8) await page.keyboard.press('Tab')
    const first = await focused(page)
    expect(first.group).toBe('Slate colours')
    await page.keyboard.press('ArrowRight')
    const second = await focused(page)
    expect(second.group).toBe('Slate colours')
    expect(second.label).not.toBe(first.label)
    await page.keyboard.press('Tab')
    expect((await focused(page)).group).not.toBe('Slate colours')
    // Escape closes the panel and gives the keyboard back to its button.
    await page.keyboard.press('Escape')
    await expect.poll(async () => (await focused(page)).inBar).toBe(true)
  } finally { await removeTestGuest(page, id) }
})

test('fields opened by mouse take the keyboard; a link without http:// gets the app\'s own words', async ({ page }) => {
  let id: string | null = null
  try {
    id = await openSlate(page)
    await addNote(page, 'Beta', 1000, 650)
    await connectAndSelectLine(page)
    await bar(page, 'Line').getByRole('button', { name: 'Label' }).click()
    await page.keyboard.type('leads to')
    await page.keyboard.press('Enter')
    await expect.poll(() => assoc(page, 'label')).toBe('leads to')
    // More → a row, by mouse: the keyboard follows into what opened.
    await select(page, 'Welcome!')
    await bar(page).getByRole('button', { name: 'More', exact: true }).click()
    await group(page, 'More').getByRole('button', { name: /^Link/ }).click()
    await expect.poll(async () => (await focused(page)).tag).toBe('INPUT')
    await page.keyboard.type('example.com')
    await page.keyboard.press('Enter')
    await expect(page.locator('#sb-pop-more').getByRole('alert')).toContainText('http')
    expect(await opt(page, 'Welcome!', 'link')).toBeFalsy()
  } finally { await removeTestGuest(page, id) }
})

test('values follow the note: a new slate\'s note shows the size it is drawn at, the custom field follows, text animation is back', async ({ page }) => {
  let id: string | null = null
  try {
    id = await openSlate(page)
    await select(page, 'Welcome!')
    // A first note is 18px: the Medium chip, not Small (restated 2026-11-23: the first note moved
    // from "14pt", drawn at 18.7px and shown as a custom size, onto the bar's M).
    expect(await opt(page, 'Welcome!', 'fontSize')).toBe(18)
    await expect(bar(page).getByRole('radio', { name: 'Small text' })).toHaveAttribute('aria-checked', 'false')
    await expect(bar(page).getByRole('radio', { name: 'Medium text' })).toHaveAttribute('aria-checked', 'true')
    // Text animation, offered again in Effects and animation.
    await bar(page).getByRole('button', { name: 'More', exact: true }).click()
    await group(page, 'More').getByRole('button', { name: /^Effects and animation/ }).click()
    const textAnimations = page.getByRole('radiogroup', { name: 'Text animation' })
    const hasText = await page.evaluate(() => Object.values((window as any).slate.filters?.availableAnimations ?? {}).some((a: any) => (a.types || []).includes('text')))
    if (hasText) {
      await expect(textAnimations).toBeVisible()
      const choice = textAnimations.getByRole('radio').nth(1)
      await choice.click()
      await expect.poll(() => page.evaluate(() => (window as any).slate.v2.getAllNodes().find((n: any) => n.options.text === 'Welcome!').options.animations?.text)).toBeTruthy()
    }
    await page.keyboard.press('Escape')
    // Compact bar: the custom field follows a preset.
    await page.setViewportSize({ width: 700, height: 900 })
    await select(page, 'Welcome!')
    await bar(page).getByRole('button', { name: /^Text size/ }).click()
    await group(page, 'Text size').getByRole('radio', { name: 'Extra large text' }).click()
    await expect.poll(() => opt(page, 'Welcome!', 'fontSize')).toBe(44)
    await expect(group(page, 'Text size').getByRole('spinbutton')).toHaveValue('44')
    await page.keyboard.press('Escape')
    await page.setViewportSize({ width: 1440, height: 900 })
  } finally { await removeTestGuest(page, id) }
})

const ruled: Workshop = {
  version: 1, title: 'Card removal',
  lanes: [{ id: 'now', label: 'Now' }, { id: 'later', label: 'Later' }],
  cards: [{ id: 'alpha', label: 'Alpha', laneId: 'now' }, { id: 'beta', label: 'Beta', laneId: 'now' }],
}

test('a card is not removed on one press: Remove asks first, Cancel keeps it, and Undo last change brings it back', async ({ page }) => {
  let id: string | null = null
  try {
    await page.goto(new URL('/new/workshop' + encodeWorkshopFragment(ruled), origin).href)
    await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await expect.poll(() => userId(page)).toBeTruthy()
    id = await userId(page)
    await dismissWelcome(page)
    await workshopReady(page)
    const key = slateKey(page)
    const cards = async () => (await storedWorkshop(page, key)).cards.map((c: any) => c.id).sort()
    const alpha = card(page, await cardIdNamed(page, 'Alpha'))
    const box = (await alpha.boundingBox())!
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    const cardBar = bar(page, 'Card: Alpha')
    await expect(cardBar).toBeVisible()
    await cardBar.getByRole('button', { name: 'Remove card' }).click()
    const ask = page.getByRole('group', { name: 'Remove Alpha?' })
    await expect(ask).toBeVisible()
    await page.waitForTimeout(800)
    expect(await cards()).toEqual(['alpha', 'beta'])
    await ask.getByRole('button', { name: 'Cancel' }).click()
    await expect(ask).toHaveCount(0)
    await page.waitForTimeout(500)
    expect(await cards()).toEqual(['alpha', 'beta'])
    // Keyboard: the confirmation takes the keyboard, and Escape keeps the card.
    await cardBar.getByRole('button', { name: 'Remove card' }).focus()
    await page.keyboard.press('Enter')
    await expect(ask).toBeVisible()
    await expect.poll(async () => (await focused(page)).inPop).toBe(true)
    await page.keyboard.press('Escape')
    await expect(ask).toHaveCount(0)
    expect(await cards()).toEqual(['alpha', 'beta'])
    // Confirmed: removed, and Undo last change puts it back.
    await cardBar.getByRole('button', { name: 'Remove card' }).click()
    await ask.getByRole('button', { name: 'Remove Alpha' }).click()
    await expect.poll(cards).toEqual(['beta'])
    await page.getByRole('button', { name: 'Undo last change' }).click()
    await expect.poll(cards).toEqual(['alpha', 'beta'])
    await expect(card(page, 'alpha')).toBeVisible()
  } finally { await removeTestGuest(page, id) }
})
