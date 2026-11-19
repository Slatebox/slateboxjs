import {resumeArchivedDraft} from './workshop-archive.shared'
import {laneChat,previewLaneEdit,sendLaneEdit} from './workshop-conversation.shared'
import {dismissWelcome, getSlate, userId, removeTestGuest} from './workshop-guests.shared'
import { releasePlan } from '../../src/workshops/release'
import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

const base = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
const canSave = ['localhost', '127.0.0.1', 'test.slatebox.com'].includes(new URL(base).hostname)

async function openExistingDraft(page: Page) {
  await resumeArchivedDraft(page,base,'release-plan')
  await dismissWelcome(page)
  await expect(page.getByRole('heading',{name:releasePlan.title})).toBeVisible()
}

test('review a release plan, preview a dependent move, undo it and present the committed budget', async ({ page }) => {
  test.skip(process.env.SLATEBOX_APP_EXTERNAL !== 'true', 'Requires the actual app')
  if(!canSave) {
    await page.goto(base+'/workshops?view=saved')
    await expect(page.getByRole('heading',{name:'Saved workshops'})).toBeVisible()
    return
  }
  let ownerId:string|null=null
  try {
    await openExistingDraft(page)
    ownerId=await userId(page)
    expect(ownerId).toBeTruthy()
    const key=new URL(page.url()).pathname.split('/').pop()!
    const persisted=async()=> (await getSlate(page,key)).creative.model.workshop
    await sendLaneEdit(page,'Rename board to Review the Friday build')
    await sendLaneEdit(page,'Set budget of @friday to 9')
    await sendLaneEdit(page,'Set points of @billing to 4')
    expect((await persisted()).cards.find((c:{id:string})=>c.id==='invite').dependsOn).toEqual(['guardrails'])
    const capacity=page.locator('#heading-friday')
    await expect(capacity).toContainText('4 / 9 points')
    await previewLaneEdit(page,'Move @invite to @friday')
    await expect(capacity).toContainText('9 / 9 points')
    await laneChat(page).getByRole('button',{name:'Discard'}).click()
    await expect(capacity).toContainText('4 / 9 points')
    await sendLaneEdit(page,'Move @invite to @friday')
    await page.getByRole('button',{name:'Undo last change'}).click()
    await expect(capacity).toContainText('4 / 9 points')
    await sendLaneEdit(page,'Move @invite to @friday')
    await page.reload()
    await page.waitForFunction(id=>(window as any).Meteor?.userId()===id,ownerId)
    await expect(laneChat(page)).toBeVisible({timeout:45000})
    await expect(capacity).toContainText('9 / 9 points')
    await page.getByRole('button', { name: 'Present', exact: true }).click()
    const presentation = page.getByRole('region', { name: 'Decision presentation' })
    await expect(presentation.locator('svg [data-node-id="card-invite"]').first()).toBeAttached()
    await expect(presentation.getByText('9 points assigned of 9 available.')).toBeVisible()
    await expect(presentation.getByRole('listitem').filter({ hasText: 'Team invitations' })).toContainText('Requires Permission checks')
    await presentation.getByRole('button', { name: 'Back to board' }).click()
    expect((await getSlate(page,key)).options.isPrivate).toBe(true)
  } finally {
    if(ownerId){
      await page.goto(base+'/plans')
      await page.waitForFunction(id=>(window as any).Meteor?.userId()===id,ownerId)
      await removeTestGuest(page,ownerId)
    }
  }
})

test('share a release plan, observe committed moves, and undo as the participant who moved', async ({ browser }) => {
  test.skip(!canSave || process.env.SLATEBOX_APP_EXTERNAL !== 'true' || !process.env.SLATEBOX_EDITOR_A || !process.env.SLATEBOX_EDITOR_B,
    'Requires two synthetic test team accounts')
  const a = await browser.newContext({ storageState: process.env.SLATEBOX_EDITOR_A })
  const b = await browser.newContext({ storageState: process.env.SLATEBOX_EDITOR_B })
  try {
    const owner = await a.newPage(), peer = await b.newPage()
    await openExistingDraft(owner)
    const key=new URL(owner.url()).pathname.split('/').pop()!
    const source=await getSlate(owner,key)
    try {
      await peer.goto(base+'/workshops?view=saved')
      await expect.poll(()=>userId(peer)).toBeTruthy()
      const peerId=await userId(peer)
      await owner.getByRole('button',{name:'Share',exact:true}).click()
      const share=owner.getByRole('dialog',{name:'Share this slate'})
      const permission=share.locator('input[name="slateAccessPermission-'+peerId+'"][value="EDIT"]')
      await permission.check()
      await expect(permission).toBeChecked()
      await share.getByRole('button',{name:'Done',exact:true}).click()
      expect((await getSlate(owner,key)).options.isPrivate).toBe(true)
      await peer.goto(owner.url())
      await dismissWelcome(peer)
      await expect.poll(()=>userId(peer)).toBeTruthy()
      expect(await userId(peer)).not.toBe(await userId(owner))
      await previewLaneEdit(peer,'Move @invite to @friday')
      await expect(peer.locator('#heading-friday')).toContainText('8 / 8 points')
      await expect(owner.locator('#heading-friday')).toContainText('3 / 8 points')
      await laneChat(peer).getByRole('button',{name:'Keep changes'}).click()
      await expect(owner.locator('#heading-friday')).toContainText('8 / 8 points')
      await expect(owner.getByRole('button',{name:'Undo last change'})).toHaveCount(0)
      await peer.getByRole('button',{name:'Undo last change'}).click()
      await expect(owner.locator('#heading-friday')).toContainText('3 / 8 points')
      await peer.reload()
      await expect(peer.locator('#heading-friday')).toContainText('3 / 8 points')
      expect((await getSlate(owner,key)).creative.model.workshop.cards.find((c:{id:string})=>c.id==='guardrails').laneId).toBe('next')
    } finally {
      await owner.goto(base+'/plans')
      await owner.waitForFunction(id=>(window as any).Meteor?.userId()===id,source.userId)
      await owner.evaluate(id=>(window as any).Meteor.callAsync('slates.remove',{slateIds:[id]}),source._id)
    }
  } finally { await a.close(); await b.close() }
})
