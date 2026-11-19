import {expect,type Page} from '@playwright/test'
import {dismissWelcome} from './workshop-guests.shared'
import {lane,openConversation} from './app-native-workshop.shared'

export async function sendMapEdit(page:Page,message:string,decision:'Keep changes'|'Discard preview'='Keep changes') {
  const chat = await openConversation(page)
  const input = chat.getByRole('textbox',{name:'Direct map edits'})
  await input.fill(message)
  await chat.getByRole('button',{name:'Preview changes',exact:true}).click()
  await chat.getByRole('button',{name:decision,exact:true}).click()
  await expect(input).toBeVisible()
}

export async function startAgentMap(page:Page,origin:URL,board:string) {
  await page.goto(new URL('/canvas/'+board,origin).href)
  await dismissWelcome(page)
  await sendMapEdit(page,'At Start, Ask who owns the decision.')
  await expect(lane(page,'start')).toBeVisible()
}
