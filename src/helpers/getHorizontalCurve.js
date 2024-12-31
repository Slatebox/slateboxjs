// returns a horizontally curved line
// export default function getHorizontalCurve(originPoint, endPoint) {
//   const x1 = originPoint.x
//   const y1 = originPoint.y
//   const x2 = endPoint.x
//   const y2 = endPoint.y

//   const middlePointX = (x1 + x2) / 2
//   return [
//     'M',
//     x1.toFixed(2),
//     y1.toFixed(2),
//     'C',
//     middlePointX.toFixed(2),
//     y1.toFixed(2),
//     middlePointX.toFixed(2),
//     y2.toFixed(2),
//     x2.toFixed(2),
//     y2.toFixed(2),
//   ].join(' ')
// }

// Function to generate a horizontally curved line or a right-angle connection
// Function to generate a dynamically curved line with the last segment straight towards the end point
// Function to generate a dynamically curved line with the last segment straight towards the end point
export default function getHorizontalCurve(
  originPoint,
  endPoint,
  curveSwoop = 0.5,
  lineType = 'bezier',
  curveType = 'quadratic',
  parentWidth = 0,
  parentXY = { x: 0, y: 0 }
) {
  const x1 = originPoint.x
  const y1 = originPoint.y
  let x2 = endPoint.x
  let y2 = endPoint.y

  const dx = Math.abs(x2 - x1)
  const dy = Math.abs(y2 - y1)

  if (lineType === 'bezier') {
    const distance = Math.sqrt(dx * dx + dy * dy)
    const swoop = distance * curveSwoop
    const angle = Math.atan2(y2 - y1, x2 - x1)

    // Calculate the parent's true center point
    const roundedParentCenterX = Math.ceil(
      (parentXY?.x || x1) + parentWidth / 2
    ) // Since x1 is the connection point, subtract half width to get center

    // Round values for stability
    const roundedChildX = Math.ceil(x2)

    // Determine curve direction based on child position relative to parent center
    const curveDirection = roundedChildX >= roundedParentCenterX + 2 ? 1 : -1

    // console.log('Values:', {
    //   childX: roundedChildX,
    //   parentCenterX: roundedParentCenterX,
    //   curveDirection,
    //   parentWidth,
    //   parentXY,
    // })

    if (curveType === 'quadratic') {
      const controlDistance = distance * 0.6
      const midX = x1 + (x2 - x1) * (controlDistance / distance)
      const midY = y1 + (y2 - y1) * (controlDistance / distance)

      const perpAngle = angle + (Math.PI / 2) * curveDirection
      const adjustedSwoop = swoop

      const controlX = midX + Math.cos(perpAngle) * adjustedSwoop
      const controlY = midY + Math.sin(perpAngle) * adjustedSwoop

      return [
        'M',
        x1.toFixed(2),
        y1.toFixed(2),
        'Q',
        controlX.toFixed(2),
        controlY.toFixed(2),
        x2.toFixed(2),
        y2.toFixed(2),
      ].join(' ')
    } else {
      // Enhanced S-curve for cubic
      const firstThird = 0.25
      const secondThird = 0.75

      const firstX = x1 + (x2 - x1) * firstThird
      const firstY = y1 + (y2 - y1) * firstThird
      const secondX = x1 + (x2 - x1) * secondThird
      const secondY = y1 + (y2 - y1) * secondThird

      const perpAngle = angle + (Math.PI / 2) * curveDirection

      const firstSwoop = swoop * 1.2
      const secondSwoop = swoop * 0.8

      const controlX1 = firstX + Math.cos(perpAngle) * firstSwoop
      const controlY1 = firstY + Math.sin(perpAngle) * firstSwoop
      const controlX2 = secondX - Math.cos(perpAngle) * secondSwoop
      const controlY2 = secondY - Math.sin(perpAngle) * secondSwoop

      return [
        'M',
        x1.toFixed(2),
        y1.toFixed(2),
        'C',
        controlX1.toFixed(2),
        controlY1.toFixed(2),
        controlX2.toFixed(2),
        controlY2.toFixed(2),
        x2.toFixed(2),
        y2.toFixed(2),
      ].join(' ')
    }
  } else if (lineType === 'orthogonal') {
    // For orthogonal lines, use the same direction logic
    const angleDegrees = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI

    // Determine if we should go vertical first or horizontal first
    const verticalFirst = Math.abs(angleDegrees) > 45

    return verticalFirst
      ? [
          'M',
          x1.toFixed(2),
          y1.toFixed(2),
          'L',
          x1.toFixed(2),
          y2.toFixed(2),
          'L',
          x2.toFixed(2),
          y2.toFixed(2),
        ].join(' ')
      : [
          'M',
          x1.toFixed(2),
          y1.toFixed(2),
          'L',
          x2.toFixed(2),
          y1.toFixed(2),
          'L',
          x2.toFixed(2),
          y2.toFixed(2),
        ].join(' ')
  }
}
