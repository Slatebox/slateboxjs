import { expect, type Page } from '@playwright/test'

// The canvas header's slate menu (on the slate's name) and Present ▾ (see app-canvas-header.spec.ts).
export const slateMenuButton = (page: Page) => page.locator('.sb-board-toolbar').getByRole('button', { name: /slate menu$/ })

/** Open the slate menu on the slate's name and choose one of its items. */
export async function fromSlateMenu(page: Page, item: string) {
  await slateMenuButton(page).click()
  await page.getByRole('menu', { name: 'Slate' }).getByRole('menuitem', { name: item, exact: true }).click()
}

/** Start presenting to everyone on the slate: Present ▾, then "Present to everyone here". */
/** Present to everyone here, from the header: the presentation is being prepared. */
export async function startPresentingToEveryone(page: Page) {
  const options = page.getByRole('button', { name: 'Presentation options', exact: true })
  const present = page.locator('.sb-board-toolbar').getByRole('button', { name: 'Present', exact: true })
  if (await options.isVisible()) await options.click()
  else await present.click()
  const item = page.getByRole('menu', { name: 'Present' }).getByRole('menuitem', { name: /^Present to everyone here/ })
  await expect(item).toBeVisible()
  await item.click()
}

/** Present to everyone here, and wait until the presentation has started. */
export async function presentToEveryone(page: Page) {
  await startPresentingToEveryone(page)
  // The presentation starts once Slatebox has planned its deck (never longer than its time limit);
  // the presenter holds at the start until then.
  const lead = page.getByRole('dialog', { name: 'Live presentation', exact: true })
  await expect(lead).toBeVisible()
  await expect(lead.getByRole('progressbar', { name: 'Planning with Slatebox…', exact: true })).toHaveCount(0, { timeout: 25_000 })
}
