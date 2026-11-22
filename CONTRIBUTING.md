# Contributing

This repository holds the FalcoTech website. Issues and pull requests are welcome, especially bug
reports, accessibility problems and translation fixes.

## Workflow

1. Branch from `main`.
2. Make the change, following [AGENTS.md](AGENTS.md): Volt UI atoms for interface elements, Lumen for icons,
   Angular Movement for motion, and every user-facing string in all three catalogs under
   `src/i18n/locales/`.
3. Run the checks the CI runs:

   ```sh
   pnpm check
   pnpm test
   pnpm build
   ```

4. Open a pull request against `main`. The CI verifies it and, for branches of this repository, deploys a
   preview whose link appears on the pull request.

## Commits

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org): `feat:`, `fix:`,
`perf:`, `refactor:`, `docs:`, `ci:`, `chore:`, with an optional scope such as `feat(gallery):`. The body
explains why, not what.

## Translations

Spanish (`es.json`) is the source catalog and defines the keys; English and Catalan must have the same keys.
Messages use [MessageFormat 2](https://messageformat.unicode.org) parameters such as `{$name}`.
