/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-cond-assign */
export default function closestPoint(pathNode, point) {
  const pathLength = pathNode.getTotalLength()
  let precision = 64 // increase this value for better performance at a risk of worse point approximation; in future this should be scaled according to number of path segments (there could be a better solution)
  let best
  let bestLength
  let bestDistance = Infinity

  function distance2(p) {
    // squared distance between two points
    const dx = p.x - point.x
    const dy = p.y - point.y
    return dx * dx + dy * dy
  }

  // linear scan for coarse approximation
  for (
    let scan, scanLength = 0, scanDistance;
    scanLength <= pathLength;
    scanLength += precision
  ) {
    if (
      (scanDistance = distance2(
        (scan = pathNode.getPointAtLength(scanLength))
      )) < bestDistance
    ) {
      ;(best = scan), (bestLength = scanLength), (bestDistance = scanDistance)
    }
  }

  // binary search for precise estimate
  precision /= 2
  while (precision > 0.5) {
    let before
    let after
    let beforeLength
    let afterLength
    let beforeDistance
    let afterDistance
    if (
      (beforeLength = bestLength - precision) >= 0 &&
      (beforeDistance = distance2(
        (before = pathNode.getPointAtLength(beforeLength))
      )) < bestDistance
    ) {
      ;(best = before),
        (bestLength = beforeLength),
        (bestDistance = beforeDistance)
    } else if (
      (afterLength = bestLength + precision) <= pathLength &&
      (afterDistance = distance2(
        (after = pathNode.getPointAtLength(afterLength))
      )) < bestDistance
    ) {
      ;(best = after),
        (bestLength = afterLength),
        (bestDistance = afterDistance)
    } else {
      precision /= 2
    }
  }
  return { bestPoint: best, bestLength }
}
