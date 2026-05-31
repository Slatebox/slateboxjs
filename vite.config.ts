import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    // Deduplicate @svgdotjs/svg.js to ensure all plugins extend the same SVG instance
    dedupe: ['@svgdotjs/svg.js'],
    // Don't preserve symlinks so linked packages use the consumer's dependencies
    preserveSymlinks: false,
    alias: {
      // Force ALL imports of svg.js to use our instance (including from symlinked packages)
      '@svgdotjs/svg.js': resolve(__dirname, 'node_modules/@svgdotjs/svg.js')
    }
  },
  optimizeDeps: {
    // Include linked packages in optimization to resolve dependencies correctly
    include: ['@svgdotjs/svg.panzoom.js']
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SlateboxJS',
      fileName: (format) => `slateboxjs.${format === 'es' ? 'es.js' : 'js'}`
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      // yjs and y-websocket are optional peer dependencies for collaboration
      external: ['yjs', 'y-websocket'],
      output: {
        globals: {},
        // Copy CSS to dist folder
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'slateboxjs.css'
          }
          return assetInfo.name!
        }
      }
    },
    sourcemap: true,
    target: 'es2020',
    // Include CSS in the build
    cssCodeSplit: false
  },
  server: {
    port: 5173,
    open: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
})