import analog from '@analogjs/platform';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    const apiKey = loadEnv(mode, process.cwd(), 'RESEND_')['RESEND_API_KEY'];
    if (apiKey) process.env['RESEND_API_KEY'] ??= apiKey;
  }

  return {
    build: { target: 'es2022' },
    plugins: [
      analog({
        ssr: true,
        // Etyma uses the request origin for canonical URLs and language alternates.
        prerender: { routes: [] },
        nitro: {
          routeRules: { '/es': { redirect: { to: '/', statusCode: 308 } } },
        },
      }),
    ],
  };
});
