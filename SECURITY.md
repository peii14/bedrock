# Security policy

Report suspected vulnerabilities privately to the owner. Do not open a public issue, and do not test against systems you do not own.

Include what is affected, how to reproduce it, and the impact you expect. You will get an acknowledgement, and a fix or a decision, as soon as the issue is confirmed.

## What runs on every change

| Stage | Check |
| --- | --- |
| Commit (local) | Biome, file length limit, secretlint and gitleaks on staged files, Conventional Commit message |
| Push (local) | Type check, unit tests, `bun audit` |
| Pull request (CI) | Commit messages, lint, types, tests, build, secret scan, Semgrep SAST, dependency audit (bun + OSV), Trivy config and filesystem scan, container image scan |
| Weekly (CI) | The full security workflow again, to catch newly published vulnerabilities |
