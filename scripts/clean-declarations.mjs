import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const dist = resolve(import.meta.dirname, '../dist')
const runtimeOnlyImport =
  /^import ['"](?:@svgdotjs\/(?:svg\.draggable\.js|svg\.panzoom\.js|svg\.select\.js(?:\/src\/svg\.select\.css)?|svg\.resize\.js)|\.\/vendor\/svg-connectable\/svg\.connectable\.js|\.\/styles\/slateboxjs\.css)['"];\r?\n/gm

const declarationFiles = readdirSync(dist, { recursive: true })
  .filter((file) => file.endsWith('.d.ts'))
  .map((file) => resolve(dist, file))

let removed = 0
for (const declarationPath of declarationFiles) {
  const declarations = readFileSync(declarationPath, 'utf8')
  const cleaned = declarations.replace(runtimeOnlyImport, () => {
    removed += 1
    return ''
  })
  if (cleaned !== declarations) {
    writeFileSync(declarationPath, cleaned)
  }
}

if (removed < 10) {
  throw new Error(
    `Expected at least 10 runtime-only imports in generated declarations; found ${removed}`
  )
}
