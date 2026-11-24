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
  // The agents' drawing: its own entry, loaded when the first agent or suggestion arrives. Measured with
  // the live suggestions (ghosts, Keep and Discard) at 32254 / 11004, plus what it may grow.
  'presence.mjs': { raw: 34000, gzip: 11500 },
  // A board's rulebook (behaviour.ts): loaded only for a board that has rules, and by a server.
  'workshop-behaviour.mjs': { raw: 20000, gzip: 6000 },
  // The plans (launch and hiring) and their time rules: loaded with the rules, or with a plan's kit. The code
  // lives in the entry itself, which the rules and the boards import (vite.workshops.config.ts keeps shared code in
  // its entry); it was a chunk of its own (plans-<hash>.mjs) with these ceilings, which carry over unchanged.
  'workshop-plans.mjs': { raw: 44000, gzip: 13000 },
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
  // slateboxjs/canvas: the canvas alone, what a page that only draws slates loads first (its own build,
  // vite.canvas.config.ts): a small entry and the chunk it shares with its parts. Measured at its first build that
  // draws lines (627,893 / 170,861 for the chunk, with the SVG plugins registered), plus a little.
  'canvas.mjs': { raw: 1000, gzip: 500 },
  'canvas-canvas-*.mjs': { raw: 640000, gzip: 174000 },
  // Its parts that wait for a person or a request: the line tool, and the bird's-eye view.
  'canvas-LineTool-*.mjs': { raw: 7000, gzip: 2600 },
  'canvas-BirdsEye-*.mjs': { raw: 19000, gzip: 5200 },
  // Its parts a slate fetches as it starts (the undo history with its slate diff, the keyboard) and those it fetches only
  // when it can be edited (the right-click menu, the video-address paste): a read-only page's first paint waits on none.
  // Moved out of the canvas chunk with first-class undo; measured at their first build (19,695 / 5,731; 15,222 / 4,794;
  // 7,262 / 2,349; 4,846 / 1,847), plus a little.
  'canvas-UndoRedo-*.mjs': { raw: 20500, gzip: 6000 },
  'canvas-Keyboard-*.mjs': { raw: 16000, gzip: 5000 },
  'canvas-ContextMenu-*.mjs': { raw: 7600, gzip: 2500 },
  'canvas-MediaInput-*.mjs': { raw: 5200, gzip: 2000 },
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

// slateboxjs/canvas as a page serves it first: the entry and every chunk it imports up front, each with its
// whitespace taken out and gzip -9, summed (the site's build, slatebox-home scripts/build-engine.sh, and its
// first-load ceiling of 138,000 bytes). None of them carries the parts it loads on first use, the v1 facade or the
// whole-slate operations, or yjs (the host's peer, loaded when a slate goes live).
{
  const { createRequire } = await import('node:module')
  const esbuild = createRequire(import.meta.url)('esbuild')
  const staticImports = text => [...text.matchAll(/(?:^|[;\n])\s*(?:import|export)\s[^;]*?from\s*["']([^"']+)["']|(?:^|[;\n])\s*import\s*["']([^"']+)["']/g)].map(match => match[1] ?? match[2])
  const first = [], seen = new Set(), queue = ['canvas.mjs']
  while (queue.length) {
    const name = queue.shift()
    if (seen.has(name)) continue
    seen.add(name)
    first.push(name)
    for (const target of staticImports(read(name).toString('utf8'))) {
      if (!target.startsWith('./')) { if (!/^(yjs|y-websocket)$/.test(target)) problems.push(`canvas.mjs loads ${target} up front (from ${name}).`); continue }
      const file = target.slice(2)
      if (!file.startsWith('canvas-')) problems.push(`${name} imports ${file}: the canvas loads only its own chunks.`)
      queue.push(file)
    }
  }
  const texts = first.map(name => read(name).toString('utf8'))
  const firstLoad = texts.reduce((sum, text) => sum + gzipSync(esbuild.transformSync(text, { minifyWhitespace: true, format: 'esm', target: 'es2020', legalComments: 'none' }).code, { level: 9 }).length, 0)
  rows.push({ entry: 'slateboxjs/canvas first load (' + first.length + ' files, as a page serves them)', raw: '', 'raw ceiling': '', gzip: firstLoad, 'gzip ceiling': 138000 })
  if (firstLoad > 138000) problems.push(`slateboxjs/canvas's first load (${first.join(', ')}), served without whitespace, is ${firstLoad} bytes gzip, over the 138,000 a page's first load allows.`)
  const all = texts.join('\n')
  const later = [...all.matchAll(/import\(\s*["']([^"']+)["']\s*\)/g)].map(match => match[1])
  for (const part of ['LineTool', 'BirdsEye', 'UndoRedo', 'Keyboard', 'ContextMenu', 'MediaInput']) if (!later.some(target => target.includes('canvas-' + part + '-'))) problems.push(`slateboxjs/canvas does not load its ${part} chunk on first use.`)
  if (/LINE_TOOL: press failed|BIRDSEYE_DEBUG/.test(all)) problems.push('slateboxjs/canvas carries the line tool or the bird\'s-eye view in its first load: they load on first use.')
  if (!/connectable\s*\(/.test(all)) problems.push('slateboxjs/canvas does not register the SVG plugins a slate draws with (no connectable plugin): its lines would not draw.')
  if (/SLATEBOX_COMPAT|invalid_operation_plan/.test(all)) problems.push('slateboxjs/canvas carries the v1 facade or the whole-slate operations: they belong to the main entry.')
  if (/^\s*import[^;]*from\s*["'](yjs|y-websocket)["']/m.test(all)) problems.push('slateboxjs/canvas imports yjs up front: it loads only when a slate goes live.')
}

// What a plain slate loads: the canvas and the model, each with every chunk it imports up front (gzip -9 of each
// file, summed). Counted over the imports, so a chunk the model hands its code to (as model-<hash>.mjs did on
// engine main 67c29e0) is counted with it.
const staticImportsOf = name => [...read(name).toString('utf8').matchAll(/(?:^|[;\n])\s*(?:import|export)\s[^;]*?from\s*["'](\.\/[^"']+)["']|(?:^|[;\n])\s*import\s*["'](\.\/[^"']+)["']/g)].map(match => (match[1] ?? match[2]).slice(2))
const closureOf = (...entries) => {
  const seen = new Set(), queue = [...entries]
  while (queue.length) { const name = queue.shift(); if (seen.has(name)) continue; seen.add(name); queue.push(...staticImportsOf(name)) }
  return [...seen]
}
const plainFiles = closureOf('slateboxjs.mjs', 'workshop-model.mjs')
const plain = plainFiles.reduce((sum, name) => sum + gzipSync(read(name), { level: 9 }).length, 0)
// The plans (launch and hiring, their time rules), the business rules and the nested boards load on their own: a
// plain slate fetches none of them, and the model carries none of their code.
for (const name of plainFiles) if (/^(workshop-plans|plans-|workshop-rules|workshop-nest|boards|dragology)/.test(name)) problems.push(`A plain slate loads ${name}: the plans, the rules and the boards load only for a slate that holds a board.`)
const plainText = plainFiles.map(name => read(name).toString('utf8')).join('\n')
for (const marker of ['The plan now starts ', 'There is no role band ', 'Overlapping tasks in ', 'That takes runway to ']) {
  if (plainText.includes(marker)) problems.push(`A plain slate carries the plans' code ("${marker.trim()}"): it belongs to workshop-plans.mjs, loaded on its own.`)
}
// Never more than on engine main, measured this way: release/2026-11-23b 1e5d702, built from its source (slateboxjs.mjs
// 207,691 + workshop-model.mjs, model-<hash>.mjs and NoteDefaults 62,337; 540ff27: 269,966; 67c29e0: 262,344). The canvas
// entry must not make the app's plain slate bigger.
const plainOnMain = 270028
if (plain > plainOnMain) problems.push(`A plain slate (${plainFiles.join(', ')}) loads ${plain} bytes gzip, ${plain - plainOnMain} more than on engine main 1e5d702 (${plainOnMain}).`)
// And what it pays over release/combined 5d21cac (canvas + model, gzip -9): at most +10.2 KB (build spec §2.3).
const plainBefore = 182795 + 32956
if (plain - plainBefore > 10200) problems.push(`A plain slate loads ${plain - plainBefore} bytes gzip more than at 5d21cac, over the 10,200 allowed.`)

console.table(rows)
console.log(`A plain slate (${plainFiles.length} files: canvas + model, with what they import): ${plain} bytes gzip, ${plain - plainOnMain >= 0 ? '+' : ''}${plain - plainOnMain} against engine main 1e5d702 (at most ${plainOnMain}), ${plain - plainBefore >= 0 ? '+' : ''}${plain - plainBefore} over 5d21cac (at most +10200).`)
if (problems.length) {
  for (const problem of problems) console.error('✗ ' + problem)
  process.exit(1)
}
console.log('✓ Every entry is within its ceiling, and the boards load only on demand.')
