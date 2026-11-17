# Slatebox v3 — Agent Handoff Prompt (written 2026-11-17, supersedes handoff-prompt-claude55.md)

You are continuing the productionization of Slatebox v3. Read this whole file
before acting. The canonical working notes live in the repo root `AGENTS.md`
of the workspace you start in — read those too. Then read the tail (~200
lines) of `docs/productionization-ledger.md`: it is the iteration-by-iteration
history; the most recent entries carry live state.

## What Slatebox v3 is
An infinite-canvas "whiteboard + AI thinking partner" (Miro-class). Two repos:
- **Engine** `~/Projects/node/slateboxjs-v2` — TypeScript/SVG.js canvas engine
  (replaces the Raphael-era lib). 1129 unit tests (vitest), 306+ e2e specs
  (playwright), 9 offline contract suites.
- **App** `~/Projects/node/app.slatebox.com` — Meteor 3.5 app (client in
  `web/app/imports/ui`, server AI pipeline in `web/app/server/methods/ai`).
The app consumes the engine **file-based** (`file:` ref to the local build) —
never npm-registry during iteration. Ship scripts live in
`~/Projects/roscoe-k8s/scripts/` (git repo with no remote).

## Where things stand (verified live at handoff time — re-verify, don't trust)
- **Live on BOTH prod + test**: ghost-cursor TTL fix, arrange toolbar (F2),
  gradient-preserving applyTheme (F3), cookie-consent floating pill (F4a),
  `/canvas/new -> /start` redirect. Test additionally has F4b (NodeDrawer
  float) awaiting verification + possible prod batch.
- **Deploy topology**: local k3s cluster (`kubectl --context roscoe-k8s`),
  namespaces `slatebox` (prod), `slatebox-test`, `slatebox-web` (old marketing
  + dead api pods). Pods named `slatebox-prod-<rs>-<id>` — match with
  `grep -E "^slatebox-prod-[a-z0-9]+-[a-z0-9]+ " | grep -v collab` (RS hash
  changes per ship; older greps broke when the hash changed).
- **AI providers**: DeepInfra. Default `Qwen/Qwen3-235B-A22B-Instruct-2507`,
  fallback `deepseek-ai/DeepSeek-V3.1-Terminus`. Real user journeys run
  4–5 calls max now (bounded ladder + shape-gates + capped repair retries);
  pre-fix the same paths ran 12-call spirals.
- **Real traffic**: 2 distinct real users observed. Their journeys decoded
  clean or self-healed (429 -> fallback success; invalid shape -> repair ->
  success). Keep decoding `aiAudit` in prod Mongo via a pod:
  require `/opt/bundle/bundle/programs/server/npm/node_modules/meteor/npm-mongo/node_modules/mongodb/lib/index.js`
  + `$MONGO_URL`, read-only, group by userId/slateShareId.

## Shipping (canonical, 2026-11-05; do not re-litigate)
Full canonical text also lives in `AGENTS.md` (workspace root) — they are
identical by design; the ledger documents why each rule exists.

1. **Push to main, test AFTER merge.** No CI gate, no PR review gate, no
   merge queue. This applies to BOTH the app and the engine library. Branch
   discipline: rebase on the remote only — never merge, never reset. The
   stale-tree gate enforces this (app remote is named `community` and the
   comparison target is branch `main-v3`; engine remote is `origin`;
   `roscoe-k8s` has no remote).
2. **One script does the ship** —
   `cd ~/Projects/roscoe-k8s && bash scripts/slatebox-ship.sh --test|--prod|--both [--note "..."]`
   Run it from the Mac (accepted end-state; "build box" is interpreted as the
   gated single-script path, not a physical machine). It: refuses a stale
   tree; reruns preflight; fast-forwards main and pushes; builds a FRESH
   engine bundle (never a stale tarball); stamps every artifact with
   lib-sha + app-sha + stamp; deploys; checks health (app answers, pages
   hydrate, smoke 24/24); runs the warn-only live probe. If any step fails,
   nothing reaches main. Never push to main by hand.
3. **Post-ship testing = background, report-only.** The FULL suite (9
   offline contract suites, ~6s) runs in background against new main and
   appends `sha, passed, failed, failing test names` lines to
   `~/Projects/roscoe-k8s/logs/suite.jsonl`. Never wait on, poll for, or
   block on it. Pre-ship you run only TARGETED checks: tests for changed
   files, typecheck/lint, build + smoke start.
4. **Red suite = fix forward, not roll back.** Whoever caused the red fixes
   it first, from the first red sha in the log, through the same `ship`
   path. Rollback only deliberate (`ship --allow-revert <sha>`). Never
   loosen a test to make it pass — fix the code, or fix the test only when
   the test itself is wrong.
5. **File-based engine invariant.** The app consumes the local
   slateboxjs-v2 build (no npm round-trips). Fresh-per-ship engine build,
   identity stamps on all artifacts, engine changes land on slateboxjs-v2
   main immediately, and app ships consume that main. npm publish happens
   ONCE when the dust settles (`docs/publish-3.1.3-runbook.md`); until then
   registry-mode ships are FORBIDDEN (3.1.2 lacks the template-gate fix =
   engine rollback) and the ship-script tripwire stays armed.
6. **Test-first env rule**: an unverified change goes to TEST only; prod
   holds last-known-good. Never leave test+prod both worse. Soak = >=1
   loop fire with clean suites/probes before the prod batch ship.

## The testing story (what "tested" means here — layers, cheapest first)
- **Unit** (engine): `cd ~/Projects/node/slateboxjs-v2 && npx vitest run`
  — 1129 tests, seconds. Any engine change ships with unit coverage of the
  changed behavior (F3 added 2; that's the pattern).
- **Contract suites** (app/server, offline): 9 suites under
  `web/app/scripts/` + `web/app/server/methods/ai/` — deepinfra-provider,
  initial-prompt, dependency-contracts, presentation-fallback,
  welcome-template-routing, procon-template-seed, template-kick-assembly,
  image-palette, guest-registration. Run pre-ship for changed files; run
  full in background post-ship (never a gate).
- **E2E** (engine, chromium): `npx playwright test --project=chromium` —
  306+ specs including canvas render, rotation, presence/cursors,
  birdseye. Run the FULL set before a prod batch ship (that's the soak
  evidence); run the touched area's specs before a test ship.
- **App-level live specs**: `playwright.app.config.ts` with
  `SLATEBOX_APP_EXTERNAL=true SLATEBOX_APP_URL=https://test.slatebox.com`
  (e.g. `tests/e2e/app-arrange.spec.ts`) — these run against the DEPLOYED
  app, true-guest (virgin context = no cookie resume). This is the
  fresh-bundle discipline: a passing local build proves nothing about what
  is executing in the browser.
- **Live probe** (`scripts/slatebox-live-probe.sh test|prod|both`): ONE
  tiny provider call inside a freshly-deployed pod with the DEPLOYED
  key/settings/network. Warn-only BY DESIGN — a non-zero exit is a signal
  to inspect, not a rollback order. Staging uses chunked base64 + md5
  verify (stream-free; stdin transport proved lossy).
- **Visual proof harnesses** (`slateboxjs-v2/scripts/f4-*.mjs`,
  `new-redirect-check.mjs`, `bundle-marker.mjs`): true-guest playwright
  drives that reach a real canvas (wizard chips auto-kick ~1 chain —
  budget it), dump geometry/screenshot, or grep shipped chunks for the
  change marker. A DOM check on `/start` proves nothing (route doesn't
  mount the canvas shell); a bundle-marker grep + fresh-session page load
  is the correct stale-vs-fresh discriminator.
- **Budgets**: <=5 live generations per iteration, <=8 per full journey;
  single-chain assumption — if chains double, that's a bug. Decode `aiAudit`
  to separate user traffic from your own test automations (wizard-chip
  repros DO kick generations; old "0-AI" labels on those were wrong).
- Git push convention: engine `git push origin main`; app
  `git push community main:main-v3`.

## Standing guardrails (per iteration)
- <=5 live provider generations per iteration (<=8 for one full journey).
- Live probe is warn-only. A probe WARN on 429/timeout = provider-side, not
  automatically a rollback trigger; decode, then decide.
- Prod Mongo + kubectl = READ-ONLY except ship's `set image`/rollout.
- No secrets in commits or output (names only). `slatebox-secrets.sh` manual
  runs MUST pass `--root-url final` (default rewrites URLs to dead hosts).
- Fresh-bundle protocol before trusting any live check: curl bundle hash, or
  grep the change marker inside the shipped chunks (`scripts/bundle-marker.mjs`
  pattern: fetch `<script src>` list, grep marker like `0d2b3e`). DOM-absence
  on `/start` is NOT a stale-bundle signal — that route doesn't mount the
  canvas shell.
- Session-reuse hazard: browser proofs need fresh `agent-browser --session`
  names or virgin playwright contexts; Meteor silently resumes cookies.
- Verification agents must stay read-only (no writes to /tmp or repos mid-loop).

## The work loop (if you continue it)
Perpetual loop prompt: `docs/loop-prompt.md` (Step 0 keep-alive first).
Cadence = hourly in quiet mode, */10–*/20 when a build queue exists. Loop
task id + timestamps tracked in `docs/.loop-marker` (untracked file — update
it; don't git-track it). IDLE is a CORRECT outcome when the queue is drained
— do not manufacture churn. Fire-gaps >5 days: Step 0 re-arms the cron task.

## Open queue (priority order)
1. **F4b verification (test env)** — NodeDrawer float shipped unverified.
   Recipe: guest playwright run against `test.slatebox.com`, wizard chips
   `Personal Use` -> `Consultant` -> `Infographic for market analysis`
   (3rd chip auto-kicks ~1 chain; 2-chip path stalls and costs nothing),
   wait `window.__slateboxInstances` non-empty, then SINGLE-CLICK an
   existing generated node; assert NodeDrawer paper: borderRadius 12px,
   width calc(100%-24px), bottom offset 12px; screenshot. If the drawer
   does not open from a node-click at all -> real defect, escalate with a
   repro. If good: ship `--prod`. Harness scripts:
   `scripts/f4-repro.mjs`, `scripts/f4-geo.mjs`, `scripts/f4b-verify.mjs`,
   `scripts/new-redirect-check.mjs`, `scripts/pill-check.mjs`,
   `scripts/bundle-marker.mjs` (all in slateboxjs-v2).
2. **Homepage rebuild = EXTERNAL agent (do not rebuild it yourself).**
   Your scope = plumbing only: Cloudflare Pages deploy path + smoke gate.
   `~/Projects/slatebox-home` (README has the 4 handoff rules for the
   builder-agent). Blocked on owner: fresh CF API token (current `.env`
   `CF_SLATEBOX_TOKEN` is `cfat_*` = WRONG CLASS — Cloudflare AI token,
   rejected by Pages/API; needed = Custom Token, Account permission
   `Pages: Read & Edit`). Cutover via `scripts/slatebox-dns.sh` (needs
   Zone:DNS:Edit), keep the old Deno pod hot 48h as rollback.
3. **Watch items**: decode aiAudit each sweep for (a) 429-class bursts —
   un-park two-provider-chain idea only at 2+ user journeys degraded in one
   window; (b) presence/ghost-cursor class regressions (F1); (c) any
   `/canvas/new` or share-embed 500 reports (api.slatebox.com is dead —
   retired by owner decision; magicLink share buttons + embed widget are the
   only surfaces it served; rebuild = iframe/read-only on CF Pages).
4. **User-gated, do not force**: npm publish 3.1.3 (needs npm token;
   `docs/publish-3.1.3-runbook.md`), public-repo flip decision, OpenRouter
   key rotation, Pro/Con template content decision (gallery entry ships empty;
   `buildProOrConTemplate` is dead code behind `enableDefaultProAndCon=false`).

## Style + gotcha notes
- No backwards compatibility worries (near-zero external users). Move fast,
  verify live, fix forward.
- Engine-surface rule: any new `slateEngine.call` method must exist on BOTH
  engine shapes (svgEngine + legacy Raphael path) or be dual-exported in
  `engine.ts`; verify consuming path with lsp_references before wiring.
- Seed/prompt hygiene: never ALL-CAPS placeholder tokens in seed content
  (they leak into user-visible prompt text via seedPrompt replace path).
- `kubectl exec -i` stdin is occasionally lossy — the live-probe now stages
  via chunked base64 through the exec ARG channel + decode-verify; keep new
  transport tools stream-free.
- Marketing claims: only tested claims ship. "Multiplayer" and "Miro import"
  stay BANNED until e2e proves them. Privacy redline: no AI conversation
  content on any public embed/gallery surface without opt-in + redaction.
- ContainerStatusUnknown pods in `slatebox-web` are ancient tombstones, not
  slatebox services — don't chase them.

## First three commands for the incoming agent
```
cd ~/Projects/node/slateboxjs-v2 && git status && npx vitest run 2>&1 | tail -3
kubectl --context roscoe-k8s get pods -A | grep slatebox
tail -60 ~/Projects/roscoe-k8s/logs/suite.jsonl   # last suites must be failed:0
```
Then start at queue item 1.
