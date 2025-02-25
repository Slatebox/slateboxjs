/* eslint-disable no-underscore-dangle */
import { WheelGestures } from 'wheel-gestures';
import utils from '../helpers/utils';

export default class inertia {
  constructor(slate) {
    this.slate = slate;
    this.scale = 1;
    this.wheelEnd = null;
    this.xyOffset = null;
    if (slate.options.viewPort.useInertiaScrolling) {
      this._init();
    }
  }

  setScale(val) {
    this.scale = val;
  }

  _init() {
    const self = this;
    const wheelGestures = WheelGestures({ momentum: true });

    // Add touch event listeners for pinch zoom
    let initialDistance = 0;
    self.slate.canvas.internal.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    });

    self.slate.canvas.internal.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );

        const scale = currentDistance / initialDistance;
        // Adjust zoom based on your needs
        self.slate.zoomSlider.set(self.slate.options.viewPort.zoom.w * scale);

        e.preventDefault(); // Prevent default browser pinch zoom
      }
    });

    // find and observe the element the user can interact with
    wheelGestures.observe(self.slate.canvas.internal);

    // function scale() {
    //   window.requestAnimationFrame(() => {
    //     const style = { transform: `scale(${self.scale})` } //, "transform-origin": `${self.slate.options.viewPort.left}px ${self.slate.options.viewPort.top}px` };
    //     console.log("ws is now", self.xyOffset);
    //     self.slate.canvas.internal.style["transform-origin"] = `${self.slate.options.viewPort.left + self.xyOffset.x}px ${self.slate.options.viewPort.top + self.xyOffset.y}px`;
    //     self.slate.canvas.internal.style.transform = `scale(${self.slate.options.viewPort.zoom.r})`; // = style;
    //   })
    // }

    // add your event callback
    let start = {};
    wheelGestures.on('wheel', (e) => {
      if (self.slate.options.allowDrag) {
        if (e.event.ctrlKey) {
          // Simple zoom calculation
          const delta = -e.event.deltaY * 0.01;
          const currentZoom = self.slate.options.viewPort.zoom.w;
          const newZoom = currentZoom * (1 + delta);

          if (newZoom > 100 && newZoom < 200000) {
            self.slate.zoomSlider.set(newZoom);
          }

          if (e.isEnding) {
            self.slate.birdsEye?.refresh(true);
          }
        } else {
          const deltaX = e.event.deltaX * 0.8; // .5 is the modifier to slow self down a bit
          const deltaY = e.event.deltaY * 0.8;

          if (e.isStart) {
            start = utils.positionedOffset(self.slate.canvas.internal);
            // hide filters during dragging
            self.slate.toggleFilters(true);
          }
          self.slate.canvas.move({
            x: deltaX,
            y: deltaY,
            dur: 0,
            isAbsolute: false,
          });

          if (e.isEnding) {
            const end = utils.positionedOffset(self.slate.canvas.internal);
            self.slate.birdsEye?.refresh(true);
            self.slate.canvas.broadcast({
              x: start.left - end.left,
              y: start.top - end.top,
            });

            // show filters after dragging
            self.slate.toggleFilters(false);
          }
        }
      }
    });
  }
}
