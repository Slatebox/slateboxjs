import { expect, type Page } from '@playwright/test'

export async function editObject(page: Page, value: string, change: () => Promise<void>) {
  await page.getByRole('button', { name: 'Edit an object' }).click()
  await page.getByLabel('Object', { exact: true }).selectOption(value)
  await change()
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.locator('.workshop-inspector')).toHaveCount(0)
}
