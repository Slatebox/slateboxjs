import { expect, test } from 'vitest'
import { pathBBox, transformPath } from '../../src/core/PathGeometry'

test('relative and smooth quadratic segments preserve analytic extrema at zero controls', () => {
  const box = pathBBox('M-10 0 q10 20 20 0 t20 0')
  expect(box).toMatchObject({ x: -10, x2: 30, y: -10, y2: 10 })
})

test('rotated elliptical arc extrema include only points inside the swept interval', () => {
  const box = pathBBox('M34.6410161514 20 A40 10 30 0 1 -34.6410161514 -20')
  expect(box.x).toBeCloseTo(-35, 4)
  expect(box.x2).toBeCloseTo(34.6410161514, 4)
  expect(box.y).toBeCloseTo(-20, 4)
  expect(box.y2).toBeCloseTo(Math.sqrt(475), 4)
})

test('a closed subpath followed by a relative move starts at its own origin', () => {
  const path = 'm4 5 h10 v12 z m20 -30 h4'
  const result = pathBBox(transformPath(path, 'm1,0,0,1,10,-5'))
  expect(result).toMatchObject({ x: 14, y: -30, x2: 38, y2: 12 })
})
