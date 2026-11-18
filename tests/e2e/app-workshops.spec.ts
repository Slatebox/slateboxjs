import {resumeArchivedDraft} from './workshop-archive.shared'
import { expectWorkshopSlide } from './workshop-slide.shared'
import { editObject } from './workshop-edit.shared'
import { test, expect } from '@playwright/test'

const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'

test('review a workshop, move a card, present and open a private editable slate', async ({ page, browser }) => {
  test.skip(process.env.SLATEBOX_APP_EXTERNAL !== 'true', 'Set the deployed app URL for the live contract')
  // This proof creates one guest-owned test slate. Production gets the read-only journey.
  const save = new URL(origin).hostname === 'test.slatebox.com' || new URL(origin).hostname === 'localhost' || new URL(origin).hostname === '127.0.0.1'
  await resumeArchivedDraft(page, origin, 'lanes')
  await expect(page.getByRole('heading', { name: /field trials/ })).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('meteor_token'))).toBeNull()
  await expect(page.locator('main textarea:visible, main input:visible')).toHaveCount(0)
  await page.getByRole('button', { name: 'Ask AI' }).click()
  await page.getByText('Draft a different board').click()
  if (process.env.SLATEBOX_SELFHOST === 'true') {
    await expect(page.getByText('Sign in to use AI when enabled by your administrator.')).toBeVisible()
  } else {
    await expect(page.getByRole('link', { name: /Explore plans/ })).toHaveAttribute('href', '/plans')
  }
  const workshop = page.locator('main.workshops')
  await expect(workshop).toHaveAttribute('data-mode', 'light')
  await page.getByRole('button', { name: 'Dark mode' }).click()
  await expect(workshop).toHaveAttribute('data-mode', 'dark')
  await expect(page.locator('.workshop-paper svg').first()).toBeVisible()
  await page.getByRole('button', { name: 'Light mode' }).click()
  await expect(workshop).toHaveAttribute('data-mode', 'light')
  const typography = await page.getByRole('heading', { level: 1 }).evaluate(async heading => {
    await document.fonts.ready
    const style = getComputedStyle(heading)
    return [style.fontFamily, style.fontWeight, style.fontStyle, document.fonts.check('700 16px "Archivo Narrow"')]
  })
  expect(typography).toEqual(['"Archivo Narrow", Arial, sans-serif', '700', 'normal', true])
  await editObject(page, 'title', () => page.getByLabel('Board title').fill('Review the winter shutdown pilots'))
  await page.getByText('Move a card by name').click()
  await page.getByRole('combobox', { name: 'Move Test bearing sensors on line four' }).selectOption('pilot')
  const second = page.getByRole('combobox', { name: 'Move Stage a spare drive at the north mill' })
  await expect(second.locator('option[value="pilot"]')).toHaveCount(0)
  await second.selectOption('evidence')
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Review the winter shutdown pilots' })).toBeVisible()
  await page.getByRole('button', { name: 'Present', exact: true }).click()
  await expectWorkshopSlide(page, 'Proposed trials', [], ['lane-proposed'])
  await expect(page.getByText('No cards in this lane.')).toBeVisible()
  const pilotCards = ['Test bearing sensors on line four', 'Rehearse the overnight restart']
  const pilotNodes = ['lane-pilot', 'card-sensors', 'card-training']
  await page.getByRole('button', { name: 'Next lane' }).click()
  await expectWorkshopSlide(page, 'Fund this quarter', pilotCards, pilotNodes)
  const viewport = page.viewportSize()!
  await page.setViewportSize({ width: 390, height: 760 })
  await expectWorkshopSlide(page, 'Fund this quarter', pilotCards, pilotNodes)
  for (let pass = 0; pass < 3; pass++) {
    await page.keyboard.press('ArrowRight')
    await expectWorkshopSlide(page, 'Gather evidence', ['Stage a spare drive at the north mill', 'Measure cooling losses at shift change'],
      ['lane-evidence', 'card-spares', 'card-cooling'])
    await page.keyboard.press('ArrowLeft')
    await expectWorkshopSlide(page, 'Fund this quarter', pilotCards, pilotNodes)
  }
  await page.setViewportSize(viewport)
  await expectWorkshopSlide(page, 'Fund this quarter', pilotCards, pilotNodes)
  await page.getByRole('button', { name: 'Back to board' }).click()
  if (!save) return

  await page.getByRole('button', { name: 'Open editable canvas' }).click()
  await expect(page).toHaveURL(/\/canvas\/[a-f0-9]{10}$/, { timeout: 45000 })
  const shareId = new URL(page.url()).pathname.split('/').pop()
  await expect(page.locator('g[data-node-id="card-sensors"]').first()).toBeVisible({ timeout: 45000 })
  await expect(page.locator('header').getByText('Private', { exact: true })).toBeVisible()
  await resumeArchivedDraft(page, origin, 'lanes')
  await page.getByRole('button', { name: 'Review the winter shutdown pilots' }).click()
  await expect(page.getByRole('button', { name: 'Present', exact: true })).toBeVisible()

  const visitor = await browser.newContext()
  try {
    const guest = await visitor.newPage()
    await resumeArchivedDraft(guest, origin, 'lanes')
    await expect(guest.getByRole('button', { name: 'Edit an object' })).toBeVisible()
    expect(await guest.evaluate(() => [(window as any).Meteor.userId(), localStorage.getItem('meteor_token')])).toEqual([null, null])
    const denials = await guest.evaluate(async id => {
      const meteor = (window as any).Meteor
      const code = async (name: string, arg: string) => {
        try { await meteor.callAsync(name, arg); return 'allowed' }
        catch (err: any) { return err.error }
      }
      const canvas = await meteor.callAsync('slates.get', { shareId: id })
      return [await code('workshops.restore', id!), await code('workshops.draft', 'Review our winter shutdown pilots'), Boolean(canvas?.slateBase)]
    }, shareId)
    expect(denials).toEqual(['unavailable', 'plan-required', false])
  } finally {
    await visitor.close()
  }
})
