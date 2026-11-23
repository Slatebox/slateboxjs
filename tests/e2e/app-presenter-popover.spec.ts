import { expect, test, type Locator, type Page } from '@playwright/test'
import { openGuestCanvas } from './app-host.shared'
import { presenter } from './app-presenter.shared'

// Reported 2026-11-23 on app.slatebox.com (desktop Chrome, a 1457×812 window): opening "More
// presenter options" or the Style popover scrolled the presenter up, so the deck filled only the
// top ~55% of the window with plain white below, and it stayed that way after the popover closed.
// The presenter's area must not be scrollable at all: nothing hidden below the stage, and no
// focus, scrollIntoView or scroll anchoring may move it. Each popover, open and closed again.

const app = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
const writable = /localhost|127\.0\.0\.1|staging|test\./.test(app)

/** A few notes, so Present plays a styled deck with its floating bar. */
async function slateOfNotes(page: Page) {
  await openGuestCanvas(page, app)
  await page.evaluate(async () => {
    const s = (window as any).slate
    const json = JSON.parse(s.exportJSON())
    const plain = { backgroundColor: '#6a9cc4', fontColor: '#ffffff', fontSize: 14, borderWidth: 0 }
    const kids = ['Plan', 'Present', 'Share', 'Build'].map((text, i) => ({ id: 'k' + i, text }))
    json.nodes = [
      { options: { id: 'root', text: 'Slatebox', x: 5000, y: 5300, width: 140, height: 80, ...plain }, relationships: { associations: kids.map(k => ({ parentId: 'root', childId: k.id, lineColor: '#7a8ca0', lineWidth: 2 })) } },
      ...kids.map((k, i) => ({ options: { id: k.id, text: k.text, x: 5300, y: 5100 + i * 120, width: 180, height: 56, ...plain }, relationships: { associations: [] } })),
    ]
    await s.loadJSON(JSON.stringify(json))
  })
  await page.waitForFunction(() => (window as any).slate.v2.nodes.allNodes.length >= 5)
}

async function openPresenter(page: Page) {
  await page.locator('.sb-board-toolbar').getByRole('button', { name: 'Present', exact: true }).click()
  const item = page.getByRole('menu', { name: 'Present' }).getByRole('menuitem', { name: 'Present on this screen', exact: true })
  if (await item.waitFor({ timeout: 1500 }).then(() => true, () => false)) await item.click()
  const dialog = presenter(page)
  await expect(dialog.locator('.sb-live-stage svg [data-node-id]').first()).toBeAttached({ timeout: 60_000 })
  await expect(dialog.getByRole('progressbar', { name: 'Planning with Slatebox…' })).toHaveCount(0, { timeout: 30_000 })
  return dialog
}

/** The stage covers the whole window, and the presenter's area cannot be scrolled, even on purpose. */
async function expectFillsWindow(page: Page, when: string) {
  const state = await page.evaluate(() => {
    const stage = document.querySelector('.sb-live-stage')!.getBoundingClientRect()
    const area = document.querySelector('.MuiDialog-paper main') as HTMLElement
    // What a focus, scrollIntoView or scroll anchoring would do: try to scroll it, then read it back.
    area.scrollTop = 400
    const moved = area.scrollTop
    area.scrollTop = 0
    return { top: Math.round(stage.top), height: Math.round(stage.height), width: Math.round(stage.width), hidden: area.scrollHeight - area.clientHeight, moved, w: innerWidth, h: innerHeight }
  })
  expect(state, when).toMatchObject({ top: 0, height: state.h, width: state.w, hidden: 0, moved: 0 })
}

const wake = async (page: Page) => {
  await page.mouse.move(700, 500)
  await page.mouse.move(720, 760, { steps: 5 })
}

test('opening and closing each presenter popover leaves the deck filling the window (1457×812)', async ({ browser }) => {
  test.skip(!writable, 'Creates a disposable guest slate on local or staging only.')
  const context = await browser.newContext({ viewport: { width: 1457, height: 812 } })
  const page = await context.newPage()
  try {
    await slateOfNotes(page)
    const dialog = await openPresenter(page)
    await expectFillsWindow(page, 'presenting')
    for (const [name, popover] of [
      ['More presenter options', page.locator('.MuiPopover-paper[aria-label="More presenter options"]')],
      ['Presentation style', page.getByRole('radiogroup', { name: 'Presentation style' })],
    ] as [string, Locator][]) {
      await wake(page)
      await dialog.getByRole('button', { name, exact: true }).click()
      await expect(popover).toBeVisible()
      await expectFillsWindow(page, name + ' open')
      await page.keyboard.press('Escape')
      await expect(popover).toHaveCount(0)
      await expect(dialog).toBeVisible()
      await expectFillsWindow(page, name + ' closed')
    }
  } finally {
    await context.close()
  }
})
