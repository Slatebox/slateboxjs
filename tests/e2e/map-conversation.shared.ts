import {expect,type Page} from '@playwright/test'
import {dismissWelcome} from './workshop-guests.shared'
import {lane,openConversation} from './app-native-workshop.shared'

export async function sendMapEdit(page:Page,message:string,decision:'Keep changes'|'Discard preview'='Keep changes') {
  const chat = await openConversation(page)
  const input = chat.getByRole('textbox',{name:'Message Slatebox'})
  await input.fill(message)
  await chat.getByRole('button',{name:'Preview changes',exact:true}).click()
  await chat.getByRole('button',{name:decision,exact:true}).click()
  await expect(input).toBeVisible()
  // The kept (or discarded) preview is settled only once the server has the change: until then the
  // canvas still shows the proposal and redraws when the save lands, moving the notes under the pointer.
  await expect(chat.getByText('Proposed change · shown on the canvas',{exact:true})).toHaveCount(0)
  await expect(page.getByRole('status').filter({hasText:/^Saving…$/})).toHaveCount(0)
}

export async function startAgentMap(page:Page,origin:URL,board:string) {
  await page.goto(new URL('/canvas/'+board,origin).href)
  await dismissWelcome(page)
  await sendMapEdit(page,'At Start, Ask who owns the decision.')
  await expect(lane(page,'start')).toBeVisible()
}
