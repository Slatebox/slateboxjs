/* eslint-disable no-underscore-dangle */
import { WheelGestures } from 'wheel-gestures'
import utils from '../helpers/utils'

export default class inertia {
  constructor(slate) {
    this.slate = slate
    this.scale = 1
    this.wheelEnd = null
    this.xyOffset = null
    if (slate.options.viewPort.useInertiaScrolling) {
      this._init()
    }
  }

  setScale(val) {
    this.scale = val
  }

  _init() {
    const self = this
    const wheelGestures = WheelGestures({ momentum: true })

    // find and observe the element the user can interact with
    wheelGestures.observe(self.slate.canvas.internal)

    // function scale() {
    //   window.requestAnimationFrame(() => {
    //     const style = { transform: `scale(${self.scale})` } //, "transform-origin": `${self.slate.options.viewPort.left}px ${self.slate.options.viewPort.top}px` };
    //     console.log("ws is now", self.xyOffset);
    //     self.slate.canvas.internal.style["transform-origin"] = `${self.slate.options.viewPort.left + self.xyOffset.x}px ${self.slate.options.viewPort.top + self.xyOffset.y}px`;
    //     self.slate.canvas.internal.style.transform = `scale(${self.slate.options.viewPort.zoom.r})`; // = style;
    //   })
    // }

    // add your event callback
    let start = {}
    wheelGestures.on('wheel', (e) => {
      if (self.slate.options.allowDrag) {
        if (e.event.ctrlKey) {
          // will not include this for now
          // if (!self.snappedZoom) {
          //   self.snappedZoom = self.slate.options.viewPort.zoom.w;
          // }
          // self.scale -= e.event.deltaY * 0.005;
          // console.log("scale is ", e.isEnding, self.scale, self.slate.options.viewPort.zoom.r);
          // let val = self.scale * self.snappedZoom;
          // if (val > 6000 && val < 100000) {
          //   self.slate.zoomSlider.set(val);
          // }
          // //self.slate.zoom(self.scale, self.initZoomVal);
          // //scale();
          // if (e.isEnding) {
          //   delete self.snappedZoom;
          //   //self.slate?.collab?.send({ type: "onCanvasMove", data: { left: self.slate.options.viewPort.left, top: self.slate.options.viewPort.top } });
          // }
        } else {
          const deltaX = e.event.deltaX * 0.8 // .5 is the modifier to slow self down a bit
          const deltaY = e.event.deltaY * 0.8

          if (e.isStart) {
            start = utils.positionedOffset(self.slate.canvas.internal)
            // hide filters during dragging
            self.slate.toggleFilters(true)
          }
          self.slate.canvas.move({
            x: deltaX,
            y: deltaY,
            dur: 0,
            isAbsolute: false,
          })

          if (e.isEnding) {
            const end = utils.positionedOffset(self.slate.canvas.internal)
            self.slate.birdsEye?.refresh(true)
            self.slate.canvas.broadcast({
              x: start.left - end.left,
              y: start.top - end.top,
            })

            // show filters after dragging
            self.slate.toggleFilters(false)
          }
        }
      }
    })
  }
}
