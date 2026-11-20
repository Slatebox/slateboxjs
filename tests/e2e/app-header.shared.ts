import { expect, type Page } from '@playwright/test'

// The canvas header's slate menu (on the slate's name) and Present ▾ (see app-canvas-header.spec.ts).
export const slateMenuButton = (page: Page) => page.locator('.sb-board-toolbar').getByRole('button', { name: /slate menu$/ })

/** Open the slate menu on the slate's name and choose one of its items. */
export async function fromSlateMenu(page: Page, item: string) {
  await slateMenuButton(page).click()
  await page.getByRole('menu', { name: 'Slate' }).getByRole('menuitem', { name: item, exact: true }).click()
}

/** Start presenting to everyone on the slate: Present ▾, then "Present to everyone here". */
export async function presentToEveryone(page: Page) {
  const options = page.getByRole('button', { name: 'Presentation options', exact: true })
  const present = page.locator('.sb-board-toolbar').getByRole('button', { name: 'Present', exact: true })
  if (await options.isVisible()) await options.click()
  else await present.click()
  const item = page.getByRole('menu', { name: 'Present' }).getByRole('menuitem', { name: /^Present to everyone here/ })
  await expect(item).toBeVisible()
  await item.click()
}
