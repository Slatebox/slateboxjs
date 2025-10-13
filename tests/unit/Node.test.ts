import { describe, it, expect, vi } from "vitest";

// Simple test to verify the testing setup works
describe("Node Simple Tests", () => {
  it("should run basic test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should handle basic options merging", () => {
    const defaultOptions = {
      x: 50,
      y: 50,
      width: 100,
      height: 60,
      text: "Node",
    };

    const customOptions = {
      x: 100,
      fontSize: 16,
    };

    const merged = { ...defaultOptions, ...customOptions };

    expect(merged.x).toBe(100);
    expect(merged.fontSize).toBe(16);
    expect(merged.text).toBe("Node"); // default preserved
  });

  it("should generate IDs", () => {
    const generateId = () => "node_" + Math.random().toString(36).substr(2, 9);
    const id = generateId();
    expect(id).toMatch(/^node_[a-z0-9]+$/);
  });

  it("should handle position calculations", () => {
    const position = { x: 100, y: 200 };
    const newPosition = { x: position.x + 50, y: position.y + 100 };

    expect(newPosition.x).toBe(150);
    expect(newPosition.y).toBe(300);
  });
});
