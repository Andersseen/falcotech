import { defineConfig } from 'vitest/config';

// Unit tests cover plain TypeScript (server logic, shared rules). They do not load the Analog plugin.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
