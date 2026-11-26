// slateboxjs/boards/grid: the grid sheet's kit (a page of cells and a tray of tiles), its own chunk so no other board
// downloads it. Load it after slateboxjs/boards, only for a slate that holds a grid sheet; loading it gives
// kitFor('grid') its kit. The sheet's rules load with slateboxjs/boards (and slateboxjs/workshops/rules on a server).
//
//   const [{ kitFor }] = await Promise.all([import('slateboxjs/boards'), import('slateboxjs/boards/grid')])
import { registerBoardKit } from './index'
import { gridKit } from './gridKit'

export { gridKit, gridLayout, gridEditsBetween, gridPrintPages, gridFrames, tileLook } from './gridKit'
export { gridQrPicture } from '../workshops/gridQr'
export { gridPrintProblems, gridCaption, gridNeeds } from '../workshops/grid'

registerBoardKit('grid', gridKit)
