# SlateboxJS v2 Testing

This directory contains both unit tests and end-to-end (e2e) tests for SlateboxJS v2.

## Directory Structure

```
tests/
├── unit/                     # Unit tests (vitest)
│   ├── Node.test.ts         # Node class tests
│   ├── Connector.test.ts    # Connector functionality tests
│   ├── Slate.test.ts        # Slate class tests
│   └── ...
├── e2e/                     # End-to-end tests (playwright)
│   ├── selection.spec.ts    # Node selection behavior
│   ├── connectors.spec.ts   # Connector plugin integration
│   ├── pan-zoom.spec.ts     # Pan/zoom functionality
│   └── ...
├── setup.ts                # Test setup and mocks
├── test-page.html          # Test HTML page for e2e tests
└── README.md               # This file
```

## Test Commands

### Unit Tests (Vitest)

```bash
# Run unit tests once
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with UI
npm run test:ui
```

### E2E Tests (Playwright)

```bash
# Run e2e tests
npm run test:e2e

# Run e2e tests with UI
npm run test:e2e:ui

# Run specific test file
npx playwright test selection.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed
```

### All Tests

```bash
# Run both unit and e2e tests
npm run test:all
```

## Setup

### First Time Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Install Playwright browsers:

   ```bash
   npx playwright install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

### Running Tests

The e2e tests will automatically start the dev server (`npm run dev`) and run tests against it.

## Unit Testing Approach

Unit tests focus on testing individual classes and methods in isolation:

- **Node.test.ts**: Tests Node class methods like `setSize()`, `setText()`, `position()`, etc.
- **Connector.test.ts**: Tests connector logic without browser rendering
- **Slate.test.ts**: Tests slate initialization and node management
- **ResizeRotate.test.ts**: Tests resize/rotate functionality logic

### Unit Test Philosophy

- Mock SVG.js dependencies to test pure logic
- Test edge cases and error conditions
- Fast execution (< 1 second for all unit tests)
- No browser dependencies

## E2E Testing Approach

E2E tests use real browsers to test complete user workflows:

- **selection.spec.ts**: Click, drag, multi-select, keyboard shortcuts
- **connectors.spec.ts**: Node connections, visual line rendering
- **pan-zoom.spec.ts**: Mouse/trackpad pan and zoom interactions
- **resize-rotate.spec.ts**: Resize handles and rotation behavior

### E2E Test Philosophy

- Test real user interactions
- Verify visual elements appear correctly
- Test cross-browser compatibility
- Include screenshots/videos on failure

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { Node } from "../../src/core/Node";

describe("Node", () => {
  it("should update position", () => {
    const node = new Node({ id: "test" }, mockSlate);
    node.position(100, 200);
    expect(node.options.x).toBe(100);
    expect(node.options.y).toBe(200);
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from "@playwright/test";

test("should select node on click", async ({ page }) => {
  await page.goto("/");
  await page.locator('g[data-node-id="node1"]').click();

  const selectedNodes = await page.evaluate(() => {
    return window.testSlate.getSelectedNodes().map((n) => n.id);
  });

  expect(selectedNodes).toEqual(["node1"]);
});
```

## Test Environment

### For E2E Tests

- Test page: `tests/test-page.html`
- Served by Vite dev server on `http://localhost:3000`
- Pre-loaded with SlateboxJS and test nodes
- Debug panel with real-time state information

### For Unit Tests

- jsdom environment for DOM simulation
- Mocked SVG.js dependencies
- Browser APIs mocked (requestAnimationFrame, ResizeObserver, etc.)

## Debugging Tests

### Unit Tests

```bash
# Run specific test file
npm run test Node.test.ts

# Run with debug output
npm run test -- --reporter=verbose

# Run single test
npm run test -- --run -t "should update position"
```

### E2E Tests

```bash
# Run with browser visible
npx playwright test --headed

# Run with debug mode
npx playwright test --debug

# Generate test report
npx playwright show-report
```

### Visual Debugging

The test page includes a debug panel that shows:

- Current node count and positions
- Selected nodes
- Pan/zoom state
- Real-time updates

## CI/CD Integration

Tests are configured for CI environments:

- Unit tests run in parallel
- E2E tests run sequentially for stability
- Screenshots/videos captured on failure
- Test reports generated

## Best Practices

### Unit Tests

- Test one thing at a time
- Use descriptive test names
- Mock external dependencies
- Test edge cases and error conditions

### E2E Tests

- Test complete user workflows
- Use data attributes for reliable element selection
- Wait for elements to appear before interacting
- Include visual assertions when appropriate

### Both

- Keep tests independent (no shared state)
- Use setup/teardown appropriately
- Write tests that are easy to understand and maintain
