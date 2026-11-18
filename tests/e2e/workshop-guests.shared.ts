import { expect, type Page } from '@playwright/test'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')

export const userId = (page: Page) => page.evaluate((): string | null => (window as any).Meteor?.userId() ?? null)
export const getSlate = (page: Page, key: string) => page.evaluate(async key =>
  (await (window as any).Meteor.callAsync('slates.get', {shareId: key}))?.slateBase, key)

export async function dismissWelcome(page: Page) {
  const ok = page.getByRole('dialog', { name: /welcome/i }).getByRole('button', { name: 'OK', exact: true })
  if (await ok.waitFor({ timeout: 4000 }).then(() => true, () => false)) await ok.click()
  const cookies = page.getByRole('button', { name: 'Accept cookies' })
  if (await cookies.isVisible()) await cookies.click()
}

export async function shareAs(page: Page, permission: 'read' | 'edit') {
  await page.getByRole('button', { name: 'Share', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: /sharing settings/i })
  const unlisted = dialog.getByRole('button', { name: /^Unlisted/ })
  if (await unlisted.getAttribute('aria-expanded') !== 'true') await unlisted.click()
  const region = dialog.getByRole('region', { name: /Unlisted/ })
  await region.getByRole('combobox').click()
  await page.getByRole('option', { name: permission, exact: true }).click()
  const link = region.getByText(/^https?:\/\//)
  await expect(link).toBeVisible()
  const url = new URL(await link.innerText())
  expect(url.origin).toBe(origin.origin)
  await dialog.getByRole('button', { name: 'Save', exact: true }).click()
  return url
}

export async function removeTestGuest(page: Page, expectedId: string | null) {
  if (!expectedId) return
  const removed = await page.evaluate(async id => {
    const meteor = (window as any).Meteor
    if (meteor.userId() !== id || meteor.user()?.isAnonymous !== true) return false
    return meteor.callAsync('users.delete')
  }, expectedId)
  expect(removed).toBe(true)
}
