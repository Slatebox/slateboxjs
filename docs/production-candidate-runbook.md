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
`SLATEBOX_PORT_IMAGE`, or `SLATEBOX_MONGO_IMAGE`. Use `--build-only` when a
runtime smoke is intentionally out of scope.

## Promotion order

1. Review and merge the library PR at its fully green SHA.
2. With explicit user approval, publish the immutable `slateboxjs@3.0.0`
   package and verify its registry version and integrity.
3. Replace the app's sibling tarball dependency with exact version `3.0.0`,
   regenerate its lock with npm 11 and `legacy-peer-deps=false`, and rerun the
   candidate gate.
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
