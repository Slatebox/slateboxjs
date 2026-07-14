import { afterEach, vi } from "vitest";

// Mock SVG.js and browser APIs that aren't available in jsdom
// @ts-ignore - Mocking global for testing
global.SVGElement = class MockSVGElement {
  getBBox() {
    return { x: 0, y: 0, width: 100, height: 100 };
  }
};

// Mock requestAnimationFrame for animations. Track the backing timers so an
// animation started by one test cannot keep running after Vitest tears down its
// jsdom environment (Node 18 reports that leak as an unhandled error).
let nextAnimationFrameId = 0;
const animationFrameTimers = new Map<number, ReturnType<typeof setTimeout>>();

global.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
  const id = ++nextAnimationFrameId;
  const timer = setTimeout(() => {
    animationFrameTimers.delete(id);
    cb(performance.now());
  }, 16);
  animationFrameTimers.set(id, timer);
  return id;
});

global.cancelAnimationFrame = vi.fn((id: number) => {
  const timer = animationFrameTimers.get(id);
  if (timer) clearTimeout(timer);
  animationFrameTimers.delete(id);
});

afterEach(() => {
  for (const timer of animationFrameTimers.values()) clearTimeout(timer);
  animationFrameTimers.clear();
});

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
