import {expect,test} from '@playwright/test'
import {dismissWelcome,getSlate,removeTestGuest,userId} from './workshop-guests.shared'

const origin=new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
for (const gesture of ['mouse','touch'] as const) {
  test('first '+gesture+' double activation edits a saved retention note', async({browser,browserName})=>{
    test.skip(!['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname),'Creates only an isolated local or staging fixture.')
    test.skip(gesture==='touch' && browserName!=='chromium','Uses a trusted Chromium touch sequence.')
    const page=await browser.newPage({viewport:gesture==='touch'?{width:390,height:844}:{width:1280,height:800},hasTouch:gesture==='touch'})
    let owner:string|null=null
    try {
      await page.goto(origin.origin+'/new/customer-file')
      await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
      await expect.poll(()=>userId(page)).toBeTruthy()
      owner=await userId(page)
      const key=new URL(page.url()).pathname.split('/').pop()!
      await dismissWelcome(page)
      if(process.env.SLATEBOX_EXPECTED_APP_BUNDLE) await expect(page.locator('script[src*="/'+process.env.SLATEBOX_EXPECTED_APP_BUNDLE+'.js"]')).toHaveCount(1)
      const note=page.locator('#slateCanvas [data-node-id="retained-records"]').first()
      await expect(note).toHaveAttribute('aria-label',/Delete the original CSV/)
      if(gesture==='mouse') await note.dblclick()
      else {
        const fit=page.getByTitle('Fit to content',{exact:true}).first()
        if(await fit.isVisible()) await fit.tap()
        await expect(note).toBeInViewport({ratio:0.95})
        await note.tap({trial:true})
        const r=(await note.boundingBox())!
        const finger={x:r.x+r.width/2,y:r.y+r.height/2}
        const device=await page.context().newCDPSession(page)
        try {
          for(let tap=0;tap<2;tap++) {
            await device.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[finger]})
            await device.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
          }
        } finally {await device.detach()}
      }
      const editor=note.locator('[contenteditable="true"]')
      await expect(editor).toBeFocused()
      const updated='Keep the receipt for 14 days'
      await editor.fill(updated)
      await editor.press('Enter')
      await expect.poll(async()=>(await getSlate(page,key)).nodes.find((n:{options:{id:string}})=>n.options.id==='retained-records')?.options.text).toBe(updated)
      await page.reload()
      await expect(note).toHaveAttribute('aria-label',updated)
    } finally {
      try {await removeTestGuest(page,owner)} finally {await page.close()}
    }
  })
}
