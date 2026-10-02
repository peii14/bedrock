import type { UserConfig } from "@commitlint/types";

/** Conventional Commits, scoped to the parts of this repo. Example: `feat(api): add invoices module`. */
const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-max-length": [2, "always", 100],
    "subject-case": [2, "never", ["start-case", "pascal-case", "upper-case"]],
    "body-max-line-length": [1, "always", 100],
    "scope-enum": [
      2,
      "always",
      [
        "api",
        "web",
        "auth",
        "config",
        "db",
        "validators",
        "tsconfig",
        "docker",
        "nginx",
        "ci",
        "deps",
        "repo",
        "release",
      ],
    ],
  },
};

export default config;
