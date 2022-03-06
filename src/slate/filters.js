import utils from '../helpers/utils'

export default class filters {
  constructor(slate) {
    this.slate = slate
    this.exposeDefaults()
  }

  addDeps(deps) {
    const self = this
    deps.forEach((d) => {
      const depDef = {
        id: utils.guid().substring(10),
        tag: d.type,
        ...d.attrs,
        inside: [],
      }
      d.nested.forEach((n) => {
        depDef.inside.push({
          type: n.type,
          attrs: n.attrs,
        })
      })
      self.slate.paper.def(depDef)
    })
  }

  add(filter, isDefault) {
    const self = this
    const filterDef = {
      id: filter.id || utils.guid().substring(10),
      tag: 'filter',
      filterUnits: 'userSpaceOnUse',
      ...filter.attrs,
      inside: [],
    }
    filter.filters.forEach((ff) => {
      if (ff.nested) {
        filterDef.inside.push({
          type: ff.type,
          nested: ff.nested,
        })
      } else {
        filterDef.inside.push({
          type: ff.type,
          attrs: ff.attrs,
        })
      }
    })
    self.slate.paper.def(filterDef)
    if (!isDefault) {
      if (!self.slate.customFilters) {
        self.slate.customFilters = []
      }
      self.slate.customFilters.push(filterDef)
    }
    return filter.id
  }

  remove(id) {
    const self = this
    self.slate?.filters.splice(
      self.slate?.filters.findIndex((f) => f.id === id)
    )
    return true
  }

  // <feGaussianBlur in="SourceAlpha" stdDeviation="3"/> <!-- stdDeviation is how much to blur -->
  // <feOffset dx="2" dy="2" result="offsetblur"/> <!-- how much to offset -->
  // <feComponentTransfer>
  //   <feFuncA type="linear" slope="0.5"/> <!-- slope is the opacity of the shadow -->
  // </feComponentTransfer>
  // <feMerge>
  //   <feMergeNode/> <!-- this contains the offset blurred image -->
  //   <feMergeNode in="SourceGraphic"/> <!-- this contains the element that the filter is applied to -->
  // </feMerge>

  exposeDefaults() {
    const self = this
    self.availableBackgrounds = [
      {
        name: 'Blackboard',
        url: '/images/backgrounds/blackboard.jpg',
        size: 'cover',
      },
      {
        name: 'Wood',
        url: '/images/backgrounds/wood.png',
      },
    ]
    self.availableFilters = {
      dropShadow: {
        levers: {
          feDropShadow: {
            stdDeviation: { label: 'distance', default: 1.5, range: [1, 10] },
            dx: { label: 'x-displacement', default: 5, range: [1, 50] },
            dy: { label: 'y-displacement', default: 5, range: [1, 50] },
          },
        },
        types: ['vect', 'line', 'image', 'text'],
        filters: [
          {
            type: 'feGaussianBlur',
            attrs: {
              stdDeviation: '3',
              in: 'SourceAlpha',
            },
          },
          {
            type: 'feOffset',
            attrs: {
              dx: '5',
              dy: '5',
              result: 'offsetblur',
            },
          },
          {
            type: 'feComponentTransfer',
            nested: [
              {
                type: 'feFuncA',
                attrs: {
                  type: 'linear',
                  slope: '0.8',
                },
              },
            ],
          },
          {
            type: 'feMerge',
            nested: [
              {
                type: 'feMergeNode',
                attrs: {},
              },
              {
                type: 'feMergeNode',
                attrs: {
                  in: 'SourceGraphic',
                },
              },
            ],
          },
        ],
      },
      postItNote: {
        types: ['vect', 'line', 'image', 'text'],
        filters: [
          {
            type: 'feGaussianBlur',
            attrs: {
              stdDeviation: '2',
              in: 'SourceAlpha',
            },
          },
          {
            type: 'feOffset',
            attrs: {
              dx: '0',
              dy: '4',
              result: 'offsetblur',
            },
          },
          {
            type: 'feComponentTransfer',
            nested: [
              {
                type: 'feFuncA',
                attrs: {
                  type: 'linear',
                  slope: '0.5',
                },
              },
            ],
          },
          {
            type: 'feMerge',
            nested: [
              {
                type: 'feMergeNode',
                attrs: {},
              },
              {
                type: 'feMergeNode',
                attrs: {
                  in: 'SourceGraphic',
                },
              },
            ],
          },
        ],
      },
      tattered: {
        levers: {
          feDisplacementMap: {
            scale: { label: 'torn', default: '10', range: [2, 50] },
          },
        },
        types: ['vect', 'line', 'image', 'text'],
        filters: [
          {
            type: 'feTurbulence',
            attrs: {
              type: 'turbulence',
              baseFrequency: '.05 .05',
              numOctaves: '05',
              seed: '2',
              stitchTiles: 'noStitch',
              result: 'turbulence',
            },
          },
          {
            type: 'feDisplacementMap',
            attrs: {
              in: 'SourceGraphic',
              in2: 'turbulence',
              scale: '10',
              xChannelSelector: 'R',
              yChannelSelector: 'B',
              result: 'displacementMap',
            },
          },
        ],
      },
      blur: {
        levers: {
          feGaussianBlur: {
            stdDeviation: { label: 'displacement', default: 2, range: [1, 10] },
          },
        },
        types: ['vect', 'line', 'image', 'text'],
        filters: [
          {
            type: 'feGaussianBlur',
            attrs: {
              stdDeviation: '2',
              in: 'SourceGraphic',
              edgeMode: 'none',
            },
          },
        ],
      },
      outline: {
        levers: {
          feMorphology: {
            radius: { label: 'cutout', default: '1', range: [1, 10] },
          },
        },
        types: ['text', 'line'],
        filters: [
          {
            type: 'feMorphology',
            attrs: {
              operator: 'dilate',
              radius: '1',
              in: 'SourceGraphic',
              result: 'thickness',
            },
          },
          {
            type: 'feComposite',
            attrs: {
              operator: 'out',
              in: 'thickness',
              in2: 'SourceGraphic',
            },
          },
        ],
      },
      pixelate: {
        levers: {
          feImage: {
            width: { label: 'width', default: '8', range: [1, 30] },
            height: { label: 'height', default: '8', range: [1, 30] },
          },
        },
        types: ['image'],
        filters: [
          // https://stackoverflow.com/questions/37451189/can-one-pixelate-images-with-an-svg-filter
          {
            type: 'feGaussianBlur',
            attrs: {
              stdDeviation: '2',
              in: 'SourceGraphic',
              result: 'smoothed',
            },
          },
          {
            type: 'feImage',
            attrs: {
              width: '8',
              height: '8',
              'xlink:href':
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAIAAAACDbGyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAWSURBVAgdY1ywgOEDAwKxgJhIgFQ+AP/vCNK2s+8LAAAAAElFTkSuQmCC',
              result: 'displacement-map',
            },
          },
          {
            type: 'feTile',
            attrs: {
              in: 'displacement-map',
              result: 'pixelate-map',
            },
          },
          {
            type: 'feDisplacementMap',
            attrs: {
              in: 'smoothed',
              in2: 'pixelate-map',
              xChannelSelector: 'R',
              yChannelSelector: 'G',
              scale: '30',
              result: 'pre-final',
            },
          },
          {
            type: 'feComposite',
            attrs: {
              operator: 'in',
              in2: 'SourceGraphic',
            },
          },
        ],
      },
      posterize: {
        levers: {},
        types: ['image'],
        filters: [
          {
            type: 'feComponentTransfer',
            nested: {
              feFuncR: {
                type: 'discrete',
                tableValues: '.25 .4 .5 .75 1',
              },
              feFuncG: {
                type: 'discrete',
                tableValues: '.25 .4 .5 .75 1',
              },
              feFuncB: {
                type: 'discrete',
                tableValues: '.25 .4 .5 .75 1',
              },
            },
          },
        ],
      },
      pencil: {
        // https://heredragonsabound.blogspot.com/2020/02/creating-pencil-effect-in-svg.html
        levers: {},
        types: ['vect', 'line', 'text', 'image'],
        filters: [
          {
            type: 'feTurbulence',
            attrs: {
              type: 'fractalNoise',
              baseFrequency: '0.03',
              numOctaves: '3',
              seed: '1',
              result: 'f1',
            },
          },
          {
            type: 'feDisplacementMap',
            attrs: {
              xChannelSelector: 'R',
              yChannelSelector: 'G',
              scale: '5',
              in: 'SourceGraphic',
              in2: 'f1',
              result: 'f4',
            },
          },
          {
            type: 'feTurbulence',
            attrs: {
              type: 'fractalNoise',
              baseFrequency: '0.03',
              numOctaves: '3',
              seed: '10',
              result: 'f2',
            },
          },
          {
            type: 'feDisplacementMap',
            attrs: {
              xChannelSelector: 'R',
              yChannelSelector: 'G',
              scale: '5',
              in: 'SourceGraphic',
              in2: 'f2',
              result: 'f5',
            },
          },
          {
            type: 'feTurbulence',
            attrs: {
              type: 'fractalNoise',
              baseFrequency: '1.2',
              numOctaves: '2',
              seed: '100',
              result: 'f3',
            },
          },
          {
            type: 'feDisplacementMap',
            attrs: {
              xChannelSelector: 'R',
              yChannelSelector: 'G',
              scale: '3',
              in: 'SourceGraphic',
              in2: 'f3',
              result: 'f6',
            },
          },
          {
            type: 'feBlend',
            attrs: { mode: 'multiply', in2: 'f4', in: 'f5', result: 'out1' },
          },
          {
            type: 'feBlend',
            attrs: { mode: 'multiply', in: 'out1', in2: 'f6', result: 'out2' },
          },
        ],
      },
    }
  }
}

// <filter id="f1" x="0" y="0" width="200%" height="200%">
//   <feOffset result="offOut" in="SourceGraphic" dx="20" dy="20" />
//   <feBlend in="SourceGraphic" in2="offOut" mode="normal" />
// </filter>

// <feBlend>
// <feColorMatrix>
// <feComponentTransfer>
// <feComposite>
// <feConvolveMatrix>
// <feDiffuseLighting>
// <feDisplacementMap>
// <feDropShadow>
// <feFlood>
// <feGaussianBlur>
// <feImage>
// <feMerge>
// <feMorphology>
// <feOffset>
// <feSpecularLighting>
// <feTile>
// <feTurbulence></feTurbulence>

// https://github.com/svgdotjs/svg.filter

// <filter id="displacementFilter">
//   <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="5" seed="2" result="turbulence"/>
//   <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="2"/>
// </filter>
