import { test, expect } from '@playwright/test'

const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'

test('review a workshop, move a card, present and open a private editable slate', async ({ page, browser }) => {
  test.skip(process.env.SLATEBOX_APP_EXTERNAL !== 'true', 'Set the deployed app URL for the live contract')
  // This proof creates one guest-owned test slate. Production gets the read-only journey.
  const save = new URL(origin).hostname === 'test.slatebox.com' || new URL(origin).hostname === 'localhost'
  await page.goto(origin + '/workshops')
  await expect(page.getByRole('heading', { name: 'Build a workshop around a decision.' })).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('meteor_token'))).toBeNull()
  await expect(page.getByRole('link', { name: /Explore Pro/ })).toHaveAttribute('href', '/plans')
  await page.getByLabel('Workshop title').fill('Review the winter shutdown pilots')
  await page.getByRole('button', { name: 'Start workshop' }).click()
  await page.getByText('Move a card by name').click()
  await page.getByRole('combobox', { name: 'Move Test bearing sensors on line four' }).selectOption('pilot')
  const second = page.getByRole('combobox', { name: 'Move Stage a spare drive at the north mill' })
  await expect(second.locator('option[value="pilot"]')).toHaveCount(0)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Review the winter shutdown pilots' })).toBeVisible()
  await page.getByRole('button', { name: 'Present decisions' }).click()
  await page.getByRole('button', { name: 'Next lane' }).click()
  await expect(page.getByRole('heading', { name: 'Fund this quarter' })).toBeVisible()
  await expect(page.getByRole('listitem').filter({ hasText: 'Test bearing sensors on line four' })).toBeVisible()
  await page.getByRole('button', { name: 'Back to board' }).click()
  if (!save) return

  await page.getByRole('button', { name: 'Open editable canvas' }).click()
  await expect(page).toHaveURL(/\/canvas\/[a-f0-9]{10}$/, { timeout: 45000 })
  const shareId = new URL(page.url()).pathname.split('/').pop()
  await expect(page.locator('g[data-node-id="card-sensors"]').first()).toBeVisible({ timeout: 45000 })
  await page.goto(origin + '/workshops')
  await page.getByRole('button', { name: 'Review the winter shutdown pilots' }).click()
  await expect(page.getByRole('button', { name: 'Present decisions' })).toBeVisible()

  const visitor = await browser.newContext()
  try {
    const guest = await visitor.newPage()
    await guest.goto(origin + '/workshops')
    await expect(guest.getByRole('button', { name: 'Start workshop' })).toBeVisible()
    const denials = await guest.evaluate(async id => {
      const meteor = (window as any).Meteor
      const code = async (name: string, arg: string) => {
        try { await meteor.callAsync(name, arg); return 'allowed' }
        catch (err: any) { return err.error }
      }
      return [await code('workshops.restore', id!), await code('workshops.draft', 'Review our winter shutdown pilots')]
    }, shareId)
    expect(denials).toEqual(['unavailable', 'plan-required'])
  } finally {
    await visitor.close()
  }
})
