#!/usr/bin/env python3
"""
check_skills.py — Quality and security scanner for skill files in skills/

Checks every skill .md file for:
  Security:
    - Prompt injection patterns (known attack strings)
    - Unauthorized MCP tool calls (outside approved list)
    - Exfiltration patterns (external URLs, curl/fetch in prompt body)
    - Hidden instructions (whitespace-encoded, base64, etc.)

  Quality:
    - Required frontmatter fields present and non-empty
    - Prompt template has at least one [PLACEHOLDER]
    - Has a concrete example section
    - Description is specific (not a generic sentence)
    - Compatible_with has at least one valid platform
    - Tags are present

Usage:
  python3 scripts/check_skills.py                  # scan all skills/
  python3 scripts/check_skills.py skills/hardware/find-testing-lab.md
  python3 scripts/check_skills.py --security-only  # skip quality checks
  python3 scripts/check_skills.py --quality-only   # skip security checks

Exit codes:
  0 — all pass
  1 — quality issues found (warnings)
  2 — security issues found (errors, block PR)
"""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

# ── Constants ─────────────────────────────────────────────────────────────────

SKILLS_ROOT = Path(__file__).parent.parent / "skills"

APPROVED_MCP_TOOLS = {
    "search_resources",
    "get_resource",
    "list_resource_types",
    "list_cities",
    "get_grants",
}

VALID_PLATFORMS = {"claude-code", "codex", "mcp-only", "cursor", "gemini", "copilot"}

VALID_SECURITY_STATUSES = {"unverified", "community", "verified", "audited"}

# Prompt injection: patterns that suggest an attacker is trying to override instructions
INJECTION_PATTERNS: list[tuple[str, str]] = [
    (r"ignore (?:previous|all|prior|above) instructions?", "classic override attempt"),
    (r"disregard (?:the|your|all|previous)", "instruction cancellation"),
    (r"forget (?:everything|all|what)", "context erasure"),
    (r"(?:new|updated|revised) (?:instructions?|prompt|system)", "instruction replacement"),
    (r"you are now", "persona override"),
    (r"act as (?:a|an|if)", "persona injection"),
    (r"<\|(?:im_start|im_end|system|user|assistant)\|>", "ChatML injection"),
    (r"\[INST\]|\[/INST\]|\[SYS\]", "Llama instruction injection"),
    (r"###\s*(?:Instruction|System|Human|Assistant):", "instruction header injection"),
    (r"(?:sudo|admin|root|system):\s", "authority impersonation"),
    (r"OVERRIDE|JAILBREAK|DAN mode", "explicit jailbreak"),
    (r"base64\s*decode|atob\(|fromCharCode", "encoded payload"),
    (r"eval\(|exec\(|__import__", "code execution attempt"),
]

# Exfiltration: patterns that suggest data is being sent somewhere outside approved tools
EXFILTRATION_PATTERNS: list[tuple[str, str]] = [
    # Allow github.com, hardstack domains, and common documentation URLs
    (r"https?://(?!hardstack\.sh|api\.hardstack\.sh|github\.com|githubusercontent\.com|shields\.io)[a-z0-9][-a-z0-9\.]*\.[a-z]{2,}/\S*", "external URL in prompt template"),
    (r"\bcurl\b\s+https?://(?!hardstack\.sh|api\.hardstack\.sh|github\.com)", "curl to external URL"),
    (r"callback_url|notify_url|ping_url", "webhook callback URL"),
    (r"send (?:results?|data|credentials?|tokens?) (?:to|at) https?://", "explicit data exfiltration instruction"),
    (r"POST (?:the )?(?:results?|data|output) (?:to|at) https?://", "POST data to external URL"),
    (r"\bsmtp\b|\bmail\.send\b|\bsendmail\b", "email exfiltration"),
]

# ── Data structures ────────────────────────────────────────────────────────────

@dataclass
class Issue:
    file: Path
    level: str  # "ERROR" | "WARNING" | "INFO"
    category: str  # "SECURITY" | "QUALITY" | "FORMAT"
    message: str
    line: int = 0

    def __str__(self) -> str:
        loc = f":{self.line}" if self.line else ""
        return f"  [{self.level}] {self.category} — {self.message}{loc}"


@dataclass
class SkillReport:
    path: Path
    issues: list[Issue] = field(default_factory=list)

    @property
    def has_security_issues(self) -> bool:
        return any(i.level == "ERROR" and i.category == "SECURITY" for i in self.issues)

    @property
    def has_quality_issues(self) -> bool:
        return any(i.level == "WARNING" for i in self.issues)

    @property
    def score(self) -> int:
        """Quality score 0-100"""
        deductions = sum(
            20 if i.level == "ERROR" else 10 if i.level == "WARNING" else 2
            for i in self.issues
        )
        return max(0, 100 - deductions)


# ── Frontmatter parser ────────────────────────────────────────────────────────

def parse_frontmatter(content: str) -> tuple[dict[str, object], str]:
    """Extract YAML-ish frontmatter and return (meta, body)."""
    if not content.startswith("---"):
        return {}, content
    end = content.find("\n---", 3)
    if end == -1:
        return {}, content
    fm_text = content[3:end].strip()
    body = content[end + 4:].strip()
    meta: dict[str, object] = {}

    current_key = None
    current_list: list[str] | None = None

    for raw_line in fm_text.split("\n"):
        line = raw_line.strip()
        if not line or line.startswith("#"):
            if current_list is not None and current_key:
                meta[current_key] = current_list
                current_list = None
                current_key = None
            continue

        if line.startswith("- ") and current_list is not None:
            current_list.append(line[2:].strip())
            continue

        if ":" in line:
            if current_list is not None and current_key:
                meta[current_key] = current_list
                current_list = None
                current_key = None

            key, _, val = line.partition(":")
            key = key.strip()
            val = val.strip()

            if val == "" or val == "|" or val.startswith(">"):
                current_key = key
                current_list = []
            else:
                meta[key] = val.strip("\"'")

    if current_list is not None and current_key:
        meta[current_key] = current_list

    return meta, body


# ── Checkers ──────────────────────────────────────────────────────────────────

def check_frontmatter(path: Path, meta: dict, issues: list[Issue]) -> None:
    required = ["name", "version", "description", "compatible_with", "tags", "security_status"]
    for field_name in required:
        if field_name not in meta or not meta[field_name]:
            issues.append(Issue(path, "WARNING", "QUALITY", f"Missing required frontmatter field: {field_name}"))

    # Platform validation
    platforms = meta.get("compatible_with", [])
    if isinstance(platforms, list):
        invalid = [p for p in platforms if p not in VALID_PLATFORMS]
        if invalid:
            issues.append(Issue(path, "WARNING", "FORMAT", f"Unknown platforms in compatible_with: {invalid}. Valid: {VALID_PLATFORMS}"))
    elif platforms:
        issues.append(Issue(path, "WARNING", "FORMAT", "compatible_with should be a YAML list"))

    # Security status
    status = str(meta.get("security_status", "")).strip()
    if status not in VALID_SECURITY_STATUSES:
        issues.append(Issue(path, "WARNING", "FORMAT", f"Invalid security_status '{status}'. Use: {VALID_SECURITY_STATUSES}"))

    # Description quality
    desc = str(meta.get("description", "")).strip()
    if len(desc) < 20:
        issues.append(Issue(path, "WARNING", "QUALITY", "Description is too short (< 20 chars) — be specific"))
    if desc.lower() in ("", "description here", "todo"):
        issues.append(Issue(path, "WARNING", "QUALITY", "Description appears to be a placeholder"))


def _extract_code_blocks(content: str) -> list[str]:
    """Extract content of all fenced code blocks (``` ... ```)."""
    return re.findall(r"```[^\n]*\n(.*?)```", content, re.DOTALL)


def check_tool_scope(path: Path, content: str, meta: dict, issues: list[Issue]) -> None:
    """Check that MCP tool calls inside code blocks only use approved tools."""
    declared: list[str] = meta.get("mcp_tools", []) or []  # type: ignore
    if not isinstance(declared, list):
        declared = []

    # Only check tool calls inside fenced code blocks — prose sections have false positives
    code_blocks = _extract_code_blocks(content)
    all_tool_calls: set[str] = set()
    for block in code_blocks:
        for match in re.finditer(r"\b([a-z_][a-z0-9_]{2,})\s*\(", block):
            name = match.group(1)
            # Skip common Python/bash builtins and obviously non-tool words
            if name in {"print", "len", "str", "list", "dict", "range", "type",
                        "input", "open", "read", "write", "split", "join",
                        "format", "encode", "decode", "strip", "lower", "upper",
                        "python", "node", "echo", "export", "mkdir", "grep"}:
                continue
            all_tool_calls.add(name)

    # Any call in code blocks that looks like an MCP call (snake_case, not a builtin)
    # and is not in approved list is worth flagging
    non_mcp_calls = {
        t for t in all_tool_calls
        if t not in APPROVED_MCP_TOOLS
        and re.match(r"^[a-z]+_[a-z]+", t)  # only flag snake_case names (likely tool calls)
    }
    for tool in sorted(non_mcp_calls):
        issues.append(Issue(
            path, "WARNING", "QUALITY",
            f"Snake_case call '{tool}()' in code block not in approved MCP tools. "
            f"If this is an MCP tool, add to mcp_tools frontmatter. Approved: {sorted(APPROVED_MCP_TOOLS)}"
        ))

    # Undeclared but approved tools (informational)
    used_approved = {t for t in all_tool_calls if t in APPROVED_MCP_TOOLS}
    undeclared = used_approved - set(declared)
    if undeclared:
        issues.append(Issue(
            path, "INFO", "FORMAT",
            f"Approved tools used in code blocks but not in mcp_tools frontmatter: {sorted(undeclared)}"
        ))


def check_security(path: Path, body: str, issues: list[Issue]) -> None:
    """Scan prompt template blocks for injection and exfiltration patterns."""
    # Extract prompt template blocks (between ``` fences inside ## Prompt template)
    # Also scan the full body since attackers might hide outside code blocks
    lines = body.split("\n")

    for i, line in enumerate(lines, 1):
        for pattern, reason in INJECTION_PATTERNS:
            if re.search(pattern, line, re.IGNORECASE):
                issues.append(Issue(
                    path, "ERROR", "SECURITY",
                    f"Prompt injection pattern ({reason}): '{line.strip()[:80]}'",
                    line=i,
                ))

        for pattern, reason in EXFILTRATION_PATTERNS:
            if re.search(pattern, line, re.IGNORECASE):
                issues.append(Issue(
                    path, "ERROR", "SECURITY",
                    f"Potential exfiltration ({reason}): '{line.strip()[:80]}'",
                    line=i,
                ))


def check_quality(path: Path, body: str, issues: list[Issue]) -> None:
    """Check that the skill has required structural elements."""

    # Must have a prompt template
    if "## Prompt template" not in body and "## Prompt Template" not in body:
        issues.append(Issue(path, "WARNING", "QUALITY", "Missing '## Prompt template' section"))

    # Must have at least one [PLACEHOLDER]
    if not re.search(r"\[([A-Z_][A-Z0-9_ ]*)\]", body):
        issues.append(Issue(path, "WARNING", "QUALITY", "No [PLACEHOLDER] found in prompt template — skills need variable inputs"))

    # Should have an example
    if "## Example" not in body and "## Examples" not in body:
        issues.append(Issue(path, "WARNING", "QUALITY", "Missing '## Example' section — examples help agents and humans understand the skill"))

    # Should have notes or when-to-use
    if "## When to use" not in body and "## When to Use" not in body:
        issues.append(Issue(path, "WARNING", "QUALITY", "Missing '## When to use' section"))

    # Should have MCP tool calls section if mcp_tools declared
    if "## MCP tool calls" not in body and "## MCP Tool Calls" not in body:
        issues.append(Issue(path, "INFO", "QUALITY", "Consider adding '## MCP tool calls' section with exact call signatures"))

    # Check for overly short skills
    if len(body.split("\n")) < 15:
        issues.append(Issue(path, "WARNING", "QUALITY", "Skill body is very short (< 15 lines) — provide more context"))


def check_hidden_content(path: Path, content: str, issues: list[Issue]) -> None:
    """Detect hidden or encoded content."""
    lines = content.split("\n")
    for i, line in enumerate(lines, 1):
        # Very long lines can hide content
        if len(line) > 1000:
            issues.append(Issue(
                path, "WARNING", "SECURITY",
                f"Suspiciously long line ({len(line)} chars) at line {i} — check for hidden content",
                line=i,
            ))
        # Base64-encoded blocks
        if re.search(r"[A-Za-z0-9+/]{40,}={0,2}", line) and "---" not in line:
            issues.append(Issue(
                path, "WARNING", "SECURITY",
                f"Possible base64 encoded content at line {i}",
                line=i,
            ))
        # Zero-width characters (common in injection attacks)
        if re.search(r"[​-‏‪-‮﻿]", line):
            issues.append(Issue(
                path, "ERROR", "SECURITY",
                f"Zero-width or direction-override Unicode character at line {i} — injection risk",
                line=i,
            ))


# ── Main scanner ──────────────────────────────────────────────────────────────

def scan_file(path: Path, security_only: bool = False, quality_only: bool = False) -> SkillReport:
    report = SkillReport(path=path)

    try:
        content = path.read_text(encoding="utf-8")
    except OSError as e:
        report.issues.append(Issue(path, "ERROR", "FORMAT", f"Cannot read file: {e}"))
        return report

    meta, body = parse_frontmatter(content)

    if not quality_only:
        check_security(path, body, report.issues)
        check_hidden_content(path, content, report.issues)

    if not security_only:
        check_frontmatter(path, meta, report.issues)
        check_tool_scope(path, body, meta, report.issues)
        check_quality(path, body, report.issues)

    return report


def collect_skill_files(targets: list[str]) -> list[Path]:
    # Files that are spec/meta documents, not skills themselves
    EXCLUDED_NAMES = {"SKILL_SPEC.md", "README.md"}
    if not targets:
        return sorted(
            p for p in SKILLS_ROOT.rglob("*.md")
            if p.name not in EXCLUDED_NAMES
        )
    files: list[Path] = []
    for t in targets:
        p = Path(t)
        if p.is_dir():
            files.extend(sorted(q for q in p.rglob("*.md") if q.name not in EXCLUDED_NAMES))
        elif p.is_file():
            if p.name not in EXCLUDED_NAMES:
                files.append(p)
            else:
                print(f"Note: skipping spec file {p.name}", file=sys.stderr)
        else:
            print(f"Warning: not found — {t}", file=sys.stderr)
    return files


def main() -> None:
    args = sys.argv[1:]
    security_only = "--security-only" in args
    quality_only = "--quality-only" in args
    file_args = [a for a in args if not a.startswith("--")]

    files = collect_skill_files(file_args)
    if not files:
        print("No skill files found.")
        sys.exit(0)

    reports: list[SkillReport] = []
    for f in files:
        r = scan_file(f, security_only=security_only, quality_only=quality_only)
        reports.append(r)

    # Print results
    has_security_errors = False
    has_quality_warnings = False
    total_issues = 0

    for r in reports:
        errors   = [i for i in r.issues if i.level == "ERROR"]
        warnings = [i for i in r.issues if i.level == "WARNING"]
        infos    = [i for i in r.issues if i.level == "INFO"]

        rel = r.path.relative_to(SKILLS_ROOT) if SKILLS_ROOT in r.path.parents else r.path
        status = "PASS" if not errors and not warnings else "FAIL" if errors else "WARN"
        score  = f"  score:{r.score}/100" if warnings or errors else ""

        print(f"{status} {rel}{score}")
        for issue in errors + warnings + infos:
            print(issue)

        if errors:
            has_security_errors = True
        if warnings:
            has_quality_warnings = True
        total_issues += len(errors) + len(warnings)

    # Summary
    print()
    print(f"Scanned {len(reports)} skill(s). Issues: {total_issues}")

    if has_security_errors:
        print("[FAIL] SECURITY issues found - fix before merging.")
        sys.exit(2)
    elif has_quality_warnings:
        print("[WARN] Quality warnings found. Review before merging.")
        sys.exit(1)
    else:
        print("[PASS] All skills passed.")
        sys.exit(0)


if __name__ == "__main__":
    main()
