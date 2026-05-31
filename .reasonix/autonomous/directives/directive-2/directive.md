# Autonomous Directive: SlateboxJS v2 — Git Integrity, Test Coverage, & Release Readiness

## Directive

Bring SlateboxJS v2 from a functionally-complete but structurally-fragile state to a fully-committed, well-tested, documented, and release-ready project. Work in five ordered phases: (1) audit & git hygiene, (2) comprehensive unit test coverage, (3) e2e test verification, (4) documentation & demos, (5) release readiness.

## Context

- **Repo**: `/Users/timheckel/Projects/node/slateboxjs-v2` — TypeScript (ES2020), SVG.js 3+, Vite 5, Playwright, Vitest
- **CLAUDE.md**: Full architecture reference — read it for the critical Selection/ResizeRotate pattern, Content Type Duality, and plugin loading order
- **Current state**: 306/306 unit tests pass, 56/56 e2e tests pass, TypeScript compiles clean, build succeeds. **However, 19 of 26 core modules (73%) and 20 of 22 test files (91%) are untracked by git** — they exist on disk but were never committed
- **Branch**: `main`, up to date with `origin/main`
- **Previous work (directive-1)**: Production hardening, error handling, compat layer tests, 3 commits

### Key Files
- `src/core/*.ts` — 26 modules total, only 7 tracked (Connector, Invoker, Node, NodesManager, PanZoom, ResizeRotate, Slate)
- `tests/unit/*.test.ts` — 22 files total, only 2 tracked (Node.test.ts, compat.test.ts)
- `tests/e2e/*.spec.ts` — 10 files total, only 2 tracked (connectors.spec.ts, selection.spec.ts)
- `public/test.html` — has uncommitted changes (rewritten test page)
- `index.html` — main demo page
- `advanced-demo.html` — uncommitted changes
- Root files: `package.json`, `README.md`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`

## Milestone Guidance

See milestones.md for the five-phase ordering:

1. **Audit & Git Hygiene** — Inventory untracked files, review for quality, write .gitignore, remove stale artifacts, commit in organized batches
2. **Unit Test Coverage** — Write tests for the 9 untested core modules (Slate, NodesManager, PanZoom, ResizeRotate, Connector, MultiSelection, Invoker, BirdsEye, Export)
3. **E2E Test Verification** — Run all 8 untracked e2e specs, fix failures, commit them
4. **Documentation & Demos** — README, JSDoc on public API, fix advanced-demo, improve index.html demo
5. **Release Readiness** — .gitignore finalization, CI config, npm publish metadata, changelog, build verification

## Constraints

- Keep work inside this workspace unless explicitly told otherwise
- Respect configured deny rules in `reasonix.toml`
- Pause and mark `state.json` as `blocked` if credentials, publishing, destructive data changes, or external approval are needed
- Do NOT modify `node_modules/` or `.git/` contents
- Do NOT publish to npm or push to remote without explicit approval
- Do NOT delete or modify `.reasonix/`, `.codegraph/`, `.cursor/`, `.serena/`, `.playwright-mcp/` metadata directories
- Follow the architectural conventions in CLAUDE.md, especially the Selection/ResizeRotate orchestration pattern and Content Type Duality guards
- All source changes must keep TypeScript compiling and unit tests passing
- Use `npm run build` to verify the build output after significant changes
- **Before committing large batches of untracked files, review each for quality and correctness**

## Definition Of Done

All of the following must be true:

1. **All source files (src/) are tracked by git** — no untracked `.ts` or `.css` files remain
2. **All test files (tests/) are tracked by git** — no untracked `.ts` or `.json` test fixtures remain
3. **`.gitignore` exists** and covers build artifacts, test results, `node_modules/`, `.env`, OS files
4. **A fresh `git clone` produces a working project** — `npm install && npm test && npm run build` succeeds
5. **All 9 untested core modules have unit tests** with meaningful coverage of happy path, edge cases, and error states
6. **All existing e2e tests pass** on chromium (306+ unit + 56+ e2e)
7. **TypeScript compiles cleanly** (`tsc --noEmit` with zero errors)
8. **`npm run build` produces a clean dist/** with esm, cjs, types, and CSS
9. **README.md is updated** with installation, basic usage, API overview, and build commands
10. **index.html demo page loads and demonstrates** basic functionality (nodes, pan/zoom, selection, connections)
11. **CI configuration is present** (GitHub Actions or similar) running tests + build on push/PR
