# ADR-0001: Run internal TypeScript packages with Node's type stripping

- Status: accepted
- Date: 2026-10-23

## Context
Internal packages like `@motherbase/codec` export TypeScript source directly (`exports` points to `./src/index.ts`).
The NestJS app compiles only its own `src/` with SWC, so at runtime `node dist/main.js` imports the codec's `.ts` files. We want no build step for internal packages and no build-order coupling between them.

## Decision
Internal packages are loaded in by Node's built-in type stripping (stable since Node 24.12/25.2; the project runs on Node 26). They must use erasable syntax only (`erasableSyntaxOnly`, `verbatimModuleSyntax` in each such package) and real `.ts` relative imports (allowed workspace-wide by `rewriteRelativeImportExtensions`).

## Considered options
1. Compile each package to `dist/`: works everywhere, but adds a build step, build ordering and watch processes for every package.
2. Node type stripping: zero build for internal packages; restricts them to erasable syntax, which fits a codec made of pure functions.
3. Bundle the app (Rspack/esbuild): one artifact, but adds a bundler config to maintain and hides module boundaries during debugging.

## Consequences
- Positive: changing the codec is visible to every app immediately, with no rebuild.
- Negative: no enums, namespaces with values, parameter properties or decorators in internal packages; Node refuses to strip files under `node_modules`, so it only works while packages are reached through pnpm's workspace symlinks.

## When to revisit
- The production image copies internal packages into `node_modules` (Phase 1 Dockerfile).
- An internal package needs non-erasable syntax, or is published to npm.