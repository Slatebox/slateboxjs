import { expect, test } from '@playwright/test'
import { openGuestCanvas } from './app-host.shared'

const app = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
const edge = process.env.SLATEBOX_PRESENTATION_EMBED_URL
const isolated = process.env.SLATEBOX_PRESENTATION_MEDIA_ISOLATED === 'true'

test('author reorders scenes, publishes an unlisted deck, and withdraws guest and embed access', async ({browser}) => {
  test.skip(!isolated || !edge || !['localhost','127.0.0.1','test.slatebox.com'].includes(new URL(app).hostname),
    'Publishing requires an isolated staging snapshot store and matching embed Worker')
  const owner = await browser.newContext({permissions:['clipboard-read','clipboard-write'],viewport:{width:1440,height:1000}})
  const guest = await browser.newContext({viewport:{width:1024,height:768},reducedMotion:'reduce'})
  const localMedia = process.env.SLATEBOX_PRESENTATION_LOCAL_PNG_URL
  if (localMedia) {
    expect(['127.0.0.1','localhost']).toContain(new URL(localMedia).hostname)
    await guest.route('https://files.slatebox.com/**/present_*.png', async route => {
      const path = new URL(route.request().url()).pathname
      const png = await guest.request.get(new URL(path, localMedia).href)
      await route.fulfill({response:png})
    })
  }
  try {
    const page = await owner.newPage()
    const viewer = await guest.newPage()
    await openGuestCanvas(page,app)
    const id = new URL(page.url()).pathname.split('/').pop()
    const publishedUrl = app+'/present/'+id
    const embedUrl = edge+'/embed/'+id
    const cookies = page.getByRole('button',{name:'Accept cookies'})
    if (await cookies.isVisible()) await cookies.click()
    await page.getByRole('button',{name:'Slatebox - quickly add a node'}).hover()
    await page.getByRole('button',{name:'Add Text',exact:true}).click()
    await page.locator('#txtNode').fill('Look for the Pleiades')
    await expect(page.locator('#slateCanvas')).toContainText('Look for the Pleiades')
    await page.keyboard.press('Escape')
    await page.getByRole('button',{name:'Presentation options'}).click()
    await page.getByRole('menuitem',{name:'Edit or publish presentation'}).click()
    const publish = page.getByRole('button',{name:'Publish presentation',exact:true})
    await expect(publish).toBeEnabled({timeout:40_000})
    await page.getByRole('button',{name:'Presentation Settings',exact:true}).click()
    const publicGallery = page.getByRole('checkbox',{name:/Make presentation public/})
    await expect(publicGallery).not.toBeChecked()
    await page.getByRole('checkbox',{name:/Show Scene Boundaries/}).check()
    await page.keyboard.press('Escape')
    await page.getByRole('button',{name:'Edit viewpoint 2',exact:true}).click()
    const marker = 'Begin with the star cluster.'
    await page.getByLabel('Narrative',{exact:true}).fill(marker)
    await page.getByRole('combobox',{name:'Position in presentation'}).click()
    await page.getByRole('option',{name:'1',exact:true}).click()
    await page.getByRole('button',{name:'Save',exact:true}).click()
    await expect(page.getByLabel('Narrative',{exact:true})).toHaveCount(0)
    await page.getByRole('button',{name:'Edit viewpoint 1',exact:true}).click()
    await expect(page.getByLabel('Narrative',{exact:true})).toHaveValue(marker)
    await page.getByRole('button',{name:'Cancel',exact:true}).click()
    await viewer.goto(publishedUrl,{waitUntil:'domcontentloaded'})
    await expect(viewer.getByRole('heading',{name:'Presentation unavailable'})).toBeVisible()
    expect((await viewer.request.get(embedUrl)).status()).toBe(404)
    await page.bringToFront()
    await publish.click()
    await expect(page.getByText(/Published! URL copied to clipboard/)).toBeVisible()
    const copied = await page.evaluate(()=>navigator.clipboard.readText())
    expect(copied).toBe(publishedUrl)
    await viewer.reload({waitUntil:'domcontentloaded'})
    await viewer.bringToFront()
    await expect(viewer.locator('#presentMain svg').filter({hasText: 'Look for the Pleiades'}).first()).toBeVisible()
    await viewer.keyboard.press('ArrowRight')
    await expect(viewer.getByText(marker,{exact:true})).toBeVisible()
    await viewer.keyboard.press('ArrowRight')
    await expect(viewer.getByText(marker,{exact:true})).toHaveCount(0)
    await viewer.keyboard.press('ArrowLeft')
    await expect(viewer.getByText(marker,{exact:true})).toBeVisible()
    await expect.poll(async ()=>(await viewer.request.get(embedUrl)).status(),{timeout:30_000}).toBe(200)
    const embed = await guest.newPage()
    await embed.goto(embedUrl)
    await expect(embed.locator('img')).toHaveAttribute('src',/\/\d{4}\/\d\d\/\d\d\/present_[\w-]+\.png$/)
    await expect.poll(()=>embed.locator('img').evaluate(e=>(e as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
    expect(await viewer.evaluate(()=>(window as any).Meteor.userId())).toBeFalsy()
    await page.bringToFront()
    await page.getByRole('button',{name:'View previous versions'}).click()
    await page.getByRole('button',{name:'Copy embed code',exact:true}).click()
    const snippet = await page.evaluate(()=>navigator.clipboard.readText())
    expect(snippet).toContain('src="'+publishedUrl+'"')
    const embedHost = await guest.newPage()
    await embedHost.setContent(snippet)
    const player = embedHost.frameLocator('iframe')
    await expect(player.locator('#presentMain svg').filter({hasText:'Look for the Pleiades'}).first()).toBeVisible()
    await page.bringToFront()
    await page.getByRole('button',{name:'Unpublish presentation',exact:true}).click()
    await expect(page.getByText(/presentation is unpublished/i)).toBeVisible()
    await viewer.reload({waitUntil:'domcontentloaded'})
    await expect(viewer.getByRole('heading',{name:'Presentation unavailable'})).toBeVisible()
    expect((await embed.reload())?.status()).toBe(404)
    await expect(embed.locator('img')).toHaveCount(0)
  } finally {
    await Promise.all([guest.close(),owner.close()])
  }
})
