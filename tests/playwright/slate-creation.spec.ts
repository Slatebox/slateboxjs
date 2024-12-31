import { test, expect } from '@playwright/test'
import { addNodeToSlate } from './helpers/create-slate'

test.describe('Slate Creation', () => {
  test('should create a slate and add a node', async ({ page }) => {
    await page.goto('http://localhost:1234')

    // const slate = await createSlate(page)

    const nodeOptions = {
      id: 'note_TEMP1001',
      name: 'note_TEMP1001',
      xPos: 10000,
      yPos: 10000,
      width: 267.109375,
      height: 94,
      vectorPath: 'custom',
      shapeHint: 'rectangle',
      groupId: 'category_main',
      text: 'Future-Ready Skills\nMap Template for\nTranshumanism Education',
      backgroundColor: '#d2e5f6',
      opacity: 1,
      fontFamily: 'Roboto Sans',
      fontSize: '16',
      foregroundColor: '#000000',
      lineColor: '#333',
      lineWidth: 5,
      filters: {
        vect: 'postItNote',
      },
    }

    console.log('adding node', nodeOptions)
    await addNodeToSlate(page, nodeOptions)

    // Verify node was added
    const node = page.locator(`[data-node-id="note_TEMP1001"]`)
    await expect(node).toBeVisible()
    await expect(node).toHaveText(/Future-Ready Skills/)
  })
})
