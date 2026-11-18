import { expect, test } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, removeTestGuest, userId } from './workshop-guests.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const model: Workshop = {
  version: 1, title: 'Harbor acoustics',
  lanes: [
    { id: 'shore', label: 'On shore', station: { column: 0, row: 0, next: ['pier'], outcome: 'Launch the microphone.' } },
    { id: 'pier', label: 'At the pier', station: { column: 1, row: 0, next: ['shore'], outcome: 'Record the tide.' } },
  ],
  cards: [{ id: 'mic', label: 'Microphone', laneId: 'shore' }],
}

test('a private owner previews roles, copies a working invitation, and revokes it after an editor returns', async ({browser, browserName}) => {
  test.skip(browserName !== 'chromium' || !['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname),
    'Exercises the real Chromium clipboard on a disposable local or staging slate')
  const ownerContext = await browser.newContext({ permissions: ['clipboard-read','clipboard-write'] })
  const editorContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const readerContext = await browser.newContext()
  const [owner, editor, reader] = await Promise.all([ownerContext, editorContext, readerContext].map(context => context.newPage()))
  let ownerId: string | null = null, editorId: string | null = null, slateId: string | null = null
  try {
    await owner.goto(new URL('/new/workshop' + encodeWorkshopFragment(model), origin).href)
    await owner.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await dismissWelcome(owner)
    const release = process.env.SLATEBOX_EXPECTED_APP_BUNDLE
    if (release) {
      expect(release).toMatch(/^[a-f0-9]{40}$/)
      const script = owner.locator(`script[src*="/${release}.js"]`)
      await expect(script).toHaveCount(1)
      const response = await owner.request.get(new URL((await script.getAttribute('src'))!, origin).href)
      expect(response.ok()).toBe(true)
      expect(await response.text()).toContain('Create edit link')
    }
    const key = new URL(owner.url()).pathname.split('/').pop()!
    const source = await getSlate(owner, key)
    ownerId = await userId(owner)
    expect(source.userId).toBe(ownerId)
    slateId = source._id
    expect(source.options.isPrivate).toBe(true)

    const share = owner.getByRole('button', {name:'Share', exact:true})
    const dialog = owner.getByRole('dialog', {name:'Share this slate'})
    const done = dialog.getByRole('button', {name:'Done', exact:true})
    const unlisted = dialog.getByRole('button', {name:/^Unlisted/})
    const panel = dialog.getByRole('region', {name:/Unlisted/})
    const copy = panel.getByRole('button', {name:'Copy link', exact:true})
    const copyUrl = async () => {
      await owner.bringToFront()
      await owner.evaluate(() => navigator.clipboard.writeText('clipboard before invitation'))
      await copy.click()
      await expect.poll(() => owner.evaluate(() => navigator.clipboard.readText())).toMatch(/^https?:\/\//)
      const link = new URL(await owner.evaluate(() => navigator.clipboard.readText()))
      expect(link.origin).toBe(origin.origin)
      expect(link.pathname).toMatch(/^\/canvas\/[a-zA-Z0-9]{8}$/)
      return link
    }

    await share.click()
    await unlisted.click()
    await panel.getByRole('combobox', {name:'Link permission'}).click()
    await owner.getByRole('option', {name:'edit', exact:true}).click()
    await dialog.getByRole('button', {name:/^Public/}).click()
    await done.click()
    const untouched = await getSlate(owner, key)
    expect(untouched.options).toMatchObject({isPrivate:true, isPublic:false, isUnlisted:false})
    expect(untouched.sharingRevision).toBe(source.sharingRevision)
    await share.click()
    await dialog.getByRole('button', {name:'Create edit link', exact:true}).click()
    await expect(copy).toBeEnabled()
    const invite = await copyUrl()
    await done.click()
    await editor.goto(invite.href)
    await expect(editor.getByRole('button', {name:'Join to edit'})).toBeVisible()
    expect(await userId(editor)).toBeNull()
    await dismissWelcome(editor)
    await editor.getByRole('button', {name:'Join to edit'}).click()
    await expect.poll(() => userId(editor)).toBeTruthy()
    editorId = await userId(editor)
    expect(editorId).not.toBe(ownerId)
    await editor.getByRole('button', {name:'Microphone → At the pier'}).click()
    await expect(owner.getByText('Microphone · At the pier', {exact:true})).toBeVisible()
    await editor.goto(origin.href)
    const recent = editor.getByRole('region', {name:'Recently joined'}).getByRole('link', {name:model.title})
    await expect(recent).toHaveAttribute('href', invite.pathname)
    await recent.click()
    await expect(editor.getByText('Microphone · At the pier', {exact:true})).toBeVisible()

    await share.click()
    if (await unlisted.getAttribute('aria-expanded') !== 'true') await unlisted.click()
    await panel.getByRole('combobox', {name:'Link permission'}).click()
    await owner.getByRole('option', {name:'read', exact:true}).click()
    await expect(copy).toHaveCount(0)
    await expect(editor.getByRole('button', {name:'Microphone → On shore'})).toBeEnabled()
    await panel.getByRole('button', {name:'Apply access', exact:true}).click()
    const viewing = await copyUrl()
    expect(viewing.href).toBe(invite.href)
    await done.click()
    await reader.goto(viewing.href)
    await dismissWelcome(reader)
    await expect(reader.getByText('Microphone · At the pier', {exact:true})).toBeVisible()
    const returnCard = reader.getByRole('button', {name:'Microphone → On shore'})
    await expect(returnCard).toBeDisabled()
    await expect(reader.getByRole('button', {name:'Join to edit'})).toHaveCount(0)
    expect(await userId(reader)).toBeNull()
    await expect(editor.getByRole('button', {name:'Microphone → On shore'})).toBeDisabled()
    await editor.goto(origin.href)
    await expect(recent).toBeVisible()
    await share.click()
    await dialog.getByRole('button', {name:/^Private/}).click()
    await dialog.getByRole('button', {name:'Make private', exact:true}).click()
    await dialog.getByRole('button', {name:'Done', exact:true}).click()
    await expect(recent).toHaveCount(0)
    await reader.reload()
    await expect(reader.getByText('This slate is not accessible.', {exact:true})).toBeVisible()
    const restored = await getSlate(owner, key)
    expect(restored.options.isPrivate).toBe(true)
    expect(restored.creative.model.workshop.cards[0].laneId).toBe('pier')
  } finally {
    try {
      if (slateId && ownerId && await userId(owner) === ownerId) {
        await owner.goto(new URL('/plans',origin).href)
        await expect.poll(() => userId(owner)).toBe(ownerId)
        await owner.evaluate(id => (window as any).Meteor.callAsync('slates.remove', {slateIds:[id]}), slateId)
      }
    } finally {
      try { await Promise.all([removeTestGuest(owner,ownerId),removeTestGuest(editor,editorId)]) }
      finally { await Promise.all([ownerContext.close(),editorContext.close(),readerContext.close()]) }
    }
  }
})
