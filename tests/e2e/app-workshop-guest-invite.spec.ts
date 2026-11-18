import { expect, test, type Page } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const model: Workshop = {
  version: 1, title: 'First light rehearsal',
  lanes: [
    { id: 'bench', label: 'Lens bench', station: { column: 0, row: 0, next: ['star'], outcome: 'Lens mounted.' } },
    { id: 'star', label: 'Bright star', station: { column: 1, row: 0, next: [], outcome: 'Star in focus.' } },
  ],
  cards: [{ id: 'lens', label: 'Lens', laneId: 'bench' }],
}

const userId = (page: Page) => page.evaluate((): string | null => (window as any).Meteor?.userId() ?? null)
const getSlate = (page: Page, key: string) => page.evaluate(async key =>
  (await (window as any).Meteor.callAsync('slates.get', {shareId: key}))?.slateBase, key)

async function dismissWelcome(page: Page) {
  const ok = page.getByRole('dialog', { name: /welcome/i }).getByRole('button', { name: 'OK', exact: true })
  if (await ok.waitFor({ timeout: 4000 }).then(() => true, () => false)) await ok.click()
  const cookies = page.getByRole('button', { name: 'Accept cookies' })
  if (await cookies.isVisible()) await cookies.click()
}

async function shareAs(page: Page, permission: 'read' | 'edit') {
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

async function removeTestGuest(page: Page, expectedId: string | null) {
  if (!expectedId) return
  const removed = await page.evaluate(async id => {
    const meteor = (window as any).Meteor
    if (meteor.userId() !== id || meteor.user()?.isAnonymous !== true) return false
    return meteor.callAsync('users.delete')
  }, expectedId)
  expect(removed).toBe(true)
}

test('a first-time workshop visitor chooses whether to join an edit link and loses access when revoked', async ({ browser }) => {
  test.skip(!['localhost', '127.0.0.1', 'test.slatebox.com'].includes(origin.hostname), 'Creates disposable guest-owned slates on local or staging only')
  const ownerContext = await browser.newContext()
  const readerContext = await browser.newContext()
  const editorContext = await browser.newContext()
  const owner = await ownerContext.newPage()
  const reader = await readerContext.newPage()
  const editor = await editorContext.newPage()
  let ownerId: string | null = null
  let editorId: string | null = null
  try {
    await owner.goto(new URL('/new/workshop' + encodeWorkshopFragment(model), origin).href)
    await owner.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await expect.poll(() => userId(owner)).toBeTruthy()
    ownerId = await userId(owner)
    await dismissWelcome(owner)
    await expect(owner.getByRole('button', { name: 'Lens → Bright star' })).toBeEnabled()
    expect(ownerId).toBeTruthy()
    const key = new URL(owner.url()).pathname.split('/').pop()!
    const original = await getSlate(owner, key)
    expect(original.userId).toBe(ownerId)
    expect(original.options.isPrivate).toBe(true)
    expect(original.creative.model.workshop).toEqual(model)
    if (process.env.SLATEBOX_EXPECTED_APP_BUNDLE) {
      const hash = process.env.SLATEBOX_EXPECTED_APP_BUNDLE
      expect(hash).toMatch(/^[a-f0-9]{40}$/)
      const loaded = owner.locator(`script[src*="/${hash}.js"]`)
      await expect(loaded).toHaveCount(1)
      const bundle = await owner.request.get(new URL((await loaded.getAttribute('src'))!, origin).href)
      expect(bundle.ok()).toBe(true)
      expect(await bundle.text()).toContain('Join to edit')
    }

    const readLink = await shareAs(owner, 'read')
    await reader.goto(readLink.href)
    await dismissWelcome(reader)
    await expect(reader.getByRole('heading', { name: model.title })).toBeVisible()
    await expect(reader.getByRole('button', { name: 'Lens → Bright star' })).toBeDisabled()
    await expect(reader.getByRole('button', { name: 'Join to edit' })).toHaveCount(0)
    expect(await userId(reader)).toBeNull()
    expect((await getSlate(owner, key)).creative.model.workshop).toEqual(model)

    const editLink = await shareAs(owner, 'edit')
    await editor.goto(editLink.href)
    await dismissWelcome(editor)
    await expect(editor.getByRole('heading', { name: model.title })).toBeVisible()
    const join = editor.getByRole('button', { name: 'Join to edit', exact: true })
    await expect(join).toBeEnabled()
    expect(await userId(editor)).toBeNull()
    const move = editor.getByRole('button', { name: 'Lens → Bright star', exact: true })
    await expect(move).toBeDisabled()
    await join.click()
    await expect.poll(() => userId(editor)).toBeTruthy()
    editorId = await userId(editor)
    await expect(move).toBeEnabled()
    expect(editorId).not.toBe(ownerId)
    expect(new URL(editor.url()).pathname).toBe(editLink.pathname)
    await move.click()

    const location = 'Lens · Bright star'
    await expect(owner.getByText(location, { exact: true })).toBeVisible()
    const expected = { ...model, cards: [{ ...model.cards[0], laneId: 'star' }] }
    await expect.poll(async () => (await getSlate(owner, key)).creative.model.workshop).toEqual(expected)
    await editor.reload()
    await dismissWelcome(editor)
    await expect(editor.getByText(location, { exact: true })).toBeVisible()
    expect(await userId(editor)).toBe(editorId)

    await owner.getByRole('button', { name: 'Share', exact: true }).click()
    const dialog = owner.getByRole('dialog', { name: /sharing settings/i })
    await dialog.getByRole('button', { name: /^Private/ }).click()
    await dialog.getByRole('button', { name: 'Save', exact: true }).click()
    await expect.poll(async () => (await getSlate(owner, key)).options.isPrivate).toBe(true)
    await expect(editor.getByRole('heading', { name: model.title })).toHaveCount(0)
    const accessKey = editLink.pathname.split('/').pop()!
    expect(await getSlate(editor, accessKey)).toBeFalsy()
    await editor.reload()
    await expect.poll(() => userId(editor)).toBe(editorId)
    await expect(editor.getByRole('heading', { name: model.title })).toHaveCount(0)
    await expect(editor.getByRole('button', { name: 'Join to edit' })).toHaveCount(0)
    expect(await getSlate(editor, accessKey)).toBeFalsy()
    expect((await getSlate(owner, key)).creative.model.workshop).toEqual(expected)
  } finally {
    try {
      await Promise.all([removeTestGuest(owner, ownerId), removeTestGuest(editor, editorId)])
    } finally {
      await Promise.all([ownerContext.close(), readerContext.close(), editorContext.close()])
    }
  }
})
