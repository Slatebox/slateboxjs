# Slatebox v3 build-loop prompt (feed to /loop or paste as prompt)

Continue Slatebox v3 work. Read memory first:
~/Projects/node/slateboxjs-v2/docs/productionization-ledger.md (program memory — ALWAYS first),
productionization-gap-triage.md (same dir), ~/Projects/roscoe-k8s/docs/shipping-log.md.

Per iteration, exactly one unit of work:

1. SWEEP (2 min): kubectl --context roscoe-k8s get pods -A (namespaces slatebox, slatebox-test, slatebox-web). Any CrashLoopBackOff past the benign ≤1-restart E11000/startup race, or restarts climbing = diagnose + fix-forward FIRST. Check `df -h /System/Volumes/Data` — if <10G free, clear rebuildable caches before any docker build.

2. PICK highest open item (test-first, end-to-end proof = goal):
   a) TEMPLATE PAYLOAD FIX: provider.mjs normalizeDeepInfraMessages must send proper OpenAI-style tool pairing (assistant.tool_calls + role:"tool" with tool_call_id, or DROP dangling tool_use/tool_result) — current template-population kickoff fails with "chat template error: list object has no element 0". Proof: "Pro/Con list for platform choice" template journey on test.slatebox.com produces content (drive with agent-browser: fresh guest → createAnonymous+login+generateShareId → /canvas/<sid>?prompt=…).
   b) ROTATED-NODE DECORATIONS: selection ring/resize handles/plug dots stay at pre-rotation AABB when rotation is NOT mouse-drag (setRotation, collab onNodeRotated, group rotate, undo). Fix sites (already traced): Node.applyPositionAndRotation → after transform set + fire("transform"), rAF slate.updateSelectionResizeRotate?.() + updateConnectionHandlePositions() if handles visible; Connector.pinDropAnchor → snap against ROTATED rect edge. Add e2e: programmatic setRotation while selected (tests/e2e/rotate-overlay-follow.spec.ts pattern).
   c) LIVE-PROOF GATE: add a live-provider probe (small script + optional ship step) that runs ONE tiny deepinfra call through the deployed app path so "24/24 green" starts implying "generation green". Never blocks ship; warns.
   d) WIZARD QUIRK: headless /start wizard submit fired no DDP call (preset click + fill+Enter silent). Verify whether real-browser users hit it (compare logged-in vs guest, WS state) before any code change.
   e) WHEN a+b DONE: cut slateboxjs@3.1.3 → npm publish → re-pin app package.json to 3.1.3 → registry-mode gate run (SLATEBOX_LIBRARY_SOURCE=registry + integrity) → ship that as the baseline.

3. GATE+SHIP: run the relevant unit/contract scripts (web/app/scripts/test-*.mjs, npm run test:ai-chat-contract / test:slate-operations) and targeted e2e for what you touched. Commit BEFORE ship (no dirty lib tree beyond dist/; identity: lib sha + app sha + stamp traceable). Ship via ~/Projects/roscoe-k8s/scripts/slatebox-ship.sh --test → verify live in browser or smoke → then --prod. Test-after-merge policy: a red suite never blocks shipping; fix forward, never roll back without flagging.

4. CLOSE LOOP: append iteration outcome to the ledger (what changed, what's verified live, next open item), update shipping-log via the ship script, commit+push all edited repos. Output one line of status. If genuinely nothing is actionable, reply exactly "IDLE" and stop.

GUARDRAILS: never leave test AND prod worse than found — same-iteration fix attempt or loud ledger flag. Cluster writes only via ship script / slatebox-secrets.sh / slatebox-apply.sh. No secret values in commits or output (names only). DeepInfra key = k12io personal account: ≤5 live generations per iteration. Guests on test are free to break; prod user data: read-only.