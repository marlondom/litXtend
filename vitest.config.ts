// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    testTimeout: 10000,
    coverage: {
      reporter: ['text', 'html']
    },
    poolOptions: {
      threads: {
        singleThread: true
      }
    }
  }
});
