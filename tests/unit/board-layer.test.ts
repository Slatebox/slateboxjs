import { describe, expect, it, vi } from 'vitest'
import { budgetKit, launchPlanKit, pipelineKit, renderLayerShapes } from '../../src/boards'
import { validateWorkshop, workshopCandidate, type BoardLayerState } from '../../src/workshops/model'
import { sampleBudget, sampleLaunchPlan, samplePipeline } from '../../src/workshops/rules'

function canvas() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const column = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  const card = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  svg.append(column, card)
  document.body.appendChild(svg)
  return { slate: { canvas: { node: svg } }, svg, column, card }
}
const state = (extra: Partial<BoardLayerState> = {}): BoardLayerState => ({ origin: { x: 40, y: 20 }, layout: {}, clamp: null, refused: false, ...extra })
const texts = (svg: Element) => [...svg.querySelectorAll('text')].map(text => text.textContent)

describe('the board layer', () => {
  it('sits above the lane columns and under every other note, in world coordinates, and leaves with destroy', () => {
    const { slate, svg, column, card } = canvas()
    const layer = launchPlanKit.layer(slate)
    layer.draw(validateWorkshop(sampleLaunchPlan()), null, state({ above: column }))
    const group = svg.querySelector('[data-board-layer]')!
    expect([...svg.children]).toEqual([column, group, card])
    expect(group.getAttribute('transform')).toBe('translate(40 20)')
    expect(group.getAttribute('pointer-events')).toBe('none')
    layer.destroy()
    expect(svg.querySelector('[data-board-layer]')).toBeNull()
  })

  it('launch plan: header, week labels, slack, arrows that unlink on click, and the clamp sentence', () => {
    const { slate, svg } = canvas()
    const plan = validateWorkshop(sampleLaunchPlan())
    const onUnlink = vi.fn()
    const layer = launchPlanKit.layer(slate)
    layer.draw(plan, null, state({ onUnlink }))
    expect(texts(svg)).toEqual(expect.arrayContaining(['Done day 12 · launch day 14', 'Week 1', 'Week 2', '+10d']))
    const links = [...svg.querySelectorAll('[data-board-link]')]
    expect(links.map(link => link.getAttribute('data-board-link')).sort()).toEqual(['build>qa', 'design>build'])
    expect(links.every(link => link.getAttribute('pointer-events') === 'stroke' && link.getAttribute('stroke-width') === '12')).toBe(true)
    links[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(onUnlink).toHaveBeenCalledTimes(1)
    layer.draw(plan, null, state({ clamp: { name: 'handle-build', text: 'Launch is day 14.' }, refused: true }))
    expect(svg.querySelector('[data-board-layer="clamp"]')!.textContent).toBe('Launch is day 14.')
    // The sentence is above every note, never under a bar: the canvas's last group.
    expect(svg.lastElementChild!.hasAttribute('data-board-layer-top')).toBe(true)
    expect(svg.lastElementChild!.querySelector('[data-board-layer="clamp"]')!.textContent).toBe('Launch is day 14.')
    expect(svg.lastElementChild!.getAttribute('pointer-events')).toBe('none')
    expect(svg.querySelector('[data-board-layer="header"]')!.getAttribute('fill')).toBe('#c2410c')
    layer.draw(plan, null, state())
    expect(svg.querySelector('[data-board-layer-top]')).toBeNull()
  })

  it('pipeline: the forecast bar is drawn from the board on show and turns the accept colour at the target', () => {
    const { slate, svg } = canvas()
    const pipeline = validateWorkshop(samplePipeline())
    const layer = pipelineKit.layer(slate)
    layer.draw(pipeline, null, state())
    const fill = () => svg.querySelectorAll('rect')[1]
    const before = Number(fill().getAttribute('width'))
    expect(fill().getAttribute('fill')).toBe('#3f6f8e')
    const preview = workshopCandidate(pipeline, 'globex', 'qualified')!
    layer.draw(pipeline, preview, state())
    expect(Number(fill().getAttribute('width'))).toBeGreaterThan(before)
    const reached = validateWorkshop({ ...pipeline, forecast: { target: 150000, currency: '$' } })
    layer.draw(reached, null, state())
    expect(fill().getAttribute('fill')).toBe('#1f7a5c')
    expect(texts(svg)).toContain('Target $150k')
  })

  it('budget: says the total balances, and shows why a divider stopped', () => {
    const { slate, svg } = canvas()
    const layer = budgetKit.layer(slate)
    layer.draw(validateWorkshop(sampleBudget()), null, state({ clamp: { name: 'handle-sales', text: 'Sales already commits $320k.' } }))
    expect(texts(svg)).toEqual(expect.arrayContaining(['$1.2M · balanced', 'Sales already commits $320k.']))
  })

  it('sets words as text, never as markup', () => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    renderLayerShapes(group, [{ t: 'text', x: 0, y: 0, text: '<b>bold</b>', color: '#000' }])
    expect(group.querySelector('b')).toBeNull()
    expect(group.textContent).toBe('<b>bold</b>')
  })
})
