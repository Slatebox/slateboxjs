import { describe, it, expect, vi, beforeEach } from "vitest";
import { Invoker } from "../../src/core/Invoker";

describe("Invoker", () => {
  let mockNode: any;
  let mockSlate: any;
  let invoker: Invoker;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});

    mockNode = {
      id: "node1",
      options: {
        x: 100,
        y: 200,
        width: 150,
        height: 80,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        fontColor: "#000000",
        textOpacity: 1,
        textXAlign: "center",
        textYAlign: "middle",
        textOffset: 0,
        borderColor: "#ccc",
        borderWidth: 2,
        backgroundColor: "#fff",
        text: "Hello",
      },
      position: vi.fn(),
      setRotation: vi.fn(),
      lock: vi.fn(),
      unlock: vi.fn(),
      setSize: vi.fn(),
      setText: vi.fn(),
      setShape: vi.fn(),
      setColors: vi.fn(),
      toFront: vi.fn(),
      toBack: vi.fn(),
      links: {
        set: vi.fn(),
        unset: vi.fn(),
      },
      filters: {
        apply: vi.fn(),
        remove: vi.fn(),
      },
      images: {
        set: vi.fn(),
        clear: vi.fn(),
      },
      applyBorder: vi.fn(),
      applyTextStyle: vi.fn(),
      relationships: {
        applyLineProperty: vi.fn(),
      },
    };

    mockSlate = {
      pan: vi.fn(),
      applyContainerStyle: vi.fn(),
      panZoom: { zoom: vi.fn() },
      options: {
        followMe: false,
        name: "Test Slate",
        description: "",
        layoutType: undefined,
        disableAutoLayoutOfManuallyPositionedNodes: undefined,
        defaultLineColor: "#000",
        ai: {},
        viewPort: {
          originalWidth: 1920,
          showGrid: false,
          snapToObjects: false,
        },
        containerStyle: {
          backgroundColor: "#ffffff",
          backgroundImage: undefined,
          backgroundEffect: undefined,
          prevBackgroundColor: "#f5f5f5",
          backgroundColorAsGradient: false,
          backgroundGradientType: undefined,
          backgroundGradientColors: undefined,
          backgroundGradientStrategy: undefined,
        },
      },
      nodes: {
        one: vi.fn().mockReturnValue(mockNode),
        add: vi.fn(),
        remove: vi.fn(),
        addRelationship: vi.fn(),
        removeRelationship: vi.fn(),
        moveNodes: vi.fn(),
        allNodes: [mockNode],
      },
    };

    invoker = new Invoker(mockSlate);
  });

  // ---------------------------------------------------------------------------
  // Node Mutations
  // ---------------------------------------------------------------------------

  describe("onNodePositioned", () => {
    it("should position the node with coordinates and optional easing/duration", () => {
      const pkg = {
        data: {
          id: "node1",
          location: { x: 250, y: 350 },
          easing: "cubic-out",
          duration: 800,
        },
      };

      invoker.onNodePositioned(pkg);

      expect(mockSlate.nodes.one).toHaveBeenCalledWith("node1");
      expect(mockNode.position).toHaveBeenCalledWith(
        250,
        350,
        expect.any(Function),
        "cubic-out",
        800
      );
    });

    it("should default duration to 500 when not provided", () => {
      const pkg = {
        data: {
          id: "node1",
          location: { x: 100, y: 200 },
        },
      };

      invoker.onNodePositioned(pkg);

      expect(mockNode.position).toHaveBeenCalledWith(
        100,
        200,
        expect.any(Function),
        undefined,
        500
      );
    });

    it("should do nothing when node is not found", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      invoker.onNodePositioned({
        data: { id: "nonexistent", location: { x: 0, y: 0 } },
      });

      expect(mockNode.position).not.toHaveBeenCalled();
    });
  });

  describe("onNodeResized", () => {
    it("should update node options and call setSize", () => {
      const pkg = {
        data: {
          id: "node1",
          width: 300,
          height: 200,
        },
      };

      invoker.onNodeResized(pkg);

      expect(mockNode.options.width).toBe(300);
      expect(mockNode.options.height).toBe(200);
      expect(mockNode.setSize).toHaveBeenCalledWith(300, 200);
    });

    it("should do nothing when node is not found", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      invoker.onNodeResized({
        data: { id: "nonexistent", width: 100, height: 100 },
      });

      expect(mockNode.setSize).not.toHaveBeenCalled();
    });
  });

  describe("onNodeRotated", () => {
    it("applies the rotation angle via setRotation and updates textOffset", () => {
      const pkg = {
        data: {
          id: "node1",
          textOffset: 90,
          rotate: { rotationAngle: 45 },
        },
      };

      invoker.onNodeRotated(pkg);

      expect(mockNode.options.textOffset).toBe(90);
      // Remote-applied rotation is animated (bug #5): setRotation(angle, duration)
    expect(mockNode.setRotation).toHaveBeenCalledWith(45, 400);
    });

    it("should do nothing when node is not found", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      invoker.onNodeRotated({
        data: { id: "nonexistent", textOffset: 0 },
      });

      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe("onNodeTextChanged", () => {
    it("should set text and update text-related options", () => {
      const pkg = {
        data: {
          id: "node1",
          text: "Updated text",
          fontSize: 18,
          fontFamily: "Helvetica",
          fontColor: "#ff0000",
          textOpacity: 0.8,
          textXAlign: "left",
          textYAlign: "top",
        },
      };

      invoker.onNodeTextChanged(pkg);

      expect(mockNode.setText).toHaveBeenCalledWith("Updated text");
      expect(mockNode.options.fontSize).toBe(18);
      expect(mockNode.options.fontFamily).toBe("Helvetica");
      expect(mockNode.options.fontColor).toBe("#ff0000");
      expect(mockNode.options.textOpacity).toBe(0.8);
      expect(mockNode.options.textXAlign).toBe("left");
      expect(mockNode.options.textYAlign).toBe("top");
      // Font/alignment changes must be re-rendered, not just stored.
      expect(mockNode.applyTextStyle).toHaveBeenCalled();
    });

    it("should do nothing when node is not found", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      invoker.onNodeTextChanged({
        data: { id: "nonexistent", text: "Nope" },
      });

      expect(mockNode.setText).not.toHaveBeenCalled();
    });
  });

  describe("onNodeColorChanged", () => {
    it("should call setColors with background and border colors", () => {
      const pkg = {
        data: {
          id: "node1",
          backgroundColor: "#ff6600",
          borderColor: "#333333",
        },
      };

      invoker.onNodeColorChanged(pkg);

      expect(mockNode.setColors).toHaveBeenCalledWith("#ff6600", "#333333");
    });

    it("should do nothing when node is not found", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      invoker.onNodeColorChanged({
        data: { id: "nonexistent", backgroundColor: "#000", borderColor: "#fff" },
      });

      expect(mockNode.setColors).not.toHaveBeenCalled();
    });
  });

  // The collab receive path applies remote packages via invoker[pkg.type](pkg).
  // A line-property change reaches a peer as { id, associationId, prop, val } and
  // must be routed to the association — this is what makes line-pane edits (type,
  // locks, arrows, width, color) sync across a two-window collab session. The
  // package MUST carry the node id (packageUp adds it) for the peer to resolve it.
  describe("onLinePropertiesChanged (collab apply)", () => {
    it("routes a remote line-property package to applyLineProperty", () => {
      invoker.onLinePropertiesChanged({
        data: {
          id: "node1",
          associationId: "node1->child1",
          prop: "lineType",
          val: "orthogonal",
        },
      } as any);

      expect(mockNode.relationships.applyLineProperty).toHaveBeenCalledWith(
        "node1->child1",
        "lineType",
        "orthogonal"
      );
    });

    it("does nothing when the target node is not found (missing id)", () => {
      mockSlate.nodes.one.mockReturnValue(null);
      invoker.onLinePropertiesChanged({
        data: { associationId: "x->y", prop: "lineType", val: "orthogonal" },
      } as any);
      expect(mockNode.relationships.applyLineProperty).not.toHaveBeenCalled();
    });
  });

  describe("onNodeDeleted", () => {
    it("should remove the node by id", () => {
      invoker.onNodeDeleted({ data: { id: "node1" } });

      expect(mockSlate.nodes.remove).toHaveBeenCalledWith("node1");
    });
  });

  describe("onNodeAdded", () => {
    it("should add nodes from nodeOptions array when no id or multiSelectCopy", () => {
      const childOpts = { id: "newChild", text: "Child", x: 50, y: 50 };
      const pkg = {
        data: {
          nodeOptions: [childOpts],
        },
      };

      mockSlate.nodes.one.mockReturnValue(null);
      invoker.onNodeAdded(pkg);

      expect(mockSlate.nodes.add).toHaveBeenCalledWith(childOpts);
    });

    it("should skip existing nodes when batch-adding", () => {
      mockSlate.nodes.one.mockReturnValue(mockNode);

      invoker.onNodeAdded({
        data: { nodeOptions: { id: "node1", text: "Exists" } },
      });

      expect(mockSlate.nodes.add).not.toHaveBeenCalled();
    });

    it("should wrap single nodeOptions in array", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      invoker.onNodeAdded({
        data: { nodeOptions: { id: "fresh", text: "New" } },
      });

      expect(mockSlate.nodes.add).toHaveBeenCalledWith({ id: "fresh", text: "New" });
    });

    it("should create a connected node when pkg.data.id is present", () => {
      const pkg = {
        data: {
          id: "parent1",
          options: { text: "Child of parent" },
          targetXPos: 400,
          targetYPos: 300,
        },
      };

      invoker.onNodeAdded(pkg);

      expect(mockSlate.nodes.add).toHaveBeenCalledWith(
        expect.objectContaining({
          text: "Child of parent",
          x: 400,
          y: 300,
        })
      );
    });

    it("should use defaults for target position when not provided", () => {
      const pkg = {
        data: {
          id: "parent1",
          options: { text: "Default pos child" },
        },
      };

      invoker.onNodeAdded(pkg);

      expect(mockSlate.nodes.add).toHaveBeenCalledWith(
        expect.objectContaining({ x: 100, y: 100 })
      );
    });

    it("should not add a connected node when parent does not exist", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      invoker.onNodeAdded({
        data: { id: "nonexistent", options: { text: "Orphan" } },
      });

      expect(mockSlate.nodes.add).not.toHaveBeenCalled();
    });

    it("should handle multiSelectCopy by logging", () => {
      invoker.onNodeAdded({
        data: { multiSelectCopy: true, items: [{ id: "a" }, { id: "b" }] },
      });

      expect(console.log).toHaveBeenCalled();
    });
  });

  describe("onNodeLocked", () => {
    it("should lock the node", () => {
      invoker.onNodeLocked({ data: { id: "node1" } });

      expect(mockNode.lock).toHaveBeenCalled();
    });

    it("should do nothing when node is not found", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      invoker.onNodeLocked({ data: { id: "nonexistent" } });

      expect(mockNode.lock).not.toHaveBeenCalled();
    });
  });

  describe("onNodeUnlocked", () => {
    it("should unlock the node", () => {
      invoker.onNodeUnlocked({ data: { id: "node1" } });

      expect(mockNode.unlock).toHaveBeenCalled();
    });

    it("should do nothing when node is not found", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      invoker.onNodeUnlocked({ data: { id: "nonexistent" } });

      expect(mockNode.unlock).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Node Ordering
  // ---------------------------------------------------------------------------

  describe("onNodeToFront", () => {
    it("should call toFront on the node", () => {
      invoker.onNodeToFront({ data: { id: "node1" } });

      expect(mockNode.toFront).toHaveBeenCalled();
    });

    it("should do nothing when node is not found", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      invoker.onNodeToFront({ data: { id: "nonexistent" } });

      expect(mockNode.toFront).not.toHaveBeenCalled();
    });
  });

  describe("a z-order result from the room", () => {
    it("applies the order it carries instead of moving one note", () => {
      mockSlate.nodes.applyOrder = vi.fn();
      invoker.onNodeToFront({ data: { id: "node1", order: ["node2", "node1"] } });
      invoker.onNodeToBack({ data: { id: "node1", order: ["node1", "node2"] } });
      expect(mockSlate.nodes.applyOrder.mock.calls).toEqual([[["node2", "node1"]], [["node1", "node2"]]]);
      expect(mockNode.toFront).not.toHaveBeenCalled();
      expect(mockNode.toBack).not.toHaveBeenCalled();
    });
  });

  describe("onNodeToBack", () => {
    it("should call toBack on the node", () => {
      invoker.onNodeToBack({ data: { id: "node1" } });

      expect(mockNode.toBack).toHaveBeenCalled();
    });

    it("should do nothing when node is not found", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      invoker.onNodeToBack({ data: { id: "nonexistent" } });

      expect(mockNode.toBack).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Node Links
  // ---------------------------------------------------------------------------

  describe("onNodeLinkAdded", () => {
    it("calls links.set with the link options (data.link), not the whole pkg", () => {
      // Shape matches Links.set's broadcast: { data: { id, link } }. Passing the
      // whole pkg used to store the collab envelope as options.link and corrupt
      // the link on reload / for remote peers.
      const link = { show: true, type: "url", url: "https://example.com", target: "_blank" };
      const pkg = { data: { id: "node1", link } };

      invoker.onNodeLinkAdded(pkg);

      expect(mockNode.links.set).toHaveBeenCalledWith(link, false);
    });

    it("should do nothing when node is not found", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      invoker.onNodeLinkAdded({
        data: { id: "nonexistent" },
      });

      expect(mockNode.links.set).not.toHaveBeenCalled();
    });

    it("should do nothing when node has no links property", () => {
      mockSlate.nodes.one.mockReturnValue({ id: "linklessNode" } as any);

      invoker.onNodeLinkAdded({
        data: { id: "linklessNode" },
      });

      // Should not throw
    });
  });

  describe("onNodeLinkRemoved", () => {
    it("should call links.unset with false", () => {
      invoker.onNodeLinkRemoved({ data: { id: "node1" } });

      expect(mockNode.links.unset).toHaveBeenCalledWith(false);
    });

    it("should do nothing when node is not found", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      invoker.onNodeLinkRemoved({ data: { id: "nonexistent" } });

      expect(mockNode.links.unset).not.toHaveBeenCalled();
    });

    it("should do nothing when node has no links property", () => {
      mockSlate.nodes.one.mockReturnValue({ id: "linklessNode" } as any);

      invoker.onNodeLinkRemoved({
        data: { id: "linklessNode" },
      });

      // Should not throw
    });
  });

  // ---------------------------------------------------------------------------
  // Node Behaviors / Shape / Image / Effect / Border / AI
  // ---------------------------------------------------------------------------

  describe("onNodeOptionsChanged (a note's plain data: category, hidden bar controls)", () => {
    it("sets the category and the hidden controls it carries", () => {
      invoker.onNodeOptionsChanged({
        data: { id: "node1", options: { isCategory: true, categoryName: "Costs", showColorTab: false, showShapeTab: false } },
      });
      expect(mockNode.options.isCategory).toBe(true);
      expect(mockNode.options.categoryName).toBe("Costs");
      expect(mockNode.options.showColorTab).toBe(false);
      expect(mockNode.options.showShapeTab).toBe(false);
    });

    it("takes only the note-data keys: no position, lock or text rides on it", () => {
      invoker.onNodeOptionsChanged({
        data: { id: "node1", options: { x: 999, isLocked: true, text: "Hijacked", showDelete: false, categoryName: "Kept" } },
      });
      expect(mockNode.options.x).toBe(100);
      expect(mockNode.options.isLocked).toBeUndefined();
      expect(mockNode.options.text).toBe("Hello");
      expect(mockNode.options.showDelete).toBeUndefined();
      expect(mockNode.options.categoryName).toBe("Kept");
    });

    it("takes each key only with a value of its kind: a flag is a boolean, the name is text", () => {
      invoker.onNodeOptionsChanged({
        data: { id: "node1", options: { isCategory: "yes", categoryName: { evil: true }, showColorTab: "no", showTextTab: 0 } },
      });
      expect(mockNode.options.isCategory).toBeUndefined();
      expect(mockNode.options.categoryName).toBeUndefined();
      expect(mockNode.options.showColorTab).toBeUndefined();
      expect(mockNode.options.showTextTab).toBeUndefined();
      invoker.onNodeOptionsChanged({ data: { id: "node1", options: { categoryName: "x".repeat(201) } } });
      expect(mockNode.options.categoryName).toBeUndefined();
    });

    it("does nothing when the note is not found", () => {
      mockSlate.nodes.one.mockReturnValue(null);
      expect(() => invoker.onNodeOptionsChanged({ data: { id: "nonexistent", options: { isCategory: true } } })).not.toThrow();
      expect(mockSlate.nodes.one).toHaveBeenCalledWith("nonexistent");
    });

    it("the Custom Behavior package is retired: there is no set-any-option package", () => {
      expect((invoker as any).onNodeBehaviorChanged).toBeUndefined();
    });
  });

  describe("onNodeShapeChanged", () => {
    it("should assign shape data and re-render the shape", () => {
      const pkg = {
        data: {
          id: "node1",
          shape: "circle",
          borderRadius: 8,
        },
      };

      invoker.onNodeShapeChanged(pkg);

      expect(mockNode.options.shape).toBe("circle");
      expect(mockNode.options.borderRadius).toBe(8);
      // The node is re-rendered with the new shape (no longer a stub).
      expect(mockNode.setShape).toHaveBeenCalledWith("circle", undefined);
    });

    it("should do nothing when node is not found", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      invoker.onNodeShapeChanged({
        data: { id: "nonexistent", shape: "circle" },
      });

      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe("onNodeImageChanged", () => {
    it("should set the image on the node", () => {
      const pkg = {
        data: {
          id: "node1",
          img: "https://example.com/pic.png",
          w: 200,
          h: 120,
        },
      };

      invoker.onNodeImageChanged(pkg);

      expect(mockNode.images.set).toHaveBeenCalledWith(
        "https://example.com/pic.png",
        200,
        120
      );
    });

    it("should clear the image when img is falsy", () => {
      invoker.onNodeImageChanged({ data: { id: "node1", img: null } });
      expect(mockNode.images.clear).toHaveBeenCalled();
    });

    it("should do nothing when node is not found", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      invoker.onNodeImageChanged({
        data: { id: "nonexistent" },
      });

      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe("onNodeEffectChanged", () => {
    it("should apply the effect filter to the node", () => {
      const pkg = {
        data: {
          id: "node1",
          filter: { apply: "vect", id: "dropShadow" },
        },
      };

      invoker.onNodeEffectChanged(pkg);

      expect(mockNode.filters.apply).toHaveBeenCalledWith("dropShadow", "vect");
    });

    it("should do nothing when node is not found", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      invoker.onNodeEffectChanged({
        data: { id: "nonexistent" },
      });

      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe("onNodeBorderPropertiesChanged", () => {
    it("should update the border prop and re-apply the border (pane shape)", () => {
      invoker.onNodeBorderPropertiesChanged({
        data: { id: "node1", prop: "borderWidth", val: 4 },
      });

      expect(mockNode.options.borderWidth).toBe(4);
      expect(mockNode.applyBorder).toHaveBeenCalled();
    });

    it("should support the legacy bulk shape", () => {
      invoker.onNodeBorderPropertiesChanged({
        data: { id: "node1", borderColor: "#ff0000", borderWidth: 4 },
      });

      expect(mockNode.options.borderColor).toBe("#ff0000");
      expect(mockNode.options.borderWidth).toBe(4);
      expect(mockNode.applyBorder).toHaveBeenCalled();
    });

    it("should do nothing when node is not found", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      invoker.onNodeBorderPropertiesChanged({
        data: { id: "nonexistent", borderColor: "#000" },
      });

      expect(mockNode.setColors).not.toHaveBeenCalled();
    });
  });

  describe("onNodeAITextChanged", () => {
    it("should merge AI data into node options", () => {
      const pkg = {
        data: {
          id: "node1",
          ai: { prompt: "Explain trees", model: "gpt-4" },
        },
      };

      invoker.onNodeAITextChanged(pkg);

      expect(mockNode.options.ai).toEqual({
        prompt: "Explain trees",
        model: "gpt-4",
      });
    });

    it("should merge with existing AI options", () => {
      mockNode.options.ai = { existingKey: "keep-me" };

      const pkg = {
        data: {
          id: "node1",
          ai: { newKey: "added" },
        },
      };

      invoker.onNodeAITextChanged(pkg);

      expect(mockNode.options.ai).toEqual({
        existingKey: "keep-me",
        newKey: "added",
      });
    });

    it("lets a new value win when it re-sets an existing field", () => {
      // The merge order was reversed, so re-setting the same AI field (or a
      // remote peer's change) was silently dropped.
      mockNode.options.ai = { textToChildNodes: 5, isDetailedChild: false };

      invoker.onNodeAITextChanged({
        data: { id: "node1", ai: { textToChildNodes: 10 } },
      });

      expect(mockNode.options.ai).toEqual({
        textToChildNodes: 10, // new value applied
        isDetailedChild: false, // untouched field preserved
      });
    });

    it("should do nothing when node is not found", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      expect(() => {
        invoker.onNodeAITextChanged({
          data: { id: "nonexistent", ai: { prompt: "test" } },
        });
      }).not.toThrow();

      expect(mockSlate.nodes.one).toHaveBeenCalledWith("nonexistent");
    });
  });

  // ---------------------------------------------------------------------------
  // Slate-Level Mutations
  // ---------------------------------------------------------------------------

  describe("onSlateNameChanged", () => {
    it("should update the slate name", () => {
      invoker.onSlateNameChanged({ data: { name: "New Name" } });

      expect(mockSlate.options.name).toBe("New Name");
    });
  });

  describe("onSlateDescriptionChanged", () => {
    it("should update the slate description", () => {
      invoker.onSlateDescriptionChanged({ data: { description: "A new description" } });

      expect(mockSlate.options.description).toBe("A new description");
    });
  });

  describe("onSlateReplaced", () => {
    it("loads the authoritative serialized slate", async () => {
      mockSlate.nodes.clear = vi.fn();
      mockSlate.addNode = vi.fn();
      mockSlate.beginRemoteApply = vi.fn();
      mockSlate.endRemoteApply = vi.fn();

      await invoker.onSlateReplaced({
        type: "onSlateReplaced",
        data: {
          snapshot: JSON.stringify({
            options: { name: "Restored" },
            nodes: [],
            shareId: "",
          }),
        },
      });

      expect(mockSlate.nodes.clear).toHaveBeenCalledOnce();
      expect(mockSlate.options.name).toBe("Restored");
      expect(mockSlate.beginRemoteApply).toHaveBeenCalledOnce();
      expect(mockSlate.endRemoteApply).toHaveBeenCalledOnce();
    });
  });

  describe("onSlateBackgroundColorChanged", () => {
    it("should set background color and clear image/effect", () => {
      const pkg = {
        data: {
          color: "#f0f0f0",
          asGradient: false,
          gradientType: null,
          gradientColors: null,
          gradientStrategy: null,
        },
      };

      invoker.onSlateBackgroundColorChanged(pkg);

      expect(mockSlate.options.containerStyle.backgroundColor).toBe("#f0f0f0");
      expect(mockSlate.options.containerStyle.backgroundColorAsGradient).toBe(false);
      expect(mockSlate.options.containerStyle.backgroundImage).toBeUndefined();
      expect(mockSlate.options.containerStyle.backgroundEffect).toBeUndefined();
      // The change must actually be painted onto the container element.
      expect(mockSlate.applyContainerStyle).toHaveBeenCalled();
    });
  });

  describe("onSlateBackgroundImageChanged", () => {
    it("should set background image properties when bg data is present", () => {
      const pkg = {
        data: {
          bg: {
            url: "https://example.com/bg.jpg",
            size: "cover",
          },
        },
      };

      invoker.onSlateBackgroundImageChanged(pkg);

      expect(mockSlate.options.containerStyle.backgroundImage).toBe(
        "https://example.com/bg.jpg"
      );
      expect(mockSlate.options.containerStyle.backgroundSize).toBe("cover");
    });

    it("should fall back to prevBackgroundColor when bg is removed", () => {
      mockSlate.options.containerStyle.prevBackgroundColor = "#e0e0e0";

      invoker.onSlateBackgroundImageChanged({ data: {} });

      expect(mockSlate.options.containerStyle.backgroundColor).toBe("#e0e0e0");
      expect(mockSlate.options.containerStyle.backgroundImage).toBeUndefined();
      expect(mockSlate.options.containerStyle.backgroundEffect).toBeUndefined();
    });
  });

  describe("onFollowMeChanged", () => {
    it("should update the followMe option", () => {
      invoker.onFollowMeChanged({ data: { followMe: true } });

      expect(mockSlate.options.followMe).toBe(true);
    });

    it("should handle undefined followMe gracefully", () => {
      invoker.onFollowMeChanged({ data: {} });

      expect(mockSlate.options.followMe).toBeUndefined();
    });
  });

  describe("onSlateLayoutTypeChanged", () => {
    it("should set layoutType and disableAutoLayout flags", () => {
      const pkg = {
        data: {
          layoutType: "grid",
          disableAutoLayoutOfManuallyPositionedNodes: true,
        },
      };

      invoker.onSlateLayoutTypeChanged(pkg);

      expect(mockSlate.options.layoutType).toBe("grid");
      expect(mockSlate.options.disableAutoLayoutOfManuallyPositionedNodes).toBe(true);
    });

    it("should not set layoutType when null", () => {
      invoker.onSlateLayoutTypeChanged({
        data: { layoutType: null, disableAutoLayoutOfManuallyPositionedNodes: null },
      });

      expect(mockSlate.options.layoutType).toBeUndefined();
      expect(mockSlate.options.disableAutoLayoutOfManuallyPositionedNodes).toBeUndefined();
    });
  });

  describe("onSlateAISet", () => {
    it("should merge AI data into slate options", () => {
      const pkg = {
        data: {
          provider: "openai",
          apiKey: "sk-xxx",
        },
      };

      invoker.onSlateAISet(pkg);

      expect(mockSlate.options.ai).toEqual({
        provider: "openai",
        apiKey: "sk-xxx",
      });
    });

    it("should merge with existing AI options", () => {
      mockSlate.options.ai = { existing: "val" };

      invoker.onSlateAISet({ data: { newKey: "added" } });

      expect(mockSlate.options.ai).toEqual({
        existing: "val",
        newKey: "added",
      });
    });
  });

  // ---------------------------------------------------------------------------
  // Line Operations
  // ---------------------------------------------------------------------------

  describe("onLineColorChanged", () => {
    it("should update default line color and all nodes' lineColor", () => {
      const pkg = { data: { color: "#ff0000" } };

      invoker.onLineColorChanged(pkg);

      expect(mockSlate.options.defaultLineColor).toBe("#ff0000");
      expect(mockNode.options.lineColor).toBe("#ff0000");
    });

    // RESTATED (P10): Relationships.associations returns copies, so writing to
    // them changed nothing that is saved; the old mock's plain array hid that.
    // The stored connectors are recoloured through updateAssociationsWith.
    it("recolours the stored connectors, not copies of them", () => {
      const stored = [{ id: "a->b", lineColor: "#000" }, { id: "a->c", lineColor: "#000" }];
      const relNode = {
        options: {},
        relationships: {
          get associations() {
            return stored.map((a) => ({ ...a }));
          },
          updateAssociationsWith: vi.fn((opts: any) => stored.forEach((a) => Object.assign(a, opts))),
        },
      };
      mockSlate.nodes.allNodes = [relNode];

      invoker.onLineColorChanged({ data: { color: "#00ff00" } });

      expect(relNode.relationships.updateAssociationsWith).toHaveBeenCalledWith({ lineColor: "#00ff00" });
      expect(stored.map((a) => a.lineColor)).toEqual(["#00ff00", "#00ff00"]);
    });
  });

  describe("onLinePropertiesChanged", () => {
    it("should apply properties to a single node", () => {
      const pkg = {
        data: {
          id: "node1",
          options: { lineColor: "#ff0000", lineWidth: 3 },
        },
      };

      invoker.onLinePropertiesChanged(pkg);

      expect(mockNode.options.lineColor).toBe("#ff0000");
      expect(mockNode.options.lineWidth).toBe(3);
    });

    it("should apply properties to multiple nodes when array is provided", () => {
      const nodeA = { id: "a", options: {} };
      const nodeB = { id: "b", options: {} };
      mockSlate.nodes.one.mockImplementation((id: string) => {
        if (id === "a") return nodeA;
        if (id === "b") return nodeB;
        return null;
      });

      const pkg = {
        data: [
          { id: "a", options: { lineColor: "red" } },
          { id: "b", options: { lineColor: "blue" } },
        ],
      };

      invoker.onLinePropertiesChanged(pkg);

      expect(nodeA.options.lineColor).toBe("red");
      expect(nodeB.options.lineColor).toBe("blue");
    });

    it("should skip nodes that are not found", () => {
      const nodeA = { id: "a", options: {} };
      mockSlate.nodes.one.mockImplementation((id: string) => {
        if (id === "a") return nodeA;
        return null;
      });

      invoker.onLinePropertiesChanged({
        data: [
          { id: "a", options: { stroke: "#000" } },
          { id: "missing", options: { stroke: "#fff" } },
        ],
      });

      expect(nodeA.options.stroke).toBe("#000");
      // Should not throw for missing node
    });
  });

  // ---------------------------------------------------------------------------
  // Canvas / Zoom
  // ---------------------------------------------------------------------------

  describe("onCanvasMove", () => {
    it("pans the canvas when followMe is true", () => {
      mockSlate.options.followMe = true;

      invoker.onCanvasMove({ data: { left: 10, top: 20 } });

      expect(mockSlate.pan).toHaveBeenCalledWith({ x: 10, y: 20 });
    });

    it("should do nothing when followMe is false", () => {
      invoker.onCanvasMove({ data: { dx: 10, dy: 20 } });

      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe("onZoom", () => {
    it("applies the zoom via panZoom when followMe is true", () => {
      mockSlate.options.followMe = true;

      invoker.onZoom({ data: { zoomLevel: 2 } });

      expect(mockSlate.panZoom.zoom).toHaveBeenCalledWith(2);
    });

    it("should do nothing when followMe is false", () => {
      invoker.onZoom({ data: { zoomLevel: 2 } });

      expect(mockSlate.panZoom.zoom).not.toHaveBeenCalled();
    });
  });

  describe("onNodesMove", () => {
    it("delegates to moveNodes (which glides by default, honoring dur)", () => {
      const pkg = { data: { dur: 300, nodes: [{ id: "node1" }] } };

      invoker.onNodesMove(pkg);

      expect(mockSlate.nodes.moveNodes).toHaveBeenCalledWith(pkg);
    });
  });

  // ---------------------------------------------------------------------------
  // Edge Cases
  // ---------------------------------------------------------------------------

  describe("edge cases", () => {
    it("should return gracefully when node is not found", () => {
      mockSlate.nodes.one.mockReturnValue(null);

      const noop = (fn: () => void) => expect(fn).not.toThrow();

      noop(() => invoker.onNodePositioned({ data: { id: "missing", location: { x: 0, y: 0 } } }));
      noop(() => invoker.onNodeResized({ data: { id: "missing" } }));
      noop(() => invoker.onNodeRotated({ data: { id: "missing" } }));
      noop(() => invoker.onNodeTextChanged({ data: { id: "missing" } }));
      noop(() => invoker.onNodeColorChanged({ data: { id: "missing" } }));
      noop(() => invoker.onNodeLocked({ data: { id: "missing" } }));
      noop(() => invoker.onNodeUnlocked({ data: { id: "missing" } }));
      noop(() => invoker.onNodeToFront({ data: { id: "missing" } }));
      noop(() => invoker.onNodeToBack({ data: { id: "missing" } }));
      noop(() => invoker.onNodeLinkAdded({ data: { id: "missing" } }));
      noop(() => invoker.onNodeLinkRemoved({ data: { id: "missing" } }));
      noop(() => invoker.onNodeOptionsChanged({ data: { id: "missing", options: {} } }));
      noop(() => invoker.onNodeShapeChanged({ data: { id: "missing" } }));
      noop(() => invoker.onNodeImageChanged({ data: { id: "missing" } }));
      noop(() => invoker.onNodeEffectChanged({ data: { id: "missing" } }));
      noop(() => invoker.onNodeBorderPropertiesChanged({ data: { id: "missing" } }));
      noop(() => invoker.onNodeAITextChanged({ data: { id: "missing" } }));
    });

    it("should handle empty pkg (no data) gracefully", () => {
      // Only handlers that use optional chaining or don't access pkg.data
      expect(() => invoker.onFollowMeChanged({})).not.toThrow();
    });
  });

  // ---------------------------------------------------------------------------
  // Relationship helpers
  // ---------------------------------------------------------------------------

  describe("addRelationship", () => {
    it("should delegate to nodes.addRelationship", () => {
      const pkg = { data: { from: "a", to: "b", type: "arrow" } };

      invoker.addRelationship(pkg);

      expect(mockSlate.nodes.addRelationship).toHaveBeenCalledWith(pkg.data);
    });
  });

  describe("removeRelationship", () => {
    it("should delegate to nodes.removeRelationship", () => {
      const pkg = { data: { id: "rel1" } };

      invoker.removeRelationship(pkg);

      expect(mockSlate.nodes.removeRelationship).toHaveBeenCalledWith(pkg.data);
    });
  });

  // ---------------------------------------------------------------------------
  // Additional slate-level handlers that exist on class but weren't covered
  // ---------------------------------------------------------------------------

  describe("onSlateBackgroundEffectChanged", () => {
    it("should set the background effect on containerStyle", () => {
      invoker.onSlateBackgroundEffectChanged({
        data: { effect: "blur" },
      });

      expect(mockSlate.options.containerStyle.backgroundEffect).toBe("blur");
      expect(console.log).toHaveBeenCalledWith("Background effect changed:", "blur");
    });
  });

  describe("onSlateShowGridChanged", () => {
    it("should update showGrid and SHOW the grid when true", () => {
      (mockSlate as any).grid = { show: vi.fn(), hide: vi.fn() };
      invoker.onSlateShowGridChanged({ data: { showGrid: true } });

      expect(mockSlate.options.viewPort.showGrid).toBe(true);
      expect((mockSlate as any).grid.show).toHaveBeenCalled();
      expect((mockSlate as any).grid.hide).not.toHaveBeenCalled();
    });

    it("should update showGrid and HIDE the grid when false", () => {
      (mockSlate as any).grid = { show: vi.fn(), hide: vi.fn() };
      invoker.onSlateShowGridChanged({ data: { showGrid: false } });

      expect(mockSlate.options.viewPort.showGrid).toBe(false);
      expect((mockSlate as any).grid.hide).toHaveBeenCalled();
      expect((mockSlate as any).grid.show).not.toHaveBeenCalled();
    });
  });

  describe("onSlateMindMapModeChanged", () => {
    it("should update mindMapMode", () => {
      invoker.onSlateMindMapModeChanged({ data: { mindMapMode: true } });

      expect(mockSlate.options.mindMapMode).toBe(true);
    });
  });

  describe("onSlateAutoResizeNodesBasedOnTextChanged", () => {
    it("should update autoResizeNodesBasedOnText", () => {
      invoker.onSlateAutoResizeNodesBasedOnTextChanged({
        data: { autoResizeNodesBasedOnText: true },
      });

      expect(mockSlate.options.autoResizeNodesBasedOnText).toBe(true);
    });
  });

  describe("onSlateTagsAndTemplateMarkdownChanged", () => {
    it("should update tags, templateMarkdown, and templatePrompt", () => {
      const pkg = {
        data: {
          tags: ["tag1", "tag2"],
          templateMarkdown: "# Title",
          templatePrompt: "Generate...",
        },
      };

      invoker.onSlateTagsAndTemplateMarkdownChanged(pkg);

      expect(mockSlate.options.tags).toEqual(["tag1", "tag2"]);
      expect(mockSlate.options.templateMarkdown).toBe("# Title");
      expect(mockSlate.options.templatePrompt).toBe("Generate...");
    });
  });

  describe("onSlateTemplateChanged", () => {
    it("should update isTemplate", () => {
      invoker.onSlateTemplateChanged({ data: { isTemplate: true } });

      expect(mockSlate.options.isTemplate).toBe(true);
    });
  });

  describe("onSlateSnapToObjectsChanged", () => {
    it("should update snapToObjects", () => {
      invoker.onSlateSnapToObjectsChanged({ data: { snapToObjects: true } });

      expect(mockSlate.options.viewPort.snapToObjects).toBe(true);
    });
  });

  describe("onSlateFollowMeChanged", () => {
    it("should update followMe", () => {
      invoker.onSlateFollowMeChanged({ data: { followMe: false } });

      expect(mockSlate.options.followMe).toBe(false);
    });
  });

  describe("onSlateHuddleChanged", () => {
    it("should set huddleType and huddleEnabled when provided", () => {
      const pkg = {
        data: {
          huddleType: "public",
          huddleEnabled: true,
        },
      };

      invoker.onSlateHuddleChanged(pkg);

      expect(mockSlate.options.huddleType).toBe("public");
      expect(mockSlate.options.huddleEnabled).toBe(true);
    });

    it("should ignore null fields", () => {
      mockSlate.options.huddleType = undefined;
      mockSlate.options.huddleEnabled = undefined;

      invoker.onSlateHuddleChanged({ data: {} });

      expect(mockSlate.options.huddleType).toBeUndefined();
      expect(mockSlate.options.huddleEnabled).toBeUndefined();
    });
  });
});
