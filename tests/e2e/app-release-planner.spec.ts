import {resumeArchivedDraft} from './workshop-archive.shared'
import { editObject } from './workshop-edit.shared'
import { releasePlan } from '../../src/workshops/release'
import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

const base = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
const canSave = ['localhost', '127.0.0.1', 'test.slatebox.com'].includes(new URL(base).hostname)

async function openExistingDraft(page: Page) {
  await resumeArchivedDraft(page,base,'release-plan')
  await expect(page.getByRole('heading', {level:1})).toHaveText(releasePlan.title)
}

test('review a release plan, preview a dependent move, undo it and present the committed budget', async ({ page }) => {
  test.skip(process.env.SLATEBOX_APP_EXTERNAL !== 'true', 'Requires the actual app')
  await page.goto(base + '/start')
  await expect(page.getByRole('link', { name: 'Plan a release' })).toHaveCount(0)
  await openExistingDraft(page)
  await editObject(page, 'title', () => page.getByLabel('Board title').fill('Review the Friday build'))
  await editObject(page, 'lane:friday', () => page.getByRole('spinbutton', {name:'Point budget', exact:true}).fill('9'))
  await editObject(page, 'card:billing', () => page.getByLabel('Points', {exact:true}).fill('4'))
  await page.getByText('More board options').click()
  await page.getByRole('button', { name: 'Edit plan JSON' }).click()
  const source = JSON.parse(await page.getByLabel('Plan JSON').inputValue())
  expect(source.cards.find((card: {id: string}) => card.id === 'invite').dependsOn).toEqual(['guardrails'])
  await page.getByRole('button', { name: 'Cancel JSON edit' }).click()
  const capacity = page.getByLabel('Friday release capacity')
  await expect(capacity).toHaveText('4 / 9 points')
  await page.getByRole('combobox', { name: 'Feature', exact: true }).selectOption('invite')
  await page.getByRole('button', { name: 'Preview Friday release' }).click()
  await expect(capacity).toHaveText('9 / 9 points')
  await expect(page.getByRole('region', { name: 'Feature dependencies' })).toContainText('Permission checks · Friday release')
  await page.getByRole('button', { name: 'Cancel preview' }).click()
  await expect(capacity).toHaveText('4 / 9 points')
  await page.getByRole('button', { name: 'Preview Friday release' }).click()
  await page.getByRole('button', { name: 'Apply move' }).click()
  await page.getByRole('button', { name: 'Undo move' }).click()
  await expect(capacity).toHaveText('4 / 9 points')
  await page.getByRole('button', { name: 'Preview Friday release' }).click()
  await page.getByRole('button', { name: 'Apply move' }).click()
  await page.reload()
  await expect(capacity).toHaveText('9 / 9 points')
  await page.getByRole('button', { name: 'Present', exact: true }).click()
  const presentation = page.getByRole('region', { name: 'Decision presentation' })
  await expect(presentation.locator('svg [data-node-id="card-invite"]').first()).toBeAttached()
  await expect(presentation.getByText('9 points assigned of 9 available.')).toBeVisible()
  await expect(presentation.getByRole('listitem').filter({ hasText: 'Team invitations' })).toContainText('Requires Permission checks')
  await presentation.getByRole('button', { name: 'Back to board' }).click()
  if (!canSave) return
  await page.getByRole('button', { name: 'Open editable canvas' }).click()
  await expect(page.locator('[data-node-id="card-guardrails"]').first()).toBeVisible()
  await expect(page.getByText('Private', { exact: true }).first()).toBeVisible()
})

test('share a release plan, observe committed moves, and undo as the participant who moved', async ({ browser }) => {
  test.skip(!canSave || process.env.SLATEBOX_APP_EXTERNAL !== 'true' || !process.env.SLATEBOX_EDITOR_A || !process.env.SLATEBOX_EDITOR_B,
    'Requires two synthetic test team accounts')
  const a = await browser.newContext({ storageState: process.env.SLATEBOX_EDITOR_A })
  const b = await browser.newContext({ storageState: process.env.SLATEBOX_EDITOR_B })
  try {
    const owner = await a.newPage(), peer = await b.newPage()
    await resumeArchivedDraft(peer, base, 'lanes')
    await peer.waitForFunction(() => (window as any).Meteor?.user()?.emails?.[0]?.address)
    const email = await peer.evaluate(() => (window as any).Meteor.user().emails[0].address)
    await resumeArchivedDraft(owner, base, 'lanes')
    await owner.waitForFunction(() => (window as any).Meteor?.user()?.emails?.[0]?.address)
    await openExistingDraft(owner)
    await owner.getByRole('button', { name: 'Share live workshop' }).click()
    await owner.getByText('Team access', {exact:true}).click()
    await owner.getByLabel('Team member email').fill(email)
    await owner.getByLabel('Access level').selectOption('EDIT')
    await owner.getByRole('button', { name: 'Save access' }).click()
    await expect(owner.getByRole('status').filter({ hasText: 'Team access updated.' })).toBeVisible()
    await peer.goto(owner.url())
    await peer.getByRole('combobox', { name: 'Feature', exact: true }).selectOption('invite')
    await peer.getByRole('button', { name: 'Preview Friday release' }).click()
    await expect(peer.getByLabel('Friday release capacity')).toHaveText('8 / 8 points')
    await expect(owner.getByLabel('Friday release capacity')).toHaveText('3 / 8 points')
    await peer.getByRole('button', { name: 'Apply move' }).click()
    await expect(owner.getByLabel('Friday release capacity')).toHaveText('8 / 8 points')
    await expect(owner.getByRole('button', { name: 'Undo move' })).toBeDisabled()
    await peer.reload()
    await peer.getByRole('button', { name: 'Undo move' }).click()
    await expect(owner.getByLabel('Friday release capacity')).toHaveText('3 / 8 points')
    await expect(owner.getByRole('region', { name: 'Feature dependencies' })).toContainText('Permission checks · Next week')
    await expect(owner.locator('[data-revision]')).toHaveAttribute('data-revision', '2')
  } finally { await a.close(); await b.close() }
})
