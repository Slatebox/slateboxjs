// Build separate package entries so non-React canvas consumers never load Dragology.
import { defineConfig } from 'vite'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'

const resolve = createRequire(import.meta.url).resolve
const dragologyEntry = resolve('dragology')
const dragologyTypes = join(dirname(dragologyEntry), 'index.d.ts')
const immerTypes = join(dirname(createRequire(dragologyEntry).resolve('immer/package.json')), 'dist/immer.d.ts')
export default defineConfig({
  plugins: [{
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
      entry: { dragology: dragologyEntry, workshops: 'src/workshops/index.tsx', 'workshop-model': 'src/workshops/model.ts' },
      formats: ['es', 'cjs'],
      fileName: (format, entry) => entry + (format === 'es' ? '.mjs' : '.cjs'),
    },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
    target: 'es2020',
    copyPublicDir: false,
  },
})
