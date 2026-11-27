import { randomBytes } from 'node:crypto'
import { expect, test } from '@playwright/test'

const appUrl = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'

// Passkeys with Chrome's virtual authenticator: save a guest's account with a passkey (no password), sign out,
// sign in again with the passkey, and see it in Profile › Sign-in.
test('a guest saves the account with a passkey and signs back in with it', async ({ browser }) => {
  test.skip(!['localhost', '127.0.0.1', 'test.slatebox.com'].includes(new URL(appUrl).hostname), 'writes: disposable account on test only')
  test.setTimeout(240_000)
  const context = await browser.newContext()
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await cdp.send('WebAuthn.enable')
  await cdp.send('WebAuthn.addVirtualAuthenticator', { options: {
    protocol: 'ctap2', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, automaticPresenceSimulation: true,
  } })
  let userId: string | null = null
  try {
    await page.goto(new URL('/start?empty=1', appUrl).href)
    await page.waitForURL(/\/canvas\/[a-zA-Z0-9]{10}$/)
    userId = await page.evaluate(() => (window as any).Meteor.userId())
    await page.goto(new URL('/signup', appUrl).href)
    await page.getByRole('button', { name: 'Use a passkey instead of a password' }).click()
    const email = `sbx-e2e-${randomBytes(6).toString('hex')}@example.com`
    await page.getByLabel('Email address').fill(email)
    await page.getByRole('button', { name: /with a passkey/ }).click()
    await page.waitForFunction(email => (window as any).Meteor?.user()?.emails?.[0]?.address === email, email, { timeout: 60_000 })
    expect(await page.evaluate(() => (window as any).Meteor.userId())).toBe(userId)
    console.log('SAVED >>>', email)

    // Signed out, then back in with the passkey alone.
    await page.evaluate(() => new Promise(resolve => (window as any).Meteor.logout(resolve)))
    await page.goto(new URL('/login', appUrl).href)
    await page.getByRole('button', { name: 'Sign in with a passkey' }).click()
    await page.waitForFunction(id => (window as any).Meteor?.userId() === id, userId, { timeout: 60_000 })
    console.log('SIGNED IN >>>', userId)

    await page.goto(new URL('/profile?tab=sign-in', appUrl).href)
    await expect(page.getByText('Passkeys').first()).toBeVisible({ timeout: 30_000 })
    const listed = await page.evaluate(() => (window as any).Meteor.callAsync('passkeys.list', {}))
    console.log('LISTED >>>', JSON.stringify(listed).slice(0, 300))
    expect(JSON.stringify(listed)).toMatch(/credential|name|lastUsed/i)
  } finally {
    if (userId) await page.evaluate(() => (window as any).Meteor.callAsync('users.delete')).catch(() => {})
    await context.close()
  }
})
