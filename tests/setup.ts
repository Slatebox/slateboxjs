import { vi } from "vitest";

// Mock SVG.js and browser APIs that aren't available in jsdom
// @ts-ignore - Mocking global for testing
global.SVGElement = class MockSVGElement {
  getBBox() {
    return { x: 0, y: 0, width: 100, height: 100 };
  }
};

// Mock requestAnimationFrame for animations
global.requestAnimationFrame = vi.fn((cb) => {
  setTimeout(cb, 16);
  return 1;
});

global.cancelAnimationFrame = vi.fn();

// Mock ResizeObserver for responsive behavior
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.getComputedStyle
Object.defineProperty(window, "getComputedStyle", {
  value: () => ({
    getPropertyValue: () => "",
  }),
});

// Console utilities for test debugging
globalThis.testUtils = {
  mockConsole: () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  },
  restoreConsole: () => {
    vi.restoreAllMocks();
  },
};
