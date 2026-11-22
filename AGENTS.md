# FalcoTech

Corporate site for FalcoTech (wildlife control, environmental consulting, drones). AnalogJS 2.9 + Angular 21,
zoneless, SSR on Nitro. Deployed to Cloudflare Workers by GitHub Actions (previews per PR, production
from `main`); the live www.falcotech.es is still on Vercel until the switch. One page in three locales: `/` (es, source), `/en`, `/ca`.

## Commands

- `pnpm dev`: dev server on http://localhost:5173
- `pnpm check`: strict Angular type check (templates included) and type check of `scripts/`
- `pnpm test`: vitest unit tests (`src/**/*.test.ts`, plain TypeScript only)
- `pnpm build && pnpm preview`: production SSR build served locally
- `pnpm build:cloudflare && pnpm preview:cloudflare`: the Workers build, served by workerd on :8787
- `pnpm images`: regenerate the responsive WebP variants in `src/assets/img/` from `images/`
- `pnpm map`: regenerate the dotted Europe map (`src/app/components/europe-map.data.ts`) from Natural Earth
- `pnpm deploy:preview` / `pnpm deploy:prod`: build for Workers and deploy from this machine (wrangler login or API token)
- `pnpm agents:check`: verify the Agentyx-managed skills

Run `pnpm check`, `pnpm test` and `pnpm build` before committing.

## Layout

- `src/app/pages/`: file-based routes (`index.page.*`, `[...not-found].page.ts`)
- `src/app/components/`: page sections (header, hero, portfolio, contact form, Turnstile)
- `src/app/seo/`: per-page head (`injectPageMeta`) and business facts (`site.ts`)
- `src/app/theme/`: light/dark preference; keep it in sync with the inline script in `index.html`
- `src/i18n/locales/*.json`: all copy. Never hard-code user-facing text; add the key to all three locales
- `src/shared/`: rules shared by client and server (contact limits, field names)
- `src/server/`: Nitro routes (`/api/contact`, `robots.txt`, `sitemap.xml`) and their logic
- `SITE.origin` (`src/app/seo/site.ts`) is the only public address: canonical, hreflang, Open Graph and
  the sitemap always use it, never the request host

## Conventions

- Everything in the repository is in English except the site copy in `src/i18n/locales/`.
- Build scripts are TypeScript in `scripts/`, run directly by Node (type stripping): only erasable syntax,
  `import type` for types, explicit `.ts` extensions on relative imports.

- UI atoms come from Volt UI (`@voltui/components`, package mode: `Volt*` classes, `volt-*` selectors).
  Check the `volt-ui` MCP server before writing any button, card, input, alert, overlay or tooltip by hand.
  Links and icon buttons use the native `voltButton` directive; icon-only buttons get a `VoltTooltip`.
  Site navigation is `VoltNavigationMenu` (header and mobile drawer); picking one photo among several
  is a `VoltToggleGroup` with `photo-option` items (see `src/styles/globals.css`); labels are `VoltBadge`.
  Volt puts consumer classes last, so overrides go in `class`; when a part (toggle-group item) keeps
  its classes on the host, shape the inner element with a `[&>button]` variant or a global class.
- Known Volt issue: `volt-accordion-content` needs `class="grid"`, or closed panels never collapse.
- Raster images: drop the best original into `images/`, run `pnpm images`, and render it with
  `NgOptimizedImage` (`[ngSrc]="image.name" [ngSrcset]="image.srcset"` from `siteImage()` in
  `src/app/media/images.ts`, plus `sizes`; `fill` when cropped, `priority` only for the LCP image).
  Never import a photo from `src/assets` directly.
- Icons come only from Lumen, imported one per file: `import { LmnXIcon } from 'lumen-icons/x'`.
- Motion comes from Angular Movement: `moveInView`/`moveStagger` for reveals, `*movePresence(For)` for
  exits, `moveWhileTap`/`moveWhileHover` for gestures, `MoveAnimator` for imperative sequences. Use CSS
  only for what is visible at first paint, hover/focus states and layout interpolation.
- Translations go through Etyma: `injectI18n(i18n)` / `injectT(i18n)`, keys are type-checked, params use
  MessageFormat 2 (`{$name}`). Build in-page links with `i18n.path('/')`.
- Signals, `OnPush`, standalone components, `@if`/`@for` control flow.
- Server code validates every input and fails closed; never log message bodies or email addresses.

## Environment

See `.env.example`. `RESEND_API_KEY` sends mail; `CONTACT_FROM`/`CONTACT_TO` are optional; Turnstile is
enabled only when `VITE_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET` and `TURNSTILE_HOSTNAMES` are set.
