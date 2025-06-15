import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SlateboxJS',
      fileName: (format) => `slateboxjs.${format === 'es' ? 'es.js' : 'js'}`
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      external: [],
      output: {
        globals: {}
      }
    },
    sourcemap: true,
    target: 'es2020'
  },
  server: {
    port: 3000,
    open: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
})