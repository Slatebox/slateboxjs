import { expect, test } from '@playwright/test'

function luminance(rgb: string) {
  const channels = rgb.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(value => {
    const channel = value / 255
    return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4
  })
  return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2]
}

test('a visitor can compare monthly and annual Pro prices using the keyboard', async ({ page }) => {
  await page.goto('/plans')
  const periods = page.getByRole('group', { name: 'Slatebox Pricing Period' })
  const annual = periods.getByRole('button', { name: 'Annually, save 25%' })
  const monthly = periods.getByRole('button', { name: 'Monthly', exact: true })
  const pro = page.locator('.MuiCard-root').filter({
    has: page.locator('.MuiCardHeader-title').filter({ hasText: /pro/i }),
  })

  await expect(annual).toHaveAttribute('aria-pressed', 'true')
  await monthly.focus()
  await page.keyboard.press('Space')
  await expect(monthly).toHaveAttribute('aria-pressed', 'true')
  await expect(pro.getByRole('heading', { name: '$8', exact: true })).toBeVisible()
  await expect(pro.getByText('($72/yr)')).toHaveCount(0)

  await annual.focus()
  await page.keyboard.press('Enter')
  await expect(annual).toHaveAttribute('aria-pressed', 'true')
  await expect(monthly).toHaveAttribute('aria-pressed', 'false')
  await expect(pro.getByRole('heading', { name: '$6', exact: true })).toBeVisible()
  await expect(pro.getByText('($72/yr)')).toBeVisible()
})

for (const scheme of ['light', 'dark']) {
  test(`pricing headers and plan details have readable contrast in ${scheme} mode`, async ({ page }) => {
    await page.addInitScript(mode => localStorage.setItem('mui-mode', mode), scheme)
    await page.goto('/plans')
    const headers = page.locator('.MuiCardHeader-root')
    await expect(headers).toHaveCount(3)
    const colors = await headers.evaluateAll(elements => elements.flatMap(header => {
      const bg = getComputedStyle(header).backgroundColor
      return [...header.querySelectorAll('.MuiCardHeader-title, .MuiCardHeader-subheader, svg')].map(label => ({
        bg, fg: getComputedStyle(label).color, text: label.textContent || 'plan icon',
      }))
    }))
    expect(colors.length).toBeGreaterThan(3)
    expect(luminance(colors[0].bg) > .5).toBe(scheme === 'dark')
    for (const {bg, fg, text} of colors) {
      const [dim, bright] = [luminance(bg), luminance(fg)].sort((a,b) => a - b)
      expect((bright + .05) / (dim + .05), text).toBeGreaterThanOrEqual(4.5)
    }
  })
}
