#!/usr/bin/env node
// Hold the built entries to their size ceilings (build spec §2.3), and check the boards stay lazy:
// the eager entries must not import the boards entry or Dragology, and the boards entry must share
// Dragology's chunk instead of carrying its own copy; the agents' drawing stays out of the canvas entry. Run after every dist rebuild: npm run check:budget
import { readFileSync, readdirSync } from 'node:fs'
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
  // The agents' drawing: its own entry, loaded when the first agent arrives.
  'presence.mjs': { raw: 20000, gzip: 7000 },
  // A board's rulebook (behaviour.ts): loaded only for a board that has rules, and by a server.
  'workshop-behaviour.mjs': { raw: 20000, gzip: 6000 },
  // The plans (launch and hiring) and their time rules: loaded with the rules, or with a plan's kit. The
  // entry only re-exports; the code is the chunk the rules and the boards share (plans-<hash>.mjs).
  'workshop-plans.mjs': { raw: 4000, gzip: 1500 },
  'plans-*.mjs': { raw: 44000, gzip: 13000 },
  // The nested boards (piles, trees) and their rules: loaded with the rules, or with the boards. Measured at its first
  // build (37535 / 11322), plus a little.
  'workshop-nest.mjs': { raw: 38000, gzip: 11500 },
  // Impact × effort, the reorg sandbox and goals & owners, plugged into the nested boards (loaded with them). Measured at its
  // first build (23184 / 7422), plus a little.
  'workshop-nest-plus.mjs': { raw: 24000, gzip: 7700 },
  // The nested boards' kit: its own chunk, loaded with the boards only for a slate that holds a nested board. Measured at
  // its first build (20645 / 6661), plus a little.
  'boards-nest.mjs': { raw: 21500, gzip: 7000 },
  // The boards the library adds (catalogSamples): loaded only where a board is added. Measured at its first build
  // (9163 / 2802), plus a little.
  'workshop-samples.mjs': { raw: 9500, gzip: 3000 },
  // The library of what can be added (pure data): loaded when the library opens.
  'catalog.mjs': { raw: 16000, gzip: 5000 },
}

const dist = readdirSync(new URL('../dist/', import.meta.url))
/** A dist file by name, or by a pattern with one * for a shared chunk's hash. */
const resolveName = name => {
  if (!name.includes('*')) return name
  const [head, tail] = name.split('*')
  const found = dist.filter(file => file.startsWith(head) && file.endsWith(tail))
  if (found.length !== 1) throw new Error(name + ' matches ' + found.length + ' files')
  return found[0]
}
const read = name => readFileSync(new URL('../dist/' + resolveName(name), import.meta.url))
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

// Every built module of any size has a ceiling: a shared chunk can't carry code past the budget unseen.
const covered = new Set(Object.keys(ceilings).map(name => { try { return resolveName(name) } catch { return name } }))
for (const file of dist.filter(file => file.endsWith('.mjs') && !covered.has(file))) {
  const size = readFileSync(new URL('../dist/' + file, import.meta.url)).length
  if (size > 2000) problems.push(`${file} (${size} bytes) has no ceiling: give it a line here.`)
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
// The rulebook and the library stay out of the model a plain slate loads, and out of the business rules.
for (const eager of ['slateboxjs.mjs', 'workshop-model.mjs', 'workshop-rules.mjs', 'boards.mjs']) {
  if (importsOf(eager).some(target => /behaviour|catalog/.test(target))) problems.push(`${eager} imports the rulebook or the library: they load on their own.`)
}
if (importsOf('catalog.mjs').length) problems.push('catalog.mjs must stand alone: pure data, no model.')
if (!importsOf('workshop-rules.mjs').includes('./workshop-model.mjs')) problems.push('workshop-rules.mjs must plug into ./workshop-model.mjs, not carry its own model.')
const boards = importsOf('boards.mjs')
if (!boards.includes('./workshop-rules.mjs')) problems.push('boards.mjs must load the rules from ./workshop-rules.mjs, the code a server runs.')
if (!boards.includes('./dragology.mjs')) problems.push('boards.mjs must import ./dragology.mjs as a shared chunk.')
if (!boards.includes('./workshop-model.mjs')) problems.push('boards.mjs must take the rules from ./workshop-model.mjs, not carry a copy.')
if (/function dragSpecToBehavior|class DragSpecBuilder/.test(read('boards.mjs').toString('utf8'))) problems.push('boards.mjs carries its own copy of Dragology.')
// The nested boards' kit and the library's samples load only when they are used: nothing else imports them, and they carry no copy of what they plug into.
if (boards.some(target => /boards-nest|samples/.test(target))) problems.push('boards.mjs imports the nested boards\' kit or the samples: they load on their own.')
if (!importsOf('boards-nest.mjs').includes('./boards.mjs')) problems.push('boards-nest.mjs must plug into ./boards.mjs, not carry its own kits.')
if (importsOf('workshop-rules.mjs').some(target => /samples/.test(target))) problems.push('workshop-rules.mjs imports the samples: they load only where a board is added.')
if (!importsOf('workshop-samples.mjs').includes('./workshop-rules.mjs')) problems.push('workshop-samples.mjs must take the plans\' samples from ./workshop-rules.mjs, not carry a copy.')
// The agents' drawing stays out of the canvas entry, and the presence entry shares no chunk.
if (read('slateboxjs.mjs').toString('utf8').includes('data-agent-presence')) problems.push('slateboxjs.mjs carries the agents\' drawing: it belongs to the presence entry.')
if (importsOf('presence.mjs').some(target => target.startsWith('./'))) problems.push('presence.mjs must stand alone (no shared chunk).')

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
