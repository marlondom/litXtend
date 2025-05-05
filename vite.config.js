import { defineConfig, loadEnv } from 'vite';

import mockServer from './mocks/mock-server';

import expressPlugin from './plugins/vite.express.plugin';

// eslint-disable-next-line no-undef
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
  env.APP_NAME = env.APP_NAME ?? 'store-test';

  return {
    base: mode === 'production' ? `/${env.APP_NAME}/` : './',
    plugins: [expressPlugin(mockServer)],
    optimizeDeps: {
      include: ['fast-deep-equal'],
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
      coverage: {
        reporter: ['text', 'html'],
      },
    },
    build: {
      target: 'es2020',
    },
    server: {
      port: 3000,
      open: false,
    },
    logLevel: 'info', // Define o nível de log (default: 'info')
  };
});
