# Agents & Automation

This document lists the automated "agents" and developer tooling used in this repository and gives guidance for adding or changing agents.

## Purpose

Provide a single source of truth describing what automation runs against this repo, how to operate it locally, and how to add new agents safely.

## Active agents / tools

- **lefthook** (pre-commit hooks) ✅
  - Runs Prettier and ESLint on staged files before commits.
  - Config: `.lefthook.yml`; install via `pnpm dlx lefthook install` or `pnpm install` (uses `postinstall` script).
- **shadcn CLI** (component scaffolding) ✅
  - Used to add UI components (`pnpm dlx shadcn@latest init` and `pnpm dlx shadcn@latest add <component>`).
  - Generated files live under `components/` and `components.json`.
- **pnpm** (package manager) ✅
  - `pnpm` is used for installs and running CLI tools (preferred by the project).
- **Next.js dev server** ✅
  - Local development via `pnpm dev`.

## Suggested / Planned agents

- **GitHub Actions CI** (recommended)
  - Should run: `pnpm install --frozen-lockfile`, `pnpm format:check`, `pnpm exec eslint . --ext .ts,.tsx`, and `pnpm build`.
  - Place workflow in `.github/workflows/ci.yml` and ensure it uses `pnpm` and Node matching project requirements.
- **Dependabot / Renovate** (recommended)
  - Automate dependency updates; configure via `.github/dependabot.yml` or Renovate config.

## Guidelines for adding new agents

1. Document the agent in this file (purpose, config path, run steps).
2. Prefer configs under `.github/` or clearly named top-level files.
3. Do not commit secrets or tokens. Use GitHub Secrets for credentials.
4. Add a small CI job to validate the agent (lint/build/tests) before granting it write privileges.
5. Create a PR describing the agent, its permissions, and what repository events it will act on.

## Security & permissions

- Use least-privilege service accounts or tokens.
- Store secrets in GitHub Secrets and avoid embedding them in repo configs.
- Review any agent that runs on `push`/`workflow_dispatch` that has write access.

## Contact

Primary contact: repository owner (`soruban`). For changes to automation, open a PR and request review from a maintainer.

---

If you want, I can add a recommended GitHub Actions `ci.yml` and a Dependabot config next — tell me if you'd like me to add those now.
