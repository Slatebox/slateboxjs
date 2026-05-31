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
        updateConnection: vi.fn(),
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
          lineColor: "#000",
          lineWidth: 6,
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
