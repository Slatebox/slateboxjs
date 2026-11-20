#!/usr/bin/env node
// Hold the built entries to their size ceilings (build spec §2.3), and check the boards stay lazy:
// the eager entries must not import the boards entry or Dragology, and the boards entry must share
// Dragology's chunk instead of carrying its own copy. Run after every dist rebuild: npm run check:budget
import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

const ceilings = {
  'slateboxjs.mjs': { raw: 692000, gzip: 187000 },
  'workshop-model.mjs': { raw: 140000, gzip: 39000 },
  'boards.mjs': { raw: 70000, gzip: 20000 },
  'dragology.mjs': { raw: 206000, gzip: 61000 },
  // Measured at release/combined 5d21cac, plus what they may grow.
  'workshops.mjs': { raw: 84089 + 2000, gzip: 24120 + 1000 },
  'operations.mjs': { raw: 80276 + 2000, gzip: 22791 + 1000 },
}

const read = name => readFileSync(new URL('../dist/' + name, import.meta.url))
const problems = []
const rows = []
for (const [name, limit] of Object.entries(ceilings)) {
  let file
  try { file = read(name) } catch { problems.push(`${name} is missing: run npm run build first.`); continue }
  const size = { raw: file.length, gzip: gzipSync(file, { level: 9 }).length }
  rows.push({ entry: name, raw: size.raw, 'raw ceiling': limit.raw, gzip: size.gzip, 'gzip ceiling': limit.gzip })
  for (const kind of ['raw', 'gzip']) {
    if (size[kind] > limit[kind]) problems.push(`${name} is ${size[kind]} bytes ${kind}, over its ceiling of ${limit[kind]} by ${size[kind] - limit[kind]}.`)
  }
}

const importsOf = name => [...read(name).toString('utf8').matchAll(/\bfrom\s*["']([^"']+)["']|\bimport\s*\(\s*["']([^"']+)["']\s*\)/g)].map(match => match[1] ?? match[2])
for (const eager of ['slateboxjs.mjs', 'workshop-model.mjs', 'operations.mjs']) {
  for (const target of importsOf(eager)) {
    if (/boards|dragology/.test(target)) problems.push(`${eager} imports ${target}: the boards and Dragology must load only for a slate that holds a business board.`)
  }
}
const boards = importsOf('boards.mjs')
if (!boards.includes('./dragology.mjs')) problems.push('boards.mjs must import ./dragology.mjs as a shared chunk.')
if (!boards.includes('./workshop-model.mjs')) problems.push('boards.mjs must take the rules from ./workshop-model.mjs, not carry a copy.')
if (/function dragSpecToBehavior|class DragSpecBuilder/.test(read('boards.mjs').toString('utf8'))) problems.push('boards.mjs carries its own copy of Dragology.')

console.table(rows)
if (problems.length) {
  for (const problem of problems) console.error('✗ ' + problem)
  process.exit(1)
}
console.log('✓ Every entry is within its ceiling, and the boards load only on demand.')
