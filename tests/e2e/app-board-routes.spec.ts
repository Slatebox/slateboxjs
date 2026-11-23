import { expect, test, type Page } from '@playwright/test'
import { dismissWelcome, removeTestGuest, userId } from './workshop-guests.shared'
import { canvas, card, resting, slateKey, storedWorkshop, workshopReady } from './app-native-workshop.shared'

/**
 * Every /new/<kind> board route in the real Meteor app opens its sample board on a new slate. 2026-11-23:
 * /new/hiring-plan showed a blank page ("This board has rules, and they have not loaded"): the route
 * loaded the boards' rules but not the rulebook's module, which a hiring plan (and a nested board)
 * comes with. On the hiring plan an empty note then becomes "New hire", as on a plan made from chat.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable accounts and slates; local app only.')
test.use({ viewport: { width: 1440, height: 900 } })

const kinds: Array<[string, string]> = [['hiring-plan', 'hiring-plan'], ['launch-plan', 'launch-plan'], ['pipeline', 'pipeline'], ['budget', 'budget'], ['nest', 'nest']]

async function openRoute(page: Page, kind: string, errors: string[]) {
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(new URL('/new/' + kind, origin).href)
  await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/, { timeout: 60000 })
  await expect.poll(() => userId(page)).toBeTruthy()
  await dismissWelcome(page)
  await workshopReady(page)
}

for (const [kind, stored] of kinds) {
  test(`/new/${kind} opens its board on a new slate, without a fault`, async ({ page }) => {
    const errors: string[] = []
    let id: string | null = null
    try {
      await openRoute(page, kind, errors)
      id = await userId(page)
      expect((await storedWorkshop(page, slateKey(page))).kind).toBe(stored)
      expect(errors).toEqual([])
    } finally {
      await removeTestGuest(page, id)
    }
  })
}

test('/new/hiring-plan: an empty note dropped on the plan is “New hire”', async ({ page }) => {
  const errors: string[] = []
  let id: string | null = null
  try {
    await openRoute(page, 'hiring-plan', errors)
    id = await userId(page)
    const key = slateKey(page)
    await page.waitForTimeout(4000)
    const laneId = await page.evaluate(() => {
      const slate = (window as any).slate.v2
      const first = document.querySelector('#slateCanvas [data-node-id^="column-"]')!.getAttribute('data-node-id')!
      const o = slate.nodes.one(first).options
      slate.addNode({ id: 'blank', x: o.x - 260, y: o.y + 20, width: 120, height: 120, text: '' })
      return first.slice('column-'.length)
    })
    await page.waitForTimeout(500)
    await page.evaluate(() => (window as any).slate.v2.fitToContent?.())
    await page.waitForTimeout(600)
    const from = await resting(page, 'blank'), to = await resting(page, 'column-' + laneId)
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
    await page.mouse.down()
    await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 16 })
    await page.waitForTimeout(80)
    await page.mouse.up()
    await expect.poll(async () => (await storedWorkshop(page, key)).cards.find((item: any) => item.id === 'blank')?.label ?? null).toBe('New hire')
    await expect(card(page, 'blank')).toHaveAttribute('aria-label', /^New hire, in /)
    await expect(canvas(page).getByText('needs some words')).toHaveCount(0)
    expect(errors).toEqual([])
  } finally {
    await removeTestGuest(page, id)
  }
})
