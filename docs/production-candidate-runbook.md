# Slatebox v3 production candidate runbook

This runbook coordinates the `slateboxjs@3.0.0` library and the canonical
Meteor 3.5 application. Publishing and deployment remain explicit release
decisions; the commands below do not authorize `npm publish`, a merge, or a
cluster mutation.

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
- `slateboxjs@3.0.0` in the final server bundle;
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
SLATEBOX_LIBRARY_VERSION=3.0.0 \
SLATEBOX_LIBRARY_INTEGRITY='sha512-O/1T67Q1fbFRnuB+ykNehgjKZ8tfIxe9jv+SelxtffvPt4hFC9+ktSuu/bOivzYYYM1G2D1yyTKfW+pOVvkcxw==' \
SLATEBOX_LIBRARY_REVISION=7655b0d1b6e723b57fa70bb29659a08bbc76ba67 \
SLATEBOX_PORT_PLATFORM=linux/amd64 \
SLATEBOX_PORT_IMAGE=slatebox-port:meteor-3.5-registry \
npm run test:port-container
```

Registry mode rejects a range, `file:` dependency, non-registry lock entry,
integrity mismatch, or abbreviated library revision. It then asserts the
released version inside the final server bundle and records the full library
commit in the image labels.

## Promotion order

1. Review and merge the library PR at its fully green SHA.
2. With explicit user approval, publish the immutable `slateboxjs@3.0.0`
   package and verify its registry version and integrity.
3. Replace the app's sibling tarball dependency with exact version `3.0.0`,
   regenerate its lock with npm 11 and `legacy-peer-deps=false`, and rerun the
   candidate gate in `registry` mode using the registry integrity returned by
   npm. A default packed-mode run is not release evidence at this stage.
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
