# HANDOFF PROMPT — Slatebox v3 productionization (for Claude 5.5)

You are taking over a long-running, loop-driven build effort ("Slatebox v3 productionization").
This document is the complete briefing. Trust NOTHING in it blindly — it was written Nov 5, 2026
after ~14 days of cluster idle. Your FIRST job is to re-verify live state, then execute the
"open work" list. Read the memory files named below before touching anything.

---

## 1. Mission

Modernize Slatebox (a Meteor-based collaborative whiteboard/mind-map product with AI generation)
by replacing the legacy Raphael-era canvas engine with a new TypeScript/SVG.js engine
("SlateboxJS v3") and making the AI generation + template product work end-to-end in production,
with fast iteration tooling and runtime-verified gates.

Owner policy ("Scion-style", canonical version in §5): push to main and test AFTER merge.
No CI gate, no PR-review gate, no merge queue. Ship with one script on the build box (roscoe),
never from a laptop. Fix forward, don't roll back. No backwards-compat worries — near-zero
external users today. Skip staging ceremony beyond the test namespace. The engine library is
consumed FILE-BASED (no npm publish during iteration — publish happens ONCE, when the dust
settles). Where any older note in this doc or the ledger says "ship-from-Mac," §5 wins.

## 2. Ground truth locations (READ THESE FIRST)

1. `~/Projects/node/slateboxjs-v2/docs/productionization-ledger.md` — THE program memory, ~63
   iteration entries, chronological. Read the last ~15 entries fully (iters 44–63 are terse
   IDLE/cadence notes; iters 22–43 carry the dense findings).
2. `~/Projects/node/slatebox/AGENTS.md` — canonical working-notes invariants (shorter, distilled).
3. `~/Projects/roscoe-k8s/docs/shipping-log.md` — every ship line: `| smoke: X | probe: Y |`.
4. `~/Projects/roscoe-k8s/scripts/slatebox-ship.sh` — the ONLY deploy path.
5. `~/Projects/roscoe-k8s/scripts/slatebox-live-probe.sh` + `scripts/live-probe/probe.mjs` —
   the post-deploy live-generation gate (in-pod, 1 tiny provider call, warn-only).

## 3. Environment

- Cluster: single-node k3s v1.36, arm64 Ubuntu 24.04 box "roscoe-2tb".
  All kubectl: `kubectl --context roscoe-k8s ...`
- Namespaces: `slatebox` (prod, 2 replicas + collab relay + mongo-0), `slatebox-test`
  (1 replica), `slatebox-web` (marketing + api, out of loop scope).
- Docker: OrbStack on the Mac. Cluster writes OUTSIDE the ship script's `set image` +
  rollout are FORBIDDEN (read-only kubectl otherwise; `slatebox-secrets.sh`/`slatebox-apply.sh`
  are sanctioned exception paths).
- Hostnames: prod `app.slatebox.com`, test `test.slatebox.com` (Cloudflare-routed).

## 4. Repos and layout

- **App**: `~/Projects/node/app.slatebox.com` (git branch `main`). Meteor 3.5 app; code lives in
  `web/app/`. Key paths:
  - `server/methods/openai.js` — welcome assistant, invokeTool switch (setIntention etc.),
    routeSlateMessage, chat entry, aiOpts assembly (~1500 lines, the heart).
  - `server/methods/ai/req.js` — provider ladder core (retries, validation-repair, fallback).
  - `server/methods/ai/provider.mjs` — provider resolution, body/headers builders,
    `shouldFallbackToModel` (iter56 policy), telemetry builder.
  - `server/methods/ai/feature-config.mjs` — per-feature model routing. Defaults for
    welcome/generation/vision/layout/presentation = DeepInfra `Qwen/Qwen3-235B-A22B-Instruct-2507`
    primary, `deepseek-ai/DeepSeek-V3.1-Terminus` fallback.
  - `server/methods/ai/welcome-response.mjs` — `WELCOME_INSTRUCTION_MIN_WORDS = 60`,
    requireSetIntention validation.
  - `server/methods/ai/initAIConversation` client twin: `imports/api/common/initAIConversation.js`
    — kickoff prompt assembly, template-gated strips, abort-on-empty-prompts.
  - `imports/ui/components/Chat.jsx` — client orchestration: loadTemplateIntoSlate → facade
    options mirror → prompt latch → initAIConversation.
  - `imports/ui/common/promptLatch.js` — page-scoped dedupe latch (kills double-dispatch).
  - `server/bootstrap/all.js` — seeds: ChatIntentions (16 docs, imported from legacy),
    proConTemplate.json, themes; plus idempotent seed-hygiene sweep (iter57: repins dead
    claude-3-5 engine fields to the live deepinfra pair).
  - 9 contract suites: `npm run test:deepinfra-provider test:initial-prompt
    test:dependency-contracts test:presentation-fallback test:welcome-template-routing
    test:procon-template-seed test:template-kick-assembly test:image-palette
    test:guest-registration` (run from `web/app`). All 9 green as of last commit.
- **Engine (library)**: `~/Projects/node/slateboxjs-v2` (branch `main`, package version `3.1.3`).
  TypeScript, SVG.js-based. `src/compat-facade.ts` is the compat layer. Unit tests: 1126.
  Playwright e2e baseline: 304 passed / 2 skipped (chromium) at iter33.
- **Infra**: `~/Projects/roscoe-k8s` — no git remote (local repo; commits are the record).

## 5. Shipping: push to main, test after merge (CANONICAL PRINCIPLE — overrides every older
## shipping note in this doc, the ledger, and AGENTS.md)

Apply to BOTH code repos — the app (`app.slatebox.com`) AND the engine library
(`slateboxjs-v2`). Same rules, same `ship` path, no per-repo exceptions.

### 5.1 The principle (verbatim policy)

1. **Targeted checks only before shipping**: the tests covering what you changed,
   typecheck/lint, and a fast preflight (build + smoke start of the app). Do NOT run the full
   suite before shipping. Full suite is a post-merge activity, never a gate.
2. **One script, `ship`, run on the build box (the roscoe), never from a laptop.** It, in order:
   - **refuses a stale tree** — the branch must be rebased on origin/main; `git rebase
     origin/main` is the ONLY way to update a branch (never merge, never reset);
   - reruns the preflight;
   - **fast-forwards main and pushes it**;
   - deploys;
   - checks health (the app answers, pages hydrate).
   If any step fails, nothing reaches main. **Never push to main by hand.**
3. **After a ship**, the full test suite runs in the BACKGROUND on the build box against the
   new main and appends one line per run (sha, passed, failed, failing test names) to a log,
   e.g. `logs/suite.jsonl`.
4. **Never wait on, poll for, or block on that post-ship suite.** Ship, report, move on.
5. **Fix a red suite forward; don't roll back by default.** Whoever caused the red fixes it
   first: find the first red sha in the log and ship a fix through the same `ship` path.
   Roll back only deliberately (e.g. `ship --allow-revert <sha>`).
6. **Never loosen a test to make it pass.** Fix the code, or fix the test only when the test
   itself is wrong.

### 5.2 Engine consumption: file-based, no npm round-trips during iteration

- The app must reference the **file-based slateboxjs** (the local `slateboxjs-v2` build), not
  the registry package. npm publish is deferred: publish slateboxjs **once, when the dust
  settles** (runbook already armed: `docs/publish-3.1.3-runbook.md`).
- Today's mechanism already satisfies "file-based": packed mode stages a **disposable build
  context** with `file:./slateboxjs-<stamp>.tgz` freshly built from current `slateboxjs-v2`
  source. You may keep that shape, or make the tracked package.json dependency genuinely
  file-based — either is acceptable as long as the three invariants below hold. What is NOT
  acceptable: pinning a stale tarball, a cached engine copy, or the registry package as the
  daily-driver path.
- **Invariants (these are what make file-based safe — the poisoned-copy class burned this
  project twice):** (a) every ship rebuilds the engine fresh from slateboxjs-v2 HEAD; no stale
  copy is ever consumed; (b) identity stamping — lib sha + app sha + stamp on every artifact
  and ship-log line, always traceable; (c) engine changes go to slateboxjs-v2 main immediately
  (same push-to-main-test-after rule), and the app ship consumes that main.
- **Registry-mode ships stay FORBIDDEN until slateboxjs@3.1.3 is actually published AND
  byte-identity-verified.** Registry 3.1.2 predates the template-gate fix — registry mode =
  engine rollback. The ship script's KNOWN-REGRESSIVE tripwire (iter38) must stay armed.

### 5.3 Gap to close: today's tooling vs the principle (= open work U3)

- `slatebox-ship.sh` currently runs FROM THE MAC (docker build via OrbStack). The principle
  puts `ship` on the build box. Facts: roscoe-2tb is arm64 and ssh-reachable from the Mac
  (`ssh roscoe-2tb` verified working at handoff). Decide at U3 whether docker/build moves
  natively onto roscoe (arm64 box, likely faster + matches the principle's letter) or a thin
  Mac-side stage remains — but the single-entrypoint contract is non-negotiable: stale-tree
  gate → preflight rerun → ff main + push → deploy → health check, one command, and it is NOT
  "from a laptop with hand-pushed main."
- Remote facts for the stale-tree gate (verify, don't trust): app repo's GitHub remote is named
  **`community`** (Slatebox/slatebox), NOT origin — `git rebase origin/main` will silently
  no-op or fail there; the gate must use the right remote. Engine remote is `origin`
  (Slatebox/slateboxjs-v2). `roscoe-k8s` has NO remote (local-only record repo — the
  stale-tree gate there reduces to "clean tree + recorded sha").
- Local mains may be AHEAD of the GitHub remotes after 2+ weeks of local-only commits. First
  act of U3: check ahead/behind per repo (`git status -sb`, `git log origin/main..main`). If
  diverged, reconcile deliberately BEFORE enabling the push-to-main step — do not let ship
  force-push or rebase-dump 60 iterations of history unreviewed onto a public repo.
- Post-ship background suite (`logs/suite.jsonl`, on the build box): app side = the 9 contract
  suites (+ playwright e2e where touched); engine side = the 1126 unit tests (+ its e2e).
  One line per run: `sha, passed, failed, failing test names`. Red handling per principle 5.
- Keep: post-deploy 24/24 smoke + warn-only live-probe inside the ship path (probe warn =
  inspect; hold-prod signal for generation-dependent changes). Keep `--allow-revert` energy
  low — the default is fix-forward.

## 6. Deployed state at handoff (RE-BASELINED LIVE Nov 7 — these checks were run on the
## cluster today; re-verify if anything contradicts)

- Running build verified: **iter57 seed-surgery on BOTH envs** (bundle markers in all live
  pods: `fallbackBlocked`×3 = iter56 ladder-cost, `seed-hygiene`×2 = iter57 repin). No deploy
  since Oct 20. Live probe re-run Nov 7: PASS both envs (200, ~0.5s, real completion, key
  present). HTTP 200 app/test/api-health. Node Ready.
- The Error/Unknown/ContainerStatusUnknown pods in `get pods` are TERMINAL RECORDS (Oct 20
  rollout residue + idle-node reschedule tombstones), NOT live failures. Every deployment has
  healthy Running replicas. Don't chase them; anchor selectors to Running RSes.
- **REAL TRAFFIC EXISTS — changes the open-work picture: ~90 provider calls Oct 22–Nov 5 in
  prod, 50 non-success.** Classes: 'Model busy, retry later (after 3 attempts)' infra bursts
  (Oct 22 ~01:07/02:35 UTC, serving-side flakiness signature), welcome-route
  `slateOperationPlanInvalid`/`slateMessageRouteMissing` misfires, `generationNodeInvalid`,
  timeout pairs, and chains where fallback RECOVERED (FB markers present). Session shares
  seen: 1e6483, d8a1dd, 383b6a, 56f54b + more. Decode per chain before fixing anything.
- Template catalog: 1 entry (`tplprocon001`, Pro/Con Analysis, 21-node seed, seed-sync verified
  in both DBs as of Oct 20).
- AI provider: DeepInfra (K12io account key, OpenAI-compatible endpoint
  `https://api.deepinfra.com/v1/openai/chat/completions`). Env var `API_KEY_DEEP_INFRA` on both
  deployments. Anthropic key is DEAD (any "API key is invalid" audit rows = legacy leftovers).
  No hardcoded model strings remain in code (iter12 eradication).
- Chatwoot: per-env kill switch `public.chatWoot.enabled` shipped both envs. Test = config-OFF
  (permanent, in secrets script). Prod = DECIDED Nov 7: CONFIG-OFF TOO (see U4 — execute it).
- debugRequestPayload: fully disarmed (code removed + config deleted).
- Loop cron: PERPETUAL, self-re-arming. Durable task every 20 min (current id in
  docs/.loop-marker, line 2). The cron prompt is a short seed pointing at docs/loop-prompt.md;
  that file's Step 0 tells every fire to re-create the durable task at age >=5 days (tasks
  auto-expire at 7d), so the loop survives expiry as long as the machine is on sometimes.
  If you find the loop dead: the re-arm recipe is loop-prompt.md Step 0 + its .loop-marker
  protocol; owner can also kill everything via /loop-kill.

## 7. The AI request path (current architecture, condensed)

Wizard/template entry → `WelcomeAssistant` (server `openai.welcome`) resolves an intention →
`invokeTool` `setIntention` case resolves/validates `slateTemplateId` against the catalog
(invalid ids DEGRADE to no-template, never retry-loop) → response carries `intention` (+
template id) to client → `Chat.jsx` loads template into slate (AWAITED), mirrors facade options,
checks the page-scoped prompt latch, then `initAIConversation` assembles the kickoff prompt →
`openai.chat` → `processConversation.js` → provider call → tool response applied to canvas
(notes/categories), with bounded validation retries.

Ladder policy (iter56, live-verified): fallback ONLY on infra failures (timeout/5xx/429/
template-error); shape-exhausted welcome responses BLOCK fallback and degrade; chat-continuation
capped at 1 repair retry; welcome instructions gate 60 words; generation fallback KEPT (it
demonstrably recovers content). `processImmediately` fast path now routes through generation
feature config (previously fired keyless at the default provider — dead sub-150ms bursts).

`slateEngine.call` contract: any new engine method must exist on BOTH engine shapes
(svgEngine AND legacy Raphael `_engine`) or be dual-exported in `engine.ts`. The
`slate.nodes.items` list populates only via `aiChatCompletion`; direct-call flows must pass it
in params. Verify with lsp_references on the consuming method BEFORE wiring.

## 8. Verification discipline (hard-won; violate at your cost)

- **Runtime-verified gate**: a unit is "done" only with a fresh-browser proof against the SHIPPED
  deployed build. Verify bundle-hash first (curl the served chunk, grep a changed marker) —
  bundle-vs-source ≠ runtime selection.
- **Session-reuse hazard**: browser profiles share cookies; Meteor silently resumes a login in a
  "guest" probe (no network request, no auth UI). For any auth-sensitive proof: clear
  `localStorage meteor_token/sampleRate` + reload, or use a virgin `agent-browser --session`
  name. Check `localStorage.getItem('meteor_token')` in empty-state assertions.
- **Stale-claim hazard**: a verifier's "I checked the live pod and content is absent/present"
  can be TRUE — verify before dismissing (bundle built from PREVIOUS deployed build, once).
- **Offline harness > live-only debugging**: `scripts/harness-assembly/initAIConversation.harness.mjs`
  is GENERATED per-run by `test-template-kick-assembly.mjs` (gitignored, don't hand-edit, don't
  run bare without the suite's stubs). It replays real production fixtures offline.
- **aiAudit forensics without spending calls**: the app writes every provider call to the
  `aiAudit` Mongo collection (feature, status, model, duration, error, slateShareId, created ms,
  fallbackFromProvider). Run read-only queries INSIDE an app pod using the bundled driver:
  `require('/opt/bundle/bundle/programs/server/npm/node_modules/meteor/npm-mongo/node_modules/mongodb/lib/index.js')`
  + `process.env.MONGO_URL`. This decoded the whole cost-drift story — use it before spending
  live calls. (Pod path may change with Meteor versions; `ls` it first.)
- **Prompt-injection/payload fixes** are verified by inspecting the actual `prompt` field in
  provider request logs, NOT by browser content-substring probes (escaping makes those unreliable).
- **Seed content hygiene**: never put ALL-CAPS placeholder tokens in seed content — they leak
  into the user-visible seeded textarea (`seedPrompt = templatePrompt.replace('The topic is',
  topic)`) and into LLM prompts. Use lowercase prose. Template-bundle caveat: test-deployment
  template content ships via `server/lib/templateBundles.ts` (built from getScaffoldTemplate +
  buildV2TemplateBundle + buildTestTemplateBundle), NOT the raw seed JSON — editing
  proconTemplate.json does not change the live bundle until the builder path is confirmed.
- **`slatebox-secrets.sh` manual runs MUST include `--root-url final`** (default preview mode
  rewrites URLs to decommissioned hosts — destroyed routing once).
- **`kubectl exec -i` stdin is occasionally lossy** — the ship/probe tooling md5-verifies staged
  files with one retry; keep that behavior if you touch the scripts.
- **Pod selector**: match the exact `<deploy>-<rs-hash>-<id>` two-segment pattern; an unanchored
  prefix once grabbed the collab relay pod.
- MUI IconButton `mt:50px` + below-fold wizard controls: automated clicks can hit the document
  backdrop. Verify suspected "automation artifacts" with trusted-input / state assertions before
  writing any fix. (Wizard submit quirk was PROVEN automation-only, iter33.)

## 9. Guardrails

- ≤5 live provider generations per iteration; ≤8 for one full journey. Single-chain assumption:
  if chains double, that's a bug to chase, not budget to absorb. The key is a personal paid
  account — prefer offline replay whenever a fixture exists.
- Never leave test AND prod both worse. Unverified change → test only; prod holds
  last-known-good until live verification.
- No secret values in commits/output (names only).
- Prod user data: read-only. Test namespace canvases: free to break.
- Commit BEFORE ship (no dirty lib tree beyond dist/); ship itself refuses a stale tree (§5).
  Ledger entry + infra/app commits close every iteration ("one unit" protocol). Pushes to main
  happen ONLY through the ship path — never by hand.
- Idle is correct when everything is gated: don't manufacture churn (the project's own lesson).

## 10. Open work (priority order)

**U1 — RE-BASELINE CLUSTER — DONE Nov 7 (result = §6; no work left, verification facts
only).** Reconciled pod churn (tombstones), verified iter57 live both envs, probe PASS both,
found the 90-call traffic window. If reality later contradicts §6, re-verify from scratch.

**U2 — Wizard default-path watch items (need traffic data from U1d).** Two filed classes:
(i) welcome-route/edit-tool misfires: on wizard entry the first welcome attempt sometimes calls
`applySlateOperations` on a NEW canvas (no existing nodes to operate on) — bounded now
(maxResponseValidationRetries), but if the audit shows a pattern, add a deterministic pre-step
or tighten the route system prompt (feature `welcome-route` in openai.js
`routeSlateMessage`). (ii) Timeout-class recurrence: old signature was 271s double-timeout pairs
(pre-iter56); iter56 policy should prevent; audit will show if it recurred. If traffic is still
zero, U2 is unverifiable — say so and move on rather than tuning on zero samples.

**U3 — SHIPPING 2.0: implement the §5 principle (the main build work). GIT DECISION MADE by
owner Nov 7: RECONCILE + ENABLE PUSH to GitHub remotes.**

> **STATUS Nov 7 (iter67) — U3a DONE, U3b REMAINING.** Push is LIVE: engine ff-pushed to
> origin/main (now 0/0 with remote); app pushed as NEW branch `main-v3` on `community` —
> remote `main` intentionally untouched (legacy 2024 line, decision C). Canonical push commands:
> engine `git push origin main`, app `git push community main:main-v3`. Pre-push secret gate
> passed (no new exposure; pre-existing settings.*.json hygiene item filed for owner rotation).
> **STATUS Nov 8 (iter68) — U3b DONE:** stale-tree gate + ff-push + background suite.jsonl are LIVE in
> slatebox-ship.sh, verified by a full no-code --test ship (24/24 + probe green + 9/9 suite). Gate
> compares app against `main-v3` as designed. Remaining tail = U3c (execute the SAME script FROM
> roscoe; needs container toolchain there — open question whether that's required or gates-close-
> the-principle; ask owner before building it).

Target state:
(a) single `ship` entrypoint that runs on the build box (roscoe), for BOTH repos; (b) stale-tree
gate (rebase check against the right remote — app's is named `community`); (c) preflight rerun;
(d) fast-forward main + push. BEFORE enabling the push step: inspect what's actually on the
GitHub remotes (Slatebox/slatebox, Slatebox/slateboxjs-v2), compare vs local main (2+ weeks of
local-only commits, ~60 iterations), reconcile deliberately, and REPORT the divergence + plan
before the first real push — do not bulk-dump history unreviewed. Once reconciled, ff-push is ON
permanently (never hand-push main again). (e) deploy
+ health check (app answers, pages hydrate); (f) background post-ship full suite appending to
`logs/suite.jsonl` (sha, passed, failed, failing names) — never blocked on, never a gate;
(g) red → first-red-sha fix-forward via the same path; rollback only via deliberate
`--allow-revert`. Engine stays file-based (fresh-per-ship build + identity stamps, §5.2).
npm publish is DEFERRED to "dust settles" — the runbook stays armed; do not half-run it.
Verification for this unit: a dry-run ship attempt must visibly refuse (1) a stale tree,
(2) a hand-pushed main, and a red preflight must leave main untouched. Then one real ship
through it + one background-suite line in the log = unit done.

**U4 — Prod Chatwoot: DECIDED by owner Nov 7 — CONFIG-OFF prod, same as test.** Execute: flip
the per-env kill switch (`public.chatWoot.enabled=false`) in the PROD settings path
(`slatebox-secrets.sh` METEOR_SETTINGS — remember `--root-url final` on manual runs) + redeploy
prod. Verify: fresh prod session → widget absent, no chatWoot TypeErrors in pod logs, rest of
app unaffected. Test is already config-off (permanent) so nothing regresses there. ~1 iteration.

**U5 — Optional cleanup (only if U1–U4 exhausted):** an in-flight edit exists to
`web/app/scripts/replay-real-payload.mjs` (usage guard + API_KEY_DEEP_INFRA env-key support
instead of argv) — verify `node scripts/replay-real-payload.mjs` prints usage cleanly, re-run the
9 contract suites, commit or discard. Then: the 2 'category label renders literal "Node"'
cosmetic nits (file-only if recurring); wizard UX polish (below-fold submit controls — FILED,
NOT a defect, revisit only if the wizard is redesigned).

## 11. Quick self-check quiz (if you can't answer these from the memory files, read them)

1. Why is a "clean guest" browser check in a reused session a false gate?
2. Why does editing proconTemplate.json not change the live test bundle?
3. A journey shows 10 provider calls, single chain, no errors — is that a plumbing bug? What
   changed in iter56 about that path's failure budget?
4. A fix touches `slateEngine.call` — what two surfaces must it exist on and how do you verify
   before shipping?
5. Ship script defaults to what library source, and why is the other one armed with a warning?
6. Where does `ship` run, and what are the three things it must refuse before anything reaches
   main? Where do post-ship full-suite results go, and who is allowed to block on them?
7. You need to reconstruct what provider calls a failed journey made without spending any calls —
   what do you query and where does the driver live in the image?

Good luck. Verify first, ship small, keep the ledger alive — append your iteration outcomes to the
END of `productionization-ledger.md` and commit (app + engine + infra repos each keep their half
of the record).
