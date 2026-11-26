import { describe, expect, it, vi } from 'vitest'
import { budgetKit, launchLayout, launchPlanKit, pipelineKit, renderLayerShapes } from '../../src/boards'
import { validateWorkshop, workshopCandidate, type BoardLayerState } from '../../src/workshops/model'
import { sampleBudget, sampleLaunchPlan, samplePipeline, withTaskValue } from '../../src/workshops/rules'

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
    // A 24px stroke to hit, and a button the keyboard reaches (phase 2 review M2, M3).
    expect(links.every(link => link.getAttribute('pointer-events') === 'stroke' && link.getAttribute('stroke-width') === '24' &&
      link.getAttribute('role') === 'button' && link.getAttribute('tabindex') === '0')).toBe(true)
    links[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(onUnlink).toHaveBeenCalledTimes(1)
    links[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(onUnlink).toHaveBeenCalledTimes(2)
    links[1].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    expect(onUnlink).toHaveBeenCalledTimes(3)
    // A tap selects the link and says so; only a second tap on it removes it.
    const tap = (target: Element) => {
      const down = new MouseEvent('pointerdown', { bubbles: true }) as MouseEvent & { pointerType: string }
      Object.defineProperty(down, 'pointerType', { value: 'touch' })
      target.dispatchEvent(down)
      target.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    }
    tap(svg.querySelector('[data-board-link="build>qa"]')!)
    expect(onUnlink).toHaveBeenCalledTimes(3)
    const armed = svg.querySelector('[data-board-link="build>qa"]')!
    expect(armed.hasAttribute('data-armed')).toBe(true)
    expect(armed.getAttribute('aria-label')).toMatch(/Tap again to remove it\.$/)
    expect(texts(svg)).toContain('Tap again to remove this link')
    tap(armed)
    expect(onUnlink).toHaveBeenCalledTimes(4)
    expect(onUnlink).toHaveBeenLastCalledWith('qa', 'build')
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

  it('the held grip\'s words stay last in the canvas when a note\'s selection outline is drawn after them', async () => {
    const { slate, svg } = canvas()
    const plan = validateWorkshop(sampleLaunchPlan())
    const layer = launchPlanKit.layer(slate)
    layer.draw(plan, null, state({ clamp: { name: 'handle-build', text: 'Launch is day 14.' }, refused: true }))
    // svg.select draws a selected note's outline as a group appended to the canvas (the grip, selected
    // where it glides back after a refused drop).
    const outline = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    svg.appendChild(outline)
    await Promise.resolve()
    expect(svg.lastElementChild!.hasAttribute('data-board-layer-top')).toBe(true)
    expect(outline.parentNode).toBe(svg)
    // With nothing to say, the layer leaves and stays away.
    layer.draw(plan, null, state())
    svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'g'))
    await Promise.resolve()
    expect(svg.querySelector('[data-board-layer-top]')).toBeNull()
    layer.destroy()
  })

  // Several boards on one canvas: each board's top layer keeps above every note and every piece of selection
  // chrome, and their observers settle instead of trading the last place forever (which hung the page).
  for (const count of [2, 3]) {
    for (const phone of [false, true]) {
      it(`${count} launch plans on one canvas${phone ? ' (phone: grips on every bar)' : ''}: the top layers stay at the end and the observers settle`, async () => {
        const Real = globalThis.MutationObserver
        let calls = 0
        const observers: MutationObserver[] = []
        // Count every observer callback; past a bound, stop forwarding so a loop fails the test instead of hanging it.
        class Counting extends Real {
          constructor(callback: MutationCallback) {
            super((records, observer) => { if (++calls <= 200) callback(records, observer) })
            observers.push(this)
          }
        }
        globalThis.MutationObserver = Counting as typeof MutationObserver
        const { slate, svg } = canvas()
        const plan = validateWorkshop(sampleLaunchPlan())
        const held = (i: number) => state({ origin: { x: 40 + i * 900, y: 20 }, layout: phone ? { narrow: true, width: 390 } : {},
          clamp: { name: 'handle-build', text: 'Launch is day ' + (14 + i) + '.' }, refused: true })
        const layers = Array.from({ length: count }, () => launchPlanKit.layer(slate))
        try {
          layers.forEach((layer, i) => layer.draw(plan, null, held(i)))
          const tops = () => [...svg.querySelectorAll('[data-board-layer-top]')]
          const tail = () => [...svg.children].slice(-count)
          const settle = async () => { for (let i = 0; i < 20; i++) await Promise.resolve() }
          await settle()
          expect(tops()).toHaveLength(count)
          expect(tops().every(top => top.firstChild)).toBe(true)
          expect(tail().every(child => child.hasAttribute('data-board-layer-top'))).toBe(true)
          // A selected note's outline, its handles and a note drawn after the layers: every top layer goes back above them.
          for (let round = 0; round < 3; round++) {
            calls = 0
            const chrome = document.createElementNS('http://www.w3.org/2000/svg', 'g')
            svg.appendChild(chrome)
            await settle()
            expect(calls).toBeLessThanOrEqual(count * 3)
            expect(chrome.parentNode).toBe(svg)
            expect(tail().every(child => child.hasAttribute('data-board-layer-top'))).toBe(true)
            expect(svg.children[svg.children.length - count - 1]).toBe(chrome)
          }
          // A redraw of one board keeps the order settled too.
          calls = 0
          layers[0].draw(plan, null, held(0))
          await settle()
          expect(calls).toBeLessThanOrEqual(count * 3)
          expect(tail().every(child => child.hasAttribute('data-board-layer-top'))).toBe(true)
          // One board with nothing more to say leaves; the others stay at the end.
          layers[0].draw(plan, null, state({ layout: phone ? { narrow: true, width: 390 } : {} }))
          svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'g'))
          await settle()
          const left = phone ? count : count - 1
          expect(tops()).toHaveLength(left)
          expect([...svg.children].slice(-left).every(child => child.hasAttribute('data-board-layer-top'))).toBe(true)
        } finally {
          layers.forEach(layer => layer.destroy())
          globalThis.MutationObserver = Real
          svg.remove()
        }
        expect(svg.querySelector('[data-board-layer-top]')).toBeNull()
        expect(observers.length).toBe(count)
      })
    }
  }

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

  it('launch plan: a held or refused grip says why in clear space near it, over no bar and no row name, on lines that fit the plan', () => {
    const plan = validateWorkshop(sampleLaunchPlan())
    const held = withTaskValue(plan, { cardId: 'build', field: 'duration' }, 8)
    // A generous estimate of bold 13px words, as wide as the kit allows for them.
    const box = (x: number, y: number, lines: string[]) => ({ x, y: y - 13, w: Math.max(...lines.map(line => line.length)) * 13 * 0.64, h: lines.length * 16 })
    const apart = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) =>
      a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y
    for (const layout of [{ narrow: true, width: 300 }, { narrow: true, width: 500 }, { width: 760 }, {}]) {
      for (const [shown, text] of [[held, 'Launch is day 14.'], [plan, 'That pushes QA to day 15, after launch on day 14.']] as const) {
        const { slate, svg } = canvas()
        const layer = launchPlanKit.layer(slate)
        layer.draw(plan, shown === plan ? null : shown, state({ layout, clamp: { name: 'handle-build', text }, refused: true }))
        const said = svg.querySelector('[data-board-layer-top] [data-board-layer="clamp"]')!
        expect(said.textContent).toBe(text)
        const lines = said.querySelectorAll('tspan').length ? [...said.querySelectorAll('tspan')].map(span => span.textContent!.trim()) : [said.textContent!]
        expect(lines.join(' ')).toBe(text)
        expect(lines.length).toBeLessThanOrEqual(4)
        const words = box(Number(said.getAttribute('x')), Number(said.getAttribute('y')), lines)
        const g = launchLayout(shown, layout)
        for (const [id, bar] of g.bars) expect(apart(words, { x: bar.x, y: bar.y, w: bar.width, h: bar.height }), JSON.stringify(layout) + ': “' + text + '” lies over the ' + id + ' bar').toBe(true)
        // Every other word of the plan (row names, the header, week labels, slack) stays clear of it too.
        for (const other of svg.querySelectorAll('[data-board-layer] > text')) {
          const size = Number(other.getAttribute('font-size')), x = Number(other.getAttribute('x')), y = Number(other.getAttribute('y'))
          expect(apart(words, { x, y: y - size, w: other.textContent!.length * size * 0.55, h: size * 1.2 }), JSON.stringify(layout) + ': “' + text + '” covers “' + other.textContent + '”').toBe(true)
        }
        expect(words.x).toBeGreaterThanOrEqual(0)
        expect(words.x + words.w).toBeLessThanOrEqual(g.width)
        // Near the grip: within the plan's rows, not set aside at its far corner.
        const grip = g.parts.find(part => part.name === 'handle-build')!
        expect(Math.abs(words.y + words.h / 2 - (grip.y + grip.height / 2))).toBeLessThan(140)
        layer.destroy(); svg.remove()
      }
    }
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
