/* eslint-disable no-lonely-if */
export default function getCorrectMidPoints(opts = {}) {
  const originBB = opts.parent
    ? opts.parent.vect.getBBox()
    : opts.parent.vect.getBBox()
  const endBB = opts.child
    ? opts.child.vect.getBBox()
    : opts.child.vect.getBBox()

  function inn(val) {
    return !Number.isNaN(parseFloat(val)) && Number.isFinite(val)
  }

  const pcx = inn(originBB.cx) && originBB.cx
  const pcy = inn(originBB.cy) && originBB.cy
  const ccx = inn(endBB.cx) && endBB.cx
  const ccy = inn(endBB.cy) && endBB.cy

  let relevantParentMiddlePoint

  const px1 = originBB.x
  const py1 = originBB.y
  const px2 = originBB.x2
  const py2 = originBB.y
  const px3 = originBB.x2
  const py3 = originBB.y2
  const px4 = originBB.x
  const py4 = originBB.y2

  /*
    generic line equation
    y = ((y2-y1)/(x2-x1)) * (x-x1) + y1

    line 1: line passing through upper left corner and bottom right corner
    y = ((py3 - py1)/(px3 - px1)) * (x - px1) + py1

    line 2: line passing through bottom left corner and upper right corner
    y = ((py2 - py4)/(px2 - px4)) * (x - px4) + py4
   */

  // NOTE: comments below apply to a Cartesian coordinate system; the svg coordinate system is slightly different with (0,0) in upper left corner of the plane
  // it means that regular above means below here
  if (ccy >= ((py3 - py1) / (px3 - px1)) * (ccx - px1) + py1) {
    // means that child center point is above line 1
    if (ccy >= ((py2 - py4) / (px2 - px4)) * (ccx - px4) + py4) {
      // means that child center point is above line 2
      relevantParentMiddlePoint = { x: pcx, y: py3 }
    } else {
      // means that child center point is either below line 2 or is on line 2
      relevantParentMiddlePoint = { x: px1, y: pcy }
    }
  } else {
    // means that child center point is below line 1
    if (ccy >= ((py2 - py4) / (px2 - px4)) * (ccx - px4) + py4) {
      // means that child center point is above line 2
      relevantParentMiddlePoint = { x: px2, y: pcy }
    } else {
      // means that child center point is either below line 2 or is on line 2
      relevantParentMiddlePoint = { x: pcx, y: py1 }
    }
  }

  let relevantChildMiddlePoint

  const cx1 = endBB.x
  const cy1 = endBB.y
  const cx2 = endBB.x2
  const cy2 = endBB.y
  const cx3 = endBB.x2
  const cy3 = endBB.y2
  const cx4 = endBB.x
  const cy4 = endBB.y2

  /*
   generic line equation
   y = ((y2-y1)/(x2-x1)) * (x-x1) + y1

   line 1: line passing through upper left corner and bottom right corner
   y = ((cy3 - cy1)/(cx3 - cx1)) * (x - cx1) + cy1

   line 2: line passing through bottom left corner and upper right corner
   y = ((cy2 - cy4)/(cx2 - cx4)) * (x - cx4) + cy4
   */

  // NOTE: comments below apply to a Cartesian coordinate system; the svg coordinate system is slightly different with (0,0) in upper left corner of the plane
  // it means that regular above means below here
  if (pcy >= ((cy3 - cy1) / (cx3 - cx1)) * (pcx - cx1) + cy1) {
    // means that child center point is above line 1
    if (pcy >= ((cy2 - cy4) / (cx2 - cx4)) * (pcx - cx4) + cy4) {
      // means that child center point is above line 2
      relevantChildMiddlePoint = { x: ccx, y: cy3 }
    } else {
      // means that child center point is either below line 2 or is on line 2
      relevantChildMiddlePoint = { x: cx1, y: ccy }
    }
  } else {
    // means that child center point is below line 1
    if (pcy >= ((cy2 - cy4) / (cx2 - cx4)) * (pcx - cx4) + cy4) {
      // means that child center point is above line 2
      relevantChildMiddlePoint = { x: cx2, y: ccy }
    } else {
      // means that child center point is either below line 2 or is on line 2
      relevantChildMiddlePoint = { x: ccx, y: cy1 }
    }
  }

  return {
    child: relevantChildMiddlePoint,
    parent: relevantParentMiddlePoint,
  }
}
