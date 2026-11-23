// slateboxjs/canvas: the canvas alone (src/canvas.ts), built on its own so the other entries keep their chunks.
// One file a page can load first (dist/canvas.mjs, and canvas.cjs), plus the chunks it imports when a slate first
// needs them (the line tool). yjs and y-websocket stay the host's optional peers, as in the main entry.
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    dedupe: ['@svgdotjs/svg.js'],
    preserveSymlinks: false,
    alias: { '@svgdotjs/svg.js': resolve(__dirname, 'node_modules/@svgdotjs/svg.js') },
  },
  build: {
    emptyOutDir: false,
    copyPublicDir: false,
    cssCodeSplit: false,
    lib: {
      entry: { canvas: resolve(__dirname, 'src/canvas.ts') },
      formats: ['es', 'cjs'],
      fileName: (format, entry) => entry + (format === 'es' ? '.mjs' : '.cjs'),
    },
    rollupOptions: {
      external: ['yjs', 'y-websocket'],
      // One output per module system, so each names its chunks with its own extension. The canvas's chunks are
      // prefixed with its name, so they never collide with the other builds' chunks in dist/.
      output: [
        { format: 'es', entryFileNames: '[name].mjs', chunkFileNames: 'canvas-[name]-[hash].mjs', assetFileNames: 'canvas-[name][extname]' },
        { format: 'cjs', entryFileNames: '[name].cjs', chunkFileNames: 'canvas-[name]-[hash].cjs', assetFileNames: 'canvas-[name][extname]', exports: 'named' },
      ],
    },
    target: 'es2020',
  },
  define: { 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development') },
})
