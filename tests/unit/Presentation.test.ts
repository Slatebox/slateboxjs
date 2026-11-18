import { describe, it, expect, vi, beforeEach } from "vitest";
import { Presentation } from "../../src/core/Presentation";

describe("Presentation", () => {
  let mockSlate: any;

  beforeEach(() => {
    mockSlate = {
      nodes: {
        allNodes: [
          {
            id: "n1",
            options: { x: 0, y: 0, _presentationIndex: 0 },
            svgGroup: {
              bbox: () => ({ x: 0, y: 0, width: 100, height: 60 }),
            },
          },
          {
            id: "n2",
            options: { x: 200, y: 100, _presentationIndex: 1 },
            svgGroup: {
              bbox: () => ({ x: 200, y: 100, width: 100, height: 60 }),
            },
          },
          {
            id: "n3",
            options: { x: 100, y: 300, _presentationIndex: 2 },
            svgGroup: {
              bbox: () => ({ x: 100, y: 300, width: 100, height: 60 }),
            },
          },
        ],
        one: vi.fn((id) => {
          return mockSlate.nodes.allNodes.find((n: any) => n.id === id);
        }),
      },
      pan: vi.fn(),
      zoom: vi.fn(),
      selectNodes: vi.fn(),
    };
  });

  describe("extractLayout", () => {
    it("should extract steps from all nodes", () => {
      const pres = new Presentation(mockSlate);
      const steps = pres.extractLayout();

      expect(steps).toHaveLength(3);
      expect(steps[0].nodeId).toBe("n1");
      expect(steps[0].index).toBe(0);
    });

    it("should filter to specific node IDs", () => {
      const pres = new Presentation(mockSlate);
      const steps = pres.extractLayout({ nodeIds: ["n1", "n3"] });

      expect(steps).toHaveLength(2);
      expect(steps.map((s) => s.nodeId)).toContain("n1");
      expect(steps.map((s) => s.nodeId)).toContain("n3");
    });

    it("should order by _presentationIndex", () => {
      const pres = new Presentation(mockSlate);
      const steps = pres.extractLayout();

      expect(steps[0].nodeId).toBe("n1");
      expect(steps[1].nodeId).toBe("n2");
      expect(steps[2].nodeId).toBe("n3");
    });
  });

  it("frames every station in a rootless cycle, alongside independent cards", () => {
    mockSlate.nodes.allNodes = [
      { id: "bench", options: { x: 40, y: 10, width: 100, height: 60 }, relationships: { associations: [{ childId: "lamp" }] } },
      { id: "lamp", options: { x: 220, y: 30, width: 120, height: 40 }, relationships: { associations: [{ childId: "bench" }] } },
      { id: "lens", options: { x: 80, y: 90, width: 70, height: 40 } },
    ];
    const layout = new Presentation(mockSlate).extractPresentationLayout();
    expect(layout.nodes.map((node: {nodeId: string}) => node.nodeId)).toEqual(["lens", "bench"]);
    const bench = layout.nodes[1];
    expect(bench.metrics.bbox).toEqual({ x: 0, y: 0, width: 100, height: 60 });
    expect(bench.childrenNodes).toHaveLength(1);
    const lamp = bench.childrenNodes[0];
    expect(lamp.nodeId).toBe("lamp");
    expect(lamp.metrics.bbox).toEqual({ x: 180, y: 20, width: 120, height: 40 });
    expect(lamp.childrenNodes).toHaveLength(0);
  });

  describe("start/stop", () => {
    it("should start presentation and go to first step", () => {
      const pres = new Presentation(mockSlate);
      pres.start();

      expect(pres.isPresenting()).toBe(true);
      expect(pres.getCurrentStep()).toBe(0);
    });

    it("should stop presentation", () => {
      const pres = new Presentation(mockSlate);
      pres.start();
      pres.stop();

      expect(pres.isPresenting()).toBe(false);
      expect(pres.getCurrentStep()).toBe(-1);
    });
  });

  describe("next/previous", () => {
    it("should advance to next step", () => {
      const pres = new Presentation(mockSlate);
      pres.start();

      expect(pres.getCurrentStep()).toBe(0);
      expect(pres.next()).toBe(true);
      expect(pres.getCurrentStep()).toBe(1);
    });

    it("should return false at end", () => {
      const pres = new Presentation(mockSlate);
      pres.start();
      pres.next(); // 1
      pres.next(); // 2
      expect(pres.next()).toBe(false); // Can't go past end
    });

    it("should go back to previous step", () => {
      const pres = new Presentation(mockSlate);
      pres.start();
      pres.next();
      expect(pres.previous()).toBe(true);
      expect(pres.getCurrentStep()).toBe(0);
    });

    it("should return false at beginning", () => {
      const pres = new Presentation(mockSlate);
      pres.start();
      expect(pres.previous()).toBe(false);
    });
  });

  describe("goToStep", () => {
    it("should jump to a specific step", () => {
      const pres = new Presentation(mockSlate);
      pres.extractLayout();
      pres.goToStep(2, 0); // instant (no rAF) for the test

      expect(pres.getCurrentStep()).toBe(2);
      // Presentation is a clean read-only view — it centers the viewport but
      // does NOT select the node (no edit toolbar/handles).
      expect(mockSlate.selectNodes).not.toHaveBeenCalled();
    });

    it("should ignore out-of-range index", () => {
      const pres = new Presentation(mockSlate);
      pres.extractLayout();
      pres.goToStep(-1);
      pres.goToStep(100);

      // Should not crash
    });
  });

  describe("getTotalSteps", () => {
    it("should return total number of steps", () => {
      const pres = new Presentation(mockSlate);
      pres.extractLayout();
      expect(pres.getTotalSteps()).toBe(3);
    });

    it("should return 0 before extractLayout", () => {
      const pres = new Presentation(mockSlate);
      expect(pres.getTotalSteps()).toBe(0);
    });
  });
});
