import analog from '@analogjs/platform';
import { defineConfig, loadEnv } from 'vite';

// A Content-Security-Policy is left out on purpose: hydration event replay injects an inline script,
// so a useful policy needs per-request nonces first.
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    // Nitro's dev server reads server secrets from process.env, which Vite does not fill from .env.
    const serverEnv = loadEnv(mode, process.cwd(), ['RESEND_', 'CONTACT_', 'TURNSTILE_']);
    for (const [name, value] of Object.entries(serverEnv)) process.env[name] ??= value;
  }

  return {
    build: { target: 'es2022' },
    plugins: [
      analog({
        ssr: true,
        // Etyma uses the request origin for canonical URLs and language alternates.
        prerender: { routes: [] },
        nitro: {
          // Read only by the Cloudflare preset (BUILD_PRESET=cloudflare_module): write a deployable
          // wrangler.json next to the server bundle, merged from wrangler.jsonc.
          cloudflare: { deployConfig: true, nodeCompat: true },
          routeRules: {
            '/**': { headers: securityHeaders },
            '/es': { redirect: { to: '/', statusCode: 308 } },
          },
        },
      }),
    ],
  };
});
