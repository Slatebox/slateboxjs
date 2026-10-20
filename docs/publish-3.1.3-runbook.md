# Publish-3.1.3 runbook (item e) — blocked ONLY on npm auth; one sitting when token is available

Status recon 2026-10-20 (iter32):
- `npm whoami` -> 401 (no token in environment; publish and re-pin must NOT be attempted without it).
- Registry latest = 3.1.2, published 2026-09-22. Verified missing (grep on published tarball):
  live-rotate content fix (650ddce), selection-init guard (144a0e0), rotation-decoration sync
  (bad2e95), loadJSON facade-options mirror (190faa7).
- HAZARD (why this is not bookkeeping): the tracked app package.json pins 3.1.2. Any
  registry-mode build (ship --library-source registry, or a CI workflow_dispatch run, or a
  clean-clone rebuild) currently ships an engine WITHOUT the template-kickoff gate fix —
  i.e. the registry path regresses the v3 product. Until 3.1.3 is published + pinned,
  registry mode is FORBIDDEN for ships; default local-bake mode is unaffected.
- DO NOT land the package.json/lock re-pin before the publish lands (unresolvable pin =
  broken tracked rebuild, same class as the poisoned-copy incidents).

## Steps (verify after every one; all gates are offline except publish/ship)
1. cd ~/Projects/node/slateboxjs-v2 && git status (must be clean beyond dist/) && npm run build && npx vitest run   (expect 1126/1126; it was green 2026-10-20)
2. npm pack --pack-destination /tmp && compare /tmp/slateboxjs-3.1.3.tgz against what `npm publish --dry-run` lists; entry points dist/slateboxjs.js + .mjs + css + d.ts present.
3. npm publish   (needs npm token; package.json version is ALREADY 3.1.3 and == current source — no version bump needed)
4. Byte-identity gate: curl the published tarball from registry.npmjs.org, sha256-compare against the local pack. A mismatch = STOP (poisoned-copy class), do not re-pin.
5. cd app repo: pin package.json + package-lock.json slateboxjs -> 3.1.3; run all 9 app suites offline (npm run test:* ; 9/9 green as of iter31).
6. Ship with --library-source registry --test FIRST; verify: smoke 24/24, live-probe green, then ONE live template journey (budget ≤8) — the journey is the product-level proof that the registry engine still gates template kickoffs (the thing 3.1.2 lacks). Only then --prod.
7. Rollback if anything smells: revert the pin commit -> ships go back to local-bake default automatically.

Evidence trail: unit 1126 + rotation e2es (programmatic-rotation-decoration.spec.ts, 2 tests) verified green against current source 2026-10-20 (iter32).
