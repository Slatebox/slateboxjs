// The dist's identity stamp: the source commit it was built from, whether the tree had changes
// that commit does not hold, and when. Written last by `npm run build`, so every dist names its
// source (slateboxjs/build.json); the app logs it at startup and the site's manifest copies it.
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
let commit = null, branch = null, dirty = null
try {
  commit = git('rev-parse', 'HEAD')
  branch = git('rev-parse', '--abbrev-ref', 'HEAD')
  // dist/ itself is what is being written; only changes to everything else count.
  dirty = git('status', '--porcelain', '--', '.', ':(exclude)dist').length > 0
} catch { /* Not a git checkout (a packed tarball): the stamp says so with nulls. */ }
const { version } = JSON.parse(execFileSync('node', ['-p', 'JSON.stringify(require("./package.json"))'], { cwd: root, encoding: 'utf8' }))
const stamp = { name: 'slateboxjs', version, commit, branch, dirty, builtAt: new Date().toISOString() }
writeFileSync(resolve(root, 'dist/BUILD.json'), JSON.stringify(stamp, null, 2) + '\n')
console.log(`dist/BUILD.json: ${version} ${commit?.slice(0, 7) ?? 'no commit'}${dirty ? ' (with uncommitted changes)' : ''}`)
