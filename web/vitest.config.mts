import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@payload-config': path.resolve(dirname, 'src/payload.config.ts'),
      '@': path.resolve(dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    // Payload validates its schema on first connect, which outlasts the 10s default.
    hookTimeout: 60_000,
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
  },
})
