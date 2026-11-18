import {expect,test,type Page} from '@playwright/test'
import {encodeWorkshopFragment} from '../../src/workshops/model'

const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'

test('an open workshop inspector keeps a newer saved capacity from another editor tab', async ({page,context}) => {
  test.skip(!['localhost','127.0.0.1','test.slatebox.com'].includes(new URL(origin).hostname),'Private synthetic documents on local or staging only.')
  const model = {version:1 as const, title:'Museum loan case', lanes:[{id:'reserve',label:'Reserve'},{id:'case',label:'Loan case',capacity:2}],
    cards:[{id:'shell',label:'Shell carving',laneId:'case'}]}
  await page.goto(origin+'/new/workshop'+encodeWorkshopFragment(model))
  await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
  const notice=page.getByRole('button',{name:'Accept cookies'})
  if (await notice.isVisible()) await notice.click()
  const welcome=page.getByRole('dialog',{name:/welcome/i})
  if (await welcome.isVisible()) await welcome.getByRole('button',{name:'OK'}).click()
  const peer=await context.newPage()
  await peer.goto(page.url())
  async function edit(tab:Page,capacity:string) {
    await tab.getByRole('button',{name:'Edit an object'}).click()
    await tab.getByRole('combobox',{name:'Object',exact:true}).selectOption('lane:case')
    await tab.getByRole('spinbutton',{name:'Capacity'}).fill(capacity)
  }
  await edit(page,'3'); await edit(peer,'4')
  await peer.getByRole('button',{name:'Save changes'}).click()
  await expect(page.locator('[data-creative-revision]')).toHaveAttribute('data-creative-revision','1')
  await page.getByRole('button',{name:'Save changes'}).click()
  await expect(page.getByRole('alert')).toContainText('A teammate changed this slate')
  await page.reload()
  await page.getByRole('button',{name:'Edit an object'}).click()
  await page.getByRole('combobox',{name:'Object',exact:true}).selectOption('lane:case')
  await expect(page.getByRole('spinbutton',{name:'Capacity'})).toHaveValue('4')
  await expect(page.locator('[data-creative-revision]')).toHaveAttribute('data-creative-revision','1')
})

test('double-opening the same card preserves a stale inspector’s revision', async ({page,context}) => {
  test.skip(!['localhost','127.0.0.1','test.slatebox.com'].includes(new URL(origin).hostname),'Disposable local or staging slate only.')
  const source = {version:1 as const, title:'Bell rehearsal',lanes:[{id:'desk',label:'Desk'},{id:'air',label:'Air'}],
    cards:[{id:'bell',label:'Original bell',laneId:'desk'}]}
  let ownerId: string | null = null
  try {
    await page.goto(origin+'/new/workshop'+encodeWorkshopFragment(source))
    await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    ownerId=await page.evaluate(()=>(window as any).Meteor.userId())
    const second = await context.newPage()
    await second.goto(page.url())
    for(const tab of [page,second]){
      const welcome=tab.getByRole('dialog',{name:/welcome/i}).getByRole('button',{name:'OK'})
      await tab.addLocatorHandler(welcome,()=>welcome.click())
      const cookies=tab.getByRole('button',{name:'Accept cookies'})
      await tab.addLocatorHandler(cookies,()=>cookies.click())
      await tab.locator('#choice-bell').dblclick()
      await expect(tab.getByLabel('Object',{exact:true})).toHaveValue('card:bell')
    }
    await page.locator('.workshop-inspector').getByLabel('Name',{exact:true}).fill('First draft')
    await second.locator('.workshop-inspector').getByLabel('Name',{exact:true}).fill('Harbor bell')
    await second.getByRole('button',{name:'Save changes'}).click()
    await expect(page.locator('[data-creative-revision]')).toHaveAttribute('data-creative-revision','1')
    await page.locator('#choice-bell').dblclick()
    await page.getByRole('button',{name:'Save changes'}).click()
    await expect(page.getByRole('alert')).toContainText('A teammate changed this slate')
    await page.reload()
    await expect(page.locator('#choice-bell')).toContainText('Harbor bell')
  } finally {
    if(ownerId) await page.evaluate(id=>{
      const meteor=(window as any).Meteor
      if(meteor.userId()===id&&meteor.user()?.isAnonymous) return meteor.callAsync('users.delete')
    },ownerId)
  }
})
