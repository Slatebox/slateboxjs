import { describe, it, expect, vi, beforeEach } from "vitest";
import { Relationships } from "../../src/core/Relationships";

describe("Relationships", () => {
  let mockNode: any;
  let mockSlate: any;
  let mockChildNode: any;

  beforeEach(() => {
    mockSlate = {
      nodes: {
        one: vi.fn(),
      },
    };

    mockNode = {
      id: "node1",
      slate: mockSlate,
      connector: {
        isEnabled: vi.fn().mockReturnValue(true),
        enable: vi.fn(),
        connectTo: vi.fn(),
        disconnectFrom: vi.fn(),
        disconnectById: vi.fn(),
        updateConnection: vi.fn(),
        getConnections: vi.fn().mockReturnValue([]),
        // Mirrors the real setEndpointLock: absolute → a resolved anchor, relative → null.
        setEndpointLock: vi
          .fn()
          .mockImplementation((_connId: string, _which: string, mode: string) =>
            mode === "absolute" ? { x: 0.5, y: 0.5 } : null
          ),
      },
    };

    mockChildNode = {
      id: "child1",
      slate: mockSlate,
    };

    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  describe("addAssociation", () => {
    it("should add an association and store it", () => {
      const rels = new Relationships(mockNode);
      const assoc = rels.addAssociation(mockChildNode);

      expect(assoc.parentId).toBe("node1");
      expect(assoc.childId).toBe("child1");
      expect(rels.hasAssociations()).toBe(true);
      expect(rels.count()).toBe(1);
    });

    it("should call connector.connectTo when adding", () => {
      const rels = new Relationships(mockNode);
      rels.addAssociation(mockChildNode);

      expect(mockNode.connector.connectTo).toHaveBeenCalledWith(
        mockChildNode,
        expect.objectContaining({
          lineColor: "#666666",
          lineWidth: 3,
        })
      );
    });

    it("should accept custom association data", () => {
      const rels = new Relationships(mockNode);
      const assoc = rels.addAssociation(mockChildNode, {
        lineColor: "#ff0000",
        lineWidth: 2,
      });

      expect(assoc.lineColor).toBe("#ff0000");
      expect(assoc.lineWidth).toBe(2);
    });
  });

  describe("removeAssociation", () => {
    it("should remove an existing association", () => {
      mockSlate.nodes.one.mockReturnValue(mockChildNode);
      const rels = new Relationships(mockNode);
      rels.addAssociation(mockChildNode);

      const removed = rels.removeAssociation("child1");
      expect(removed).toBe(true);
      expect(rels.count()).toBe(0);
    });

    it("should return false for non-existent association", () => {
      const rels = new Relationships(mockNode);
      expect(rels.removeAssociation("nonexistent")).toBe(false);
    });
  });

  describe("removeAll", () => {
    it("should remove all associations", () => {
      mockSlate.nodes.one.mockReturnValue(mockChildNode);
      const rels = new Relationships(mockNode);
      rels.addAssociation(mockChildNode);
      rels.addAssociation({ id: "child2", slate: mockSlate });

      rels.removeAll();
      expect(rels.count()).toBe(0);
      expect(rels.hasAssociations()).toBe(false);
    });
  });

  describe("getAssociations", () => {
    it("should return all associations as an array", () => {
      const rels = new Relationships(mockNode);
      rels.addAssociation(mockChildNode);
      rels.addAssociation({ id: "child2", slate: mockSlate });

      const assocs = rels.getAssociations();
      expect(assocs).toHaveLength(2);
    });
  });

  describe("getAssociation", () => {
    it("should return a specific association by child ID", () => {
      const rels = new Relationships(mockNode);
      rels.addAssociation(mockChildNode, { lineColor: "#f00" });

      const assoc = rels.getAssociation("child1");
      expect(assoc).toBeDefined();
      expect(assoc!.lineColor).toBe("#f00");
    });

    it("should return undefined for unknown child ID", () => {
      const rels = new Relationships(mockNode);
      expect(rels.getAssociation("unknown")).toBeUndefined();
    });
  });

  // Line-pane data contract: the host's LineProperties pane reads these values off
  // the association to render its toggles (Line Type, Start/End Absolute/Relative).
  // If applyLineProperty stops persisting them on the record, the pane reverts to
  // stale defaults — the "doesn't stick / doesn't save / drifts" class of bugs.
  describe("applyLineProperty (line-pane state contract)", () => {
    it("persists lineType on the association so the pane reflects BEZIER↔ORTHOGONAL", () => {
      const rels = new Relationships(mockNode);
      const a = rels.addAssociation(mockChildNode);
      expect(rels.applyLineProperty(a.id, "lineType", "orthogonal")).toBe(true);
      expect(rels.getAssociation("child1")!.lineType).toBe("orthogonal");
    });

    it("persists a directly-set targetAnchor (drop-pin) on the association", () => {
      const rels = new Relationships(mockNode);
      const a = rels.addAssociation(mockChildNode);
      rels.applyLineProperty(a.id, "targetAnchor", { x: 0.2, y: 0.9 });
      expect(rels.getAssociation("child1")!.targetAnchor).toEqual({ x: 0.2, y: 0.9 });
    });

    it("targetLock=absolute stores the resolved anchor (RELATIVE→ABSOLUTE saves)", () => {
      const rels = new Relationships(mockNode);
      const a = rels.addAssociation(mockChildNode);
      rels.applyLineProperty(a.id, "targetLock", "absolute");
      expect(rels.getAssociation("child1")!.targetAnchor).toEqual({ x: 0.5, y: 0.5 });
    });

    it("targetLock=relative clears the anchor back to auto-flow", () => {
      const rels = new Relationships(mockNode);
      const a = rels.addAssociation(mockChildNode);
      rels.applyLineProperty(a.id, "targetLock", "absolute");
      rels.applyLineProperty(a.id, "targetLock", "relative");
      expect(rels.getAssociation("child1")!.targetAnchor).toBeNull();
    });

    it("persists showParentArrow / showChildArrow so the Arrow Heads toggle reflects", () => {
      const rels = new Relationships(mockNode);
      const a = rels.addAssociation(mockChildNode);
      rels.applyLineProperty(a.id, "showParentArrow", true);
      rels.applyLineProperty(a.id, "showChildArrow", false);
      const assoc = rels.getAssociation("child1")!;
      expect((assoc as any).showParentArrow).toBe(true);
      expect((assoc as any).showChildArrow).toBe(false);
    });
  });

  describe("serialize", () => {
    it("should serialize associations to JSON-compatible format", () => {
      const rels = new Relationships(mockNode);
      rels.addAssociation(mockChildNode);
      rels.addAssociation({ id: "child2", slate: mockSlate });

      const serialized = rels.serialize();
      expect(serialized.associations).toHaveLength(2);
      expect(serialized.associations[0].parentId).toBe("node1");
      expect(serialized.associations[0].childId).toBe("child1");
    });

    it("should produce JSON-serializable output", () => {
      const rels = new Relationships(mockNode);
      rels.addAssociation(mockChildNode);

      const serialized = rels.serialize();
      const json = JSON.stringify(serialized);
      const parsed = JSON.parse(json);
      expect(parsed.associations).toHaveLength(1);
    });
  });

  describe("enable/disable", () => {
    it("should start enabled by default", () => {
      const rels = new Relationships(mockNode);
      expect(rels.isEnabled()).toBe(true);
    });

    it("should respect enabled option", () => {
      const rels = new Relationships(mockNode, { enabled: false });
      expect(rels.isEnabled()).toBe(false);
    });

    it("should toggle enabled state", () => {
      const rels = new Relationships(mockNode);
      rels.disable();
      expect(rels.isEnabled()).toBe(false);
      rels.enable();
      expect(rels.isEnabled()).toBe(true);
    });
  });

  describe("updateAssociationsWith", () => {
    it("should update all associations with new properties", () => {
      const rels = new Relationships(mockNode);
      rels.addAssociation(mockChildNode);
      rels.addAssociation({ id: "child2", slate: mockSlate });

      rels.updateAssociationsWith({ lineColor: "#00ff00" });

      const assocs = rels.getAssociations();
      expect(assocs[0].lineColor).toBe("#00ff00");
      expect(assocs[1].lineColor).toBe("#00ff00");
    });
  });
});
