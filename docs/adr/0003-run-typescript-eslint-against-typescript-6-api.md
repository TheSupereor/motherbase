# ADR-0003: Run typescript-eslint against the TypeScript 6 API next to TypeScript 7

- Status: accepted
- Date: 2026-11-02

## Context

typescript-eslint uses the TypeScript compiler's API, but the TypeScript 7 compiler was rewritten in Go and does not have an API, so typescript-eslint does not work with TypeScript 7, showing the versions ">=4.8.4 <6.1.0" as peer dependencies (result of `pnpm view typescript-eslint peerDependencies`). Linting needs types to check code types and check for common errors, such as a promise without an await.

## Decision

- We will use the `@typescript/typescript6` package, published by the TypeScript team, which re-exports the TypeScript 6 API and provides a `tsc6` executable, working alongside TypeScript 7 using aliases, since both packages would have the same name. This works because "TypeScript 7.0 is made to be compatible with TypeScript 6.0's type-checking and command-line behavior", according to the [TypeScript team](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/).

## Considered options

1. TypeScript 6 alongside TypeScript 7: It's the TypeScript team's recommendation, it's compatible with version 7.0 (lint, typechecking, tests and build pass all green on current repository with little effort to install), but may break in future updates of 7.x.
2. Oxlint: Oxlint is a linter written in Rust which uses tsgolint (engine) built on top of typescript-go, which is the TypeScript 7 compiler. Oxlint does not have full coverage (59/61 rules) but it's [12x - 18x faster to lint](https://www.infoq.com/news/2026/09/tsgolint-oxlint-typescript/) and independent from TypeScript 6 and still being refined according to InfoQ.
3. No type linting: typescript-eslint calls "ts.createSourceFile" from the API to make a lint without types, which is not exported by TypeScript 7.0.2 (which only exports `[ 'version', 'versionMajorMinor']`), but it's exported by version 6.x, bringing no benefits since version 6 would still be necessary and the drawback of possible errors caused by the lack of linting.
4. Entire repo in TS 6: TypeScript 7 uses a new compiler written in Go, with faster builds and checking, ["typically yield speedups between 8x and 12x on full builds"](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0).
5. Wait for 7.1 API: TypeScript 7.0 came with no API, and the TypeScript team said ["While TypeScript 7.0 is here, it does not ship with an API. We expect TypeScript 7.1 to ship with a new (and different) API"](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/), there is no date for a new API + a new typescript-eslint version.

## Consequences

- Positive: Both binaries can coexist and have type-checking and command-line behavior compatibility.
- Positive: Has full rules coverage compared to Oxlint (59/61).
- Positive: Linting with types, still using TypeScript 7 on the project.
- Negative: May break or become obsolete in future TypeScript 7 versions.
- Negative: It's 12x - 18x slower than Oxlint, according to Oxlint team.
- Negative: A warning when using `pnpm install`: `Replaced "typescript" ("^7.0.2") with "typescript@npm:@typescript/typescript6@^6.0.2" from a different source`.
- Negative: 2 TypeScripts versions in the package.json file, both with aliases, `typescript` using version 6.0 and `@typescript/native` using version 7.0 with the tsc.

## When to revisit

- When typescript-eslint uses a new version of TypeScript (check with `pnpm view typescript-eslint peerDependencies` -> the interval of accepted versions shows TypeScript 7) use the new version of typescript-eslint. The `@typescript/typescript6` should be uninstalled and the default name `typescript -> typescript@7` should be used erasing the aliases `typescript -> @typescript/typescript6` and `@typescript/native -> typescript@7`. No new version is added to the repository.
- If a new version of TypeScript changes type verifications in comparison to version 6 (e.g., linting throws "unnecessary ?." but tsc says the value can be undefined) and no version of typescript-eslint accepts TypeScript 7, Oxlint can be used, since it uses typescript-go, the TypeScript 7 compiler.
- If the linting time (CI environment) grows larger than 20 seconds (current local test time: 4.6 seconds), Oxlint can be used to replace typescript-eslint (specific rule coverage for the project's use case must be tested), since it's 12x-18x faster (measured by Oxlint team).
