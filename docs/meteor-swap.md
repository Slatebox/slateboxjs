# SlateboxJS v3 in the canonical Meteor app

The canonical product app is `~/Projects/node/app.slatebox.com` on the
`meteor-3.5-changestreams` branch. The older `~/Projects/node/slatebox`
checkout is historical reference material, not a second migration target.
Draft app PR [Slatebox/slatebox-app#33](https://github.com/Slatebox/slatebox-app/pull/33)
contains the committed Meteor 3.5 integration.

The app keeps the existing public import:

```js
import { Slatebox } from 'slateboxjs'
import 'slateboxjs/dist/slateboxjs.css'
```

The v2-compatible facade preserves the host contract, while SlateboxJS v3 is
the only diagramming engine behind it.

## Pre-publication development loop

Before `slateboxjs@3.0.0` is published, run the paired candidate from the app
checkout with the sibling library at `../slateboxjs-v2`:

```sh
cd ~/Projects/node/app.slatebox.com
npm run test:port-container
```

This default `packed` mode builds the library, packs it, writes a disposable
self-contained app lock, builds the Meteor production image, starts a clean
Mongo replica set, and runs the real-host collaboration and persistence
invariants. It never changes the tracked app dependency or lock.

For a manual Meteor development reinstall, clear the same-version bundler
cache after repacking:

```sh
cd ~/Projects/node/slateboxjs-v2
npm run build
npm pack

cd ~/Projects/node/app.slatebox.com/web/app
meteor npm install ../../../slateboxjs-v2/slateboxjs-3.0.0.tgz
rm -rf .meteor/local/bundler-cache
```

Do not commit that file dependency as the final release state.

## Published-package verification

After explicit publication approval, replace the app dependency with exact
version `3.0.0`, regenerate `web/app/package-lock.json` with npm 11 and
`legacy-peer-deps=false`, then run the gate in `registry` mode:

```sh
cd ~/Projects/node/app.slatebox.com
SLATEBOX_LIBRARY_SOURCE=registry \
SLATEBOX_LIBRARY_VERSION=3.0.0 \
SLATEBOX_LIBRARY_INTEGRITY='sha512-O/1T67Q1fbFRnuB+ykNehgjKZ8tfIxe9jv+SelxtffvPt4hFC9+ktSuu/bOivzYYYM1G2D1yyTKfW+pOVvkcxw==' \
SLATEBOX_LIBRARY_REVISION=7655b0d1b6e723b57fa70bb29659a08bbc76ba67 \
SLATEBOX_PORT_PLATFORM=linux/amd64 \
SLATEBOX_PORT_IMAGE=slatebox-port:meteor-3.5-registry \
npm run test:port-container
```

Registry mode does not pack or substitute the sibling checkout. It requires:

- an exact app dependency rather than a range or `file:` reference;
- the expected `https://registry.npmjs.org/` lock resolution;
- the exact npm SHA-512 integrity; and
- the full library product commit for the candidate image label.

The build also asserts the installed package version inside the final Meteor
server bundle. A passing registry-mode run is therefore the proof that the app
actually consumes the immutable release.

## Collaboration verification

The collaboration surface matrix runs against both the standalone relay and
the real Meteor host:

```sh
cd ~/Projects/node/slateboxjs-v2
npx playwright test tests/e2e/collab-surfaces.spec.ts --project=chromium
npx playwright test tests/e2e/app-collab-surfaces.spec.ts --project=chromium
```

The current matrix covers 16 surfaces: presence, add, move, text, color,
resize, rotate, z-order in both directions, relationship add/remove, follow
zoom, shape, border, effect, and delete. `app-port-invariants.spec.ts` adds
Mongo-backed text, grouping/locking, themes, primitive paths, undo, and redo.

## Product smoke

Before production promotion, the test deployment must prove all of the
following on one persisted slate:

1. add, edit, move, connect, group, reload, undo, and redo;
2. the same mutations in a second browser with presence and collaboration;
3. the same document after a fresh authenticated session;
4. readiness and liveness endpoints; and
5. image and presentation paths used by the canonical app.

Use `docs/production-candidate-runbook.md` for the test-first deployment,
evidence record, and Kubernetes rollback procedure. Do not publish, merge,
push an image, or mutate the cluster without the corresponding release
authorization.
