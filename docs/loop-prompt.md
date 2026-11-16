# Slatebox v3 build-loop prompt (PERPETUAL, self-re-arming — the cron prompt just points here)

This loop is PERPETUAL. Two standing duties every fire: Step 0 (keep-alive), then exactly ONE
iteration unit. Read order every fire: this file → tail of
`~/Projects/node/slateboxjs-v2/docs/productionization-ledger.md` (last ~10 entries) → if the
task requires decisions/context beyond the PICK list, the relevant part of
`~/Projects/node/slateboxjs-v2/docs/handoff-prompt-claude55.md` (canonical shipping policy §5 +
open-work U-list with owner decisions baked in).

## Step 0 — KEEP-ALIVE (do FIRST, every fire, ~30s; the loop dies without it)

Durable cron tasks AUTO-EXPIRE 7 days after creation. The loop must re-arm itself at age ≥5
days, or immediately if its task vanished. Protocol:

(a) `cat ~/Projects/node/slateboxjs-v2/docs/.loop-marker` → line 1 = arm timestamp (ISO UTC),
    line 2 = task ID. Missing/garbage file = treat as age ≥5 days (re-arm).
(b) `date -u +%Y-%m-%dT%H:%M:%SZ` → compute age of the arm timestamp.
(c) cron_list. If the marker's task ID is present AND age < 5 days → skip to unit work.
(d) Otherwise RE-ARM: cron_delete the marker's old ID (tolerate not-found), then cron_create:
    durable=true, recurring=true, cron `*/20 * * * *`, label `slatebox-loop-perpetual`,
    prompt = the EXACT §SEED text below (verbatim — do not paraphrase or "improve" it; the
    loop's identity is that file, not the prompt). Then write .loop-marker: line 1 = fresh
    UTC timestamp, line 2 = new task ID. Then continue the same fire with normal work.
- If the machine slept for days, THIS fire is the re-arm chance — do Step 0 before anything.
- Re-arm is not "churn" and is never skippable for IDLE reasons.

## §SEED — exact prompt to use for every re-arm (verbatim)

Slatebox v3 perpetual build loop. Read ~/Projects/node/slateboxjs-v2/docs/loop-prompt.md IN FULL and execute it (Step 0 keep-alive re-arm FIRST if due, then one iteration unit). Also read the tail of productionization-ledger.md. Guardrails: ≤5 live generations (≤8 one journey), warn-only probe, never leave test+prod both worse, no secrets in output, prod data read-only, reply IDLE if nothing actionable.

## Per iteration: exactly ONE unit of work

1. SWEEP (2 min): `kubectl --context roscoe-k8s get pods -A` (slatebox, slatebox-test,
   slatebox-web). KNOWN BENIGN: terminal Error/Unknown/ContainerStatusUnknown records of OLD
   replicas (see handoff §6) = tombstones, ignore unless NEW failures appear, restarts are
   CLIMBING on Running pods, or an env stops answering HTTP. Check `df -h
   /System/Volumes/Data` (<10G free → clear rebuildable caches before any docker build).
   Then zero-call recon: aiAudit window since last iteration (recipe in handoff §8 — Mongo
   driver inside a Running app pod; there is REAL user traffic now, ~90 calls were logged in
   the Oct 22–Nov 5 idle window alone). Cluster writes ONLY via sanctioned scripts
   (slatebox-ship.sh / slatebox-secrets.sh --root-url final / slatebox-apply.sh).

2. PICK highest open item (test-first, end-to-end proof = goal). ACTIVE QUEUE (owner
   reopened fast-build mode Nov 16; cadence */10; workflow UNCHANGED: direct pushes to
   main, file-linked engine, NO npm publish, ship via slatebox-ship.sh gates):
   R1 HOMEPAGE = slatebox.com: REBRAND + MIGRATE TO CLOUDFLARE (owner directive
      Nov 16: Deno stack is being deprecated). Current = Fresh 2 (deno serve) + tiny
      api (waitlist.tsx, /api/*). Target end-state: new "open source Miro replacement"
      marketing site on Cloudflare Pages (static/prerender; dynamic bits as Pages
      Functions/Workers), deployed via existing CF tokens — retire the k8s
      slatebox-marketing + slatebox-api deployments once parity proven. Unit split:
      (1a) inventory: what api.slatebox.com + slatebox.com /api actually serve +
      waitlist datastore + provenance check of deployed image sha e1c473ab (NOT in
      either local marketing repo); (1b) new brand+site build on Pages behind a
      preview, e2e-smokeable; (1c) cutover via slatebox-dns.sh + keep k8s as
      rollback origin until 48h clean. BLOCKER pending owner: LICENSE.md is Elastic
      License 2.0 = NOT open source; do NOT ship "open source" claims until owner
      picks a license (asked Nov 16).
   R2 CANVAS DEFECT HUNT (owner screenshot Nov 16): maroon palette bleed in default
      theme; canvas content rendering UNDER the bottom toolbar; EFFECTS Style/Animation
      + alignment dropdowns broken; ghost "Anonymous" cursor labels; stray red-arrow
      edge decorations on selected notes. For each: localize engine vs app, seed
      repro, fix, cover with new unit/e2e spec.
   R3 TEST EXPANSION: unit (engine themes/decorations/selection) + e2e Playwright
      (304 spec baseline) — every R2 fix ships WITH its spec.
   Also ongoing: decode audit window each fire; wizard misfire watch (>=3 samples).
   Old PICK list follows for history only:
   - U2 (top): audit-decode of the 90-call window (50 non-success: Model-busy infra bursts,
     welcome-route slateOperationPlanInvalid/slateMessageRouteMissing, generationNodeInvalid,
     timeout pairs). Per chain: did the iter56 ladder policy fire correctly (infra→fallback
     ok; shape-exhaustion welcome→degrade; generation fallback kept), did journeys complete,
     any DOUBLE chains (double = bug, chase it). Propose fixes ONLY for evidenced patterns;
     otherwise record + close. New traffic folds into the same decode.
   - U4 (DECIDED — execute): prod Chatwoot CONFIG-OFF like test. public.chatWoot.enabled=false
     in the PROD METEOR_SETTINGS path via slatebox-secrets.sh (--root-url final, always).
     Absent key = widget ENABLED, so the false must be explicit. Verify fresh prod session:
     widget absent, no chatWoot TypeErrors, rest unaffected.
   - U3 (biggest): build-box `ship` per handoff §5. Git decision MADE: reconcile with the
     GitHub remotes (app remote is named `community`!) + REPORT divergence + then ENABLE
     ff-push permanently. Stale-tree gate (rebase only, no merge/reset), preflight rerun,
     ff main+push, deploy, health (app answers, pages hydrate), background post-ship full
     suite → logs/suite.jsonl (sha, passed, failed, names) never blocked on. Red =
     first-red-sha fix-forward; rollback only deliberate --allow-revert; never loosen a test.
   - WATCH (only if the three above are done/exhausted): wizard new-canvas edit-tool misfires;
     literal 'Node' category labels — need audit evidence, no vibe-tuning.
   - PARKED, do NOT execute without owner: npm publish chain (deferred to dust-settles;
     runbook armed at docs/publish-3.1.3-runbook.md; registry-mode ships FORBIDDEN until
     3.1.3 published + byte-verified — 3.1.2 lacks the template-gate fix).
   If a live journey is planned: probe-first discipline (probe green = precondition, not
   proof; fresh-session browser check is proof). If everything is user-gated or
   evidence-less AND the sweep is clean: reply IDLE, don't manufacture churn.

3. GATE+SHIP: targeted checks for what you changed (suites under web/app/scripts or
   web/app package.json test:* + any e2e for touched surface) — no full-suite pre-ship gate.
   Commit BEFORE ship; identity: lib sha + app sha + stamp traceable; engine fresh-per-ship
   file-based (never a stale tarball). Ship via the current slatebox-ship.sh (until U3
   replaces it with the build-box `ship`): --test → verify live (browser/smoke) → --prod only
   if verified. Test-after-merge: a red suite never blocks shipping; fix forward, flag loud.
   A probe WARN in shipping-log = generation plumbing not green at ship time = hold-prod
   signal. If provider.mjs/deepinfra.mjs/feature-config.mjs shape changed: re-run
   `bash scripts/slatebox-live-probe.sh both` before trusting any live journey.

4. CLOSE LOOP: append iteration outcome to the END of the ledger file (what changed, what's
   verified live, next open item), shipping-log updated via the ship script, commit all edited
   repos. Output one line of status. Nothing actionable → reply exactly "IDLE" and stop.

GUARDRAILS: never leave test AND prod worse than found (same-iteration fix attempt or loud
ledger flag). No secret values in commits/output (names only). DeepInfra key = k12io personal
account: ≤5 live generations per iteration, EXCEPT one full verification journey may use up to
8; a journey that DOUBLES the expected chains (~1 welcome ladder + 1 kickoff ≈ 5-6 calls) is a
bug to chase, not budget to absorb. Prefer offline harness replay over live calls when a
fixture exists. Test-namespace canvases free to break; prod user data READ-ONLY. Verification
agents stay read-only (no /tmp or repo writes mid-loop). Session-reuse hazard: fresh
agent-browser --session or full reload for any proof; check localStorage meteor_token before
trusting "guest" results.
