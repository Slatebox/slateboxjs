// Plain Node, no DOM shim: the built slateboxjs/operations entry must load and
// run where a server runs it. Run after `npm run build` with `npm run test:node`.
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'

const require = createRequire(import.meta.url)
const plan = {
  message: 'Done.',
  operations: [
    { kind: 'add_nodes', count: 1, shape: 'rectangle', text: 'New', ids: ['x1'] },
    { kind: 'connect_nodes', from: { ids: ['a'] }, to: { ids: ['x1'] } },
  ],
}
const stored = {
  options: { name: 'Demo' },
  nodes: [{ options: { id: 'a', text: 'Alpha', xPos: 0, yPos: 0, width: 100, height: 60 }, relationships: { associations: [] } }],
}

test('there is no DOM in this process', () => {
  assert.equal(typeof globalThis.document, 'undefined')
  assert.equal(typeof globalThis.window, 'undefined')
  assert.equal(typeof globalThis.SVGElement, 'undefined')
})

for (const [format, load] of [
  ['ES module', () => import('../../dist/operations.mjs')],
  ['CommonJS', async () => require('../../dist/operations.cjs')],
]) {
  test(`the ${format} build applies, validates, describes and summarises`, async () => {
    const operations = await load()
    const result = operations.applyPlanToJSON(stored, plan)
    assert.deepEqual(result.report.created, ['x1'])
    assert.deepEqual(result.report.connected, ['a->x1'])
    assert.equal(operations.validatePlan(plan).valid, true)
    const description = operations.describeOperations()
    assert.ok(description.shapes.includes('rectangle'))
    assert.equal(operations.SLATE_OPERATION_TOOL.name, 'applySlateOperations')
    assert.equal(operations.summarizeSlate(result.slate).connections[0].id, 'a->x1')
    // The read pages with a cursor, which must encode and decode without the DOM or Buffer.
    const first = operations.readSlate(result.slate, { limit: 1 })
    const next = operations.readSlate(result.slate, { limit: 1, cursor: first.nextCursor })
    assert.notEqual(next.nodes[0].id, first.nodes[0].id)
    assert.equal(operations.toSlateDocument(result.slate).options.isPublic, undefined)
  })
}
