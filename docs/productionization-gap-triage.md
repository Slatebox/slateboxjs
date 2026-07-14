# Slatebox v3 current gap triage

Updated: 2026-07-14

This is the current decision record for the SlateboxJS v3 plus canonical Meteor
3.5 port. The dated `parity-gaps.md`, `ui-fixes.md`, and
`collab-bugs-loop.md` files are implementation evidence, not active checklists.
Items labelled `pending commit`, `NEXT`, or `TODO` in those logs may already be
implemented and committed.

## Live product gaps

### Default primitive nodes as SVG paths — isolated follow-up

The requested direction is for rectangle, rounded rectangle, circle, and
ellipse nodes to share the path-based rendering pipeline used by custom shapes.
An earlier rectangle-only conversion was reverted because it broke resize,
shape changes, connector pinning/rotation, and reload styling. Treat this as a
deliberate subsystem migration, not a cosmetic one-line change. Acceptance must
cover fill/border/opacity/effects, resize/rotate, connector geometry and pinned
anchors, selection bounds, serialization, collaboration, and undo/redo before
the native-shape fast path is removed.

### Release and deployment — required after code convergence

- Review and merge the library and canonical-app draft PRs.
- With explicit user approval, publish `slateboxjs@3.0.0` (or choose another
  reviewed immutable artifact), then replace the app's local tarball dependency.
- Run the remote target-architecture app gate and repeat the production
  container matrix at the final package/app commits.
- Execute test-cluster then production-cluster smoke and rollback proof, and
  record package integrity, image digest, commits, and accepted limitations.

## Closed findings

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
