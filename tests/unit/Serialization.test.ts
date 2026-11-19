import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  serialize,
  deserialize,
  serializeNode,
  deserializeNodeOptions,
  snapshot,
  type SlateJSON,
} from "../../src/core/Serialization";

describe("Serialization", () => {
  let mockSlate: any;
  let mockNode1: any;
  let mockNode2: any;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});

    mockNode1 = {
      id: "n1",
      options: {
        id: "n1",
        x: 100,
        y: 200,
        width: 150,
        height: 80,
        text: "Node 1",
        fontColor: "#000",
        backgroundColor: "#f0f0f0",
        shape: "rectangle",
      },
      svgGroup: {
        bbox: () => ({ x: 100, y: 200 }),
      },
      getRotation: () => 0,
      relationships: {
        serialize: () => ({
          associations: [
            {
              id: "n1->n2",
              parentId: "n1",
              childId: "n2",
              lineColor: "#333",
              lineOpacity: 1,
              lineEffect: "",
              lineType: "bezier",
              lineCurveType: "cubic",
              lineCurviness: 0.1,
              lineWidth: 6,
              isStraightLine: false,
              showParentArrow: false,
              showChildArrow: true,
            },
          ],
        }),
      },
      connector: {
        getConnections: () => [],
      },
    };

    mockNode2 = {
      id: "n2",
      options: {
        id: "n2",
        x: 300,
        y: 200,
        width: 100,
        height: 60,
        text: "Node 2",
        fontColor: "#000",
      },
      svgGroup: {
        bbox: () => ({ x: 300, y: 200 }),
      },
      getRotation: () => 45,
      relationships: {
        serialize: () => ({ associations: [] }),
      },
      connector: {
        getConnections: () => [],
      },
    };

    mockSlate = {
      options: {
        name: "Test Slate",
        shareId: "share1",
      },
      nodes: {
        allNodes: [mockNode1, mockNode2],
        one: vi.fn((id: string) => {
          if (id === "n1") return mockNode1;
          if (id === "n2") return mockNode2;
          return null;
        }),
        clear: vi.fn(),
      },
      addNode: vi.fn((opts: any) => {
        const node = { id: opts.id, options: opts };
        return node;
      }),
      panZoom: null,
    };
  });

  describe("serialize", () => {
    it("should produce valid SlateJSON", () => {
      const json = serialize(mockSlate);

      expect(json.options).toBeDefined();
      expect(json.options.name).toBe("Test Slate");
      expect(json.shareId).toBe("share1");
      expect(json.nodes).toHaveLength(2);
    });

    it("should serialize node positions as xPos/yPos in v1 format", () => {
      const json = serialize(mockSlate);
      expect(json.nodes[0].options.xPos).toBe(100);
      expect(json.nodes[0].options.yPos).toBe(200);
    });

    it("should include relationships in serialized output", () => {
      const json = serialize(mockSlate);
      expect(json.nodes[0].relationships.associations).toHaveLength(1);
      expect(json.nodes[0].relationships.associations[0].childId).toBe("n2");
    });

    it("should serialize only specified nodes", () => {
      const json = serialize(mockSlate, [mockNode1]);
      expect(json.nodes).toHaveLength(1);
      expect(json.nodes[0].options.xPos).toBe(100);
    });

    it("should add presentation index when asPresentation is true", () => {
      const json = serialize(mockSlate, undefined, true);
      expect(json.nodes[0].options._presentationIndex).toBe(0);
      expect(json.nodes[1].options._presentationIndex).toBe(1);
    });

    // The stored document says which undo it already holds, so the client that
    // loads it does not rebuild the slate from the room's copy of that undo.
    it("stores which whole-slate replacement the document holds", () => {
      mockSlate.options.collabBaseline = { id: "slate-1", t: 1700000000000, c: 42, k: "onSlateReplaced_1_abc" };
      expect(serialize(mockSlate).options.collabBaseline).toEqual(mockSlate.options.collabBaseline);
    });
  });

  describe("serializeNode", () => {
    it("should serialize a single node to NodeJSON", () => {
      const nodeJson = serializeNode(mockNode1);

      expect(nodeJson.options).toBeDefined();
      expect(nodeJson.options.xPos).toBe(100);
      expect(nodeJson.options.yPos).toBe(200);
      expect(nodeJson.relationships).toBeDefined();
    });

    it("should include rotation when non-zero", () => {
      const nodeJson = serializeNode(mockNode2);
      expect(nodeJson.options.rotate).toBeDefined();
      expect(nodeJson.options.rotate.rotationAngle).toBe(45);
    });

    it("should not include rotation when zero", () => {
      const nodeJson = serializeNode(mockNode1);
      expect(nodeJson.options.rotate).toBeUndefined();
    });
  });

  describe("deserializeNodeOptions", () => {
    it("should convert v1 JSON options to v2 format", () => {
      const opts = deserializeNodeOptions({
        id: "test",
        xPos: 50,
        yPos: 75,
        foregroundColor: "#ff0000",
        shapeHint: "star",
      });

      expect(opts.x).toBe(50);
      expect(opts.y).toBe(75);
      expect(opts.fontColor).toBe("#ff0000");
      expect(opts.shape).toBe("star");
    });
  });

  describe("deserialize", () => {
    it("should call addNode for each node in JSON", () => {
      const json: SlateJSON = {
        options: { name: "Loaded Slate" },
        nodes: [
          {
            options: { id: "new1", xPos: 10, yPos: 20, text: "New" },
            relationships: { associations: [] },
          },
        ],
        shareId: "s1",
      };

      deserialize(json, mockSlate);

      expect(mockSlate.nodes.clear).toHaveBeenCalled();
      expect(mockSlate.addNode).toHaveBeenCalledTimes(1);
    });

    it("should accept JSON string input", () => {
      const jsonStr = JSON.stringify({
        options: {},
        nodes: [
          {
            options: { id: "s1" },
            relationships: { associations: [] },
          },
        ],
        shareId: "",
      });

      deserialize(jsonStr, mockSlate);
      expect(mockSlate.addNode).toHaveBeenCalled();
    });

    it("should not clear nodes in preserve mode", () => {
      const json: SlateJSON = {
        options: {},
        nodes: [],
        shareId: "",
      };

      deserialize(json, mockSlate, true);
      expect(mockSlate.nodes.clear).not.toHaveBeenCalled();
    });

    it("should apply shareId from JSON", () => {
      const json: SlateJSON = {
        options: {},
        nodes: [],
        shareId: "newShare",
      };

      deserialize(json, mockSlate);
      expect(mockSlate.options.shareId).toBe("newShare");
    });
  });

  describe("snapshot", () => {
    it("should be equivalent to serialize", () => {
      const snap = snapshot(mockSlate);
      const serial = serialize(mockSlate);

      expect(snap.options).toEqual(serial.options);
      expect(snap.nodes).toHaveLength(serial.nodes.length);
      expect(snap.shareId).toBe(serial.shareId);
    });
  });

  describe("round-trip", () => {
    it("serialized JSON should be valid JSON", () => {
      const json = serialize(mockSlate);
      const str = JSON.stringify(json);
      const parsed = JSON.parse(str);

      expect(parsed.options.name).toBe("Test Slate");
      expect(parsed.nodes).toHaveLength(2);
    });
  });
});
