const kCSSFontFacePattern = /(@font\-face {[\s\S]*?})/g
const kCSSUrlPattern = /url\((https.+?)\)/

function fontToDataURLViaBlob(fontUrl) {
  return fetch(fontUrl)
    .then((fontResponse) => fontResponse.blob())
    .then(
      (fontBlob) =>
        new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => {
            resolve(reader.result)
          }
          reader.readAsDataURL(fontBlob)
        })
    )
}

function fontToDataURLViaBuffer(fontUrl) {
  return fetch(fontUrl)
    .then((fontResponse) =>
      Promise.all([
        Promise.resolve(fontResponse.headers.get('content-type')),
        fontResponse.buffer(),
      ])
    )
    .then((fontBuffer) => {
      const b64 = fontBuffer[1].toString('base64')
      return `data:${fontBuffer[0]};base64,${b64}`
    })
}

function embedFont(fontFace) {
  const fontUrlMatch = kCSSUrlPattern.exec(fontFace)
  let promise
  if (typeof FileReader !== 'undefined') {
    promise = fontToDataURLViaBlob(fontUrlMatch[1])
  } else {
    promise = fontToDataURLViaBuffer(fontUrlMatch[1])
  }
  return promise.then((dataURL) => fontFace.replace(fontUrlMatch[1], dataURL))
}

function embedGoogleFonts({ fonts, text, styleNode }) {
  const snode = styleNode
  const fontQuery = fonts.join('|').replace(/ /g, '+')
  const googleFontUrl = `https://fonts.googleapis.com/css?family=${fontQuery}&text=${text}`
  if (fonts.length > 0) {
    return fetch(googleFontUrl)
      .then((cssResponse) => cssResponse.text())
      .catch((error) => {
        console.error('Failed to load Google font CSS:', error)
        return false
      })
      .then((cssText) => {
        let fontFaces = kCSSFontFacePattern.exec(cssText)
        const embedFontPromises = []
        while (fontFaces != null) {
          embedFontPromises.push(embedFont(fontFaces[1]))
          fontFaces = kCSSFontFacePattern.exec(cssText)
        }
        return Promise.all(embedFontPromises)
      })
      .catch((error) => {
        console.error('Failed to load Google font CSS:', error)
        return false
      })
      .then((results) => {
        snode.innerHTML += results.join('\n')
        return true
      })
  }
  return Promise.resolve(true)
}

export default embedGoogleFonts
