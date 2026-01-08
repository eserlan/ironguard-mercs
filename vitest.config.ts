import { defineConfig } from 'vitest/config'
import path from 'path';

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
      '@flamework/core': path.resolve(__dirname, './test/mocks/flamework.ts'),
      '@flamework/components': path.resolve(__dirname, './test/mocks/flamework.ts'),
      '@rbxts/services': path.resolve(__dirname, './test/mocks/roblox-services.ts'),
      'shared': path.resolve(__dirname, './src/shared'),
      'server': path.resolve(__dirname, './src/server'),
      'client': path.resolve(__dirname, './src/client'),
    }
  }
})
