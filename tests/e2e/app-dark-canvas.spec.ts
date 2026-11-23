import { expect, test, type Browser, type Page } from '@playwright/test'
import { removeTestGuest, userId } from './workshop-guests.shared'

// Dark mode all the way (the app's polish slice 2): in dark mode a slate whose background nobody
// chose is drawn on the dark canvas, its ink that would vanish there (black words on a clear note,
// a dark line) is shown lifted and never saved, a board's lanes are tints of their own colours, a
// slate with its own background keeps it, and the presenter and My slates follow the same rule.
const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
const at = (path: string) => new URL(path, origin).href
const DARK = 'rgb(20, 32, 27)'

async function fresh(browser: Browser, scheme: 'light' | 'dark', width = 1440) {
  const phone = width < 600
  const context = await browser.newContext({ viewport: { width, height: phone ? 844 : 900 }, colorScheme: scheme, hasTouch: phone, isMobile: phone })
  await context.addInitScript((mode) => { try { localStorage.setItem('mui-mode', mode) } catch { /* private window */ } }, scheme)
  await context.route('**/*', (route) => /^(https?|wss?):\/\/(localhost|127\.0\.0\.1)[:/]|^(data|blob):/.test(route.request().url()) ? route.continue() : route.abort())
  return { context, page: await context.newPage() }
}

async function newSlate(page: Page) {
  await page.goto(at('/new'))
  await page.waitForURL(/\/canvas\/[a-zA-Z0-9]+$/)
  await expect.poll(() => userId(page)).toBeTruthy()
  const ok = page.getByRole('dialog', { name: /welcome/i }).getByRole('button', { name: 'OK', exact: true })
  if (await ok.waitFor({ timeout: 4000 }).then(() => true, () => false)) await ok.click()
  // A new slate starts empty; its first note is the one the welcome's "Add a note" makes.
  await page.getByRole('button', { name: 'Add a note', exact: true }).click()
  await expect(page.locator('.sb-inline-editor')).toBeVisible()
  await page.keyboard.type('Welcome!')
  await page.keyboard.press('Enter')
  // Written and no longer selected, as the slate's first note was before it had a welcome.
  await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
  await page.keyboard.press('Escape')
  await expect(page.locator('#slateCanvas g[data-node-id]').first()).toBeVisible({ timeout: 20000 })
  return (await userId(page))!
}

const canvas = (page: Page) => page.evaluate(() => {
  const c = document.getElementById('slateCanvas')!
  return { mark: c.getAttribute('data-sb-canvas'), bg: getComputedStyle(c).backgroundColor }
})

test('dark mode: the default canvas is dark, black words and a dark line are lifted (and saved as they were), a chosen background is kept', async ({ browser }) => {
  const { context, page } = await fresh(browser, 'dark')
  let id: string | null = null
  try {
    id = await newSlate(page)
    await expect.poll(() => canvas(page)).toEqual({ mark: 'dark', bg: DARK })
    // The first note (made by the welcome): white words on the default blue, AA.
    const first = page.locator('#slateCanvas g[data-node-id]').first()
    await expect(first.locator('[data-node-background-path]')).toHaveCSS('fill', 'rgb(64, 112, 154)')
    await expect(first.locator(':scope > text')).toHaveCSS('fill', 'rgb(255, 255, 255)')
    // A text note as the toolbar makes it (no fill, black words) and a dark line between two notes.
    await page.evaluate(async () => {
      const v2 = (window as any).slate.v2
      const note = v2.getAllNodes()[0]
      const { x, y } = note.options
      v2.addNode({ id: 'darktext', text: 'Black words', x, y: y + 150, width: 270, height: 40, shape: 'rectangle',
        opacity: 0, borderOpacity: 0, textOpacity: 1, backgroundColor: '#ffffff', fontColor: '#000000', foregroundColor: '#000000', fontSize: 20 })
      const other = v2.addNode({ id: 'darkpale', text: 'Pale', x: x + 260, y, width: 140, height: 70, backgroundColor: '#fff3c4', fontColor: '#1d2b2a' })
      await other.ready
      note.connector.enable()
      note.connector.connectTo(other, { lineColor: '#333333' })
    })
    const words = page.locator('#slateCanvas g[data-node-id="darktext"] > text')
    await expect(words).toHaveCSS('fill', 'rgb(238, 241, 232)')
    await expect(words).toHaveAttribute('fill', '#000000')
    const line = page.locator('#slateCanvas [data-connection-id]').first()
    await expect(line).toHaveCSS('stroke', 'rgb(169, 188, 171)')
    await expect(line).toHaveAttribute('stroke', /#333/)
    // Words on a solid pale note already read: untouched.
    await expect(page.locator('#slateCanvas g[data-node-id="darkpale"] > text')).toHaveCSS('fill', 'rgb(29, 43, 42)')
    // Nothing of the dark canvas is in the slate: its background is still white, its words still black.
    expect(await page.evaluate(() => {
      const s = (window as any).slate.v2
      return { bg: s.options.containerStyle.backgroundColor, ink: s.getNode('darktext').options.fontColor }
    })).toEqual({ bg: '#ffffff', ink: '#000000' })
    // A copy of the drawing holds the slate's own colours: "Selection as SVG" (the same clone as every export, a
    // copied picture, a template's picture and a presentation's surface) has black words, never the lifted ink.
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin })
    const box = (await page.locator('#slateCanvas g[data-node-id="darktext"]').boundingBox())!
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    await page.getByRole('button', { name: /^More/ }).first().click()
    await page.getByText('Selection as SVG', { exact: true }).first().click()
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()).catch(() => '')).toMatch(/Black words/)
    const copied = await page.evaluate(() => navigator.clipboard.readText())
    expect(copied).toMatch(/#000000/i)
    expect(copied).not.toMatch(/eef1e8|a9bcab|238,\s*241,\s*232|data-sb-ink/i)
    await page.keyboard.press('Escape')
    // And the canvas still shows the lifted ink.
    await expect(words).toHaveCSS('fill', 'rgb(238, 241, 232)')
    // The minimap's frame is amber on the dark canvas, its field the canvas's own colour.
    const frame = page.locator('#slateCanvas .slateboxjs-birdseye-viewport')
    await expect(frame).toHaveCSS('stroke', 'rgb(242, 206, 139)')
    await expect(page.locator('#slateCanvas .slateboxjs-birdseye > svg > rect').first()).toHaveCSS('fill', DARK)
    // An author's own colour (as the slate menu's colour picker sets it) is kept in dark mode, and the lifted ink goes with the dark canvas.
    await page.evaluate(() => { const s = (window as any).slate.v2; Object.assign(s.options.containerStyle, { backgroundColor: '#fdf3e1' }); s.applyContainerStyle() })
    await expect.poll(() => canvas(page)).toEqual({ mark: null, bg: 'rgb(253, 243, 225)' })
    await expect(words).toHaveCSS('fill', 'rgb(0, 0, 0)')
    await page.evaluate(() => { const s = (window as any).slate.v2; Object.assign(s.options.containerStyle, { backgroundColor: '#ffffff' }); s.applyContainerStyle() })
    await expect.poll(() => canvas(page)).toEqual({ mark: 'dark', bg: DARK })
    // The presenter plays the slate as a styled deck: it keeps its style's own backdrop and ink in
    // dark mode (presentation styles), so the stage is not marked dark and nothing is lifted.
    await page.getByRole('button', { name: /^Present$/ }).first().click()
    await expect(page.locator('.sb-presenter-bar-immersive')).toBeVisible({ timeout: 20000 })
    const stage = page.locator('.MuiDialog-paper main')
    await expect(stage).not.toHaveAttribute('data-sb-canvas', 'dark')
    await expect(page.locator('.MuiDialog-paper').first()).not.toHaveCSS('background-color', DARK)
    expect(await stage.locator('[data-sb-ink]').count()).toBe(0)
    await page.getByRole('button', { name: 'Exit presentation' }).click()
    // My slates: the picture of a slate follows the mode too.
    await page.goto(at('/'))
    await expect(page.locator('[id^="slate_"]').first()).toHaveAttribute('data-sb-canvas', 'dark', { timeout: 20000 })
  } finally {
    await removeTestGuest(page, id).catch(() => undefined)
    await context.close()
  }
})

test('light mode: the canvas stays white and every ink is drawn as saved; switching modes repaints it', async ({ browser }) => {
  const { context, page } = await fresh(browser, 'light')
  let id: string | null = null
  try {
    id = await newSlate(page)
    await expect.poll(() => canvas(page)).toEqual({ mark: null, bg: 'rgb(255, 255, 255)' })
    await page.evaluate(() => {
      const v2 = (window as any).slate.v2
      const { x, y } = v2.getAllNodes()[0].options
      v2.addNode({ id: 'lighttext', text: 'Black words', x, y: y + 150, width: 270, height: 40, shape: 'rectangle',
        opacity: 0, borderOpacity: 0, textOpacity: 1, backgroundColor: '#ffffff', fontColor: '#000000', foregroundColor: '#000000', fontSize: 20 })
    })
    await expect(page.locator('#slateCanvas g[data-node-id="lighttext"] > text')).toHaveCSS('fill', 'rgb(0, 0, 0)')
    expect(await page.locator('#slateCanvas [data-sb-ink]').count()).toBe(0)
    // Switching the app to dark (its own shortcut) repaints the open canvas at once; back to light undoes it all.
    await page.locator('body').press('Meta+j')
    await expect.poll(() => canvas(page)).toEqual({ mark: 'dark', bg: DARK })
    await expect(page.locator('#slateCanvas g[data-node-id="lighttext"] > text')).toHaveCSS('fill', 'rgb(238, 241, 232)')
    await page.locator('body').press('Meta+j')
    await expect.poll(() => canvas(page)).toEqual({ mark: null, bg: 'rgb(255, 255, 255)' })
    expect(await page.locator('#slateCanvas [data-sb-ink]').count()).toBe(0)
  } finally {
    await removeTestGuest(page, id).catch(() => undefined)
    await context.close()
  }
})

for (const width of [1440, 390]) test(`${width}px dark: a retro's lanes are tints of their own colours, its counts and rules in the light ink`, async ({ browser }) => {
  const { context, page } = await fresh(browser, 'dark', width)
  let id: string | null = null
  try {
    id = await newSlate(page)
    const ask = page.locator('aside[aria-label="Ask Slatebox"]')
    if (!(await ask.isVisible().catch(() => false))) {
      await (width < 600 ? page.locator('[data-conversation-toggle]') : page.getByRole('button', { name: /^Ask Slatebox$/ }).first()).click()
    }
    await page.getByRole('button', { name: /^(Browse|See all|Add to this slate)/ }).first().click()
    await page.getByLabel('Search the library or describe what you need').first().fill('retro')
    await page.getByRole('button', { name: /^Add( on a new slate:)? / }).first().click()
    await page.getByRole('button', { name: 'Keep changes', exact: true }).click({ timeout: 25000 })
    const column = page.locator('#slateCanvas g[data-node-id^="column-"] [data-node-background-path]').first()
    await expect(column).toHaveCSS('fill-opacity', '0.18', { timeout: 20000 })
    await expect(page.locator('#slateCanvas g[data-node-id^="caption-"] > text').first()).toHaveCSS('fill', 'rgb(238, 241, 232)')
    // A lane's header keeps its pastel with its dark words on it.
    await expect(page.locator('#slateCanvas g[data-node-id^="lane-"] > text').first()).toHaveCSS('fill', 'rgb(29, 43, 42)')
    expect(await page.evaluate(() => getComputedStyle(document.getElementById('slateCanvas')!).getPropertyValue('--slatebox-board-ink').trim())).toBe('#dfe7dc')
  } finally {
    await removeTestGuest(page, id).catch(() => undefined)
    await context.close()
  }
})

test('1440px dark: a launch plan\'s task bars are raised dark cards with light words, its weekends the muted columns', async ({ browser }) => {
  const { context, page } = await fresh(browser, 'dark', 1440)
  let id: string | null = null
  try {
    id = await newSlate(page)
    const ask = page.locator('aside[aria-label="Ask Slatebox"]')
    if (!(await ask.isVisible().catch(() => false))) await page.getByRole('button', { name: /^Ask Slatebox$/ }).first().click()
    await page.getByRole('button', { name: /^(Browse|See all|Add to this slate)/ }).first().click()
    await page.getByLabel('Search the library or describe what you need').first().fill('launch plan')
    await page.getByRole('button', { name: /^Add( on a new slate:)? / }).first().click()
    await page.getByRole('button', { name: 'Keep changes', exact: true }).click({ timeout: 25000 })
    const bar = page.locator('#slateCanvas g[data-node-id^="card-"]').first()
    await expect(bar.locator('[data-node-background-path]')).toHaveCSS('fill', 'rgb(58, 79, 68)', { timeout: 20000 })
    await expect(bar.locator(':scope > text').first()).toHaveCSS('fill', 'rgb(238, 241, 232)')
    // Saved as drawn: the bar is still its white paper in the slate.
    expect(await bar.locator('[data-node-background-path]').getAttribute('fill')).toMatch(/^#fff/i)
    // Weekends are drawn in the track ink, below the canvas.
    expect(await page.evaluate(() => getComputedStyle(document.getElementById('slateCanvas')!).getPropertyValue('--slatebox-board-track').trim())).toBe('#0a120e')
  } finally {
    await removeTestGuest(page, id).catch(() => undefined)
    await context.close()
  }
})
