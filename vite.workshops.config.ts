// Build separate package entries so non-React canvas consumers never load Dragology,
// and a server can load the DOM-free canvas operations (slateboxjs/operations) alone.
import { defineConfig } from 'vite'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'

const resolve = createRequire(import.meta.url).resolve
const dragologyEntry = resolve('dragology')
const dragologyTypes = join(dirname(dragologyEntry), 'index.d.ts')
const immerTypes = join(dirname(createRequire(dragologyEntry).resolve('immer/package.json')), 'dist/immer.d.ts')
const modelEntry = 'slateboxjs-workshop-model-entry'
export default defineConfig({
  plugins: [{
    // Both the host and workshop view use the same package instance of the SVG engine.
    name: 'workshop-native-engine',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source === '../index' && importer?.endsWith('/NativeMapSurface.tsx')) return {id:'slateboxjs',external:true}
    },
  }, {
    // slateboxjs/workshops re-exports the model (src/workshops/index.tsx: export * from './model'). It takes it from the
    // model's own entry, the file beside it in dist/, as one export * line: the same module the boards and the rules
    // plug into, without listing (and importing) each of the model's names by its public name.
    name: 'workshops-reexport-model-entry',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source === './model' && importer?.endsWith('/src/workshops/index.tsx')) return { id: modelEntry, external: true }
    },
    renderChunk(code, _chunk, options) {
      if (!code.includes(modelEntry)) return null
      return { code: code.split(modelEntry).join('./workshop-model.' + (options.format === 'es' ? 'mjs' : 'cjs')), map: null }
    },
  }, {
    name: 'workshop-dependency-notices',
    generateBundle(_options, bundle) {
      // Ship the release's complete JSX augmentation and public types. Its only
      // non-React type dependency is Immer's self-contained declaration file.
      const types = readFileSync(dragologyTypes, 'utf8')
      const draftImport = "from 'immer'"
      if (!types.includes(draftImport)) throw new Error('Check Dragology declaration dependencies')
      this.emitFile({ type: 'asset', fileName: 'dragology/index.d.ts', source: types.replace(draftImport, "from './immer'") })
      this.emitFile({ type: 'asset', fileName: 'dragology/immer.d.ts', source: readFileSync(immerTypes, 'utf8') })
      const packages = new Set<string>()
      for (const output of Object.values(bundle)) {
        if (output.type !== 'chunk') continue
        for (const moduleId of Object.keys(output.modules)) {
          const directory = moduleId.match(/^(.*\/node_modules\/(?:@[^/]+\/)?[^/]+)\//)?.[1]
          if (directory) packages.add(directory)
        }
      }
      const notices = [...packages].sort().map(directory => {
        const { name, version } = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8'))
        const license = readdirSync(directory).find(file => /^(?:LICENSE|LICENCE|COPYING)(?:\..*)?$/i.test(file))
        if (!license) throw new Error('Missing bundled dependency license for ' + name)
        return name + ' ' + version + '\n' + readFileSync(join(directory, license), 'utf8')
      })
      this.emitFile({ type: 'asset', fileName: 'workshops-LICENSE.txt', source: notices.join('\n') })
    },
  }],
  build: {
    emptyOutDir: false,
    lib: {
      // workshop-rules: the launch plan's, pipeline's and budget's rules for a server (the browser takes them with the kits).
      // boards: the business boards' kits (layout, board layer, Dragology specs), loaded only for a slate that holds one.
      // boards-nest: the nested boards' kit, loaded with boards only for a slate that holds a nested board.
      // shapes: custom shapes as data (validate, normalise, text box), DOM-free for a server.
      // presence: the agents' pointers and tags, loaded only when an agent arrives.
      // suggestions: what agents suggest (ghost notes, a frame, a tag and Keep all / Discard all per answer), loaded when the
      // first suggestion arrives; it imports ./presence.mjs for what the two have in common, and carries no copy of it.
      // catalog: the library of what can be added to a slate (pure data), loaded when the library opens.
      // workshop-plans: the launch and hiring plans with their time rules (loaded with the rules, or a plan's kit).
      // workshop-nest: the nested boards (piles, trees) and their rules (loaded with the rules, or the nest kit).
      // workshop-nest-plus: impact × effort, the reorg sandbox and goals & owners, plugged into the nested boards (loaded with them).
      // workshop-samples: the boards the library adds (catalogSamples), loaded only where a board is added.
      // workshop-behaviour: a board's rulebook, loaded only for a board that has rules (and by a server).
      entry: { dragology: dragologyEntry, workshops: 'src/workshops/index.tsx', 'workshop-model': 'src/workshops/model.ts', 'workshop-rules': 'src/workshops/rules.ts', 'workshop-plans': 'src/workshops/plans.ts', 'workshop-nest': 'src/workshops/nest.ts', 'workshop-nest-plus': 'src/workshops/nestPlus.ts', 'workshop-samples': 'src/workshops/samples.ts', catalog: 'src/workshops/catalog.ts', 'workshop-behaviour': 'src/workshops/behaviour.ts', 'workshop-mount': 'src/workshops/mount.ts', operations: 'src/operations/index.ts', shapes: 'src/shapes/index.ts', boards: 'src/boards/index.ts', 'boards-nest': 'src/boards/nest.ts', 'boards-still': 'src/boards/still.ts', 'workshop-controls': 'src/workshops/controls.ts', presence: 'src/core/AgentPresence.ts', suggestions: 'src/core/AgentSuggestions.ts' },
      formats: ['es', 'cjs'],
      fileName: (format, entry) => entry + (format === 'es' ? '.mjs' : '.cjs'),
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
      // Code two entries share stays in the entry it belongs to (the model in workshop-model.mjs, the plans in
      // workshop-plans.mjs), which then exports a little more, instead of moving to an anonymous chunk: the rules, the
      // boards and the rulebook plug into ./workshop-model.mjs, the one model a page loads (check:budget holds this).
      preserveEntrySignatures: 'allow-extension',
    },
    target: 'es2020',
    copyPublicDir: false,
  },
})
