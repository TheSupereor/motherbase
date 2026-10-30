# ADR-0002: Use Vitest's built-in transform for NestJS tests (no unplugin-swc)

- Status: accepted
- Date: 2026-10-26

## Context
NestJS resolves dependencies from decorator metadata (`design:paramtypes`), so whatever transforms our tests must emit it. Until Vite 7 esbuild was used, which did not emit metadata, so the use of unplugin-swc was needed, which generates metadata so we could better test the environment. Vitest 5 uses Vite 8, which uses Oxc, a transformer that supports legacy decorators and emitDecoratorMetadata, reading the closest tsconfig.json experimentalDecorators and emitDecoratorMetadata, among other configurations, and sending to Oxc.

## Decision
- We will not use unplugin-swc and instead use Vitest 5 with Vite 8, since it has built-in support for metadata use and does not add a new dependency.

## Considered options
1. unplugin-swc (the NestJS docs recipe): Same compiler as production, but adds a new dependency to monitor, configure and maintain.
2. Vite's built-in Oxc transform: Built-in and fewer dependencies, but may diverge from production.

## Consequences
- Positive: Vite 8 produces the same metadata as swc in cases we measured, not needing a new tool that could bring new problems. 
- Negative: Vite 8, like SWC, only has partial metadata support, interfaces and aliases turn into Object. 
- Negative: Cache ignores tsconfig, it needs to be cleaned if an alteration is made in the tsconfig file with the command "vitest --clearCache".
- Negative: Different compiler, thus may produce different transformations and metadata.

## When to revisit
- A library or module needs information on types to generate metadata, try to use classes instead of type aliases or interfaces, or find a compatible library. 
- If a test fails but the app starts with "Nest can't resolve dependencies of the <Provider> (?)", try using [unplugin-swc](https://github.com/unplugin/unplugin-swc) library on Vite configuration file in a vitest.config.ts file in each project, since root plugins are not inherited by the projects. 
- When we bump Vitest or Vite to a new major version, test and run with start before accepting the update.