import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const dist = resolve(scriptDirectory, '../dist')
const runtimeOnlyImport =
  /^import ['"](?:@svgdotjs\/(?:svg\.draggable\.js|svg\.panzoom\.js|svg\.select\.js(?:\/src\/svg\.select\.css)?|svg\.resize\.js)|\.\/vendor\/svg-connectable\/svg\.connectable\.js|\.\/styles\/slateboxjs\.css)['"];\r?\n/gm

function findDeclarationFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) return findDeclarationFiles(path)
    return path.endsWith('.d.ts') ? [path] : []
  })
}

const declarationFiles = findDeclarationFiles(dist)

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
