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
  curveType = 'quadratic'
) {
  const x1 = originPoint.x
  const y1 = originPoint.y
  let x2 = endPoint.x
  let y2 = endPoint.y

  // Determine the predominant direction of the connection
  const dx = Math.abs(x2 - x1)
  const dy = Math.abs(y2 - y1)
  const approachAxis = dx > dy ? 'vertical' : 'horizontal'

  if (lineType === 'bezier') {
    // Standard swoop for a natural cubic Bezier curve
    const swoop = Math.min(dx, dy) * curveSwoop // This factor can be adjusted for more or less curvature

    if (curveType === 'quadratic') {
      // Calculate control point for a quadratic Bezier curve
      const controlX =
        approachAxis === 'horizontal'
          ? (x1 + x2) / 2
          : x1 + (swoop * (y2 - y1)) / dy
      const controlY =
        approachAxis === 'horizontal'
          ? y1 + (swoop * (x2 - x1)) / dx
          : (y1 + y2) / 2

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
      let controlX1, controlY1, controlX2, controlY2

      if (approachAxis === 'horizontal') {
        controlX1 = x1 + swoop
        controlY1 = y1
        controlX2 = x2 - swoop
        controlY2 = y2
      } else {
        controlX1 = x1
        controlY1 = y1 + swoop
        controlX2 = x2
        controlY2 = y2 - swoop
      }

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
    // Generate orthogonal line (right-angle)
    return [
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
  }
}
