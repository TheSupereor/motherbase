# ADR-0004: Activate Dependabot

- Status: accepted
- Date: 2026-11-13

## Context

The project pins its GitHub Actions to full commit SHAs and has 12 outdated dependencies (check with `pnpm outdated -r`), with TypeScript 7 being ignored until new release with an API because of [Nest build](https://GitHub.com/nestjs/nest-cli/issues/3477). Dependabot commits, by default, [tries to detect user preferences](https://docs.GitHub.com/en/code-security/reference/supply-chain-security/dependabot-options-reference), and can be formatted with commit-message options, dependabot message needs to be conform with commitlint (test with `echo 'bump python from 3.13.1 to 3.13.2' | pnpm exec commitlint` and then `echo $?`).

## Decision

- Dependabot: The bot will verify dependencies for updates and patch, making pull requests that are validated against the same CI, formatting and linting as any developer.
- Commits: Commits regarding project dependencies and building will use the `build` prefix and updates regarding GitHub actions will use `ci` prefix, following Angular recommendations.
- Update Types: Updates will be grouped by type. [SemVer](https://semver.org/) promises that `minor` and `patch` updates are compatible with previous versions, because of that they are grouped together to unify small updates and have little impact on code. SemVer also clarifies that Major updates may make incompatible changes on the API, because of that they are separated in a different group, to both minimize the quantity of open PRs and maximize the major updates applied to the project simultaneously, facilitating a manual test.
- Ecosystems: divided into npm and GitHub actions, to better manage update packages inside pnpm and to verify new action updates separately to keep them updated.
- Cooldown: Standard times are used, 3 days are enough for updates and immediate for security updates.
- Ignores: TypeScript 7 is ignored, since this version does not expose an API that is used by NestJS CLI and typescript-eslint.
- Scheduling: Weekly, on Mondays at 04:00, start of the week so the team can have time to test the update, and to group multiple updates through the week.
- Limits: The default limit is used to build updates and to ci/github actions.
- Strict: Turned off because Dependabot only rebases PRs on merge conflicts, not when a branch simply falls behind main. With strict mode enabled, merging one PR would block the others, and manually clicking "Update branch" adds a non-Dependabot commit that makes it stop managing the PR.

## Considered options

1. Renovate: Dependabot deploy is easier, runs on GitHub itself and not a third party app, includes cooldown and commit messages customization, Renovate has minimumReleaseAge but its default value was not verified. Renovate can manage node versions, but updating a node version can break dependencies and need to be done decisively and well tested. Renovate pnpm 12 support and its commit message were not verified.
2. Manually update: checking every version from dependencies and their safety would demand time, which is a limited resource in a one person team.

## Consequences

- Positive: Runs on GitHub and does not need third party apps or permissions.
- Positive: Is easily customizable.
- Positive: The ci.yml runs on push to main, if a combination breaks, CI will fail on main after merge.
- Negative: Since strict is turned off, each PR is tested only against main of the day it was open.
- Negative: Node version needs to be updated manually, since Dependabot will not update it automatically.
- Negative: pnpm writes two YAML documents as pnpm-lock.yaml, the dependency graph does not detect dependencies on this file. This allows the Dependabot updates to work, but alerts and security updates from it will not be created to these dependencies.
- Negative: Grouped major releases may break with one breaking major update, holding other major updates within the PR.

## When to revisit

- When a new TypeScript version is released with a new API, then the ignore can be deleted and both typescript-eslint and motherbase can be updated.
