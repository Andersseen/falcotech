# FalcoTech

Website of [FalcoTech](https://www.falcotech.es): wildlife control, environmental consultancy and drone
technology. One page in three languages (Spanish at `/`, English at `/en`, Catalan at `/ca`), rendered on
the server and deployed to Cloudflare Workers.

[![CI](https://github.com/Andersseen/falcotech/actions/workflows/ci.yml/badge.svg)](https://github.com/Andersseen/falcotech/actions/workflows/ci.yml)

## Stack

| Area | Choice |
| --- | --- |
| Framework | [AnalogJS](https://analogjs.org) 2.9 and Angular 21: zoneless, signals, standalone components, server-side rendering on [Nitro](https://nitro.build) |
| UI | [Volt UI](https://voltui.dev) atoms, [Lumen Icons](https://github.com/Andersseen), [Angular Movement](https://github.com/Andersseen) for motion, Tailwind CSS 4 |
| Translations | [Etyma](https://github.com/Andersseen): typed catalogs, localized routes, `lang`, canonical and `hreflang` |
| Hosting | Cloudflare Workers, deployed from GitHub Actions |
| Mail | [Resend](https://resend.com), behind a validated and rate-limited endpoint |

## Getting started

Requirements: Node.js 22.18+ or 24, and pnpm 10 (`corepack enable` picks the pinned version).

```sh
pnpm install --frozen-lockfile
cp .env.example .env   # optional: needed only to send contact mail locally
pnpm dev               # http://localhost:5173
```

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development server with hot reload |
| `pnpm check` | Strict type check of the app (templates included) and of the build scripts |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm build` / `pnpm preview` | Production build for Node, served locally |
| `pnpm build:cloudflare` / `pnpm preview:cloudflare` | Production build for Workers, served by workerd on :8787 |
| `pnpm deploy:preview` | Upload a preview version to `local-falcotech.<subdomain>.workers.dev`; production is untouched |
| `pnpm deploy:prod` | Deploy production to Cloudflare |
| `pnpm images` | Regenerate the responsive image variants from `images/` |
| `pnpm map` | Regenerate the dotted map of Europe from Natural Earth data |
| `pnpm agents:check` | Verify the coding-agent configuration (see [AGENTS.md](AGENTS.md)) |

`pnpm deploy` is a built-in pnpm command, hence the `deploy:*` names. Deploying from your machine needs
`pnpm exec wrangler login` once, or `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the environment.

## Project layout

```text
src/
  app/
    pages/        file-based routes (index, 404)
    components/   page sections: header, hero, gallery, contact, map, footer background
    media/        responsive image loader for NgOptimizedImage
    seo/          page head (title, Open Graph, JSON-LD) and business facts
    theme/        light and dark preference
  i18n/locales/   all copy, one catalog per language
  server/         Nitro routes: /api/contact, robots.txt, sitemap.xml
  shared/         rules shared by client and server (contact limits, field names)
images/           original photos and illustrations (sources for pnpm images)
scripts/          build scripts in TypeScript, run directly by Node
```

## Configuration

Copy [`.env.example`](.env.example) to `.env` for local development. In production the server variables are
Worker secrets (`pnpm exec wrangler secret put <NAME>`), shared by production and previews.

| Variable | Where | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | server | Sends contact messages. Without it the endpoint answers 503. |
| `CONTACT_FROM`, `CONTACT_TO` | server, optional | Sender (its domain must be verified in Resend) and recipients |
| `VITE_TURNSTILE_SITE_KEY` | build, optional | Public key of the Cloudflare Turnstile widget |
| `TURNSTILE_SECRET`, `TURNSTILE_HOSTNAMES` | server, optional | Turnstile verification; with all three unset the form works without the challenge |

## Contact form

The form posts to `POST /api/contact`, which validates the fields with the same rules as the client
(`src/shared/contact.ts`) and sends the message through Resend.

- Requests from another origin are rejected (403), bodies over 16 KB too (413), and each IP may send
  5 messages every 15 minutes (429). The limit lives in each instance's memory, so on serverless it is
  a best effort.
- A honeypot field (`website`) catches naive bots: they get a success response and nothing is sent.
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) is optional (see Configuration).
- Without JavaScript the form still works: the server redirects back with `?contact=sent|error|limited`.
- Every response carries security headers (`nosniff`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `Cross-Origin-Opener-Policy`).
- The server never logs message bodies or email addresses.

## Deployment

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) verifies every change (type check, tests, Workers
build, agent configuration) and then deploys:

- **Pull requests** get a preview version at `https://pr-<number>-falcotech.<subdomain>.workers.dev`,
  linked in a comment on the pull request. Production traffic is not touched. The first run creates the
  Worker if it does not exist yet.
- **Pushes to `main`** (or a manual *Run workflow*) deploy production.

The workflow needs two repository secrets: `CLOUDFLARE_API_TOKEN` (permissions *Workers Scripts: Edit*
and *Account Settings: Read*) and `CLOUDFLARE_ACCOUNT_ID`. Pull requests from forks are verified but not
deployed, since they get no secrets.

Worker settings are in [`wrangler.jsonc`](wrangler.jsonc); Nitro merges them into
`dist/analog/server/wrangler.json`, which is the file that gets deployed.

The live site at www.falcotech.es is still served by the previous deployment until the domain moves to
Cloudflare (a custom domain on the Worker, then the DNS records and the old project's domain).

## SEO

- Etyma sets `<html lang>`, the canonical URL and the `hreflang` alternates of every page.
- `src/app/seo/page-seo.ts` renders the title, description, Open Graph and Twitter cards, `robots` and the
  `Organization` structured data on the server. The 404 page is `noindex`.
- Canonical URLs, alternates, Open Graph URLs, structured data and the sitemap always name
  `https://www.falcotech.es` (`SITE.origin`), whichever host renders the page.
- Only `www.falcotech.es` is indexable. Every other host (previews, `workers.dev`, localhost) answers with
  `X-Robots-Tag: noindex` and a `robots.txt` that disallows everything, so Lighthouse reports a lower SEO
  score there by design.

## Images

Originals live in [`images/`](images). `pnpm images` turns each one into WebP variants from 160 to 2560 px
(never wider than the original) in `src/assets/img/`, with a `manifest.json` of their sizes. Templates
render them with `NgOptimizedImage` and a custom loader (`src/app/media/images.ts`): every image gets
`srcset` and `sizes`, loads lazily, and the hero image is preloaded from the server-rendered head.

To add or replace a photo, drop the best original you have into `images/` and run `pnpm images`.

## Coding agents

Conventions for Codex, Claude Code and other agents are in [AGENTS.md](AGENTS.md) (`CLAUDE.md` imports it).
Skills and MCP servers are managed by [Agentyx](https://github.com/Andersseen/agentyx), pinned in
`.agentyx.json`; Volt UI adds its own skills and its [MCP server](https://voltui.dev/docs/ai-mcp).

## Contributing and security

See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow and [SECURITY.md](SECURITY.md) to report a
vulnerability.
