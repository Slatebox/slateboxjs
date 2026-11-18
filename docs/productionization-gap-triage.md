# Slatebox v3 current gap triage

Updated: 2026-10-18

This is the current decision record for the SlateboxJS v3 plus canonical Meteor
3.5 port. The dated `parity-gaps.md`, `ui-fixes.md`, and
`collab-bugs-loop.md` files are implementation evidence, not active checklists.
Items labelled `pending commit`, `NEXT`, or `TODO` in those logs may already be
implemented and committed.

## Live product gaps

### Release and deployment — required after code convergence

- **3.1.3 cycle (candidate ready, awaiting user action — was: open):** the Sept-24 rotate/selection fixes (PR #15/#16) exist only in library `main` src; no published artifact contained them. A verified 3.1.3 candidate now exists (branch `release/3.1.3-candidate`, integrity recorded in the ledger; both-architecture paired gate green, 2026-10-19). Remaining steps are user-reserved: npm publish, PR merge, app consumption + registry-mode re-gate, test-cluster deploy.
- Review and merge the library and canonical-app draft PRs.
- With explicit user approval, publish `slateboxjs@3.0.0` (or choose another
  reviewed immutable artifact), then replace the app's local tarball dependency.
- Run the remote target-architecture app gate and repeat the production
  container matrix at the final package/app commits.
- Execute test-cluster then production-cluster smoke and rollback proof, and
  record package integrity, image digest, commits, and accepted limitations.

## Closed findings

- Default rectangle, rounded-rectangle, circle, and ellipse nodes now render
  through the same path, visible-style, resize-proxy, and connector-outline
  pipeline as custom shapes. The migration also makes image fills target the
  visible path, keeps SVG-content artwork distinct from its invisible
  background, and removes stale resize proxies during shape changes.
  `primitive-path-invariants.spec.ts` proves all four families render and style,
  serialize/reload, collaborate, and undo/redo; the full browser catalog covers
  live resize/rotate, pinned and rotated connector geometry, selection, badges,
  effects, images, opacity, borders, and production fixtures.
- The G, P, Q, M, L, and U interaction backlogs are implemented and guarded by
  unit/browser coverage. This includes presentation, modern context toolbars,
  endpoint editing and locking, themes/color application, comments, export,
  birds-eye behavior, multi-selection, grouping, persistence, collaboration,
  and undo/redo.
- Saved app themes now apply their complete node and line style: `vectorPath`,
  image, fill/opacity, border, text/font, filters, and line appearance. The
  host-owned `collab.invoke()` path also records undo checkpoints. The
  `theme-style-invariants` browser test proves render, serialize/reload,
  two-client collaboration, undo, and redo for a shape-bearing theme.
- The earlier absolute-anchor-on-drag report is now covered by
  `connector-pin-follows-move.spec.ts`, `line-endpoint-lock.spec.ts`, and the
  connector persistence suite; it is not a reproducible open defect.
- The app no longer reaches into `window.__slateboxInstances` for grouping.
  The registry remains an internal lifecycle/debug surface owned by the
  library.
- Slate background effects are intentionally empty because neither the legacy
  nor current filter registry defines a slate-targeted effect.

## Accepted differences and debt

- Node/line toolbars are the approved modern Miro-style controls; they do not
  reproduce the legacy Raphael UI pixel-for-pixel.
- The current resize/rotate interaction is intentionally retained.
- URL links are the canonical app's exposed node-link mode. Legacy
  `currentSlate`/`externalSlate` link navigation is not exposed by the app and
  is not a release blocker unless product scope changes.
- The app production audit has one accepted, unreachable moderate finding:
  `qs@6.14.2` inside the latest `meteor-node-stubs`. The app does not import the
  affected path, and forking Meteor's stub bundle would add more release risk.
- Publishing, merging, and cluster deployment remain explicit user-controlled
  operations.

## Completion rule

Do not declare the port complete from a green historical checklist. The final
package and app commits must pass library unit/build/package verification, real
fixtures, standalone collaboration, canonical-app two-client persistence and
undo/redo, the production container gate, and production-like cluster smoke.

## Canvas and workshops, November 2026

The app and homepage consume the file build of SlateboxJS. The October registry and PR instructions above describe the old release process. The Roscoe ship script now rebuilds the engine and stamps the deployed app with both source revisions.

| Capability | Implementation and scope |
| --- | --- |
| Freeform whiteboard | SVG.js draws the native shapes, custom paths, embedded artwork, connectors and text. The comments about Raphael in the compatibility facade describe the input contract for older slates. |
| Multiplayer | The canvas collaboration API exchanges document edits and awareness via Yjs. The app uses a collaboration relay. The homepage runs two editors and their Yjs documents inside each visit, so visitors can take either side of the demo. |
| Presentations | The engine exposes ordered node viewpoints and camera traversal. The app's authored presentation player also handles saved viewpoints and the presentation SVG. The homepage readout feeds the current editable slate to that player. |
| Agent-designed workshops | The Pro and Team workshop flow asks a model for a validated board of lanes, cards, allowed destinations and capacity limits. The team reviews it before opening the workshop. Dragology chooses between valid next board states during a drag. Keyboard moves follow the same rules. |
| Workshop export | The account can reopen its saved workshop or open its choices as an editable native slate. The freeform copy has independent node positions. Moving a freeform node does not update the workshop's lane membership. |
| Template coverage | Agent-designed workshops run alongside the existing gallery. Existing templates have not all been converted into constrained workshops. The current workshop model expresses lane membership, allowed destinations and capacity. More interaction models require additional engine support. |

The workshop model and renderer live in `src/workshops/model.ts` and `src/workshops/index.tsx`. Browser checks for the app paths live under `tests/e2e/app-*.spec.ts`. The historic parity log records the earlier editor work, including selection, grouping, routing, comments and export.
