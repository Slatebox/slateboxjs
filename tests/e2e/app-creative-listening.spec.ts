import { expect, test, type Page } from '@playwright/test'
import { randomBytes } from 'node:crypto'

const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
const local = ['localhost', '127.0.0.1'].includes(new URL(origin).hostname)

test('an owned listening slate persists a gesture and label and presents the shared version', async ({ page, context, browser }) => {
  test.skip(!local, 'Creates and shares a synthetic local board')
  await page.goto(origin + '/plans')
  await page.waitForFunction(() => (window as any).Accounts && (window as any).Meteor.status().connected)
  const credentials = { email: 'mix-' + randomBytes(12).toString('hex') + '@slatebox.invalid', password: randomBytes(24).toString('hex') }
  await page.evaluate(values => new Promise<void>((ok, fail) => (window as any).Accounts.createUser(values, (err: Error) => err ? fail(err) : ok())), credentials)
  const other = await browser.newContext()
  const reader = await other.newPage()
  const call = (tab: Page, method: string, ...args: any[]) =>
    tab.evaluate(async ([name, values]) => {
      try { return await (window as any).Meteor.callAsync(name, ...values) }
      catch (error: any) { throw new Error(error.reason || error.message) }
    }, [method, args] as [string, any[]])
  try {
    await page.goto(origin + '/new/listening-room?mix=0.78')
    await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    const url = page.url(), key = url.split('/').pop()!
    const horn = page.getByRole('slider', { name: 'Listening horn' })
    await expect(horn).toHaveAttribute('aria-valuenow', '78')
    const cookie = page.getByRole('button', { name: 'Accept cookies' })
    if (await cookie.isVisible()) await cookie.click()
    const welcome = page.getByRole('dialog', { name: /welcome/i })
    if (await welcome.isVisible()) await welcome.getByRole('button', { name: 'OK' }).click()
    const before = (await call(page, 'slates.get', { shareId: key })).slateBase
    expect(before.options.isPrivate).toBe(true)
    expect(before.creative.model.mix).toBe(.78)
    const nonce = randomBytes(12).toString('hex').slice(0,17)
    const duplicate = await Promise.all([call(page,'creativeSlates.create','listening-room','?mix=2',nonce), call(page,'creativeSlates.create','listening-room','?mix=2',nonce)])
    expect(duplicate[0]).toBe(duplicate[1])
    expect((await call(page,'slates.get',{shareId:duplicate[0]})).slateBase.creative.model.mix).toBe(.15)

    const peer = await context.newPage()
    await peer.goto(url)
    await expect(peer.getByRole('slider')).toHaveAttribute('aria-valuenow', '78', { timeout: 12000 })
    await horn.focus()
    await horn.press('Home')
    await expect(peer.getByRole('slider')).toHaveAttribute('aria-valuenow', '0')
    await page.getByRole('textbox',{name:'Message Slatebox'}).fill('Set Left recording to Copper singing bowl')
    await page.getByRole('button',{name:'Preview change'}).click()
    await expect(peer.getByRole('button',{name:'Listen to rain',exact:true})).toBeVisible()
    await page.getByRole('button',{name:'Keep change'}).click()
    await expect(peer.getByRole('button',{name:'Listen to Copper singing bowl'})).toBeVisible()
    await expect(call(page, 'creativeSlates.save', key, 0, before.creative.model)).rejects.toThrow(/latest version/)
    await expect(call(page, 'creativeSlates.save', key, 2, {...before.creative.model, mix: 'invalid'})).rejects.toThrow(/could not be saved/)
    await page.reload()
    await expect(page.getByRole('button', {name:'Listen to Copper singing bowl'})).toBeVisible()
    await page.getByRole('button', {name:'Present',exact:true}).click()
    const presentation = page.getByRole('dialog', {name:'Slate presentation'})
    await expect(presentation.getByRole('slider')).toHaveAttribute('aria-readonly','true')
    await expect(presentation.getByText(/Copper singing bowl 100%/)).toBeVisible()
    await presentation.getByRole('button',{name:'Exit presentation'}).click()
    await reader.goto(origin + '/plans')
    await reader.waitForFunction(() => (window as any).Meteor?.status().connected)
    expect(await reader.evaluate(() => (window as any).Meteor.userId())).toBeNull()
    expect(await call(reader, 'slates.get', { shareId: key })).toBeNull()
    await call(page,'slateAccess.configureLink',{slateId:before._id,type:'unlisted',permission:'READ'})
    await reader.goto(url)
    await expect(reader.getByRole('slider')).toHaveAttribute('aria-readonly','true')
    await expect(reader.getByRole('textbox',{name:'Message Slatebox'})).toHaveCount(0)
    await expect(call(reader,'creativeSlates.save',key,2,before.creative.model)).rejects.toThrow(/unavailable/)
    await peer.getByRole('button',{name:'Blend both'}).click()
    await expect(reader.getByRole('slider')).toHaveAttribute('aria-valuenow','50')
    await call(page,'slateAccess.configureLink',{slateId:before._id,type:'private',permission:'READ'})
    await expect(reader.getByRole('slider')).toHaveCount(0)
  } finally {
    await other.close()
    expect(await page.evaluate(() => (window as any).Meteor.callAsync('users.delete'))).toBe(true)
  }
})
