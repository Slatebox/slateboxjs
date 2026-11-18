import { expect, test } from '@playwright/test'
import { randomUUID } from 'node:crypto'
import { dismissWelcome, userId } from './workshop-guests.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')

test('a signed-in subscriber can open Plans directly and reload without being offered a new Pro purchase', async ({ browser }) => {
  const mongo = process.env.SLATEBOX_LOCAL_FIXTURE_MONGO
  test.skip(!mongo || !['localhost','127.0.0.1'].includes(origin.hostname), 'Requires the matching disposable local Meteor database.')
  const endpoint = new URL(mongo!)
  expect(endpoint.hostname).toBe(origin.hostname)
  expect(Number(endpoint.port)).toBe(Number(origin.port) + 1)
  expect(endpoint.pathname).toBe('/meteor')
  const { MongoClient } = require(process.env.MONGODB_DRIVER || 'mongodb')
  const client = new MongoClient(mongo)
  const db = client.db('meteor')
  const email = 'plans-resume-' + randomUUID() + '@slatebox.invalid'
  const password = randomUUID()
  const setup = await browser.newContext()
  const owner = await setup.newPage()
  let id: string | null = null
  const contexts = [setup]
  try {
    await owner.goto(new URL('/new', origin).href)
    await expect.poll(() => userId(owner)).toBeTruthy()
    id = await userId(owner)
    await dismissWelcome(owner)
    await owner.goto(new URL('/profile', origin).href)
    await owner.getByRole('button', {name:'Save My Slatebox'}).click()
    const registration = owner.getByRole('dialog', {name:'Save your work'})
    await registration.getByLabel('Email address').fill(email)
    await registration.getByLabel(/^Password/i).fill(password)
    await registration.getByRole('button',{name:'Save my Slatebox'}).click()
    const own = { _id:id, 'emails.address':email, isAnonymous:false, orgId:null }
    const users = db.collection('users')
    await expect.poll(()=>users.countDocuments(own)).toBe(1)
    const tier = await db.collection('pricingTiers').findOne({_id:'pro'})
    const env = await owner.evaluate(()=>(window as any).Meteor.settings.public.env)
    const rates = ['dev', 'test'].includes(env) ? tier.testMode : tier
    // This local account has no Stripe subscription/customer. Only the unavailable
    // portal fallback and plan display are exercised; no provider request is needed.
    expect((await users.findOne(own)).subscriptionId).toBeFalsy()
    expect((await users.updateOne(own, {$set:{planType:rates.monthly.priceId}})).matchedCount).toBe(1)

    // First load of a new browser context goes straight to /plans with a real resumed login.
    const subscriber = await browser.newContext({storageState: await setup.storageState()})
    contexts.push(subscriber)
    const plans = await subscriber.newPage()
    await plans.addInitScript(() => {
      const state = window as Window & {offeredNewPro: boolean}
      state.offeredNewPro = false
      new MutationObserver(() => {
        if ([...document.querySelectorAll('button')].some(button => !button.disabled && button.textContent?.trim() === 'Go Pro')) {
          state.offeredNewPro = true
        }
      }).observe(document, {childList:true,subtree:true,attributes:true,characterData:true})
    })
    await plans.goto(new URL('/plans', origin).href)
    for (let visit = 0; visit < 2; visit++) {
      if (visit) await plans.reload()
      await expect.poll(()=>userId(plans)).toBe(id)
      await expect(plans.getByRole('button',{name:'Manage billing',exact:true})).toBeVisible()
      await plans.getByRole('button',{name:'Monthly',exact:true}).click()
      await expect(plans.getByRole('button',{name:'Current plan · billed monthly'})).toBeDisabled()
      expect(await plans.evaluate(()=>(window as any).offeredNewPro)).toBe(false)
    }
    expect((await users.updateOne(own, {$set:{planType:rates.yearly.priceId}})).matchedCount).toBe(1)
    await plans.getByRole('button',{name:/Annually, save 25%/i}).click()
    await expect(plans.getByRole('button',{name:'Current plan · billed annually'})).toBeDisabled()
    await plans.reload()
    await expect(plans.getByRole('button',{name:'Current plan · billed annually'})).toBeDisabled()
    expect(await plans.evaluate(()=>(window as any).offeredNewPro)).toBe(false)
  } finally {
    try {
      if (id) {
        const removed = await owner.evaluate(async ({id,email}) => {
          const m=(window as any).Meteor, me=m.user()
          if (me?._id!==id || !(me.isAnonymous || me.emails?.[0]?.address===email)) return false
          return m.callAsync('users.delete')
        },{id,email})
        expect(removed).toBe(true)
        expect(await db.collection('users').countDocuments({_id:id})).toBe(0)
      }
    } finally {
      await client.close()
      await Promise.all(contexts.map(context=>context.close()))
    }
  }
})
