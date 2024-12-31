import { JSDOM } from 'jsdom'

async function setup() {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost:1234',
    pretendToBeVisual: true,
    resources: 'usable',
    runScripts: 'dangerously',
  })

  // Set up all required globals
  global.window = dom.window
  global.document = dom.window.document
  global.navigator = dom.window.navigator
  global.HTMLElement = dom.window.HTMLElement
  global.SVGElement = dom.window.SVGElement
  global.Element = dom.window.Element
  global.Node = dom.window.Node
  global.XMLHttpRequest = dom.window.XMLHttpRequest
  global.DOMParser = dom.window.DOMParser
}

export default setup
