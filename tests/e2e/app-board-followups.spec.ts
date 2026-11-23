import { expect, test, type Page } from '@playwright/test'
import { dismissWelcome, getSlate, removeTestGuest, userId } from './workshop-guests.shared'
import { openConversation, resting, slateKey, storedWorkshop, workshopReady } from './app-native-workshop.shared'

/**
 * Follow-ups from verifying release 2026-11-23b, in the real Meteor app:
 * - an empty note let go over a later day of a hiring or launch plan is saved as a task on that day,
 *   not at the very start of its row;
 * - a hiring plan kept from Ask Slatebox onto an untitled slate names the slate "Hiring plan", and its
 *   card in My slates is one picture with that name, none of the board's controls said on it;
 * - "Add a launch plan for our app launching in March" launches in March, not on the sample's third Friday.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable accounts and slates; local app only.')
test.use({ viewport: { width: 1440, height: 900 } })

const centre = (box: { x: number; y: number; width: number; height: number }) => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 })
async function drag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }) {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 16 })
  await page.waitForTimeout(80)
  await page.mouse.up()
}

/** A new slate with a board kept from Ask Slatebox. */
async function keepFromChat(page: Page, message: string) {
  await page.goto(new URL('/new', origin).href)
  await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
  await expect.poll(() => userId(page)).toBeTruthy()
  await dismissWelcome(page)
  const panel = await openConversation(page)
  await panel.getByRole('textbox').fill(message)
  await panel.getByRole('button', { name: 'Preview changes', exact: true }).click()
  await expect(panel.getByRole('button', { name: 'Keep changes', exact: true })).toBeEnabled({ timeout: 30000 })
  await panel.getByRole('button', { name: 'Keep changes', exact: true }).click()
  await expect(page.locator('#slateCanvas [data-node-id^="column-"]').first()).toBeVisible({ timeout: 30000 })
  await dismissWelcome(page)
  await workshopReady(page)
}

for (const board of [{ kind: 'hiring plan', path: null, chat: 'Add a hiring plan' }, { kind: 'launch plan', path: '/new/launch-plan', chat: null }]) {
  test(`${board.kind}: an empty note let go over a later day is saved as a task starting there`, async ({ page }) => {
    let id: string | null = null
    try {
      if (board.chat) await keepFromChat(page, board.chat)
      else {
        await page.goto(new URL(board.path!, origin).href)
        await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
        await expect.poll(() => userId(page)).toBeTruthy()
        await dismissWelcome(page)
        await workshopReady(page)
      }
      id = await userId(page)
      const key = slateKey(page)
      await page.waitForTimeout(4000)
      const laneId = await page.evaluate(() => {
        const slate = (window as any).slate.v2
        const first = document.querySelector('#slateCanvas [data-node-id^="column-"]')!.getAttribute('data-node-id')!
        const o = slate.nodes.one(first).options
        slate.addNode({ id: 'blank', x: o.x - 260, y: o.y + 20, width: 120, height: 120, text: '', shape: 'ellipse' })
        return String(o.id).slice('column-'.length)
      })
      await page.waitForTimeout(500)
      await page.evaluate(() => (window as any).slate.v2.fitToContent?.())
      await page.waitForTimeout(600)
      const column = await resting(page, 'column-' + laneId)
      const at = { x: column.x + column.width * 0.66, y: column.y + column.height / 2 }
      await drag(page, centre(await resting(page, 'blank')), at)
      await expect.poll(async () => (await storedWorkshop(page, key)).cards.find((item: any) => item.id === 'blank')?.lag ?? 0, { timeout: 15000 }).toBeGreaterThan(0)
      await page.keyboard.press('Escape')
      // Drawn where it was let go: its bar starts under the pointer, within a week.
      const bar = await resting(page, 'card-blank')
      expect(Math.abs(bar.x - at.x)).toBeLessThan(column.width * 0.08)
    } finally {
      await removeTestGuest(page, id)
    }
  })
}

test('a hiring plan kept on an untitled slate names it; its card in My slates is one picture with that name', async ({ page }) => {
  let id: string | null = null
  try {
    await keepFromChat(page, 'Add a hiring plan')
    id = await userId(page)
    const key = slateKey(page)
    await expect.poll(async () => (await getSlate(page, key)).options.name).toBe('Hiring plan')
    await expect(page.locator('.sb-board-name strong')).toHaveText('Hiring plan')
    // A save from the page keeps the name (the page holds it).
    await page.evaluate(() => (window as any).slate.v2.addNode({ id: 'aside', x: -900, y: -900, width: 120, height: 80, text: 'Aside' }))
    await expect.poll(async () => (await getSlate(page, key)).nodes.some((n: any) => n.options.id === 'aside'), { timeout: 15000 }).toBe(true)
    expect((await getSlate(page, key)).options.name).toBe('Hiring plan')

    await page.goto(new URL('/', origin).href)
    const picture = page.getByRole('img', { name: 'Hiring plan', exact: true })
    await expect(picture).toBeVisible({ timeout: 30000 })
    // The board is drawn in it (its hires), and none of its controls are said or focusable.
    await expect(picture.locator('[data-node-id^="card-"]').first()).toBeAttached({ timeout: 30000 })
    await page.waitForTimeout(1500)
    const said = await picture.evaluate(root => Array.from(root.querySelectorAll('*')).flatMap((el: Element) =>
      el.getAttributeNames().filter((name: string) => /^(aria-|role$|tabindex$)/.test(name)).map((name: string) => el.localName + '[' + name + '=' + el.getAttribute(name) + ']')))
    expect(said).toEqual([])
    expect(await picture.innerHTML()).not.toMatch(/Remove the link|move it a day/)
    await expect(page.getByRole('button', { name: 'Open Hiring plan', exact: true }).first()).toBeVisible()
  } finally {
    await removeTestGuest(page, id)
  }
})

test('“Add a launch plan for our app launching in March” launches in March', async ({ page }) => {
  let id: string | null = null
  try {
    await keepFromChat(page, 'Add a launch plan for our app launching in March')
    id = await userId(page)
    const plan = await storedWorkshop(page, slateKey(page))
    const launch = new Date(Date.parse(plan.clock.origin + 'T00:00:00Z') + plan.launch.day * 86400000)
    expect(launch.getUTCMonth()).toBe(2)
    expect(launch.getUTCDate()).toBe(1)
  } finally {
    await removeTestGuest(page, id)
  }
})
