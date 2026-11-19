import {expect, type Page} from '@playwright/test'

export const laneChat = (page:Page) => page.getByRole('complementary',{name:'Workshop conversation'})

export async function previewLaneEdit(page:Page, message:string) {
  const chat = laneChat(page)
  const input = chat.getByRole('textbox')
  await input.fill(message)
  await chat.getByRole('button',{name:'Send workshop message'}).click()
  await expect(chat.getByRole('button',{name:'Keep changes'})).toBeEnabled()
}
export async function sendLaneEdit(page:Page, message:string) {
  const chat = laneChat(page)
  await previewLaneEdit(page,message)
  await chat.getByRole('button',{name:'Keep changes'}).click()
  await expect(chat.getByRole('textbox')).toBeVisible()
}
