// returns a vertically curved line
export default function getVerticalCurve(originPoint, endPoint) {
  const x1 = originPoint.x
  const y1 = originPoint.y
  const x2 = endPoint.x
  const y2 = endPoint.y

  const middlePointY = (y1 + y2) / 2
  return [
    'M',
    x1.toFixed(2),
    y1.toFixed(2),
    'C',
    x1.toFixed(2),
    middlePointY.toFixed(2),
    x2.toFixed(2),
    middlePointY.toFixed(2),
    x2.toFixed(2),
    y2.toFixed(2),
  ].join(' ')
}
