import {expect,test} from '@playwright/test'
import {encodeWorkshopFragment} from '../../src/workshops/model'

import {dismissWelcome,getSlate,removeTestGuest,userId} from './workshop-guests.shared'
import {laneChat,previewLaneEdit,sendLaneEdit} from './workshop-conversation.shared'

const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'

for (const kind of ['lane','card'] as const) {
  test('a stale '+kind+' proposal preserves the peer’s newer edit after reselect and reload', async ({page,context}) => {
    test.skip(!['localhost','127.0.0.1','test.slatebox.com'].includes(new URL(origin).hostname),'Disposable local or staging slate only.')
    const source={version:1 as const,title:'Loan case rehearsal',lanes:[{id:'reserve',label:'Reserve'},{id:'case',label:'Case',capacity:2}],
      cards:[{id:'bell',label:'Desk bell',laneId:'reserve'}]}
    let ownerId:string|null=null
    const peer=await context.newPage()
    try {
      await page.goto(origin+'/new/workshop'+encodeWorkshopFragment(source))
      await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
      await dismissWelcome(page)
      ownerId=await userId(page)
      expect(ownerId).toBeTruthy()
      const key=new URL(page.url()).pathname.split('/').pop()!
      await peer.goto(page.url())
      await dismissWelcome(peer)
      if(kind==='card') {
        await page.locator('#choice-bell').click()
        await expect(laneChat(page)).toContainText('Desk bell')
      }
      await previewLaneEdit(page,kind==='lane'?'Set capacity of @case to 3':'Rename card this to First draft')
      await sendLaneEdit(peer,kind==='lane'?'Set capacity of @case to 4':'Rename card @bell to Harbor bell')
      await expect(laneChat(page)).toContainText('A teammate changed the workshop.')
      if(kind==='card') await page.locator('#choice-bell').click()
      await expect(laneChat(page).getByRole('button',{name:'Keep changes'})).toBeDisabled()
      await page.reload()
      await dismissWelcome(page)
      const saved=(await getSlate(page,key)).creative.model.workshop
      expect(kind==='lane'?saved.lanes[1].capacity:saved.cards[0].label).toBe(kind==='lane'?4:'Harbor bell')
    } finally {
      await peer.close()
      if(ownerId) {
        await page.goto(origin+'/plans')
        await page.waitForFunction(id=>(window as any).Meteor?.userId()===id,ownerId)
        await removeTestGuest(page,ownerId)
      }
    }
  })
}
