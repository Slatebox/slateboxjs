import {expect, type Page} from '@playwright/test'
import {industrialWorkshop,nightTransfer,releasePlan} from '../../src/workshops/model'

// Reconstruct tab-local data written by previous app versions. Merely visiting
// the saved-work directory is read-only, including on a signed-out production check.
export async function resumeArchivedDraft(page:Page, origin:string | URL, format:'lanes'|'map'|'release-plan'='lanes') {
  const models = {lanes:industrialWorkshop,map:nightTransfer,'release-plan':releasePlan}
  const prefixes = {lanes:'slatebox.workshop.v1.',map:'slatebox.map.v1.','release-plan':'slatebox.release.v1.'}
  const directory = new URL('/workshops?view=saved&format='+format,origin).href
  if (!['localhost','127.0.0.1','test.slatebox.com'].includes(new URL(directory).hostname)) throw new Error('Resuming an archived draft creates a private native slate; use a local or staging host.')
  await page.goto(directory, {waitUntil:'domcontentloaded'})
  await page.waitForFunction(()=> (window as any).Meteor?.status()?.connected && !(window as any).Meteor.loggingIn())
  await page.evaluate(({prefix,model})=>{
    const key=prefix+((window as any).Meteor.userId() || 'guest')
    if(!sessionStorage.getItem(key)) sessionStorage.setItem(key,JSON.stringify({draft:model,stage:'arrange'}))
  },{prefix:prefixes[format],model:models[format]})
  await page.reload({waitUntil:'domcontentloaded'})
  await page.getByRole('link',{name:/Resume tab draft/}).click()
  await expect(page).toHaveURL(/\/canvas\/[a-f0-9]{10}$/)
  // The archived draft opens as a slate with the workshop on its canvas and the slate's own conversation.
  await expect(page.locator('#slateCanvas [data-node-id^="lane-"]').first()).toBeVisible()
  await expect(page.getByRole('complementary',{name:'Ask Slatebox'})).toBeVisible()
}
