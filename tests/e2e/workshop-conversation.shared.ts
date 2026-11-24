import {expect, type Page} from '@playwright/test'
import {conversation, openConversation} from './app-native-workshop.shared'

/** A workshop's conversation is the slate's own conversation panel. */
export const laneChat = (page:Page) => conversation(page)

export async function previewLaneEdit(page:Page, message:string) {
  const chat = await openConversation(page)
  const input = chat.getByRole('textbox')
  await input.fill(message)
  await chat.getByRole('button',{name:'Preview changes',exact:true}).click()
  await expect(chat.getByRole('button',{name:'Keep changes'})).toBeEnabled()
}
export async function sendLaneEdit(page:Page, message:string) {
  const chat = laneChat(page)
  await previewLaneEdit(page,message)
  await chat.getByRole('button',{name:'Keep changes'}).click()
  await expect(chat.getByRole('textbox')).toBeVisible()
}

// Restated 2026-11-23 (app fix/decision-path, owner rule): a move the board's rules refuse is offered as
// "Move anyway" / "Cancel" with the rule's own sentence, never saved by itself. This takes the refusal and
// cancels it, so nothing moves.
export async function expectRejectedLaneEdit(page:Page,message:string) {
  const chat=await openConversation(page)
  await chat.getByRole('textbox').fill(message)
  await chat.getByRole('button',{name:'Preview changes',exact:true}).click()
  // The reply names the card and the lane; the offer gives the rule's own reason.
  await expect(chat.getByText(/can’t move to .+ by this board’s rules\..*Move it anyway\?/).first()).toBeVisible()
  await expect(chat.locator('[data-move-anyway-rule]')).not.toBeEmpty()
  await expect(chat.getByRole('button',{name:'Move anyway'})).toBeVisible()
  await expect(chat.getByRole('button',{name:'Keep changes'})).toHaveCount(0)
  await chat.getByRole('button',{name:'Cancel',exact:true}).click()
  await expect(chat.getByRole('button',{name:'Move anyway'})).toHaveCount(0)
  await expect(chat.getByText('stays where it was.')).toBeVisible()
}
