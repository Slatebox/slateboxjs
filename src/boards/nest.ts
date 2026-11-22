// slateboxjs/boards/nest: the nested boards' kit (piles, a tree, a 2 by 2, an org chart, goals & owners), its own
// chunk so a launch plan, a pipeline or a budget never downloads it. Load it after slateboxjs/boards, only for a
// slate that holds a nested board; loading it gives kitFor('nest') its kit.
//
//   const [{ kitFor }] = await Promise.all([import('slateboxjs/boards'), import('slateboxjs/boards/nest')])
import { registerBoardKit } from './index'
import { nestKit } from './nestKit'

export { nestKit, nestLayout, nestEditsBetween } from './nestKit'

registerBoardKit('nest', nestKit)
