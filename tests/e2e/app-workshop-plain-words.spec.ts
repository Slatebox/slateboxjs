import { expect, test, type Page } from '@playwright/test'
import { dismissWelcome, getSlate, removeTestGuest, userId } from './workshop-guests.shared'
import { caption, conversation, messageBox, starter, workshopReady } from './app-native-workshop.shared'

/**
 * A workshop slate's conversation in the running Meteor app: the slate's ordinary conversation,
 * with nothing to learn. A message is a sentence about what is on the slate, the starters are
 * such sentences and fill the message, Preview / Keep / Discard are worded as on any slate, and
 * a message that cannot be acted on is answered with what can be done, in plain words.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')
test.use({ viewport: { width: 1360, height: 900 } })

async function open(page: Page, path: string) {
  await page.goto(new URL(path, origin).href)
  await page.waitForURL(/\/canvas\/[a-zA-Z0-9]+$/)
  await expect.poll(() => userId(page)).toBeTruthy()
  await dismissWelcome(page)
  await workshopReady(page)
  return { id: (await userId(page))!, key: page.url().split('/').pop()! }
}
const lanesOf = async (page: Page, key: string) =>
  Object.fromEntries((await getSlate(page, key)).creative.model.workshop.cards.map((card: any) => [card.id, card.laneId]))
/** Nothing in the panel names a command, a syntax or a format to learn. */
const noLore = async (page: Page) => expect(conversation(page)).not.toContainText(/command|syntax|direct map edit|\bformat\b/i)

test('the budget is changed by saying so: starters fill the message, a preview is kept, and what cannot be done is answered in plain words', async ({ page }) => {
  let id: string | null = null
  try {
    const owner = await open(page, '/new/pilot-budget')
    id = owner.id
    const chat = conversation(page)
    // The same panel as on any slate.
    await expect(chat.getByRole('heading', { name: 'Ask Slatebox', exact: true })).toBeVisible()
    await expect(chat.getByText('What should happen on this slate?', { exact: true })).toBeVisible()
    await expect(messageBox(page)).toBeVisible()
    await expect(chat.getByRole('textbox')).toHaveCount(1)
    await expect(chat.locator('details, summary')).toHaveCount(0)
    await noLore(page)
    // Starters are things a person would say about this workshop, and each one works here.
    const offered = chat.getByLabel('Starter messages').getByRole('button')
    await expect(offered).toHaveText(['Move Third $200 to Customer calls', 'Let Unallocated hold two cards', 'Add a card called New idea to Unallocated'])
    // A starter fills the message and leaves the keyboard in it.
    await starter(page, 'Move Third $200 to Customer calls').click()
    await expect(messageBox(page)).toHaveValue('Move Third $200 to Customer calls')
    await expect(messageBox(page)).toBeFocused()
    await chat.getByRole('button', { name: 'Preview changes', exact: true }).click()
    // The proposal is on the canvas and not saved; the reply says what it did, with the lane's whole name.
    await expect(chat.getByRole('log')).toContainText('Moved “Third $200” to “Customer calls · $50 per call”.')
    await expect(caption(page, 'calls')).toContainText('$400 · 8 customer calls')
    expect((await lanesOf(page, owner.key))['fund-2']).toBe('reserve')
    await expect(chat.getByRole('button', { name: 'Discard preview', exact: true })).toBeVisible()
    await chat.getByRole('button', { name: 'Keep changes', exact: true }).click()
    await expect.poll(async () => (await lanesOf(page, owner.key))['fund-2']).toBe('calls')
    await expect(chat.getByRole('log')).toContainText('Saved to the workshop.')

    // Said another way, with the lane's short name and a full stop.
    await messageBox(page).fill('Please put the second $200 in the newsletter.')
    await messageBox(page).press('Enter')
    await expect(chat.getByRole('log')).toContainText('Moved “Second $200” to “Partner newsletter · $200 per placement”.')
    await chat.getByRole('button', { name: 'Discard preview', exact: true }).click()
    await expect(chat.getByRole('button', { name: 'Keep changes' })).toHaveCount(0)
    expect((await lanesOf(page, owner.key))['fund-1']).toBe('reserve')

    // A sentence the workshop's own sentences do not cover goes to the slate's own conversation,
    // never to a reply that lists what may be said. A question has to be thought up: AI is free
    // each month for anyone signed in, so a guest is told plainly to sign in, and no plan is
    // offered. (Restated 2026-11-19: this used to answer "I did not follow that" with examples.
    // Restated 2026-11-20, switch day: Slatebox has no plans, so the Pro and Team link is gone.)
    await messageBox(page).fill('Which lane has the most left?')
    await messageBox(page).press('Enter')
    await expect(chat.getByRole('log')).toContainText('Sign in to use AI. It is free each month.')
    await expect(chat.getByRole('log')).not.toContainText('I did not follow that')
    await expect(chat.getByRole('log')).not.toContainText(/\bPro\b|Team plan/)
    await expect(chat.getByRole('link', { name: 'See Pro and Team plans' })).toHaveCount(0)
    await expect(chat.getByRole('alert')).toHaveCount(0)
    await expect(chat.getByRole('button', { name: 'Keep changes' })).toHaveCount(0)
    await expect(messageBox(page)).toHaveValue('')

    // A rule that refuses says so in its own sentence.
    await messageBox(page).fill('Add a lane called Later')
    await messageBox(page).press('Enter')
    await expect(chat.getByRole('alert')).toHaveText('This workshop keeps the lanes it came with. You can rename them, and rename and move its cards.')
    await expect(chat.getByRole('button', { name: 'Keep changes' })).toHaveCount(0)
    await noLore(page)
  } finally { await removeTestGuest(page, id) }
})

test('a map takes its steps as a list and a token is moved on in words', async ({ page }) => {
  let id: string | null = null
  try {
    const owner = await open(page, '/new/map')
    id = owner.id
    const chat = conversation(page)
    await expect(messageBox(page)).toBeVisible()
    await expect(chat.getByRole('textbox')).toHaveCount(1)
    await noLore(page)
    const keep = async (message: string, reply: string) => {
      await messageBox(page).fill(message)
      await messageBox(page).press('Enter')
      await expect(chat.getByRole('log')).toContainText(reply)
      await chat.getByRole('button', { name: 'Keep changes', exact: true }).click()
      await expect(messageBox(page)).toBeVisible()
    }
    await keep('Intake, Review, Done', 'Connected Intake → Review → Done.')
    await keep('Add Sign-off before Done', 'Added “Sign-off” before “Done”.')
    await keep('Move the token forward', 'to “Review”.')
    const saved = (await getSlate(page, owner.key)).creative.model.workshop
    expect(saved.lanes.map((lane: any) => lane.label)).toEqual(['Intake', 'Review', 'Done', 'Sign-off'])
    const byLabel = (label: string) => saved.lanes.find((lane: any) => lane.label === label)
    expect(byLabel('Review').station.next).toEqual([byLabel('Sign-off').id])
    expect(byLabel('Sign-off').station.next).toEqual([byLabel('Done').id])
    expect(saved.cards[0].laneId).toBe(byLabel('Review').id)
    // A question goes to the slate's own conversation: a guest is asked to sign in for AI, said
    // plainly, and nothing is proposed. (Restated 2026-11-19: this used to list what a map can do.
    // Restated 2026-11-20, switch day: no plans, so no Pro and Team link.)
    await messageBox(page).fill('What should come next?')
    await messageBox(page).press('Enter')
    await expect(chat.getByRole('log')).toContainText('Sign in to use AI. It is free each month.')
    await expect(chat.getByRole('log')).not.toContainText(/\bPro\b|Team plan/)
    await expect(chat.getByRole('link', { name: 'See Pro and Team plans' })).toHaveCount(0)
    await expect(chat.getByRole('button', { name: 'Keep changes' })).toHaveCount(0)
    await noLore(page)
  } finally { await removeTestGuest(page, id) }
})
