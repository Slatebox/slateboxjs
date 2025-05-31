/* eslint-disable no-param-reassign */
import utils from '../helpers/utils';
import { fabric } from 'fabric';

export default class editor {
  constructor(slate, node) {
    this.slate = slate;
    this.node = node;
    this.isEditing = false;
  }

  setTextOffset() {
    if (this.node.options.allowDrag) {
      this.node.options.textBounds = this.node.vect.getBBox();
      this.node.options.textOffset = {
        x:
          this.node.options.textBounds.cx -
          this.node.options.textBounds.width / 2 -
          this.node.options.xPos,
        y: this.node.options.textBounds.cy - this.node.options.yPos,
        width: this.node.options.textBounds.width,
        height: this.node.options.textBounds.height,
      };
    }
  }

  set(t, s, f, c, opacity, ta, tb, isCategory) {
    const tempShim = `§`; // utils.guid().substring(3);

    if (!t && t !== '') {
      t = this.node.options.text || tempShim;
    }
    if (!s) {
      s = this.node.options.fontSize || 12;
    }
    if (opacity == null) {
      opacity = this.node.options.textOpacity || 1;
    }
    if (!f) {
      f = this.node.options.fontFamily || 'Roboto';
    }
    if (!c) {
      c = this.node.options.foregroundColor || '#000';
    }
    if (!ta) {
      ta = this.node.options.textXAlign || 'middle';
    }
    if (!tb) {
      tb = this.node.options.textYAlign || 'middle';
    }

    // ensure text is always legible if it is set to the same as background
    let nodeOpacity = 1;
    try {
      nodeOpacity = parseFloat(this.node.options.opacity) ?? 0;
    } catch (e) {
      console.error('Error parsing node opacity', e);
    }
    if (c === this.node.options.backgroundColor && nodeOpacity > 0.5) {
      c = utils.whiteOrBlack(this.node.options.backgroundColor);
    }

    this.node.options.text = t;
    this.node.options.fontSize = s;
    this.node.options.fontFamily = f;
    this.node.options.foregroundColor = c;
    this.node.options.textOpacity = opacity;
    this.node.options.textXAlign = ta;
    this.node.options.textYAlign = tb;

    if (
      this.slate.options.autoResizeNodesBasedOnText &&
      !this.node.options.ignoreTextFit
    ) {
      let widthScalar = 1;
      let heightScalar = 1;
      let nodebb = this.node.vect.getBBox();
      if (this.node.options.text !== tempShim) {
        const textDimens = utils.getTextWidth(
          this.node.options.text,
          `${this.node.options.fontSize}pt ${this.node.options.fontFamily}`
        );

        const { transWidth, transHeight } =
          utils.obtainProportionateWidthAndHeightForResizing(
            0,
            0,
            textDimens.width,
            textDimens.height,
            this.node.options.origVectWidth,
            this.node.options.origVectHeight,
            this.slate.isCtrl,
            this.node.options.shapeHint === 'custom'
          );

        widthScalar = transWidth / nodebb.width;
        heightScalar = transHeight / nodebb.height;
      }

      // TODO: Replace Raphael.transformPath with FabricJS equivalent
      // For now, we'll update the path directly
      const scaledVectPath = utils
        ._transformPath(
          this.node.options.vectorPath,
          `s${widthScalar}, ${heightScalar}`
        )
        .toString();
      this.node.options.vectorPath = scaledVectPath;
      this.node.vect.attr({ path: scaledVectPath });
      nodebb = this.node.vect.getBBox();
      this.node.options.width = nodebb.width;
      this.node.options.height = nodebb.height;
      this.node.options.xPos = nodebb.x;
      this.node.options.yPos = nodebb.y;
      this.node.relationships &&
        this.node.relationships.refreshOwnRelationships();
    }

    let coords = null;
    this.setTextOffset();
    coords = this.node.textCoords();

    if (!this.node.text) {
      // Determine if we need editable text
      const useEditableText = this.shouldUseEditableText();

      // Create FabricJS text object
      this.node.text = useEditableText
        ? new fabric.IText(
            t || '',
            this.createTextOptions(coords, s, f, c, opacity, ta, tb)
          )
        : new fabric.Text(
            t || '',
            this.createTextOptions(coords, s, f, c, opacity, ta, tb)
          );

      // Add event listeners for editable text
      if (useEditableText) {
        this.setupEditableTextEvents();
      }

      // Add Raphael-like methods for compatibility
      this.addTextCompatibilityMethods();

      // Set node attribute for reference
      const dragRider = this.node.options.disableDrag ? 'nodrag_' : '';
      this.node.text.set('rel', `${dragRider}text-${this.node.options.id}`);

      // Add to canvas
      this.slate.paper.add(this.node.text);
    }

    // Update coordinates
    coords = this.node.textCoords({
      x: this.node.options.xPos,
      y: this.node.options.yPos,
    });
    this.node.text.attr(coords);

    // Update text properties
    this.node.text.attr({ text: t });
    this.node.text.attr({ 'font-size': `${s}pt` });
    this.node.text.attr({ 'font-family': f });
    this.node.text.attr({ fill: c });
    this.node.text.attr({ 'text-anchor': ta });
    this.node.text.attr({ 'text-baseline': tb });
    this.node.text.attr({ 'fill-opacity': opacity });
    this.node.text.attr({ class: 'slatebox-text' });

    if (tempShim === t) {
      this.node.options.text = '';
      this.node.text.attr({ text: '' });
    } else {
      setTimeout(() => {
        this.node.text.attr({ text: t });
      }, 10);
    }
  }

  /**
   * Determine if editable text should be used
   */
  shouldUseEditableText() {
    // Use IText for nodes that are not read-only and allow editing
    return (
      !this.slate.isReadOnly() &&
      this.node.options.allowMenu &&
      !this.node.options.isLocked &&
      !this.slate.options.isbirdsEye
    );
  }

  /**
   * Create text options for FabricJS text objects
   */
  createTextOptions(coords, s, f, c, opacity, ta, tb) {
    return {
      left: this.node.options.xPos + coords.x,
      top: this.node.options.yPos + coords.y,
      fontSize: s,
      fontFamily: f,
      fill: c,
      opacity: opacity,
      textAlign: ta === 'middle' ? 'center' : ta,
      originX: ta === 'middle' ? 'center' : 'left',
      originY: tb === 'middle' ? 'center' : 'top',
      selectable: false,
      hoverCursor: 'default',
      moveCursor: 'default',
      editable: true,
      splitByGrapheme: false, // Better text editing experience
    };
  }

  /**
   * Set up event listeners for editable text
   */
  setupEditableTextEvents() {
    // Text editing started
    this.node.text.on('editing:entered', () => {
      this.isEditing = true;
      this.slate.options.allowDrag = false; // Disable canvas dragging during text edit

      // Notify that text editing started
      if (this.slate.events.onTextEditStart) {
        this.slate.events.onTextEditStart.apply(this.node, [
          this.node.options.id,
        ]);
      }
    });

    // Text editing finished
    this.node.text.on('editing:exited', () => {
      this.isEditing = false;
      this.slate.options.allowDrag = true; // Re-enable canvas dragging

      // Update node options with new text
      this.node.options.text = this.node.text.text;

      // Notify that text editing finished
      if (this.slate.events.onTextEditEnd) {
        this.slate.events.onTextEditEnd.apply(this.node, [
          this.node.options.id,
          this.node.text.text,
        ]);
      }

      // Send collaboration update
      if (this.slate.collab) {
        this.slate.collab.send({
          type: 'onNodeTextChanged',
          data: {
            id: this.node.options.id,
            text: this.node.text.text,
          },
        });
      }
    });

    // Text changed during editing
    this.node.text.on('changed', () => {
      if (this.isEditing) {
        // Auto-resize if enabled
        if (
          this.slate.options.autoResizeNodesBasedOnText &&
          !this.node.options.ignoreTextFit
        ) {
          this.autoResizeToText();
        }
      }
    });
  }

  /**
   * Auto-resize node based on text content
   */
  autoResizeToText() {
    const textDimens = utils.getTextWidth(
      this.node.text.text,
      `${this.node.options.fontSize}pt ${this.node.options.fontFamily}`
    );

    const { transWidth, transHeight } =
      utils.obtainProportionateWidthAndHeightForResizing(
        0,
        0,
        textDimens.width,
        textDimens.height,
        this.node.options.origVectWidth,
        this.node.options.origVectHeight,
        this.slate.isCtrl,
        this.node.options.shapeHint === 'custom'
      );

    // Update node size
    if (this.node.resize) {
      this.node.resize.set(transWidth, transHeight);
    }
  }

  /**
   * Start editing text programmatically
   */
  startEditing() {
    if (this.node.text && this.node.text.type === 'i-text' && !this.isEditing) {
      this.node.text.enterEditing();
      this.node.text.selectAll();
    }
  }

  /**
   * Stop editing text programmatically
   */
  stopEditing() {
    if (this.node.text && this.node.text.type === 'i-text' && this.isEditing) {
      this.node.text.exitEditing();
    }
  }

  /**
   * Add Raphael-compatible methods to text objects
   */
  addTextCompatibilityMethods() {
    this.node.text.attr = function (attrs) {
      if (attrs) {
        Object.keys(attrs).forEach((key) => {
          switch (key) {
            case 'text':
              this.set('text', attrs[key]);
              break;
            case 'font-size':
              this.set('fontSize', parseInt(attrs[key].replace('pt', '')));
              break;
            case 'font-family':
              this.set('fontFamily', attrs[key]);
              break;
            case 'fill':
              this.set('fill', attrs[key]);
              break;
            case 'text-anchor':
              this.set(
                'textAlign',
                attrs[key] === 'middle' ? 'center' : attrs[key]
              );
              this.set('originX', attrs[key] === 'middle' ? 'center' : 'left');
              break;
            case 'text-baseline':
              this.set('originY', attrs[key] === 'middle' ? 'center' : 'top');
              break;
            case 'fill-opacity':
              this.set('opacity', attrs[key]);
              break;
            case 'x':
              this.set('left', attrs[key]);
              break;
            case 'y':
              this.set('top', attrs[key]);
              break;
            case 'class':
            case 'style':
              // Ignore style attributes for now
              break;
            default:
              // Try to set directly
              try {
                this.set(key, attrs[key]);
              } catch (e) {
                // Ignore unsupported attributes
              }
              break;
          }
        });
        this.canvas?.requestRenderAll();
        return this;
      } else {
        // Return current attributes in Raphael format
        return {
          text: this.text,
          'font-size': this.fontSize + 'pt',
          'font-family': this.fontFamily,
          fill: this.fill,
          'text-anchor':
            this.textAlign === 'center' ? 'middle' : this.textAlign,
          'fill-opacity': this.opacity,
          x: this.left,
          y: this.top,
        };
      }
    };

    // Add other Raphael-like methods
    this.node.text.hide = function () {
      this.set('visible', false);
      this.canvas?.requestRenderAll();
    };

    this.node.text.show = function () {
      this.set('visible', true);
      this.canvas?.requestRenderAll();
    };

    this.node.text.toFront = function () {
      if (this.canvas) {
        this.canvas.bringToFront(this);
      }
    };

    this.node.text.toBack = function () {
      if (this.canvas) {
        this.canvas.sendToBack(this);
      }
    };

    this.node.text.remove = function () {
      if (this.canvas) {
        this.canvas.remove(this);
      }
    };

    this.node.text.animate = function (attrs, duration, easing, callback) {
      Object.keys(attrs).forEach((key) => {
        let targetKey = key;
        let targetValue = attrs[key];

        if (key === 'x') targetKey = 'left';
        if (key === 'y') targetKey = 'top';

        this.animate(targetKey, targetValue, {
          duration: duration,
          onChange: () => this.canvas?.requestRenderAll(),
          onComplete: callback,
          easing: fabric.util.ease.easeOutQuad,
        });
      });
    };

    this.node.text.transform = function (transformString) {
      // Store transform for later application
      this._pendingTransform = transformString;
      return this;
    };
  }
}
