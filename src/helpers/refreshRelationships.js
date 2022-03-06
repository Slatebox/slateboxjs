/* eslint-disable no-underscore-dangle */
import closestPoint from './closestPoint'
import getHorizontalCurve from './getHorizontalCurve'
import getCorrectMidPoints from './getCorrectMidPoints'

export default function refreshRelationships({
  relationships,
  nodes,
  dx = 0,
  dy = 0,
}) {
  relationships.forEach((r) => {
    const midPoints = getCorrectMidPoints(r)

    let tempOriginNode
    let tempEndNode
    let linePath
    if (nodes.some((n) => n.options.id === r.parent.options.id)) {
      tempOriginNode = r.parent.getTempPathWithCorrectPositionFor({
        pathElement: r.parent.vect,
        dx,
        dy,
      })

      tempEndNode = r.child.getTempPathWithCorrectPositionFor({
        // this one is all about rotation
        pathElement: r.child.vect,
        dx: 0,
        dy: 0,
      })
      const childPathContext = closestPoint(
        tempEndNode || r.child.vect,
        midPoints.parent
      )
      const pointOnChildPath = childPathContext.bestPoint

      const parentPathContext = closestPoint(
        tempOriginNode || r.parent.vect,
        pointOnChildPath
      )
      const pointOnParentPath = parentPathContext.bestPoint
      linePath = getHorizontalCurve(pointOnParentPath, pointOnChildPath)
    } else {
      tempEndNode = r.child.getTempPathWithCorrectPositionFor({
        pathElement: r.child.vect,
        dx,
        dy,
      })

      tempOriginNode = r.parent.getTempPathWithCorrectPositionFor({
        // this one is all about rotation
        pathElement: r.parent.vect,
        dx: 0,
        dy: 0,
      })
      const childPathContext = closestPoint(
        tempEndNode || r.child.vect,
        midPoints.parent
      )
      const pointOnChildPath = childPathContext.bestPoint

      const parentPathContext = closestPoint(
        tempOriginNode || r.parent.vect,
        pointOnChildPath
      )
      const pointOnParentPath = parentPathContext.bestPoint
      linePath = getHorizontalCurve(pointOnParentPath, pointOnChildPath)
    }

    const _attr = {
      stroke: r.lineColor,
      fill: 'none',
      'stroke-width': r.lineWidth,
      'fill-opacity': r.lineOpacity,
      opacity: r.lineOpacity,
      filter: r.lineEffect ? `url(#${r.lineEffect})` : '',
    }
    // stop connection re-draws when shift+alt drag until the move is up because the lines are hidden anyways
    if (!(r.isAlt && r.isShift) || (r.isAlt && r.isShift && r.isUp)) {
      _attr.path = linePath
    }

    if (r.showChildArrow) {
      Object.assign(_attr, { 'arrow-end': 'classic' })
    } else {
      Object.assign(_attr, { 'arrow-end': 'none' })
    }

    if (r.showParentArrow) {
      Object.assign(_attr, { 'arrow-start': 'classic' })
    } else {
      Object.assign(_attr, { 'arrow-start': 'none' })
    }

    r.line.attr(_attr)

    if (tempOriginNode) tempOriginNode.remove()
    if (tempEndNode) tempEndNode.remove()
  })

  // always push the grid back
  if (nodes.length > 0) {
    nodes[0].slate?.grid?.toBack()
    nodes[0].slate?.canvas?.bgToBack()
  }
}
