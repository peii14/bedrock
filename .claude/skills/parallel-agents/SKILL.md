---
name: parallel-agents
description: Agentic workflow for this repo (explore, plan, implement, verify), when and how to run subagents or parallel sessions, git worktrees, writer and reviewer pattern, fan out for large changes. Use for multi file features, large refactors, audits, research across many files, or when asked to work in parallel or use agents.
---

# Parallel agents

Context is the scarce resource. Keep the main session for decisions and implementation; send reading heavy or independent work to subagents.

## Default loop
1. **Explore**: read only what the task touches. For wide searches, use the `Explore` subagent and ask for conclusions, not file dumps.
2. **Plan**: for changes over a few files or with unclear approach, write a short plan (files, interfaces, out of scope, how it will be verified). Skip planning if the diff fits in one sentence.
3. **Implement**: follow the `code-quality` and `design-system` skills.
4. **Verify**: run the checks from `feature-testing`; show evidence.
5. **Review**: before calling it done, have a fresh subagent review the diff (see agents below).

## When to use subagents
| Use a subagent | Stay in the main session |
| --- | --- |
| Reading many files to answer one question | Small targeted edits |
| Independent investigations that can run at once | Work that needs back and forth with the user |
| Verbose output (test logs, audits) you only need summarized | Phases that share a lot of context |
| A second opinion on finished work | When latency matters |

## Project agents (`.claude/agents/`)
- `code-reviewer`: reviews a diff for correctness and the code quality rules.
- `security-reviewer`: reviews a diff against the security skill.
- `test-runner`: runs checks and tests, returns only failures and their likely cause.

Run independent ones in the same turn, for example: "Use code-reviewer and security-reviewer in parallel on the current diff."

## Parallel implementation
- Split only along real seams: API module, web feature, shared package. Two agents must never edit the same file.
- Agree on the contract first (Zod schema in `packages/validators`), then build API and web in parallel against it.
- Give each agent: the goal, the files it owns, the files it must not touch, and the exact check that proves it is done.
- Use worktree isolation (`isolation: worktree` or `claude --worktree`) for agents that edit, so their changes stay separate until merged.
- For many similar edits, use `/batch` or a `claude -p` loop with `--allowedTools` scoped to what the task needs; try two or three files first, then run the rest.

## Writer and reviewer
- One session writes, a fresh one reviews only the diff and the plan. The reviewer reports gaps that affect correctness or the stated requirements; style preferences are optional.
- Same idea for tests: one agent writes failing tests from the spec, another makes them pass.

## Guardrails
- Each agent returns a summary under 200 words plus evidence, never whole files.
- Do not run agents in parallel when one needs the other's output; chain them instead.
- Two failed corrections on the same problem: stop, clear context, restart with a better prompt.

## Sources
- https://code.claude.com/docs/en/best-practices
- https://code.claude.com/docs/en/sub-agents
- https://code.claude.com/docs/en/skills
