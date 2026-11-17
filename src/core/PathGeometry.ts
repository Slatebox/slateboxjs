// PathArray normalizes SVG commands to absolute coordinates. Compute geometry
// without mounting an element, so persisted shapes work in server renders too.
import { Matrix, PathArray, Point } from '@svgdotjs/svg.js'

type XY = { x: number; y: number }
type Move = { kind: 'move'; end: XY }
type Cubic = { kind: 'cubic'; start: XY; first: XY; second: XY; end: XY }
type Arc = { kind: 'arc'; start: XY; end: XY; center: XY; axisX: XY; axisY: XY; angle: number; sweep: number }
type Segment = Move | Cubic | Arc
const TAU = 2 * Math.PI

function xy(x: number, y: number): XY { return { x, y } }
function interpolate(a: XY, b: XY, t: number): XY {
  return xy(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
}
function cubic(start: XY, first: XY, second: XY, end: XY): Cubic {
  return { kind: 'cubic', start, first, second, end }
}
function line(start: XY, end: XY) { return cubic(start, start, end, end) }

// SVG 2 implementation notes, endpoint-to-center parameterization.
function ellipticalArc(start: XY, end: XY, rx: number, ry: number, rotation: number, large: number, forward: number): Arc | Cubic {
  rx = Math.abs(rx)
  ry = Math.abs(ry)
  if (!rx || !ry || (start.x === end.x && start.y === end.y)) return line(start, end)
  const phi = rotation * Math.PI / 180, cos = Math.cos(phi), sin = Math.sin(phi)
  const dx = (start.x - end.x) / 2, dy = (start.y - end.y) / 2
  let u = (cos * dx + sin * dy) / rx, v = (-sin * dx + cos * dy) / ry
  const correction = Math.max(1, Math.hypot(u, v))
  rx *= correction
  ry *= correction
  u /= correction
  v /= correction
  const squared = u * u + v * v
  const offset = (large === forward ? -1 : 1) * Math.sqrt(Math.max(0, (1 - squared) / squared))
  const cx = offset * v, cy = -offset * u
  const axisX = xy(rx * cos, rx * sin), axisY = xy(-ry * sin, ry * cos)
  const center = xy((start.x + end.x) / 2 + cx * axisX.x + cy * axisY.x,
    (start.y + end.y) / 2 + cx * axisX.y + cy * axisY.y)
  const angle = Math.atan2(v - cy, u - cx)
  let sweep = Math.atan2(-v - cy, -u - cx) - angle
  if (forward && sweep < 0) sweep += TAU
  if (!forward && sweep > 0) sweep -= TAU
  return { kind: 'arc', start, end, center, axisX, axisY, angle, sweep }
}

function readSegments(path: string): Segment[] {
  const segments: Segment[] = []
  let cursor = xy(0, 0), subpath = cursor
  let lastCubic: XY | undefined, lastQuadratic: XY | undefined
  for (const command of new PathArray(path)) {
    const type = command[0]
    const args = command.slice(1) as number[]
    const pair = (i: number) => xy(args[i], args[i + 1])
    let segment: Segment
    let quadraticControl: XY | undefined
    switch (type) {
      case 'M':
        subpath = pair(0)
        segment = { kind: 'move', end: subpath }
        break
      case 'H': segment = line(cursor, xy(args[0], cursor.y)); break
      case 'V': segment = line(cursor, xy(cursor.x, args[0])); break
      case 'L': segment = line(cursor, pair(0)); break
      case 'Z': segment = line(cursor, subpath); break
      case 'C': segment = cubic(cursor, pair(0), pair(2), pair(4)); break
      case 'S': segment = cubic(cursor, lastCubic ? interpolate(lastCubic, cursor, 2) : cursor, pair(0), pair(2)); break
      case 'Q':
      case 'T': {
        const end = pair(type === 'Q' ? 2 : 0)
        quadraticControl = type === 'Q' ? pair(0) : lastQuadratic ? interpolate(lastQuadratic, cursor, 2) : cursor
        segment = cubic(cursor, interpolate(cursor, quadraticControl, 2 / 3), interpolate(end, quadraticControl, 2 / 3), end)
        break
      }
      case 'A': segment = ellipticalArc(cursor, pair(5), args[0], args[1], args[2], args[3], args[4]); break
      default: continue
    }
    segments.push(segment)
    lastCubic = type === 'C' || type === 'S' ? (segment as Cubic).second : undefined
    lastQuadratic = quadraticControl
    cursor = segment.end
  }
  return segments
}

function arcPoint(arc: Arc, angle: number) {
  return xy(arc.center.x + arc.axisX.x * Math.cos(angle) + arc.axisY.x * Math.sin(angle),
    arc.center.y + arc.axisX.y * Math.cos(angle) + arc.axisY.y * Math.sin(angle))
}
function arcTangent(arc: Arc, angle: number) {
  return xy(-arc.axisX.x * Math.sin(angle) + arc.axisY.x * Math.cos(angle),
    -arc.axisX.y * Math.sin(angle) + arc.axisY.y * Math.cos(angle))
}

function cubicExtrema(start: number, first: number, second: number, end: number): number[] {
  const a = -start + 3 * first - 3 * second + end
  const b = 2 * (start - 2 * first + second)
  const c = first - start
  if (Math.abs(a) < Number.EPSILON * Math.max(1, Math.abs(b), Math.abs(c))) return b ? [-c / b] : []
  const discriminant = b * b - 4 * a * c
  if (discriminant < 0) return []
  const root = Math.sqrt(discriminant)
  return [(-b - root) / (2 * a), (-b + root) / (2 * a)]
}
function curvePoint(curve: Cubic, t: number): XY {
  const a = interpolate(curve.start, curve.first, t), b = interpolate(curve.first, curve.second, t)
  const c = interpolate(curve.second, curve.end, t)
  return interpolate(interpolate(a, b, t), interpolate(b, c, t), t)
}

function bounds(segments: Segment[]) {
  let x = Infinity, y = Infinity, x2 = -Infinity, y2 = -Infinity
  function include(point: XY) {
    x = Math.min(x, point.x); x2 = Math.max(x2, point.x)
    y = Math.min(y, point.y); y2 = Math.max(y2, point.y)
  }
  if (!segments.length) include(xy(0, 0))
  for (const part of segments) {
    include(part.end)
    if (part.kind === 'move') continue
    include(part.start)
    for (const axis of ['x', 'y'] as const) {
      if (part.kind === 'cubic') {
        for (const t of cubicExtrema(part.start[axis], part.first[axis], part.second[axis], part.end[axis])) {
          if (t > 0 && t < 1) include(curvePoint(part, t))
        }
      } else {
        const extremum = Math.atan2(part.axisY[axis], part.axisX[axis])
        for (const angle of [extremum, extremum + Math.PI]) {
          const distance = (Math.sign(part.sweep) * (angle - part.angle) % TAU + TAU) % TAU
          if (distance <= Math.abs(part.sweep)) include(arcPoint(part, angle))
        }
      }
    }
  }
  return { x, y, x2, y2, width: x2 - x, height: y2 - y, cx: (x + x2) / 2, cy: (y + y2) / 2 }
}

export function pathBBox(path: string) { return bounds(readSegments(path)) }

function pathMatrix(transform: string, center: XY): Matrix {
  const matrix = new Matrix()
  for (const [, command, operands] of transform.matchAll(/([trsm])([^trsm]*)/gi)) {
    const values = (operands.match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi) || []).map(Number)
    const [a, b, c, d, e, f] = values
    let op = new Matrix()
    switch (command.toLowerCase()) {
      case 't': if (values.length === 2) op = op.translate(a, b); break
      case 'm': if (values.length === 6) op = new Matrix(a, b, c, d, e, f); break
      case 'r':
        if (values.length === 1) op = op.rotate(a, center.x, center.y)
        if (values.length === 3) op = op.rotate(a, b, c)
        break
      case 's':
        if (values.length === 1 || values.length === 2) op = op.scale(a, b ?? a, center.x, center.y)
        if (values.length === 3) op = op.scale(a, a, b, c)
        if (values.length === 4) op = op.scale(a, b, c, d)
        break
    }
    matrix.multiplyO(op)
  }
  return matrix
}

function arcCubics(arc: Arc): Cubic[] {
  // Each segment spans at most 45 degrees to keep the polynomial approximation
  // accurate on large or eccentric shapes, including after an affine transform.
  const count = Math.max(1, Math.ceil(Math.abs(arc.sweep) / (Math.PI / 4)))
  const step = arc.sweep / count, weight = 4 / 3 * Math.tan(step / 4)
  let start = arc.start
  return Array.from({ length: count }, (_, i) => {
    const from = arc.angle + i * step, to = from + step
    const end = i === count - 1 ? arc.end : arcPoint(arc, to)
    const out = arcTangent(arc, from), incoming = arcTangent(arc, to)
    const result = cubic(start, xy(start.x + weight * out.x, start.y + weight * out.y),
      xy(end.x - weight * incoming.x, end.y - weight * incoming.y), end)
    start = end
    return result
  })
}

export function transformPath(path: string, transform: string): string {
  const segments = readSegments(path), box = bounds(segments)
  const matrix = pathMatrix(transform, xy(box.cx, box.cy))
  const coordinates = (point: XY) => new Point(point.x, point.y).transform(matrix).toArray().join(',')
  return segments.map(segment => {
    if (segment.kind === 'move') return 'M' + coordinates(segment.end)
    const curves = segment.kind === 'arc' ? arcCubics(segment) : [segment]
    return curves.map(curve => 'C' + [curve.first, curve.second, curve.end].map(coordinates).join(',')).join('')
  }).join('')
}
