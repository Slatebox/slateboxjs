---
description: One iteration of the slatebox.com drop-in vetting loop — verify/implement the next contract item, test, commit, update the checklist
---

You are continuing the SlateboxJS v2 port-completion effort. The mission: make this library
(`~/Projects/node/slateboxjs-v2`, SVG.js-based rewrite) a first-class, MIT-licensed, open-source
diagramming library that drops into slatebox.com — the Meteor app at `~/Projects/node/slatebox` —
replacing the Raphael-era `slateboxjs` npm package (source at `~/Projects/node/slateboxjs`).

The single source of truth for remaining work is **`docs/drop-in-contract.md`**. Every unchecked
box there is work; every checked box must be backed by a test.

## This iteration

1. **Read `docs/drop-in-contract.md`** (including the Status log at the bottom) and `git log --oneline -5`
   to orient. If the working tree has uncommitted changes, understand them first — finish or commit
   coherent in-flight work before starting new work.

2. **Pick the highest-leverage unchecked item**, in this priority order unless the status log says
   otherwise:
   1. §J quick hygiene wins (LICENSE, CONTRIBUTING.md, peerDependencies) — small, unblocking
   2. §A namespace facade (`Slatebox.slate/node/utils`, `window.Slatebox`) — everything else builds on it
   3. §B constructor `(options, events)` + events-object wiring
   4. §C/§D missing methods (`scaleToFitAndCenter`, `hideBg`, `getOrientation`, `nodes.addRange/one/allNodes/nodeMovePackage/applyLayout/packageLayout`, `node.resize.set/send`, `.png`)
   5. §E utils gaps (`_transformPath`, `whiteOrBlack` return values)
   6. §F change-package emission
   7. §G real-fixture serialization round-trip
   8. §I collab bridge (needs a DECISION from the user first — see below)
   9. §K integration proof (e2e drop-in spec, then the real Meteor swap)

3. **Verify before implementing.** Items marked `(?)` may already exist under another name — read
   the v1 source (`~/Projects/node/slateboxjs/src/`) and the Meteor call sites
   (`~/Projects/node/slatebox/imports/`) to pin exact expected behavior (argument shapes, return
   values, event timing) rather than guessing. The v1 repo and Meteor repo are READ-ONLY reference
   material — never modify them.

4. **Implement following house rules** (CLAUDE.md): SVG.js native methods only, isolated-class
   pattern, defensive guards for text-vs-SVG content, centralized selection orchestration through
   Slate, store element references. Put the v1 facade in a dedicated module (e.g.
   `src/compat-facade.ts`) that wraps the v2 classes rather than modifying their public APIs —
   v2's modern API stays clean; the facade is the migration layer.

5. **Prove it.** Add/extend unit tests (and an e2e spec when behavior is visual/interactive) for
   the specific contract item. Then run the gates — ALL must pass before commit:
   - `npm test` (currently 998 passing — regressions are unacceptable)
   - `npm run build` (vite + tsc declarations, must be clean)
   - `npm run test:e2e` if you touched runtime behavior (currently 101 passing on chromium)

6. **Record and commit.**
   - Check the box(es) in `docs/drop-in-contract.md` and note the proving test file inline
   - Append one line to the Status log table (date, what was done, metric deltas)
   - Commit to `main` with a descriptive message (include the Co-Authored-By trailer)

7. **Report** a short summary: what was completed, what's next, current test counts, and any
   blockers.

## Decisions reserved for the user — do NOT decide autonomously

- npm package name / taking over the `slateboxjs` name / publishing anything to npm
- Collab bridge strategy (§I a/b/c) — prepare an analysis with a recommendation, then ask
- Any modification inside `~/Projects/node/slatebox` or `~/Projects/node/collab.slatebox.com`
  (the final swap test needs coordination — prepare instructions instead)

If the next unchecked item needs one of these decisions, skip to the next actionable item and
surface the pending decision in your report. If NOTHING is actionable without a decision, stop
and ask via AskUserQuestion (interactive) or state it plainly as the blocker (autonomous).

## Loop termination

The loop is DONE when every box in `docs/drop-in-contract.md` is checked except user-reserved
decisions, and §K's drop-in e2e spec passes alongside the full existing suite. At that point,
write a final handoff summary at the top of the Status log, report completion, and do not
schedule further iterations.

Keep each iteration to ONE coherent contract item (or a small cluster of trivially-related ones).
Small, proven, committed increments beat big unverified sweeps.
