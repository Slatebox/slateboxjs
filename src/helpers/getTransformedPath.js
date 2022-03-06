/* eslint-disable no-underscore-dangle */
import utils from './utils'

export default function getTransformedPath(originalPath, transforms) {
  let transformsArray = transforms
  let transformedPath = originalPath
  if (!transforms.find && typeof transforms === 'string') {
    transformsArray = [transforms]
  }
  // NOTE: it's safer to apply transforms one by one because this transform string `T${_x * percent}, ${_y * percent}, s${_width/150 * percent}, ${_height/100 * percent}, ${_x}, ${_y}`
  //      would be applied incorrectly - element would be translated using the center of scaling ${_x}, ${_y} which seems to be a bug in raphael.js
  transformsArray.forEach((transform) => {
    transformedPath = utils
      ._transformPath(transformedPath, transform)
      .toString()
  })

  return transformedPath
}
