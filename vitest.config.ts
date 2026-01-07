import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.spec.ts', 'test/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        // Enforce high standards for Pure Logic
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      },
      include: ['src/shared/**'] // Only cover shared logic initially
    },
    setupFiles: ['test/setup.ts']
  },
  resolve: {
    alias: {
      '@flamework/core': '/home/espen/proj/ironguard-mercs/test/mocks/flamework.ts',
      '@flamework/components': '/home/espen/proj/ironguard-mercs/test/mocks/flamework.ts',
    }
  }
})
