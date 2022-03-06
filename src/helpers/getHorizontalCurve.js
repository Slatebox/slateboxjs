// returns a horizontally curved line
export default function getHorizontalCurve(originPoint, endPoint) {
  const x1 = originPoint.x
  const y1 = originPoint.y
  const x2 = endPoint.x
  const y2 = endPoint.y

  const middlePointX = (x1 + x2) / 2
  return [
    'M',
    x1.toFixed(2),
    y1.toFixed(2),
    'C',
    middlePointX.toFixed(2),
    y1.toFixed(2),
    middlePointX.toFixed(2),
    y2.toFixed(2),
    x2.toFixed(2),
    y2.toFixed(2),
  ].join(' ')
}
