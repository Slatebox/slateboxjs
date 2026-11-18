import { expect, test } from '@playwright/test'
import { dismissWelcome, getSlate, removeTestGuest, userId } from './workshop-guests.shared'

const app = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const marketing = process.env.SLATEBOX_MARKETING_URL

test('a sales engineer can correct the retention policy on the showcased board and present the saved change', async ({ page }) => {
  test.skip(!['127.0.0.1', 'localhost', 'test.slatebox.com'].includes(app.hostname), 'Creates a private test slate')
  let owner: string | null = null
  try {
    if (marketing) {
      await page.goto(new URL('/product/presentations/', marketing).href)
      const copy = page.getByRole('link', { name: 'Open a private copy' })
      const href = await copy.getAttribute('href')
      expect(href).toBe('https://app.slatebox.com/new/customer-file')
      await page.route(href!, route => route.fulfill({ status: 302, headers: { location: new URL('/new/customer-file', app).href } }), { times: 1 })
      await copy.click()
    } else {
      await page.goto(new URL('/new/customer-file', app).href)
    }
    await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    owner = await userId(page)
    expect(owner).toBeTruthy()
    const key = new URL(page.url()).pathname.split('/').pop()!
    await dismissWelcome(page)
    const note = page.locator('#slateCanvas g[data-node-id="retained-records"]').first()
    await expect(note).toHaveAttribute('aria-label', /Delete the original CSV/)
    const board = await getSlate(page, key)
    expect(board.options.isPrivate).toBe(true)
    expect(board.creative).toBeUndefined()
    expect(board.nodes.map((node: any) => node.options.id)).toEqual(['customer-upload', 'import-worker', 'retained-records'])
    await note.click()
    await page.keyboard.press('F2')
    const field = page.locator('.sb-inline-editor[contenteditable="true"]')
    const correction = 'Keep the receipt for 30 days'
    await field.fill(correction)
    await field.press('Enter')
    await expect.poll(async () => (await getSlate(page, key)).nodes.find((node: any) => node.options.id === 'retained-records')?.options.text).toBe(correction)
    await page.reload()
    await expect(note).toHaveAttribute('aria-label', correction)
    await page.getByRole('button', { name: 'Present', exact: true }).click()
    const deck = page.getByRole('dialog', { name: 'Board presentation' })
    const current = deck.locator('footer [aria-live]')
    await expect(current).toContainText('Customer upload')
    await deck.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(current).toContainText('Import worker')
    await deck.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(current).toContainText(correction)
    await deck.getByRole('button', { name: 'Exit presentation' }).click()
    await expect(note).toBeVisible()
  } finally {
    await removeTestGuest(page, owner)
  }
})
