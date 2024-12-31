import { Page } from '@playwright/test'
// import { Slatebox } from '../../../src/index.js'
// import '../../../src/plugins/node/attempt.js'
// import '../../../src/plugins/slate/second.js'
// import '../../../src/helpers/utils.js'

// export interface SlateOptions {
//   name?: string
//   id?: string
//   description?: string
//   container?: string
//   viewPort?: {
//     width?: number
//     height?: number
//     left?: number
//     top?: number
//     useInertiaScrolling?: boolean
//     showGrid?: boolean
//     snapToObjects?: boolean
//     gridSize?: number
//   }
//   showbirdsEye?: boolean
//   sizeOfbirdsEye?: number
//   showMultiSelect?: boolean
//   showZoom?: boolean
//   showUndoRedo?: boolean
//   allowDrag?: boolean
//   enabled?: boolean
// }

// export async function createSlate(page: Page, options: SlateOptions = {}) {
//   // Wait for DOM to be ready
//   await page.waitForLoadState('domcontentloaded')

//   // // Dynamic imports within the evaluate callback
//   // await page.evaluate(async () => {
//   //   await import('../../../src/index.js')
//   //   await import('../../../src/plugins/node/attempt.js')
//   //   await import('../../../src/plugins/slate/second.js')
//   //   await import('../../../src/helpers/utils.js')
//   // })

//   const defaultOptions = {
//     name: 'Test Slate',
//     id: `test-slate-${Date.now()}`,
//     description: '',
//     defaultLineColor: '#333',
//     container: 'slateCanvas',
//     viewPort: {
//       useInertiaScrolling: true,
//       showGrid: false,
//       snapToObjects: true,
//       gridSize: 50,
//       width: 50000,
//       height: 50000,
//       left: 25000,
//       top: 25000,
//     },
//     enabled: true,
//     allowDrag: true,
//     showbirdsEye: true,
//     sizeOfbirdsEye: 150,
//     showMultiSelect: true,
//     showZoom: true,
//     showUndoRedo: true,
//   }

//   const slateOptions = { ...defaultOptions, ...options }

//   // Create slate using the client-side API
//   const slate = await page.evaluate((opts) => {
//     // Ensure document is defined in this context
//     if (typeof document === 'undefined') {
//       throw new Error('Document is not defined in evaluate context')
//     }
//     return new Slatebox.slate(opts).init()
//   }, slateOptions)

//   // Wait for slate to be fully initialized
//   await page.waitForSelector('#slateCanvas svg')

//   return slate
// }

export async function addNodeToSlate(page: Page, nodeOptions: any) {
  await page.evaluate((options) => {
    console.log('will add node', options, window.Slatebox)
    const node = new window.Slatebox.node(options)
    console.log('node added', node)
    window.slate.nodes.add(node)
  }, nodeOptions)

  // Wait for node to be added
  await page.waitForSelector(`[data-node-id="${nodeOptions.id}"]`)
}
