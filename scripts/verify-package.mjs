import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDirectory, '..')
const sandbox = mkdtempSync(join(tmpdir(), 'slateboxjs-package-smoke-'))
const expectedPackage = JSON.parse(
  readFileSync(join(projectRoot, 'package.json'), 'utf8')
)

function run(command, args, cwd = projectRoot) {
  execFileSync(command, args, { cwd, stdio: 'inherit' })
}

try {
  run('npm', ['run', 'build'])

  const packJson = execFileSync(
    'npm',
    ['pack', '--json', '--pack-destination', sandbox],
    { cwd: projectRoot, encoding: 'utf8' }
  )
  const [{ filename, files }] = JSON.parse(packJson)
  const tarball = join(sandbox, filename)
  const paths = new Set(files.map(({ path }) => path))

  for (const required of [
    'LICENSE',
    'README.md',
    'dist/index.d.ts',
    'dist/slateboxjs.mjs',
    'dist/slateboxjs.js',
    'dist/slateboxjs.css',
    'dist/dragology.mjs',
    'dist/dragology.cjs',
    'dist/dragology/index.d.ts',
    'dist/dragology/immer.d.ts',
    'dist/workshops-LICENSE.txt',
    'licenses/Dragology-MIT.txt',
    'dragology/index.js',
  ]) {
    if (!paths.has(required)) {
      throw new Error(`Packed artifact is missing ${required}`)
    }
  }

  writeFileSync(
    join(sandbox, 'package.json'),
    JSON.stringify(
      {
        private: true,
        type: 'module',
        dependencies: { slateboxjs: `file:${tarball}` },
        devDependencies: { typescript: '^5.3.3', react: '^18.3.1', 'react-dom': '^18.3.1', '@types/react': '^18.3.0' },
      },
      null,
      2
    )
  )
  writeFileSync(
    join(sandbox, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          lib: ['ES2020', 'DOM'],
          strict: true,
          noEmit: true,
          skipLibCheck: false,
        },
        include: ['consumer.ts'],
      },
      null,
      2
    )
  )
  writeFileSync(
    join(sandbox, 'consumer.ts'),
    `import SlateboxJS, { Slatebox, utils, type SlateJSON } from 'slateboxjs'
import 'slateboxjs/style.css'
import { createElement } from 'react'
import { WorkshopBoard, type WorkshopBoardProps } from 'slateboxjs/workshops'
import { validateWorkshop, encodeWorkshopFragment } from 'slateboxjs/workshops/model'
import { DraggableRenderer, type Draggable, type DragSpecBuilder, produceAmb } from 'slateboxjs/dragology'
const fieldNotes = validateWorkshop({
  version: 1, title: 'Sound check', lanes: [{id:'notes', label:'Notes'}, {id:'check', label:'Rehearsal', capacity:2}],
  cards: [{id:'cue', label:'Try a headphone cue', laneId:'notes'}]
})
const boardProps: WorkshopBoardProps = {
  fitLanes: true, value: fieldNotes, onPreview: candidate => { void candidate?.cards },
  onChange: committed => { encodeWorkshopFragment(committed) },
}
void createElement(WorkshopBoard, boardProps)
const legal = produceAmb({ friday: false }, draft => { draft.friday = true })
const render: Draggable<{friday: boolean}> = () => createElement('g')
void [legal, render, DraggableRenderer]
type Builder = DragSpecBuilder<{friday: boolean}>


const factory: typeof SlateboxJS = SlateboxJS
const id: string = utils.guid()
const legacyNode = new Slatebox.node({ id, text: 'package smoke test' })
const saved: SlateJSON | undefined = undefined

void factory
void legacyNode
void saved
`
  )

  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], sandbox)
  run('npx', ['tsc', '--noEmit'], sandbox)
  run(
    'node',
    [
      '--input-type=module',
      '--eval',
      "const m = await import('slateboxjs'); if (typeof m.default !== 'function' || typeof m.Slatebox !== 'object') process.exit(1)",
    ],
    sandbox
  )
  run(
    'node',
    [
      '--eval',
      "const m = require('slateboxjs'); if (typeof m.default !== 'function' || typeof m.Slatebox !== 'object') process.exit(1)",
    ],
    sandbox
  )

  const upstream = await import('dragology')
  const expectedExports = Object.keys(upstream).sort()
  const parity = `const expected = ${JSON.stringify(expectedExports)}; if (JSON.stringify(Object.keys(api).sort()) !== JSON.stringify(expected)) throw Error('Dragology export mismatch'); if (api.runAmb(() => api.amb([1,2])).join() !== '1,2') throw Error('Dragology candidate enumeration failed')`
  run('node', ['--input-type=module', '--eval', "import * as api from 'slateboxjs/dragology';" + parity], sandbox)
  run('node', ['--eval', "const api = require('slateboxjs/dragology');" + parity], sandbox)
  const bundledLicense = readFileSync(join(sandbox, 'node_modules/slateboxjs/dist/workshops-LICENSE.txt'), 'utf8')
  const upstreamLicense = readFileSync(join(projectRoot, 'node_modules/dragology/LICENSE'), 'utf8')
  if (!bundledLicense.includes(upstreamLicense) ||
      readFileSync(join(sandbox, 'node_modules/slateboxjs/licenses/Dragology-MIT.txt'), 'utf8') !== upstreamLicense) {
    throw new Error('Dragology MIT attribution differs from the integrated release')
  }
  const installed = JSON.parse(
    readFileSync(join(sandbox, 'node_modules/slateboxjs/package.json'), 'utf8')
  )
  if (
    installed.name !== expectedPackage.name ||
    installed.version !== expectedPackage.version
  ) {
    throw new Error(
      `Installed unexpected package ${installed.name}@${installed.version}`
    )
  }

  console.log(
    `Verified ${installed.name}@${installed.version}: packed files, fresh install, ESM/CJS entry points, public CSS export, full Dragology export and license parity, and strict TypeScript consumer.`
  )
} finally {
  rmSync(sandbox, { recursive: true, force: true })
}
