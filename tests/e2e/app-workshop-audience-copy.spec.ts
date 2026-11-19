import {sendLaneEdit,laneChat} from './workshop-conversation.shared'
import { expect, test, type Page } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, removeTestGuest, userId } from './workshop-guests.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const original: Workshop = {version:1, title:'Harbor soundcheck', lanes:[{id:'desk',label:'Desk'}, {id:'air',label:'On air'}],
  cards:[{id:'bell',label:'Harbor bell',laneId:'desk'}]}
const copyName = 'Open my own copy'

test('audiences can keep a private copy only of a currently opted-in workshop edition, including large models', async ({browser}) => {
  test.skip(!['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname) ||
    process.env.SLATEBOX_TEST_WORKSHOP_PUBLICATION !== 'true','Opt in to link-only synthetic publication on local or staging.')
  const ownerContext=await browser.newContext()
  const guestContext=await browser.newContext({viewport:{width:390,height:844}})
  const deniedContext=await browser.newContext()
  const owner=await ownerContext.newPage(), article=await guestContext.newPage(), denied=await deniedContext.newPage()
  let copier:Page|undefined, ownerId:string|null=null, copierId:string|null=null, sourceId:string|null=null, key=''
  try {
    await owner.goto(new URL('/new/workshop'+encodeWorkshopFragment(original),origin).href)
    await owner.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await dismissWelcome(owner)
    ownerId=await userId(owner)
    key=new URL(owner.url()).pathname.split('/').pop()!
    const source=await getSlate(owner,key)
    sourceId=source._id
    const published=new URL('/present/'+key,origin).href
    const publish=async(allow:boolean,first=false)=>{
      await owner.getByRole('button',{name:'Publish presentation',exact:true}).click()
      const dlg=owner.getByRole('dialog',{name:'Publish presentation'})
      const check=dlg.getByRole('checkbox',{name:'Let viewers open their own copy'})
      await expect(dlg.getByRole('radio',{name:'Anyone with the link'})).toBeChecked()
      if(first) await expect(check).not.toBeChecked()
      await check.setChecked(allow)
      await dlg.getByRole('button',{name:first?'Publish':'Republish',exact:true}).click()
      await expect(dlg.getByRole('status')).toContainText('Presentation published')
      await dlg.getByRole('button',{name:'Close',exact:true}).click()
    }
    const assertDenied=async(href:string)=>{
      await denied.goto(href)
      await expect(denied.getByRole('alert')).toContainText('no longer available to copy')
      expect(await userId(denied)).toBeNull()
      expect(new URL(denied.url()).pathname).toBe('/new/workshop')
    }
    await publish(false,true)
    await article.goto(published)
    await expect(article.getByRole('heading',{name:'Desk'})).toBeVisible()
    await expect(article.getByRole('link',{name:copyName})).toHaveCount(0)
    // Grow an ordinary authenticated working board beyond the 64 KiB portable URL limit.
    const large = {...original, signals:Array.from({length:24},(_,i)=>({id:'signal-'+i,label:'Cue '+i,
      cardId:'bell',laneId:'air',whenPresent:'響'.repeat(158),whenAbsent:'靜'.repeat(158)}))}
    expect(()=>encodeWorkshopFragment(large)).toThrow(/too large/)
    const save=async(workshop:Workshop)=>{
      await owner.evaluate(async ({key,workshop})=>{
        const m=(window as any).Meteor, slate=(await m.callAsync('slates.get',{shareId:key})).slateBase
        await m.callAsync('creativeSlates.save',key,slate.creative.revision,{...slate.creative.model,workshop})
      },{key,workshop})
      await expect.poll(async()=>(await getSlate(owner,key)).creative.model.workshop).toEqual(workshop)
    }
    await save(large)
    await publish(true)
    const privateRevision={...large,title:'Private edition in progress'}
    await save(privateRevision)
    await article.goto(published)
    const cta=article.getByRole('link',{name:copyName})
    await expect(cta).toBeVisible()
    const edition=new URL((await cta.getAttribute('href'))!,origin).href
    expect(edition.length).toBeLessThan(220)
    await article.setContent('<iframe title="Workshop" style="width:345px;height:260px" src="'+published+'"></iframe>')
    const embed=article.frameLocator('iframe')
    const link=embed.getByRole('link',{name:copyName})
    await expect(link).toHaveAttribute('target','_blank')
    await link.focus()
    const newPage=guestContext.waitForEvent('page')
    await link.press('Enter')
    copier=await newPage
    await copier.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await dismissWelcome(copier)
    copierId=await userId(copier)
    const copyKey=new URL(copier.url()).pathname.split('/').pop()!
    const duplicate=await getSlate(copier,copyKey)
    expect(copierId).toBeTruthy()
    expect(copierId).not.toBe(ownerId)
    expect(duplicate.userId).toBe(copierId)
    expect(duplicate._id).not.toBe(sourceId)
    expect(duplicate.options).toMatchObject({isPrivate:true,isPublic:false,isUnlisted:false})
    expect(duplicate.creative.model.workshop).toEqual(large)
    await sendLaneEdit(copier,'Move @bell to @air')
    await expect.poll(async()=>(await getSlate(copier!,copyKey)).creative.model.workshop.cards[0].laneId).toBe('air')
    expect((await getSlate(owner,key)).creative.model.workshop).toEqual(privateRevision)
    expect(await getSlate(owner,copyKey)).toBeFalsy()
    await publish(false)
    await assertDenied(edition)
    const code = await copier.evaluate(async query => {
      try {
        await (window as any).Meteor.callAsync('creativeSlates.create','workshop',query,'A'.repeat(17))
      } catch (err) {
        return (err as any).error
      }
    },new URL(edition).search)
    expect(code).toBe('copy-unavailable')
    await article.goto(published)
    await expect(article.getByRole('heading',{name:'Desk'})).toBeVisible()
    await expect(article.getByRole('link',{name:copyName})).toHaveCount(0)
    await publish(true)
    await article.reload()
    const nextEdition=new URL((await article.getByRole('link',{name:copyName}).getAttribute('href'))!,origin).href
    expect(nextEdition).not.toBe(edition)
    const returning = await guestContext.newPage()
    await returning.goto(nextEdition)
    await returning.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    const newKey = new URL(returning.url()).pathname.split('/').pop()!
    const currentCopy = await getSlate(returning,newKey)
    expect(newKey).not.toBe(copyKey)
    expect(currentCopy.userId).toBe(copierId)
    expect(currentCopy.creative.model.workshop).toEqual(privateRevision)
    await returning.close()
    await assertDenied(edition)
    await owner.getByRole('button',{name:'Publish presentation',exact:true}).click()
    await owner.getByRole('button',{name:'Withdraw presentation',exact:true}).click()
    await expect(owner.getByRole('status')).toContainText('Presentation withdrawn')
    await assertDenied(nextEdition)
    await copier.reload()
    await expect(laneChat(copier).getByRole('textbox')).toBeVisible()
    await expect.poll(() => userId(copier!)).toBe(copierId)
    expect((await getSlate(copier,copyKey)).creative.model.workshop.cards[0].laneId).toBe('air')
  } finally {
    try {
      if(ownerId&&sourceId){
        await owner.evaluate(async({key,sourceId})=>{
          const m=(window as any).Meteor
          const pub=await m.callAsync('presentations.workshopStatus',key)
          if(pub)await m.callAsync('presentations.unpublish',{presentationId:'workshop-presentation-'+key,generation:pub.generation})
          await m.callAsync('slates.remove',{slateIds:[sourceId]})
        },{key,sourceId})
      }
    } finally {
      try {
        if (copier) await removeTestGuest(copier,copierId)
      } finally {
        try { await removeTestGuest(owner,ownerId) }
        finally { await Promise.all([ownerContext.close(),guestContext.close(),deniedContext.close()]) }
      }
    }
  }
})
