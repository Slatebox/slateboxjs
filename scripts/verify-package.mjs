import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDirectory, '..')
const sandbox = mkdtempSync(join(tmpdir(), 'slateboxjs-package-smoke-'))

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
        devDependencies: { typescript: '^5.3.3' },
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

  const installed = JSON.parse(
    readFileSync(join(sandbox, 'node_modules/slateboxjs/package.json'), 'utf8')
  )
  if (installed.name !== 'slateboxjs' || installed.version !== '3.0.0') {
    throw new Error(
      `Installed unexpected package ${installed.name}@${installed.version}`
    )
  }

  console.log(
    `Verified ${installed.name}@${installed.version}: packed files, fresh install, ESM/CJS entry points, public CSS export, and strict TypeScript consumer.`
  )
} finally {
  rmSync(sandbox, { recursive: true, force: true })
}
