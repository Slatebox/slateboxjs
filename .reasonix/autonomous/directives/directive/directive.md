# Autonomous Directive: SlateboxJS v2 Production Hardening & Release Prep

## Directive

Bring SlateboxJS v2 to a production-ready state by finishing in-progress work, fixing gaps, hardening error handling, verifying the v1 compat layer, ensuring all tests pass, and producing a clean, publishable build. Work in order of most impactful gap first, iterating across the full codebase.

## Context

- **Repo**: `/Users/timheckel/Projects/node/slateboxjs-v2` — TypeScript (ES2020), SVG.js 3+, Vite 5, Playwright, Vitest
- **CLAUDE.md**: Full architecture reference — read it for the critical Selection/ResizeRotate pattern, Content Type Duality, and plugin loading order
- **Current state**: All 290 unit tests pass, TypeScript compiles cleanly (`tsc --noEmit` succeeds). 56 Playwright e2e tests exist across 10 spec files. The dist/ build exists (2.4MB) but may be stale. Working tree has uncommitted changes to 7 source files.
- **Branch**: `main`, up to date with `origin/main`
- **Recent work**: Connector handles, panzoom plugin switch (trackpad support), zoom controls, resize/rotate improvements, BirdsEye integration
- **Key files**: `src/index.ts` (exports), `src/core/*.ts` (30+ modules), `tests/unit/*.test.ts` (22 files), `tests/e2e/*.spec.ts` (10 files)

## Milestone Guidance

Work in order of most impactful gap first. See milestones.md for the planned phases:

1. **Audit** — Inventory the current state: what's uncommitted, what e2e tests pass/fail, what modules lack tests, what the build looks like
2. **Fix** — Address gaps found in audit, hardest-impact first
3. **Finish** — Complete and commit in-progress working-tree changes
4. **Harden** — Error handling, edge cases, defensive programming, dead code removal
5. **Validate** — Full test pass, clean build, demo page works, verify dist is publishable

## Constraints

- Keep work inside this workspace (`/Users/timheckel/Projects/node/slateboxjs-v2`) unless explicitly told otherwise
- Respect configured deny rules in `reasonix.toml`
- Pause and mark `state.json` as `blocked` if credentials, publishing, destructive data changes, or external approval are needed
- Do NOT modify `node_modules/` or `.git/` contents
- Do NOT publish to npm or push to remote without explicit approval
- Do NOT delete or modify `.reasonix/`, `.codegraph/`, `.cursor/`, `.serena/`, `.playwright-mcp/` metadata directories
- Follow the architectural conventions in CLAUDE.md, especially the Selection/ResizeRotate orchestration pattern and Content Type Duality guards
- All source changes must keep TypeScript compiling and unit tests passing
- Use `npm run build` to verify the build output after significant changes

## Definition Of Done

All of the following must be true:

1. **All uncommitted working-tree changes are reviewed, correct, and committed** to `main`
2. **All 56 e2e Playwright tests pass** on chromium (or documented as known unsupported features)
3. **All 290+ unit tests pass**
4. **TypeScript compiles cleanly** (`tsc --noEmit` with zero errors)
5. **`npm run build` produces a clean dist/** with esm, cjs, types, and CSS
6. **The compat layer** (`src/core/compat.ts`) is verified against v1 → v2 and v2 → v1 round-trip
7. **Error handling and edge cases** across core modules are reviewed and hardened
8. **The demo page** (`index.html`) loads and demonstrates basic functionality (nodes, pan/zoom, selection)
