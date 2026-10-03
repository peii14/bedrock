"""Turns scanner JSON (semgrep, trivy, osv) into GitHub annotations and fails when anything was found.

Annotations are readable through the checks API, so findings can be reviewed without downloading logs.
"""

import json
import sys

MAX_ANNOTATIONS = 10
SEVERITY_ORDER = {"CRITICAL": 0, "HIGH": 1, "ERROR": 1, "MEDIUM": 2, "WARNING": 2, "LOW": 3, "INFO": 4}


def semgrep(data):
    for r in data.get("results", []):
        yield (r["extra"].get("severity", "ERROR"), r["path"], r["start"]["line"],
               r["check_id"].split(".")[-1], r["extra"]["message"])


def trivy(data):
    for res in data.get("Results") or []:
        target = res.get("Target", "image")
        for v in res.get("Vulnerabilities") or []:
            fix = v.get("FixedVersion") or "no fix yet"
            yield (v.get("Severity", "HIGH"), target, 1,
                   f'{v["VulnerabilityID"]} in {v["PkgName"]} {v.get("InstalledVersion", "")}',
                   f'{v.get("Title", "")} (fixed in {fix})')
        for m in res.get("Misconfigurations") or []:
            yield (m.get("Severity", "HIGH"), target, 1, f'{m.get("ID")} {m.get("Title", "")}',
                   m.get("Message", ""))
        for s in res.get("Secrets") or []:
            yield (s.get("Severity", "HIGH"), target, s.get("StartLine", 1), f'Secret: {s.get("RuleID")}',
                   s.get("Title", ""))


def osv(data):
    for r in data.get("results", []):
        source = r.get("source", {}).get("path", "lockfile").split("/src/")[-1]
        for p in r.get("packages", []):
            pkg = p.get("package", {})
            for v in p.get("vulnerabilities", []):
                yield ("HIGH", source, 1, f'{v["id"]} in {pkg.get("name")} {pkg.get("version", "")}',
                       v.get("summary", ""))


def escape(text):
    return str(text).replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A")


def main():
    kind, path = sys.argv[1], sys.argv[2]
    with open(path, encoding="utf-8") as handle:
        data = json.load(handle)
    findings = sorted({*{"semgrep": semgrep, "trivy": trivy, "osv": osv}[kind](data)},
                      key=lambda f: (SEVERITY_ORDER.get(str(f[0]).upper(), 5), f[1], f[3]))
    for severity, file, line, title, message in findings[:MAX_ANNOTATIONS]:
        print(f"::error file={escape(file)},line={line},title={escape(f'{severity} {title}')}::{escape(message)}")
    if len(findings) > MAX_ANNOTATIONS:
        print(f"::error title={kind}::{len(findings) - MAX_ANNOTATIONS} more findings, see the job log")
    for severity, file, line, title, message in findings:
        print(f"{severity}\t{file}:{line}\t{title}\t{message}")
    print(f"{kind}: {len(findings)} finding(s)")
    sys.exit(1 if findings else 0)


if __name__ == "__main__":
    main()
