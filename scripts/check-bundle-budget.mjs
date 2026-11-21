#!/usr/bin/env node
// Hold the built entries to their size ceilings (build spec §2.3), and check the boards stay lazy:
// the eager entries must not import the boards entry or Dragology, and the boards entry must share
// Dragology's chunk instead of carrying its own copy. Run after every dist rebuild: npm run check:budget
import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

const ceilings = {
  'slateboxjs.mjs': { raw: 692000, gzip: 187000 },
  'workshop-model.mjs': { raw: 140000, gzip: 39000 },
  // The launch plan's, pipeline's and budget's rules: loaded with the kits, or by a server.
  'workshop-rules.mjs': { raw: 30000, gzip: 9000 },
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
// The business rules load with their kits, never with the model a plain slate loads.
if (importsOf('workshop-model.mjs').some(target => /rules/.test(target))) problems.push('workshop-model.mjs imports the business rules: they load with the kits (slateboxjs/boards) or slateboxjs/workshops/rules.')
if (/function scheduleLaunch|function validatePipeline|function validateBudget|function readNoteNumbers/.test(read('workshop-model.mjs').toString('utf8'))) problems.push('workshop-model.mjs carries a business board\'s rules.')
if (!importsOf('workshop-rules.mjs').includes('./workshop-model.mjs')) problems.push('workshop-rules.mjs must plug into ./workshop-model.mjs, not carry its own model.')
const boards = importsOf('boards.mjs')
if (!boards.includes('./workshop-rules.mjs')) problems.push('boards.mjs must load the rules from ./workshop-rules.mjs, the code a server runs.')
if (!boards.includes('./dragology.mjs')) problems.push('boards.mjs must import ./dragology.mjs as a shared chunk.')
if (!boards.includes('./workshop-model.mjs')) problems.push('boards.mjs must take the rules from ./workshop-model.mjs, not carry a copy.')
if (/function dragSpecToBehavior|class DragSpecBuilder/.test(read('boards.mjs').toString('utf8'))) problems.push('boards.mjs carries its own copy of Dragology.')

// What a plain slate pays over release/combined 5d21cac (canvas + model, gzip -9): at most +10.2 KB (build spec §2.3).
const plain = ['slateboxjs.mjs', 'workshop-model.mjs'].reduce((sum, name) => sum + (rows.find(row => row.entry === name)?.gzip ?? 0), 0)
const plainBefore = 182795 + 32956
if (plain - plainBefore > 10200) problems.push(`A plain slate loads ${plain - plainBefore} bytes gzip more than at 5d21cac, over the 10,200 allowed.`)

console.table(rows)
console.log(`A plain slate (canvas + model): ${plain} bytes gzip, ${plain - plainBefore >= 0 ? '+' : ''}${plain - plainBefore} over 5d21cac (at most +10200).`)
if (problems.length) {
  for (const problem of problems) console.error('✗ ' + problem)
  process.exit(1)
}
console.log('✓ Every entry is within its ceiling, and the boards load only on demand.')
