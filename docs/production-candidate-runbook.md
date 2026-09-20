# Slatebox v3 production candidate runbook

This runbook coordinates the SlateboxJS library and the canonical Meteor 3.5
application. The `slateboxjs@3.0.0` cycle completed in July 2026 (published;
deployed to test as app release 1.3.0). The current cycle is
`slateboxjs@3.1.2` on `release/3.1.2-candidate` (library PR #10): the
September real-input fixes composed onto the published 3.1.1 lineage.
Publishing and deployment remain explicit release decisions; the commands
below do not authorize `npm publish`, a merge, or a cluster mutation.

## Reproduce the candidate locally

From `~/Projects/node/app.slatebox.com` with the sibling library at
`../slateboxjs-v2`:

```sh
npm run test:port-container
```

The Slatebox cluster nodes are `linux/amd64`. Before promotion, repeat the same
gate against that target architecture (Docker Desktop may use emulation on an
ARM development host):

```sh
SLATEBOX_PORT_PLATFORM=linux/amd64 \
SLATEBOX_PORT_IMAGE=slatebox-port:meteor-3.5-amd64 \
npm run test:port-container
```

The gate builds and packs the library, creates a disposable app context with a
clean npm 11 lock, builds the production Dockerfile, and verifies:

- Meteor 3.5 with Node 24.15.0;
- the exact `slateboxjs` version under release in the final server bundle
  (asserted via `SLATEBOX_LIBRARY_VERSION`);
- native Sharp loading in the Alpine runtime;
- a clean Mongo 7 replica set and `/readyz`/`/livez` health endpoints;
- all 16 real-host collaboration surfaces; and
- Mongo-backed collaborative undo and redo.

The settings JSON is read without printing it. Override paths or image names
with `SLATEBOX_LIBRARY_DIR`, `SLATEBOX_APP_SETTINGS`,
`SLATEBOX_PORT_IMAGE`, `SLATEBOX_PORT_PLATFORM`, or
`SLATEBOX_MONGO_IMAGE`. Use `--build-only` when a runtime smoke is
intentionally out of scope.

The default `SLATEBOX_LIBRARY_SOURCE=packed` mode is only the pre-publication
paired-candidate proof. After publication, the tracked app dependency and lock
must be verified without substituting a local pack:

```sh
SLATEBOX_LIBRARY_SOURCE=registry \
SLATEBOX_LIBRARY_VERSION=3.1.2 \
SLATEBOX_LIBRARY_INTEGRITY='sha512-RECOMPUTE-FROM-PUBLISHED-TARBALL' \
SLATEBOX_LIBRARY_REVISION=<40-char-SHA-of-the-library-commit-whose-tree-produced-the-published-tarball> \
SLATEBOX_PORT_PLATFORM=linux/amd64 \
SLATEBOX_PORT_IMAGE=slatebox-port:meteor-3.5-registry \
npm run test:port-container
```

Candidate pre-flight evidence (2026-09-20): packed-mode gates passed on both
native arm64 and `linux/amd64` against the `release/3.1.2-candidate` tree —
16/16 collaboration surfaces and Mongo-backed undo/redo invariants, zero
failures. The candidate pack was reproducible (two byte-identical tarballs,
SHA-256 `6fbdf5d6a17d458d592b95216453fb4b0f26fa2422e9151811858af1cefdc374`,
local integrity `sha512-l1S/19dQpEUc1nFF+1oQ17haCitOceAaovu75EVrsULDaimwN3sazW2E1UJuVaK54u1BhNOk3k2wxKhDud9u0Q==`).
These are pre-publication values: replace integrity and revision with the
values returned for the actual published artifact before running the gate.

Registry mode rejects a range, `file:` dependency, non-registry lock entry,
integrity mismatch, or abbreviated library revision. It then asserts the
released version inside the final server bundle and records the full library
commit in the image labels.

## Promotion order

1. Review and merge the library PR at its fully green SHA.
2. With explicit user approval, publish the immutable `slateboxjs@3.1.2`
   package and verify its registry version and integrity.
3. Update the app's `slateboxjs` dependency and lock from `3.1.0` to exact
   `3.1.2` (npm 11, `legacy-peer-deps=false`), then rerun the candidate gate
   in `registry` mode using the registry integrity returned by npm. A default
   packed-mode run is not release evidence at this stage.
4. Resolve or formally accept the app production-dependency audit findings.
   Critical findings are a production promotion blocker unless their paths are
   proven unreachable and recorded.
5. Merge the app PR to the test deployment branch first. The workflow must
   build the immutable dependency and finish `kubectl rollout status`.
6. On the test host, create a slate and verify add, edit, move, connect, group,
   reload, a second client, undo, and redo. Confirm the same document survives
   a fresh session.
7. Promote the reviewed app commit to `main`, wait for the production rollout,
   and repeat the smoke against `app.slatebox.com`.

Run the real-host suite against the deployed test application rather than
substituting a local container:

```sh
SLATEBOX_APP_EXTERNAL=true \
SLATEBOX_APP_URL=https://test.slatebox.com \
npm run test:app
```

This creates a guest slate through the deployed onboarding flow and verifies
all 16 collaboration surfaces plus Mongo-backed text, grouping, themes,
primitive paths, undo, and redo across two isolated browser contexts.

The 2026-07-14 test promotion advanced `slatebox-test` from revision 39 to 40
using exact registry digest
`sha256:11bba759d6772d6f70a97e6879029df83041d05c3a9a2462e0e949c485675ef2`.
The image build and registry push completed in workflow run 29343005633, but
its Kubernetes apply was rejected because the Actions kubeconfig did not
provide valid credentials. The already-pushed immutable digest was therefore
applied through the authenticated local `sb-k3s` context. Revision 40 reached
1/1 ready with zero restarts; `/`, `/livez`, and `/readyz` returned HTTP 200;
and the external suite passed both tests in 26.9 seconds. Repair and verify the
Actions kubeconfig before relying on an automated production apply.

Record the library commit, app commit, package integrity, image tag/digest,
target architecture, workflow run URLs, and Kubernetes deployment revision in
the productionization ledger.

## Kubernetes verification

The deployment uses a database-backed `/readyz` startup/readiness probe and a
process-only `/livez` liveness probe. During a rollout:

```sh
kubectl rollout status deployment/slatebox-prod --timeout=10m
kubectl get pods -l app=slatebox-prod
kubectl get deployment slatebox-prod -o wide
```

Do not treat image push or `kubectl apply` alone as success. The rollout and
product smoke must both pass.

## Pre-promotion cluster baseline

Read-only verification on 2026-07-14 through the local `sb-k3s` context found:

- production at deployment revision 82, image
  `timheckel/slatebox-prod:1.2.6`, with 4/4 replicas ready;
- test at deployment revision 39, image `timheckel/slatebox-test:1.2.6`, with
  1/1 replica ready; and
- `/`, `/livez`, and `/readyz` returning HTTP 200 on both
  `app.slatebox.com` and `test.slatebox.com`.

This is the known-good pre-promotion baseline, not a permanent rollback target.
Re-read rollout history immediately before deployment so a newer release is
never rolled back accidentally.

## Rollback

If readiness, collaboration, persistence, or undo fails, stop promotion and
restore the last known-good deployment revision:

```sh
kubectl rollout history deployment/slatebox-prod
kubectl rollout undo deployment/slatebox-prod --to-revision=<known-good>
kubectl rollout status deployment/slatebox-prod --timeout=10m
```

Verify the restored pods and repeat a known-good slate reload. Preserve the
failed image digest and logs for diagnosis. Do not unpublish or overwrite an
npm version; fix forward with a new version. If persisted data compatibility is
in question, disable writes before rollback and inspect representative slate
documents rather than attempting an automatic data rewrite.
