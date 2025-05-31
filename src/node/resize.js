/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import throttle from 'lodash.throttle';
import clone from 'lodash.clone';
import kdTree from 'static-kdtree';
import { fabric } from 'fabric';
import utils from '../helpers/utils';
import sbIcons from '../helpers/sbIcons';

export default class resize {
  constructor(slate, node) {
    const self = this;

    self.slate = slate;
    self.node = node;
    self.resize = null;
    self.resizeTemp = null;

    self.origX = null;
    self.origY = null;
    self.lastDx = null;
    self.lastDy = null;
    self._minWidth = 5;
    self._minHeight = 5;
    self._dragAllowed = false;
    self._origWidth = null;
    self._origHeight = null;
    self._isResizing = false;
    self.origPath = null;
    self.origPoint = {};

    self.resizeEvents = {
      start() {
        const s = this;

        self.node.toggleImage({ active: true, keepResizerOpen: true });
        self.origPath = self.node.options.vectorPath;
        self.origPoint = self.node.options.rotate.point;
        self.origX = self.resizeTemp.attr('x');
        self.origY = self.resizeTemp.attr('y');
        self.node.options.hasResized = true;

        // create a huge dragging area in order to prevent mouse from losing focus on the correct element
        self.resizeTemp.attr({
          x: self.resizeTemp.attr('x') - 1000,
          y: self.resizeTemp.attr('y') - 1000,
          width: 10000,
          height: 10000,
        });

        self.slate.isBeingResized = true;

        self.node.relationships.updateAssociationsWith({
          activeNode: self.node.options.id,
          currentDx: 0,
          currentDy: 0,
          action: 'resize',
        });

        self.lastDx = 0;
        self.lastDy = 0;
        const bbr = self.resize.getBBox();
        self.resize.ox = bbr.x;
        self.resize.oy = bbr.y;

        self._isResizing = true;

        self.slate.multiSelection?.end();

        // the resize coords at the start
        s.ox = s.attr('x');
        s.oy = s.attr('y');

        self.node.setStartDrag();
        self.node.connectors.remove();
        self.node.rotate.hide();

        self._dragAllowed = self.slate.options.allowDrag;
        self.slate.disable(false, true);

        if (self.node.options.text !== ' ') {
          self._minWidth = 10;
          self._minHeight = 10;
        }

        self._origWidth = self.node.options.width;
        self._origHeight = self.node.options.height;

        self.foreignPoints = self.slate.nodes.allNodes
          .filter((n) => n.options.id !== self.node.options.id)
          .map((n) => ({
            id: n.options.id,
            bbox: n.vect.getBBox(),
            point: [n.options.xPos, n.options.yPos],
          }));
        self.kdTree = kdTree(self.foreignPoints.map((fp) => fp.point));
        self.node.relationships.conditionallyHideAll();
        self.slate.toggleFilters(false);
      },
      move(dx, dy) {
        const s = this;
        try {
          const zoomRatio = self.slate.options.viewPort.zoom.r;

          // for snapping
          if (
            self.slate.options.viewPort.showGrid &&
            self.slate.options.viewPort.snapToGrid
          ) {
            const gridSize = self.slate.options.viewPort.gridSize || 10;
            dx = Math.round(dx / gridSize) * gridSize;
            dy = Math.round(dy / gridSize) * gridSize;
          }

          dx += dx / zoomRatio - dx;
          dy += dy / zoomRatio - dy;

          const nearest = self.kdTree.knn(
            [self.node.options.xPos, self.node.options.yPos],
            5
          );
          nearest.forEach((n) => {
            self.node.gridLines.draw(
              self.foreignPoints[n].id,
              dx,
              dy,
              self.foreignPoints[n].bbox,
              false,
              200
            );
          });

          const { transWidth, transHeight } =
            utils.obtainProportionateWidthAndHeightForResizing(
              dx,
              dy,
              self._origWidth,
              self._origHeight,
              self.node.options.shapeHint === 'custom'
                ? self.node.options.origVectWidth
                : null,
              self.node.options.shapeHint === 'custom'
                ? self.node.options.origVectHeight
                : null,
              self.slate.isCtrl,
              self.node.options.shapeHint === 'custom'
            );

          if (transWidth > self._minWidth) {
            s.attr({ x: s.ox + dx });
          } else {
            s.attr({ x: s.ox });
          }

          if (transHeight > self._minHeight) {
            s.attr({ y: s.oy + dy });
          } else {
            s.attr({ y: s.oy });
          }

          // Update resize handle position
          self.resize.set({
            left: self.resize.ox + dx,
            top: self.resize.oy + dy,
          });
          self.slate.paper.requestRenderAll();

          self.node.events?.onResizing?.apply(self, [transWidth, transHeight]);

          self.set(transWidth, transHeight, {
            isMoving: true,
            getRotationPoint: self.node.options.rotate.rotationAngle,
          });
          self.node.images.imageSizeCorrection();
          self.lastDx = dx * 2;
          self.lastDy = dy * 2;
        } catch (err) {
          finalize();
        }
      },
      async up() {
        self.slate.toggleFilters(false);
        finalize();
      },
    };

    function finalize() {
      self.node.vect.attr({ path: self.node.options.vectorPath });
      self.node.relationships.showAll(true);
      self.slate.isBeingResized = false;

      self._isResizing = false;
      self.slate.enable(false, true);
      self.resize.remove();
      self.resizeTemp.remove();
      self.node.setEndDrag();

      const _bbox = self.node.vect.getBBox();
      self.node.toggleImage({
        active: false,
        width: _bbox.width,
        height: _bbox.height,
      });

      self.node.options.width = _bbox.width;
      self.node.options.height = _bbox.height;
      self.node.options.xPos = _bbox.x;
      self.node.options.yPos = _bbox.y;
      if (self.node.options.image) {
        self.node.options.ignoreTextFit = true;
      } else {
        self.node.options.ignoreTextFit = false;
      }

      self.node.editor.setTextOffset();
      self.node.text.attr(
        self.node.textCoords({
          x: self.node.options.xPos,
          y: self.node.options.yPos,
        })
      );

      self.node.gridLines.clear();
      delete self.foreignPoints;
      delete self.kdTree;

      if (self.node.events && self.node.events?.onResized) {
        self.node.events.onResized.apply(self, [self.send]);
      } else {
        self.send();
      }
    }
  }

  show(x, y) {
    const self = this;
    if (self.node.options.allowResize) {
      self.resizeTemp?.remove();

      // Create FabricJS resize handle
      const resizePath = utils._transformPath(
        sbIcons.icons.resize,
        `t${x - 5},${y - 5} r95`
      );

      self.resize = new fabric.Path(resizePath, {
        left: x - 5,
        top: y - 5,
        fill: '#fff',
        stroke: '#000',
        selectable: false,
        evented: false,
      });

      self.resizeTemp = new fabric.Rect({
        left: x - 6,
        top: y - 6,
        width: 20,
        height: 20,
        fill: '#f00',
        opacity: 0.00000001,
        selectable: false,
        evented: true,
        hoverCursor: 'pointer',
        moveCursor: 'pointer',
      });

      // Add Raphael-like methods for compatibility
      self.addResizeCompatibilityMethods(self.resize);
      self.addResizeCompatibilityMethods(self.resizeTemp);

      // Add to canvas
      self.slate.paper.add(self.resize);
      self.slate.paper.add(self.resizeTemp);

      // Bring resize temp to front
      self.slate.paper.bringToFront(self.resizeTemp);

      // Set up events
      self.resizeTemp.on('mouseover', (e) => {
        self.node.overMenuButton = true;
        self.resizeTemp.set('hoverCursor', 'pointer');
      });

      self.resizeTemp.on('mouseout', (e) => {
        self.node.overMenuButton = false;
      });

      // Set up FabricJS drag events for resize
      self.setupResizeDragEvents();

      return self.resize;
    }
  }

  /**
   * Set up FabricJS drag events for resize handle
   */
  setupResizeDragEvents() {
    const self = this;
    let isDragging = false;
    let dragStarted = false;
    let startX, startY;

    self.resizeTemp.on('mousedown', (options) => {
      const pointer = self.slate.paper.getPointer(options.e);
      startX = pointer.x;
      startY = pointer.y;
      dragStarted = false;
      isDragging = true;

      // Call the start event
      self.resizeEvents.start.call(self.resizeTemp);

      const onMouseMove = (e) => {
        if (!isDragging) return;

        const currentPointer = self.slate.paper.getPointer(e.e);
        const dx = currentPointer.x - startX;
        const dy = currentPointer.y - startY;

        if (!dragStarted && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
          dragStarted = true;
        }

        if (dragStarted) {
          self.resizeEvents.move.call(self.resizeTemp, dx, dy);
        }
      };

      const onMouseUp = (e) => {
        if (isDragging) {
          isDragging = false;

          self.slate.paper.off('mouse:move', onMouseMove);
          self.slate.paper.off('mouse:up', onMouseUp);

          self.resizeEvents.up.call(self.resizeTemp);
        }
      };

      self.slate.paper.on('mouse:move', onMouseMove);
      self.slate.paper.on('mouse:up', onMouseUp);
    });
  }

  /**
   * Add Raphael-like methods to resize objects
   */
  addResizeCompatibilityMethods(obj) {
    obj.attr = function (attrs) {
      if (attrs) {
        Object.keys(attrs).forEach((key) => {
          switch (key) {
            case 'x':
              this.set('left', attrs[key]);
              break;
            case 'y':
              this.set('top', attrs[key]);
              break;
            case 'width':
              this.set('width', attrs[key]);
              break;
            case 'height':
              this.set('height', attrs[key]);
              break;
            case 'cursor':
              this.set('hoverCursor', attrs[key]);
              this.set('moveCursor', attrs[key]);
              break;
            default:
              this.set(key, attrs[key]);
              break;
          }
        });
        this.canvas?.requestRenderAll();
        return this;
      } else {
        return {
          x: this.left,
          y: this.top,
          width: this.width,
          height: this.height,
        };
      }
    };

    obj.remove = function () {
      if (this.canvas) {
        this.canvas.remove(this);
      }
    };

    obj.getBBox = function () {
      const bounds = this.getBoundingRect();
      return {
        x: bounds.left,
        y: bounds.top,
        width: bounds.width,
        height: bounds.height,
        cx: bounds.left + bounds.width / 2,
        cy: bounds.top + bounds.height / 2,
      };
    };

    obj.toFront = function () {
      if (this.canvas) {
        this.canvas.bringToFront(this);
      }
    };
  }

  hide() {
    this.resizeTemp?.remove();
    this.resize?.remove();
  }

  send() {
    // broadcast change to birdsEye and collaborators
    const textAttrs = this.node.text.attr();
    const pkg = {
      type: 'onNodeResized',
      data: {
        id: this.node.options.id,
        textPosition: {
          x: textAttrs.x,
          y: textAttrs.y,
        },
        rotate: this.node.options.rotate,
        vectorPath: this.node.options.vectorPath,
        associations: this.node.relationships.associations.map((a) => ({
          parentId: a.parent.options.id,
          childId: a.child.options.id,
          linePath: a.line.attr('path') || a.line.path,
        })),
      },
    };
    const currentRotationPoint = clone(this.node.options.rotate.point);
    this.slate.birdsEye?.nodeChanged(pkg);
    this.node.options.rotate.point = currentRotationPoint;
    this.slate.collab?.send(pkg);
  }

  lazySend() {
    throttle(this.send, 700);
  }

  animateSet(data, opts) {
    const self = this;
    self.node.text.animate(
      data.textPosition,
      opts.duration || 500,
      opts.easing || '>'
    );
    self.node.vect.animate(
      {
        path: data.vectorPath,
      },
      opts.duration || 500,
      opts.easing || '>',
      () => {
        const { image, imageOrigHeight, imageOrigWidth } = self.node.options;
        if (image && !!imageOrigHeight && !!imageOrigWidth) {
          self.node.images.imageSizeCorrection();
        }
      }
    );

    opts.associations.forEach((assoc) => {
      const a = self.node.relationships.associations.find(
        (ax) =>
          ax.parent.options.id === assoc.parentId &&
          ax.child.options.id === assoc.childId
      );
      if (opts.animate) {
        if (a) {
          a.line.animate(
            { path: assoc.linePath },
            opts.duration || 500,
            opts.easing || '>',
            () => {
              a.line.attr({ path: assoc.linePath });
            }
          );
        }
      } else if (a) a.line.attr({ path: assoc.linePath });
    });
  }

  set(width, height, opts = {}) {
    const self = this;

    let pathWithPotentialTransformations =
      self.node.vect.attr('path') ||
      self.node.vect.path ||
      self.node.options.vectorPath;

    if (opts.getRotationPoint) {
      self.origPoint = self.node.options.rotate.point;
    }

    // Handle rotation - for now we'll use a simplified approach since we don't have Raphael.transformPath
    if (
      self.origPoint &&
      Object.entries(self.origPoint).length > 0 &&
      self.node.options.rotate.rotationAngle > 0
    ) {
      // TODO: Implement FabricJS equivalent of Raphael.transformPath for rotation
      // For now, we'll work with the base path
    }

    // Reset transforms
    if (self.node.vect.transform) {
      self.node.vect.transform('');
    }
    if (self.node.text.transform) {
      self.node.text.transform('');
    }

    self.node.vect.attr({ path: pathWithPotentialTransformations });
    const rotationBB = self.node.vect.getBBox();

    let widthScalar = 1;
    let heightScalar = 1;

    if (width > self._minWidth) {
      widthScalar = width / rotationBB.width;
      self.node.options.width = width;
    } else {
      widthScalar = self._minWidth / rotationBB.width;
      self.node.options.width = self._minWidth;
    }

    if (height > self._minHeight) {
      heightScalar = height / rotationBB.height;
      self.node.options.height = height;
    } else {
      heightScalar = self._minHeight / rotationBB.height;
      self.node.options.height = self._minHeight;
    }

    // Apply scaling to the FabricJS object
    self.node.vect.set({
      scaleX: widthScalar,
      scaleY: heightScalar,
    });

    // Update the stored path
    self.node.options.vectorPath = pathWithPotentialTransformations;
    const noRotationBB = self.node.vect.getBBox();

    self.node.options.rotate.point = {
      x: noRotationBB.cx,
      y: noRotationBB.cy,
    };
    self.node.setPosition({ x: noRotationBB.x, y: noRotationBB.y }, true);

    self.node.rotate.applyImageRotation();

    const lc = self.node.linkCoords();
    // Update link position and scaling
    self.node.link.set({
      left: lc.x,
      top: lc.y,
      scaleX: 0.8,
      scaleY: 0.8,
      angle: 180,
    });

    self.node.relationships.refreshOwnRelationships();

    self.node.editor.setTextOffset();
    self.node.text.attr(
      self.node.textCoords({
        x: self.node.options.xPos,
        y: self.node.options.yPos,
      })
    );
  }
}
