import { createServer } from 'node:http'
import { once } from 'node:events'
import { randomUUID } from 'node:crypto'
import { expect, test, type Page } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, removeTestGuest, userId } from './workshop-guests.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.use({ actionTimeout: 20_000, navigationTimeout: 45_000 })

const plan: Workshop = {
  version: 1, title: 'Plan a listening walk',
  lanes: [{ id: 'studio', label: 'In the studio' }, { id: 'walk', label: 'On the walk' }],
  cards: [{ id: 'birdsong', label: 'Dawn birdsong', laneId: 'studio' }],
}

test('a reader keeps an independent workshop from a handbook and reopens it on another device', async ({ browser }) => {
  test.skip(!['localhost', '127.0.0.1', 'test.slatebox.com'].includes(origin.hostname), 'Uses isolated test accounts and a disposable unlisted publication')
  const presenter = await browser.newContext()
  const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true })
  const laptop = await browser.newContext()
  const owner = await presenter.newPage()
  const reader = await phone.newPage()
  const returning = await laptop.newPage()
  const email = 'listening-walk-' + randomUUID() + '@slatebox.invalid'
  const password = randomUUID()
  const handbook = createServer((_req, res) => {
    res.setHeader('content-type', 'text/html')
    res.end('<main><h1>Field recording guide</h1><iframe title="Listening walk" width="340" height="420"></iframe></main>')
  })
  let ownerId: string | null = null
  let copyOwner: string | null = null
  let copyPage: Page | undefined
  try {
    await owner.goto(new URL('/new/workshop' + encodeWorkshopFragment(plan), origin).href)
    await owner.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    ownerId = await userId(owner)
    expect(ownerId).toBeTruthy()
    await dismissWelcome(owner)
    const sourceKey = new URL(owner.url()).pathname.split('/').pop()!
    await owner.getByRole('button', { name: 'Publish presentation', exact: true }).click()
    const publication = owner.getByRole('dialog', { name: 'Publish presentation' })
    await expect(publication.getByRole('radio', { name: 'Anyone with the link' })).toBeChecked()
    await publication.getByRole('checkbox', { name: 'Let viewers open their own copy' }).check()
    await publication.getByRole('button', { name: 'Publish', exact: true }).click()
    const url = await publication.getByRole('link', { name: 'Open published presentation' }).getAttribute('href')
    expect(new URL(url!).origin).toBe(origin.origin)

    // A separate origin models a team handbook. The framed player and app both come from the deployment.
    handbook.listen(0, '127.0.0.1')
    await once(handbook, 'listening')
    const address = handbook.address()
    if (!address || typeof address === 'string') throw new Error('Handbook has no HTTP address')
    await reader.goto('http://127.0.0.1:' + address.port + '/field-guide')
    await reader.locator('iframe').evaluate((frame, src) => { frame.src = src }, url!)
    const openCopy = reader.frameLocator('iframe').getByRole('link', { name: 'Open my own copy' })
    await expect(openCopy).toBeVisible({ timeout: 20_000 })
    const [popup] = await Promise.all([phone.waitForEvent('page', { timeout: 20_000 }), openCopy.click()])
    copyPage = popup
    await copyPage.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await dismissWelcome(copyPage)
    const copyUrl = copyPage.url()
    const key = new URL(copyUrl).pathname.split('/').pop()!
    expect(key).not.toBe(sourceKey)
    copyOwner = await userId(copyPage)
    expect(copyOwner).toBeTruthy()
    expect(copyOwner).not.toBe(ownerId)
    expect((await getSlate(copyPage, key)).options.isPrivate).toBe(true)

    await copyPage.getByText('Move a card by name', { exact: true }).click()
    await copyPage.getByRole('combobox', { name: 'Move Dawn birdsong' }).selectOption('walk')
    await expect.poll(async () => (await getSlate(copyPage!, key)).creative.model.workshop.cards[0].laneId).toBe('walk')
    expect((await getSlate(owner, sourceKey)).creative.model.workshop.cards[0].laneId).toBe('studio')
    await publication.getByRole('button', { name: 'Withdraw presentation' }).click()
    await expect(publication.getByRole('status')).toContainText('withdrawn')

    await copyPage.goto(new URL('/profile', origin).href)
    await copyPage.getByRole('button', { name: 'Save My Slatebox' }).click()
    const account = copyPage.getByRole('dialog', { name: 'Save your work' })
    await account.getByLabel('Email address').fill(email)
    await account.getByLabel(/^Password/i).fill(password)
    await account.getByRole('button', { name: 'Save my Slatebox' }).click()
    await expect.poll(() => copyPage!.evaluate(() => (window as any).Meteor.user()?.emails?.[0]?.address)).toBe(email)

    await returning.goto(new URL('/login', origin).href)
    await returning.getByLabel('Email Address').fill(email)
    await returning.getByLabel(/^Password/i).fill(password)
    await returning.getByRole('button', { name: /^Sign In\s*→/ }).click()
    await expect.poll(() => userId(returning)).toBe(copyOwner)
    await returning.goto(copyUrl)
    await expect(returning.getByRole('heading', { name: plan.title })).toBeVisible()
    const reopened = await getSlate(returning, key)
    expect(reopened.userId).toBe(copyOwner)
    expect(reopened.creative.model.workshop.cards[0].laneId).toBe('walk')
    expect(await getSlate(returning, sourceKey)).toBeFalsy()
    await returning.goto(url!)
    await expect(returning.getByRole('heading', { name: 'Presentation unavailable' })).toBeVisible()
  } finally {
    handbook.close()
    try {
      if (copyOwner && copyPage) {
        const removed = await copyPage.evaluate(async ({ id, address }) => {
          const m = (window as any).Meteor
          const me = m.user()
          if (me?._id !== id || !(me.isAnonymous || me.emails?.[0]?.address === address)) return false
          return m.callAsync('users.delete')
        }, { id: copyOwner, address: email })
        expect(removed).toBe(true)
      }
    } finally {
      try { await removeTestGuest(owner, ownerId) }
      finally { await Promise.all([presenter.close(), phone.close(), laptop.close()]) }
    }
  }
})
