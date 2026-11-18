import { expect, test, type Page } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const base: Workshop = {
  version:1, title:'Harbor listening rehearsal',
  lanes:[{id:'desk',label:'At the desk'}, {id:'air',label:'On air'}],
  cards:[{id:'chime',label:'Harbor chime',laneId:'desk'}],
}
const report = (page: Page) => page.getByRole('region',{name:'Placement outcomes',exact:true})

test('author a placement outcome, accept a second editor’s move and republish the changed readout', async ({browser}) => {
  test.skip(!['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname) ||
    process.env.SLATEBOX_TEST_WORKSHOP_PUBLICATION !== 'true', 'Link-only synthetic workshops on local or staging.')
  const context = await browser.newContext()
  const peerContext = await browser.newContext()
  const audience = await browser.newContext({viewport:{width:390,height:844}})
  const owner = await context.newPage(), peer = await peerContext.newPage(), viewer = await audience.newPage()
  let ownerId: string | null = null, peerId: string | null = null, slateId: string | null = null, key = ''
  try {
    await owner.goto(new URL('/new/workshop'+encodeWorkshopFragment(base),origin).href)
    await owner.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await dismissWelcome(owner)
    ownerId = await userId(owner)
    key = new URL(owner.url()).pathname.split('/').pop()!
    const original = await getSlate(owner,key)
    slateId = original._id
    expect(original.creative.model.workshop.signals).toBeUndefined()
    async function editChime() {
      await owner.getByRole('button',{name:'Edit an object'}).click()
      await owner.getByLabel('Object',{exact:true}).selectOption('card:chime')
    }
    await editChime()
    const editor = owner.locator('.workshop-inspector')
    await expect(editor.getByLabel('Object',{exact:true})).toHaveValue('card:chime')
    await editor.getByRole('button',{name:'Add placement outcome'}).click()
    await editor.getByLabel('Outcome name').fill('Broadcast')
    await editor.getByLabel('Target lane').selectOption('air')
    await editor.getByLabel('When the card is here').fill('The harbor chime is live.')
    await editor.getByLabel('When the card is elsewhere').fill('The harbor chime is waiting.')
    await editor.getByRole('button',{name:'Save changes'}).click()
    await expect(report(owner)).toContainText('The harbor chime is waiting.')
    const publish = async (label: 'Publish' | 'Republish') => {
      await owner.getByRole('button',{name:'Publish presentation',exact:true}).click()
      const dialog=owner.getByRole('dialog',{name:'Publish presentation'})
      await expect(dialog.getByRole('radio',{name:'Anyone with the link'})).toBeChecked()
      await dialog.getByRole('button',{name:label,exact:true}).click()
      await expect(dialog.getByRole('status')).toContainText('Presentation published')
      await dialog.getByRole('button',{name:'Close',exact:true}).click()
    }
    await publish('Publish')
    const view = new URL('/present/'+key,origin).href
    const openAudience = async (message: string) => {
      await viewer.goto(view)
      const scene=viewer.getByRole('region',{name:'Decision presentation'})
      await expect(scene.getByRole('heading',{name:'At the desk'})).toBeVisible()
      await expect(report(viewer)).toHaveCount(0)
      await scene.getByRole('button',{name:'Next lane'}).click()
      await expect(report(viewer)).toContainText(message)
      expect(await userId(viewer)).toBeNull()
    }
    await openAudience('The harbor chime is waiting.')
    const link=await shareAs(owner,'edit')
    await peer.goto(new URL('/new',origin).href)
    await dismissWelcome(peer)
    peerId=await userId(peer)
    expect(peerId).toBeTruthy()
    expect(peerId).not.toBe(ownerId)
    await peer.goto(link.href)
    await dismissWelcome(peer)
    await peer.getByText('Move a card by name',{exact:true}).click()
    await peer.getByRole('combobox',{name:'Move Harbor chime'}).selectOption('air')
    await expect(report(peer)).toContainText('The harbor chime is live.')
    await expect(report(owner)).toContainText('The harbor chime is waiting.')
    await peer.getByRole('button',{name:'Apply move'}).click()
    await expect(report(owner)).toContainText('The harbor chime is live.')
    await owner.reload()
    await dismissWelcome(owner)
    await expect(report(owner)).toContainText('The harbor chime is live.')
    await openAudience('The harbor chime is waiting.')
    await publish('Republish')
    await openAudience('The harbor chime is live.')
    await editChime()
    await editor.getByRole('button',{name:'Broadcast',exact:true}).click()
    await editor.getByLabel('When the card is here').fill('The bell is live.')
    await editor.getByRole('button',{name:'Save changes'}).click()
    await expect(report(owner)).toContainText('The bell is live.')
    await editChime()
    await editor.getByRole('button',{name:'Broadcast',exact:true}).click()
    await editor.getByRole('button',{name:'Remove outcome'}).click()
    await editor.getByRole('button',{name:'Save changes'}).click()
    await expect(report(owner)).toHaveCount(0)
    await expect.poll(async()=> (await getSlate(owner,key)).creative.model.workshop.signals).toBeUndefined()
  } finally {
    try {
      if(slateId){
        await owner.evaluate(async key => {
          const meteor=(window as any).Meteor
          const active=await meteor.callAsync('presentations.workshopStatus',key)
          if(active) await meteor.callAsync('presentations.unpublish',{presentationId:'workshop-presentation-'+key,generation:active.generation})
        },key)
        await owner.evaluate(id=>(window as any).Meteor.callAsync('slates.remove',{slateIds:[id]}),slateId)
      }
      await Promise.all([removeTestGuest(owner,ownerId), removeTestGuest(peer,peerId)])
    } finally { await Promise.all([context.close(),peerContext.close(),audience.close()]) }
  }
})
