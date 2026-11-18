import { expect, test } from '@playwright/test'
import { dismissWelcome, getSlate, removeTestGuest, userId } from './workshop-guests.shared'

const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'

test('opens the outage whiteboard with native connectors, editable notes and playback', async ({ page }) => {
  let owner: string | null = null
  const changes = { fallback: { x: 283, y: 242, text: 'Call the first customer' } }
  const note = (id: string) => page.locator('#slateCanvas g[data-node-id="' + id + '"]').first()
  try {
    await page.goto(origin + '/new/sign-in-outage#' + new URLSearchParams({ notes: JSON.stringify(changes) }))
    await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    owner = await userId(page)
    expect(owner).toBeTruthy()
    const key = new URL(page.url()).pathname.split('/').pop()!
    await dismissWelcome(page)
    await expect(note('fallback')).toHaveAttribute('aria-label', changes.fallback.text)
    const board = await getSlate(page, key)
    expect(board.options.isPrivate).toBe(true)
    expect(board.creative).toBeUndefined()
    expect(board.userId).toBe(owner)
    expect(board.nodes).toHaveLength(6)
    const arrows = (slate: typeof board) => [...new Set(slate.nodes.flatMap((node: any) =>
      node.relationships.associations.filter((edge: any) => edge.showChildArrow)
        .map((edge: any) => edge.parentId + '/' + edge.childId)))].sort()
    const expected = ['blocked/fallback', 'newcomer/signin', 'session/workspace', 'signin/blocked']
    expect(arrows(board)).toEqual(expected)
    await note('fallback').click()
    await page.keyboard.press('F2')
    const field = page.locator('.sb-inline-editor')
    await field.fill('Offer an incident update')
    await field.press('Enter')
    await expect.poll(async () => (await getSlate(page, key)).nodes.find((n:any) => n.options.id === 'fallback')?.options.text).toBe('Offer an incident update')
    await page.reload()
    await expect(note('fallback')).toHaveAttribute('aria-label', 'Offer an incident update')
    expect(arrows(await getSlate(page,key))).toEqual(expected)
    await page.getByRole('button', { name: 'Present', exact: true }).click()
    const deck = page.getByRole('dialog', { name: 'Board presentation' })
    const indicator = deck.locator('footer [aria-live]')
    const stops = []
    for (let i = 1; i <= 6; i++) {
      await expect(indicator).toContainText(i + ' of 6')
      stops.push(await indicator.innerText())
      if (i < 6) await deck.getByRole('button', {name:'Next', exact:true}).click()
    }
    expect(stops.join(' ')).toContain('Offer an incident update')
    expect(stops.join(' ')).toContain('Open saved work')
    await deck.getByRole('button', {name:'Exit presentation'}).click()
    await expect(note('newcomer')).toBeVisible()
  } finally { await removeTestGuest(page, owner) }
})
