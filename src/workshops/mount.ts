import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { WorkshopBoard, type WorkshopBoardProps } from './index'
import { validateWorkshop, type Workshop } from './model'
export { attachWorkshop, type AttachWorkshopOptions, type AttachedWorkshop } from './native'
export { dragologyCandidates } from './dragologyCandidates'

type MountOptions = Omit<WorkshopBoardProps, 'value' | 'onChange'> & {
  onChange?: WorkshopBoardProps['onChange']
}

/** Mount a playable workshop from data in a plain DOM host. The owner persists committed changes. */
export function mountWorkshop(element: HTMLElement, initial: Workshop, options: MountOptions = {}) {
  let value = validateWorkshop(initial)
  let disposed = false
  const root = createRoot(element)

  function update(next: Workshop) {
    if (disposed) throw new Error('This workshop has been unmounted.')
    value = validateWorkshop(next)
    render()
  }

  function render() {
    root.render(createElement(WorkshopBoard, {
      mapCanvas: Boolean(value.lanes[0].station),
      ...options,
      value,
      onChange(next, move) {
        update(next)
        options.onChange?.(value, move)
      },
    }))
  }

  render()
  return { update, destroy() {
    if (disposed) return
    disposed = true
    root.unmount()
  } }
}
