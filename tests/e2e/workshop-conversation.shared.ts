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

export async function expectRejectedLaneEdit(page:Page,message:string) {
  const chat=await openConversation(page)
  await chat.getByRole('textbox').fill(message)
  await chat.getByRole('button',{name:'Preview changes',exact:true}).click()
  await expect(chat.getByRole('alert')).toContainText('unavailable')
  await expect(chat.getByRole('button',{name:'Keep changes'})).toHaveCount(0)
}
