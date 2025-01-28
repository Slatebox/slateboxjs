import utils from '../helpers/utils';

export default class filters {
  constructor(slate) {
    this.slate = slate;
    this.exposeDefaults();
  }

  addDeps(deps) {
    const self = this;
    deps.forEach((d) => {
      const depDef = {
        id: utils.guid().substring(10),
        tag: d.type,
        ...d.attrs,
        inside: [],
      };
      d.nested.forEach((n) => {
        if (
          n.type !== 'animate' ||
          (n.type === 'animate' && !self.slate.options.isbirdsEye)
        ) {
          depDef.inside.push({
            type: n.type,
            attrs: n.attrs,
          });
        }
      });
      self.slate.paper.def(depDef);
    });
  }

  add(filter, isDefault) {
    const self = this;
    const filterDef = {
      id: filter.id || utils.guid().substring(10),
      tag: 'filter',
      filterUnits: 'userSpaceOnUse',
      ...filter.attrs,
      inside: [],
    };
    filter.filters?.forEach((ff) => {
      if (
        ff.type !== 'animate' ||
        (ff.type === 'animate' && !self.slate.options.isbirdsEye)
      ) {
        if (ff.nested) {
          filterDef.inside.push({
            type: ff.type,
            nested: ff.nested,
          });
        } else {
          filterDef.inside.push({
            type: ff.type,
            attrs: ff.attrs,
          });
        }
      }
    });
    self.slate.paper.def(filterDef);
    if (!isDefault) {
      if (!self.slate.customFilters) {
        self.slate.customFilters = [];
      }
      self.slate.customFilters.push(filterDef);
    }
    return filter.id;
  }

  remove(id) {
    const self = this;
    self.slate?.filters.splice(
      self.slate?.filters.findIndex((f) => f.id === id)
    );
    return true;
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
    const self = this;
    const defaultTextDuration = 0.6;
    self.availableAnimations = {
      mystery: {
        id: 'sb-mystery',
        types: ['text'],
        display: 'Mystery',
        css: `
          .mystery {
            opacity: 0;
            transform-box: fill-box;
            transform-origin: center;
            animation: mystery ${defaultTextDuration}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          @keyframes mystery {
            0% {
              opacity: 0;
              transform: scale(1.2);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.1);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }`,
        description: 'Gentle fade in with subtle zoom out',
      },
      fadeSlideUp: {
        id: 'sb-fade-slide-up',
        types: ['text'],
        display: 'Fade up',
        css: `
          .fadeSlideUp {
            opacity: 0;
            transform-box: fill-box;
            transform-origin: bottom;
            animation: fadeSlideUp ${defaultTextDuration}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          @keyframes fadeSlideUp {
            0% {
              opacity: 0;
              transform: translateY(100%) rotateX(40deg);
            }
            100% {
              opacity: 1;
              transform: translateY(0) rotateX(0);
            }
          }`,
        description: 'Smooth upward rise with 3D perspective tilt',
      },
      fadeSlideDown: {
        id: 'sb-fade-slide-down',
        types: ['text'],
        display: 'Fade down',
        css: `
          .fadeSlideDown {
            opacity: 0;
            transform-box: fill-box;
            transform-origin: top;
            animation: fadeSlideDown ${defaultTextDuration}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          @keyframes fadeSlideDown {
            0% {
              opacity: 0;
              transform: translateY(-100%) rotateX(-40deg);
            }
            100% {
              opacity: 1;
              transform: translateY(0) rotateX(0);
            }
          }`,
        description: 'Graceful downward descent with 3D perspective tilt',
      },
      bumpUpIn: {
        id: 'sb-bump-up-in',
        types: ['text'],
        display: 'Bump Up',
        css: `
          .bumpUpIn {
            opacity: 0;
            transform-box: fill-box;
            transform-origin: center;
            animation: bumpUpIn ${defaultTextDuration}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          @keyframes bumpUpIn {
            0% {
              opacity: 0;
              transform: scale(0.8) rotate(-3deg) translateY(100%);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.1) rotate(2deg) translateY(-50%);
            }
            75% {
              opacity: 0.9;
              transform: scale(0.95) rotate(-1deg) translateY(25%);
            }
            100% {
              opacity: 1;
              transform: scale(1) rotate(0) translateY(0);
            }
          }`,
        description: 'Playful bounce up with slight rotation',
      },
      bumpDownIn: {
        id: 'sb-bump-down-in',
        types: ['text'],
        display: 'Bump Down',
        css: `
          .bumpDownIn {
            opacity: 0;
            transform-box: fill-box;
            transform-origin: center;
            animation: bumpDownIn ${defaultTextDuration}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          @keyframes bumpDownIn {
            0% {
              opacity: 0;
              transform: scale(0.8) rotate(3deg) translateY(-100%);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.1) rotate(-2deg) translateY(50%);
            }
            75% {
              opacity: 0.9;
              transform: scale(0.95) rotate(1deg) translateY(-25%);
            }
            100% {
              opacity: 1;
              transform: scale(1) rotate(0) translateY(0);
            }
          }`,
        description: 'Playful bounce down with slight rotation',
      },
      impactSlide: {
        id: 'sb-impact-slide',
        types: ['text'],
        display: 'Impact Slide',
        css: `
          .impactSlide {
            transform-box: fill-box;
            transform-origin: center;
            animation: impactSlide ${defaultTextDuration}s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
            opacity: 0;
          }
          @keyframes impactSlide {
            0% {
              opacity: 0;
              transform: translateX(-200%) scale(3) skew(-30deg);
            }
            30% {
              opacity: 1;
              transform: translateX(10%) scale(1.4) skew(15deg);
            }
            45% {
              transform: translateX(-5%) scale(0.9) skew(-5deg);
            }
            65% {
              transform: translateX(2%) scale(1.1) skew(2deg);
            }
            100% {
              opacity: 1;
              transform: translateX(0) scale(1) skew(0deg);
            }
          }`,
        description: 'Aggressive slide from left with dynamic scaling',
      },
      powerSmash: {
        id: 'sb-power-smash',
        types: ['text'],
        display: 'Power Smash',
        css: `
          .powerSmash {
            transform-box: fill-box;
            transform-origin: center;
            animation: powerSmash ${defaultTextDuration}s cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards;
            opacity: 0;
          }
          @keyframes powerSmash {
            0% {
              opacity: 0;
              transform: translateY(-150%) scale(0.2);
            }
            15% {
              opacity: 1;
              transform: translateY(0) scale(2);
            }
            30% {
              transform: scale(0.7) rotate(-5deg);
            }
            45% {
              transform: scale(1.3) rotate(3deg);
            }
            65% {
              transform: scale(0.95) rotate(-1deg);
            }
            100% {
              opacity: 1;
              transform: scale(1) rotate(0);
            }
          }`,
        description: 'Dramatic smash down with explosive scaling',
      },
      torqueWarp: {
        id: 'sb-torque-warp',
        types: ['text'],
        display: 'Torque Warp',
        css: `
          .torqueWarp {
            transform-box: fill-box;
            transform-origin: center;
            animation: torqueWarp ${defaultTextDuration}s cubic-bezier(0.7, -0.3, 0.1, 1.3) forwards;
            opacity: 0;
          }
          @keyframes torqueWarp {
            0% {
              opacity: 0;
              transform: translateX(-100%) scaleX(0.1) skew(45deg);
            }
            20% {
              opacity: 1;
              transform: translateX(20%) scaleX(1.5) skew(-20deg);
            }
            40% {
              transform: translateX(-10%) scaleX(0.8) skew(10deg);
            }
            60% {
              transform: translateX(5%) scaleX(1.2) skew(-5deg);
            }
            80% {
              transform: translateX(-2%) scaleX(0.9) skew(2deg);
            }
            100% {
              opacity: 1;
              transform: translateX(0) scaleX(1) skew(0);
            }
          }`,
        description: 'Energetic horizontal twist with stretching effect',
      },
      unroll: {
        id: 'sb-unroll',
        types: ['text'],
        display: 'Unroll',
        css: `
          .unroll {
            transform-box: fill-box;
            transform-origin: top;
            animation: unroll ${defaultTextDuration}s cubic-bezier(0.33, 1, 0.68, 1) forwards;
            opacity: 0;
          }
          @keyframes unroll {
            0% {
              opacity: 0;
              transform: perspective(1000px) rotateX(-180deg) scaleY(0.1);
            }
            30% {
              opacity: 1;
              transform: perspective(1000px) rotateX(-120deg) scaleY(0.3);
            }
            50% {
              transform: perspective(1000px) rotateX(-90deg) scaleY(0.5);
            }
            70% {
              transform: perspective(1000px) rotateX(-45deg) scaleY(0.8);
            }
            85% {
              transform: perspective(1000px) rotateX(-20deg) scaleY(0.9);
            }
            100% {
              opacity: 1;
              transform: perspective(1000px) rotateX(0) scaleY(1);
            }
          }`,
        description: 'Elegant unfurling motion from top like paper',
      },
      smoke: {
        id: 'sb-smoke',
        types: ['text'],
        display: 'Smoke',
        disablesFilter: true,
        css: `
          .smoke {
            transform-box: fill-box;
            transform-origin: center;
            animation: smoke ${defaultTextDuration}s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards;
            opacity: 0
          }
          @keyframes smoke {
            0% {
              opacity: 0;
              transform: scale(1.5) rotate(5deg);
              filter: blur(10px) brightness(1.2);
            }
            30% {
              opacity: 0.7;
              transform: scale(1.2) rotate(-2deg);
              filter: blur(5px) brightness(1.1);
            }
            60% {
              opacity: 0.85;
              transform: scale(1.1) rotate(1deg);
              filter: blur(3px) brightness(1.05);
            }
            80% {
              opacity: 0.95;
              transform: scale(1.05);
              filter: blur(1px) brightness(1.02);
            }
            100% {
              opacity: 1;
              transform: scale(1) rotate(0);
              filter: blur(0) brightness(1);
            }
          }

          @keyframes smokeParticles {
            0% {
              opacity: 0;
              transform: translateY(0) scale(1);
            }
            50% {
              opacity: 0.5;
              transform: translateY(-50%) scale(1.5);
            }
            100% {
              opacity: 0;
              transform: translateY(-100%) scale(2);
            }
          }`,
        description: 'Fiery emergence with smoke and heat distortion',
      },
      fractured: {
        id: 'sb-fractured',
        types: ['text'],
        display: 'Fractured',
        css: `
          .fractured {
            transform-box: fill-box;
            transform-origin: center;
            animation: fractured ${defaultTextDuration}s cubic-bezier(0.17, 0.84, 0.44, 1) forwards;
            opacity: 0;
            transform-style: preserve-3d;
          }
          @keyframes fractured {
            0% {
              opacity: 0;
              clip-path: polygon(50% 50%, 50% 50%, 50% 50%);
              transform: rotate3d(1, 1, 0, 90deg) scale(0.3);
            }
            30% {
              opacity: 0.6;
              clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
              transform: rotate3d(1, -1, 0.5, 45deg) scale(1.2);
            }
            60% {
              clip-path: polygon(0% 15%, 100% 15%, 100% 85%, 0% 85%);
              transform: rotate3d(-1, 1, -0.5, 20deg) scale(0.9);
            }
            100% {
              opacity: 1;
              clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
              transform: rotate3d(0, 0, 0, 0) scale(1);
            }
          }`,
        description: 'Sharp geometric reveal with 3D shattered effect',
      },
      flux: {
        id: 'sb-flux',
        types: ['text'],
        display: 'Flux',
        css: `
          .flux {
            transform-box: fill-box;
            transform-origin: center;
            animation: flux ${defaultTextDuration}s cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards;
            opacity: 0;
          }
          @keyframes flux {
            0% {
              opacity: 0;
              transform: scale(0.1) rotate(180deg);
              letter-spacing: 50px;
            }
            30% {
              opacity: 0.3;
              transform: scale(1.5) rotate(-90deg);
              letter-spacing: -10px;
            }
            60% {
              opacity: 0.6;
              transform: scale(0.8) rotate(45deg);
              letter-spacing: 20px;
            }
            100% {
              opacity: 1;
              transform: scale(1) rotate(0);
              letter-spacing: normal;
            }
          }`,
        description: 'Dynamic spinning letters with elastic spacing',
      },
      springy: {
        id: 'sb-springy',
        types: ['text'],
        display: 'Springy',
        css: `
          .springy {
            transform-box: fill-box;
            transform-origin: center;
            animation: springy ${defaultTextDuration}s cubic-bezier(0.37, 0, 0.63, 1) forwards;
            opacity: 0;
          }
          @keyframes springy {
            0% {
              opacity: 0;
              transform: scale(2) translate(100px, -100px);
              letter-spacing: 100px;
            }
            20% {
              opacity: 0.2;
              transform: scale(1.5) translate(-50px, 50px);
              letter-spacing: -20px;
            }
            40% {
              opacity: 0.4;
              transform: scale(0.8) translate(25px, -25px);
              letter-spacing: 30px;
            }
            60% {
              opacity: 0.6;
              transform: scale(1.2) translate(-10px, 10px);
              letter-spacing: -10px;
            }
            80% {
              opacity: 0.8;
              transform: scale(0.9) translate(5px, -5px);
              letter-spacing: 5px;
            }
            100% {
              opacity: 1;
              transform: scale(1) translate(0, 0);
              letter-spacing: normal;
            }
          }`,
        description: 'Bouncy diagonal entrance with letter stretching',
      },
      breathe: {
        id: 'sb-breathe-slow',
        types: ['vect'],
        isInfinite: true,
        display: 'Breathe',
        css: `
          .breathe {
            transform-box: fill-box;
            transform-origin: center;
            animation: breathe 4s ease-in-out infinite;
          }
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            20% { transform: scale(1.03); }
            35% { transform: scale(1.02); }
            50% { transform: scale(1.05); }
            65% { transform: scale(1.02); }
            80% { transform: scale(1.03); }
          }`,
        description: 'Subtle breathing effect with micro-movements',
      },
      pulse: {
        id: 'pulse',
        isInfinite: true,
        types: ['vect'],
        display: 'Pulse',
        css: `
          .pulse {
            transform-box: fill-box;
            transform-origin: center;
            animation: pulse ${defaultTextDuration}s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            20% { transform: scale(1.09); }
            35% { transform: scale(1.04); }
            50% { transform: scale(1.02); }
            65% { transform: scale(1.08); }
            80% { transform: scale(1.04); }
          }`,
        description: 'Intense breathing effect with micro-movements',
      },
      rotate: {
        id: 'rotate',
        isInfinite: true,
        types: ['vect'],
        display: 'Rotate',
        css: `
          .rotate {
            transform-box: fill-box;
            transform-origin: center;
            animation: rotate 8s linear infinite;
          }
          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }`,
        description: 'Smooth continuous rotation',
      },
    };
    self.availableFilters = {
      embossed: {
        types: ['vect', 'line', 'image', 'text'],
        filters: [
          {
            type: 'feGaussianBlur',
            attrs: {
              stdDeviation: '1.5',
              in: 'SourceAlpha',
            },
          },
          {
            type: 'feOffset',
            attrs: {
              dx: '1',
              dy: '1',
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
                  slope: '10',
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
      dropShadow: {
        display: 'drop shadow',
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
        display: 'post-it note',
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
      blur: {
        levers: {
          feGaussianBlur: {
            stdDeviation: { label: 'displacement', default: 2, range: [1, 10] },
          },
        },
        types: ['vect', 'line', 'image'],
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
        attrs: {
          filterUnits: 'userSpaceOnUse',
          primitiveUnits: 'objectBoundingBox',
        },
        types: ['text', 'line'],
        filters: [
          {
            type: 'feMorphology',
            attrs: {
              operator: 'dilate',
              radius: '0.003 0.015', // x y values - making vertical (y) thicker
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
      sketchy: {
        types: ['vect', 'line', 'text', 'image'],
        attrs: {
          filterUnits: 'userSpaceOnUse',
          primitiveUnits: 'objectBoundingBox',
        },
        filters: [
          {
            type: 'feTurbulence',
            attrs: {
              baseFrequency: '0.005 0.005',
              numOctaves: 2,
              result: 'turbulence',
            },
          },
          {
            type: 'feDisplacementMap',
            attrs: {
              in2: 'turbulence',
              in: 'SourceGraphic',
              scale: 0.02,
              xChannelSelector: 'R',
              yChannelSelector: 'G',
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
        ],
      },
      rollWaves: {
        display: 'roll waves',
        types: ['text'],
        attrs: {
          filterUnits: 'objectBoundingBox',
          primitiveUnits: 'objectBoundingBox',
          x: '0',
          y: '0',
          width: '1',
          height: '1',
        },
        animated: true,
        filters: [
          {
            type: 'feTurbulence',
            attrs: {
              type: 'fractalNoise',
              baseFrequency: '0.005 0.2', // Wider horizontal waves
              numOctaves: '3', // More complex pattern
              result: 'noise',
            },
            nested: [
              {
                type: 'animate',
                attrs: {
                  attributeName: 'baseFrequency',
                  values: '0.005 0.2;0.005 0.4;0.005 0.2', // Vertical wave motion
                  dur: '3s',
                  repeatCount: 'indefinite',
                  calcMode: 'spline',
                  keySplines: '0.4 0 0.2 1',
                },
              },
            ],
          },
          {
            type: 'feDisplacementMap',
            attrs: {
              in: 'SourceGraphic',
              in2: 'noise',
              scale: '120', // Dramatically increased displacement
              xChannelSelector: 'G', // Use green channel for vertical displacement
              yChannelSelector: 'G',
            },
            nested: [
              {
                type: 'animate',
                attrs: {
                  attributeName: 'scale',
                  values: '120;80;120', // Pulse effect
                  dur: '1s',
                  repeatCount: 'indefinite',
                  calcMode: 'spline',
                  keySplines: '0.4 0 0.6 1',
                },
              },
            ],
          },
        ],
      },
    };
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
