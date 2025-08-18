import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  server: {
    hmr: true,
  },
  plugins: [
    vue(),
    vueDevTools(),
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable code splitting and manual chunking
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate Vuetify into its own chunk
          vuetify: ['vuetify'],
          // Separate Vue ecosystem into its own chunk
          vue: ['vue', 'vue-router', 'pinia'],
          // Create a chunk for game logic
          game: [
            './src/game/entity.ts',
            './src/game/character.ts',
            './src/game/ship.ts',
            './src/game/mission.ts',
            './src/game/department.ts',
            './src/game/rank.ts',
            './src/game/species.ts',
            './src/game/role.ts',
          ],
          // Create a chunk for error handling utilities
          errors: [
            './src/errors/MissionBrieflyError.ts',
            './src/errors/validation.ts',
            './src/errors/errorLogger.ts',
          ],
        },
      },
    },
  },
})
