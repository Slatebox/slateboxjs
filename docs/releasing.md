# Releasing SlateboxJS

SlateboxJS is versioned on its own, with [Semantic Versioning](https://semver.org/). It is not
tied to the Slatebox app's version.

| What | Where |
| --- | --- |
| Package | [`slateboxjs` on npm](https://www.npmjs.com/package/slateboxjs) |
| Tags | `vX.Y.Z` in this repository, at the commit the npm tarball was built from |
| Notes | [CHANGELOG.md](../CHANGELOG.md), one section per version, and a GitHub Release per tag |

## Between releases

- Every change lands on `main` with a [Conventional Commits](https://www.conventionalcommits.org/)
  message and, when it changes behavior or API, a line under `## [Unreleased]` in the changelog.
- `dist/` is committed. A source change is followed by a `build: rebuild dist on <sha>` commit, so
  `main` always holds a build that matches its source (`npm run build` reproduces it apart from
  the stamp in `dist/BUILD.json`).
- The Slatebox app builds against this repository's `main` during development. Builds made that
  way are stamped `<package version>+local.<commit>` in `dist/BUILD.json`; they are not releases.

## Cutting a release

1. Pick the version from the `[Unreleased]` notes: a removed or changed API is a major, new API a
   minor, fixes only a patch.
2. Move the `[Unreleased]` notes under `## [X.Y.Z] — YYYY-MM-DD`, set `version` in
   `package.json`, and commit it as `chore(release): slateboxjs X.Y.Z`.
3. Run the gates: `npx tsc --noEmit`, `npm test`, `npm run test:node`, `npm run build`,
   `npm run verify:package`, `npm run check:budget` and `npm run test:e2e`.
4. Tag the commit `vX.Y.Z` and create a GitHub Release from its changelog section.
5. A maintainer runs `npm publish` from that commit (npm publishing needs the maintainer's
   one-time password), then checks that the registry tarball's `dist/` matches the tagged
   commit byte for byte.

Security fixes go into the newest release. See [SECURITY.md](../SECURITY.md).
