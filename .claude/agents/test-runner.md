---
name: test-runner
description: Runs lint, typecheck and tests, and returns only failures with their likely cause. Use to verify a change without filling the main context with logs.
tools: Read, Grep, Glob, Bash
skills: feature-testing
---

Run in order and stop at the first failing step:
1. `bun run check`
2. `bun run typecheck`
3. `bun run test` (start Postgres and Valkey with `docker compose -f docker/compose.dev.yml up -d --wait` and run `bun run db:migrate` first if needed)

Return: which step failed, the exact failing test or error lines (trimmed), and the most likely cause with the file to look at. If everything passes, return one line with the pass counts.
