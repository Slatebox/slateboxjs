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

Owner preference ("Scion-style"): test-after-merge. No CI gate blocks a ship. Fix forward, don't
roll back. No backwards-compat worries — near-zero external users today. Skip staging ceremony
beyond the test namespace. Ship-from-Mac is the deliberate workflow.

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

## 5. How shipping works RIGHT NOW

```
~/Projects/roscoe-k8s/scripts/slatebox-ship.sh --test|--prod|--both [--no-probe] [--note "..."]
```
- DEFAULT is **packed mode**: builds the local `slateboxjs-v2` engine, tars it, stages a
  **disposable build context** whose package.json points at `file:./slateboxjs-<stamp>.tgz`.
  npm publish is NOT part of the flow. The tracked `package.json` pin (registry 3.1.2) is inert
  in packed mode.
- **NEVER ship `--library-source registry` until slateboxjs@3.1.3 actually publishes.** Registry
  3.1.2 PREDATES the template-gate fix — registry mode = engine rollback. The ship script prints a
  KNOWN-REGRESSIVE warning (tripwire, iter38) — do not silence it, don't use that mode.
- `file:` dependency edits to the TRACKED app package.json are forbidden (poisoned-copy class).
- Every artifact must be identity-stamped (lib sha + app sha + stamp) — this rule exists because
  untraceable copies burned the project twice.
- Ship runs smoke (24/24 baseline) then the live-probe post-deploy automatically. Probe is
  WARN-ONLY (never gates): a probe warn = inspect, don't rollback; treat as hold-prod signal for
  generation-dependent changes.
- Test-after-merge: a red suite doesn't block a ship, but you fix forward same-iteration.

## 6. Deployed state at handoff (VERIFY BEFORE TRUSTING — 14 days idle)

- Last known-good deploy: "iter57 seed-surgery" build on BOTH test and prod
  (template-less basedOnTemplate journeys degrade to default mindmap; welcome display sanitized
  of raw `{{token}}`; bootstrap repin of dead claude-3-5 pins). Both shipped ~Oct 20 evening,
  smoke 24/24 + probe green at ship time, and a post-ship window with ZERO real user calls.
- **The one sweep taken just before this handoff (Nov 5) showed pod churn**: test ReplicaSet
  rolled (old pod Error, new Running), prod 77d9694bc6 has 2 Error/Unknown + 2 Running
  replicas, api/marketing also churned. Could be node sleep/rollout residue, could be a crash
  loop that resolved. **Unit #1 is: reconcile this** (kubectl describe, logs, what RS is current,
  whether smoke+probe still pass, whether anything deployed itself that shouldn't have).
- Template catalog: 1 entry (`tplprocon001`, Pro/Con Analysis, 21-node seed, seed-sync verified
  in both DBs as of Oct 20).
- AI provider: DeepInfra (K12io account key, OpenAI-compatible endpoint
  `https://api.deepinfra.com/v1/openai/chat/completions`). Env var `API_KEY_DEEP_INFRA` on both
  deployments. Anthropic key is DEAD (any "API key is invalid" audit rows = legacy leftovers).
  No hardcoded model strings remain in code (iter12 eradication).
- Chatwoot: per-env kill switch `public.chatWoot.enabled` shipped both envs. Test = config-OFF
  (permanent, encoded in secrets script). Prod = widget ON (default behavior) — unresolved
  identity decision, see open work.
- debugRequestPayload: fully disarmed (code removed + config deleted).
- Loop cron cadence: hourly `:05` (id 60c1711e, durable, auto-expires ~Nov 10). You may want to
  replace or kill it; the ship-time gates are the real standing protection.

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
- Commit BEFORE ship (no dirty lib tree beyond dist/). Ledger entry + infra/app commits close
  every iteration ("one unit" protocol).
- Idle is correct when everything is gated: don't manufacture churn (the project's own lesson).

## 10. Open work (priority order)

**U1 — RE-BASELINE CLUSTER (do this first).** Nov 5 sweep saw: test rolled to a new RS (old pod
Error/terminated, new Running), prod deployment 77d9694bc6 showing 2 Error/Unknown + 2 Running
replicas and collab replica churn. (a) Determine what's actually running and what deployed since
Oct 20 (shipping-log + `kubectl -n slatebox describe rs/deploy` + pod logs). (b) Run smoke
(24/24 baseline) both envs. (c) Run `bash ~/Projects/roscoe-k8s/scripts/slatebox-live-probe.sh
both` (warn-only; costs ~2 tiny calls). (d) Query aiAudit (recipe above) for ANY traffic in the
idle window — the watch items below depend on it. (e) Only then touch code.

**U2 — Wizard default-path watch items (need traffic data from U1d).** Two filed classes:
(i) welcome-route/edit-tool misfires: on wizard entry the first welcome attempt sometimes calls
`applySlateOperations` on a NEW canvas (no existing nodes to operate on) — bounded now
(maxResponseValidationRetries), but if the audit shows a pattern, add a deterministic pre-step
or tighten the route system prompt (feature `welcome-route` in openai.js
`routeSlateMessage`). (ii) Timeout-class recurrence: old signature was 271s double-timeout pairs
(pre-iter56); iter56 policy should prevent; audit will show if it recurred. If traffic is still
zero, U2 is unverifiable — say so and move on rather than tuning on zero samples.

**U3 — npm publish chain (BLOCKED on a human: npm auth 401).** Full runbook:
`~/Projects/node/slateboxjs-v2/docs/publish-3.1.3-runbook.md`. Chain = publish 3.1.3 → byte-identity
gate (published tarball vs local build) → re-pin app package.json → registry-mode gate run →
baseline ship. UNTIL DONE: registry-mode ships are FORBIDDEN (3.1.2 regressive; tripwire armed).
If auth still fails, this stays blocked — don't half-do it.

**U4 — Prod Chatwoot identity decision (needs owner call, then ~30 min).** Prod users currently
share one anonymous widget contact space (test escaped it via config-OFF in iter30/25). Options:
(a) config-off prod too — one line in `slatebox-secrets.sh` settings + redeploy; (b) wire real
identity: configure per-env `chatWoot.userIdentityValidationToken` (the crash-prone unguarded
read was fixed iter30; the KILL SWITCH `public.chatWoot.enabled` defaults to ENABLED when the
config key is absent, so absent-key = widget on). Ask the owner which; do not guess.

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
6. You need to reconstruct what provider calls a failed journey made without spending any calls —
   what do you query and where does the driver live in the image?

Good luck. Verify first, ship small, keep the ledger alive — append your iteration outcomes to the
END of `productionization-ledger.md` and commit (app + engine + infra repos each keep their half
of the record).
