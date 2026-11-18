import {expect, type Page} from '@playwright/test'
import {industrialWorkshop,nightTransfer,releasePlan} from '../../src/workshops/model'

// Reconstruct tab-local data written by previous app versions. Merely visiting
// the saved-work directory is read-only, including on a signed-out production check.
export async function resumeArchivedDraft(page:Page, origin:string | URL, format:'lanes'|'map'|'release-plan'='lanes') {
  const models = {lanes:industrialWorkshop,map:nightTransfer,'release-plan':releasePlan}
  const prefixes = {lanes:'slatebox.workshop.v1.',map:'slatebox.map.v1.','release-plan':'slatebox.release.v1.'}
  const directory = new URL('/workshops?view=saved&format='+format,origin).href
  await page.goto(directory, {waitUntil:'domcontentloaded'})
  await page.waitForFunction(()=> (window as any).Meteor?.status()?.connected && !(window as any).Meteor.loggingIn())
  await page.evaluate(({prefix,model})=>{
    const key=prefix+((window as any).Meteor.userId() || 'guest')
    if(!sessionStorage.getItem(key)) sessionStorage.setItem(key,JSON.stringify({draft:model,stage:'arrange'}))
  },{prefix:prefixes[format],model:models[format]})
  await page.reload({waitUntil:'domcontentloaded'})
  await page.getByRole('link',{name:/Resume tab draft/}).click()
  await expect(page.locator('.workshop-paper svg').first()).toBeVisible()
}
