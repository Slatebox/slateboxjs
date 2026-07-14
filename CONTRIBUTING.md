# Contributing to SlateboxJS

Thanks for your interest in contributing! SlateboxJS is MIT-licensed and welcomes
issues, discussion, and pull requests.

## Getting started

```bash
git clone https://github.com/slatebox/slateboxjs-v2.git
cd slateboxjs-v2
npm install
npm run dev        # Vite dev server at http://localhost:5173
```

Requires Node >= 18.

## Development workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes, with tests
4. Run the quality gates (see below) — all must pass
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Quality gates

Every change must keep these green:

```bash
npm test                 # Vitest unit suite (jsdom)
npm run build            # vite build + tsc declaration emit — must be clean
npm run test:e2e         # Playwright e2e (chromium) — required for runtime/visual changes
```

Run a single test file with:

```bash
npx vitest run tests/unit/Node.test.ts
npx playwright test tests/e2e/connectors.spec.ts --project=chromium
```

## Conventions

- **TypeScript + SVG.js native methods** — use `size()`, `move()`, `rotate()`, `viewbox()`,
  `preserveAspectRatio`; never hand-rolled SVG attribute/transform manipulation.
- **Isolated class pattern** for new features: constructor takes `node`/`slate` + `options`,
  exposes `enable()`, `disable()`, `isEnabled()`, `updateOptions()`, `destroy()`.
- **Selection is centralized** — only `Slate` orchestrates resize/rotate enablement; nodes
  delegate upward. Never enable selection UI directly on a node.
- **Content duality** — a node has either `textElement` or `nestedSvg`, never both. Guard
  accordingly.
- **Store element references** as class properties instead of re-querying the DOM.
- Debug logging format: `COMPONENT_ACTION_DEBUG: description`.

See `CLAUDE.md` for the full architecture notes.

## Reporting issues

Open a GitHub issue with a minimal reproduction — a small HTML snippet using the built
bundle (or a failing test) is ideal.
