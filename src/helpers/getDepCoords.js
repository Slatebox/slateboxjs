export default function getDepCoords(p, options) {
  let lx = p.x - 5
  let tx = p.x + options.width / 2
  let ty = p.y + options.height / 2

  if (options.vectorPath === 'ellipse') {
    lx = p.cx - 5
    tx = p.cx
    ty = p.cy
  }

  return { lx, tx, ty }
}
