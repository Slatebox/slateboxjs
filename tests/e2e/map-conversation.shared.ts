import {expect,type Page} from '@playwright/test'
import {dismissWelcome} from './workshop-guests.shared'

export async function sendMapEdit(page:Page,message:string,decision:'Keep changes'|'Discard'='Keep changes') {
  const chat = page.getByRole('complementary',{name:'Map conversation'})
  const input = chat.getByRole('textbox',{name:'Direct map edits'})
  await input.fill(message)
  await input.press('Enter')
  await chat.getByRole('button',{name:decision,exact:true}).click()
  await expect(input).toBeVisible()
}

export async function startAgentMap(page:Page,origin:URL,board:string) {
  await page.goto(new URL('/canvas/'+board,origin).href)
  await dismissWelcome(page)
  await sendMapEdit(page,'At Start, Ask who owns the decision.')
  await expect(page.locator('[data-native-workshop-map] [data-node-id="lane-start"]')).toBeVisible()
}
