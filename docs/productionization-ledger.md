# Slatebox v3 productionization ledger

Updated: 2026-07-14

This ledger tracks the long-running convergence of the SlateboxJS v3 library and the canonical Meteor 3.5 application. A historical checklist being green is not sufficient evidence; each row names the current artifact or command that proves the product-level requirement.

## Repository roles

| Surface | Canonical location | Current role | Evidence / action |
|---|---|---|---|
| Diagramming library | `~/Projects/node/slateboxjs-v2` | `slateboxjs@3.0.0`, modern engine plus 2.x migration facade | `package.json`, `src/index.ts`, `src/compat-facade.ts` |
| Meteor application | `~/Projects/node/app.slatebox.com` | Canonical Meteor 3.5 product app on `meteor-3.5-changestreams` | This is the checkout containing the latest Meteor 3.5 and Miro-style group commits. Draft app PR [Slatebox/slatebox-app#33](https://github.com/Slatebox/slatebox-app/pull/33) is the remote review surface. |
| Older app checkout | `~/Projects/node/slatebox` | Reference/in-flight checkout, not an independent product source of truth | Compare and deliberately port or retire its uncommitted work; do not merge its whole tree blindly. |
| Collaboration service | `~/Projects/node/collab.slatebox.com` | Authenticated Yjs/y-websocket relay | `docs/collab-migration.md` plus library and host two-client tests |

## Completion matrix

| Requirement | State | Authoritative evidence / remaining gate |
|---|---|---|
| v3 is the app's only diagramming engine | Proven locally | Canonical app depends on the v3 tarball and imports `Slatebox` from `slateboxjs`; final proof requires the reviewed app branch and deployment artifact. |
| Canonical app chosen and reconciled | Canonical chosen; review pending | `app.slatebox.com` on `meteor-3.5-changestreams` is designated above and pushed as draft PR [Slatebox/slatebox-app#33](https://github.com/Slatebox/slatebox-app/pull/33). The older checkout's presentation UI and model-selection patch are superseded by the canonical app's newer `PresentSlate` flow and provider-aware AI request path; do not transplant them. |
| Library work committed and remotely recoverable | Proven; review pending | The productionization history is pushed on `agent/slatebox-v3-productionization` as draft PR [Slatebox/slateboxjs-v2#2](https://github.com/Slatebox/slateboxjs-v2/pull/2). Tool caches and generated artifacts remain outside the review branch. |
| App work committed and remotely recoverable | Proven; review pending | The canonical app branch is pushed as draft PR [Slatebox/slatebox-app#33](https://github.com/Slatebox/slatebox-app/pull/33), including the real-host build fix at `7642406`. The unrelated Kubernetes host-alias change remains uncommitted and outside the port slice. |
| Reproducible package consumer install | Proven and automated | `npm run verify:package` builds, packs, installs into a fresh temporary project, checks required files plus ESM/CJS/CSS exports, and runs strict TypeScript checking. It passed locally on 2026-07-14 and CI invokes the same command. |
| Versioned dependency replaces local tarball | Pending release | Both app checkouts still use `file:../../../slateboxjs-v2/slateboxjs-3.0.0.tgz`. Replace only after the user-authorized publish or another reviewed immutable artifact exists. |
| Migration and release documentation | In progress | README and CHANGELOG describe v3 and the facade. `docs/drop-in-contract.md` now points here for post-drop-in work; `docs/meteor-swap.md`, `docs/collab-migration.md`, and the historical parity/fix logs still need a final release-candidate reconciliation. |
| Known interaction gaps triaged | In progress | `docs/parity-gaps.md`, `docs/ui-fixes.md`, and `docs/collab-bugs-loop.md` contain historical findings; convert live remaining items into an explicit accepted/fix list. |
| Render → persist/reload → collab → undo invariant | Proven for undo/redo vertical slice | `undo-redo-collab.spec.ts` proves local render, two-client sync, late-join replay, redo, and export/load. `app-port-invariants.spec.ts` runs two canonical Meteor clients and queries `slates.get` until Mongo contains each undo/redo restoration. Continue expanding this four-leg proof across the remaining mutation matrix. |
| Production fixtures round-trip | Proven locally | `tests/e2e/real-fixtures.spec.ts` and `tests/fixtures/real-slates/`. Must pass in the final release SHA. |
| Standalone and real-host collaboration | Proven locally; release-SHA refresh pending | On 2026-07-14 the canonical Meteor 3.5 app passed the current 16-surface A→B matrix. `npm run test:app` is the repeatable gate; re-run it at the reviewed release SHAs. |
| Library gates | Proven locally; remote CI rerun pending | On 2026-07-14 after the collaborative undo slice: 1,100 unit tests passed; the 270-test Chromium catalog completed with Playwright status `passed`; build and fresh-consumer `verify:package` passed. The first PR runs correctly exposed two violations of the advertised Node 18 floor: `jsdom@28` and build scripts using Node 20's `import.meta.dirname`. The compatibility slice pins `jsdom@26`, uses `fileURLToPath(import.meta.url)`, and passes all 1,100 unit tests, build, and `verify:package` under Node 18.16. Record the replacement Node 18/20/22 PR run before promoting the candidate. |
| Dependency security | Production clean; dev upgrade pending | `npm audit --omit=dev` reported zero vulnerabilities on 2026-07-14. The full audit reports five development-tool advisories in the Vite/Vitest toolchain; upgrade and re-run all gates in a dedicated slice. |
| App build and integration gates | Proven locally; remote gate awaits immutable artifact | `npm run test:app` builds and packs the current library, installs it into the canonical app without changing its manifest, boots Meteor with the configured settings path, and runs strict real-host tests. The first run exposed and fixed the app's undeclared `lodash/cloneDeep` import by using its declared `lodash.clonedeep` dependency. App PR CI cannot resolve the current sibling tarball: both repositories are private and the app repository has neither a cross-repository Actions token nor an immutable package dependency. Add the remote app gate when one of those release inputs exists. |
| Production-like deployment smoke | Pending | Run against the candidate artifact and record create/edit/connect/group/reload/two-client collaboration results plus rollback steps. |
| npm publication | User-reserved | Do not run `npm publish` without explicit approval. |
| Final handoff | Pending | Record package/app/collab commits, artifact versions, migration steps, deployment and rollback procedure, test output, and accepted limitations. |

## Iteration rule

Choose one high-risk unproven vertical slice. Reproduce it in the canonical app, fix it at the correct library/facade/app boundary, verify every applicable invariant leg, add regression coverage, run proportional gates, commit each repository independently, and update this ledger with current evidence.
