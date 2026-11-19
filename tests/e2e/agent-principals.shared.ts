import {randomBytes} from 'node:crypto'
import {expect, type Page} from '@playwright/test'
import {userId} from './workshop-guests.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')

export type Actor = {page:Page; email:string; id:string|null}
export async function register(actor: Actor, path: string) {
  const {page,email} = actor
  await page.goto(new URL(path,origin).href)
  await page.waitForURL(/\/canvas\/[a-zA-Z0-9]{10}$/)
  const boardKey = new URL(page.url()).pathname.split('/').pop()!
  await expect.poll(() => userId(page)).toBeTruthy()
  actor.id = await userId(page)
  await page.goto(new URL('/profile',origin).href)
  const claim = page.getByTestId('guest-account-claim')
  await claim.getByLabel('Email address').fill(email)
  await claim.locator('input[type=password]').fill(randomBytes(24).toString('hex'))
  await claim.getByRole('button',{name:'Save my Slatebox'}).click()
  await page.waitForFunction(email => (window as any).Meteor?.user()?.emails?.[0]?.address === email,email)
  return boardKey
}

export async function retire(actor: Actor) {
  if (!actor.id) return
  const {page,id,email} = actor
  await page.goto(new URL('/profile',origin).href)
  await page.waitForFunction(({id,email}) => {
    const u = (window as any).Meteor?.user()
    return u?._id === id && !u.orgId && (u.isAnonymous === true || u.emails?.[0]?.address === email)
  },{id,email})
  expect(await page.evaluate(async ({id,email}) => {
    const m=(window as any).Meteor,u=m.user()
    if (m.userId() !== id || u.orgId || !(u.isAnonymous || u.emails?.[0]?.address === email)) return false
    return m.callAsync('users.delete')
  },{id,email})).toBe(true)
}

