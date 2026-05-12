#!/usr/bin/env python3
"""
validate_md.py — Validate Markdown resource files in the public repo.

Usage:
  python3 scripts/validate_md.py                  # validate all resources/
  python3 scripts/validate_md.py resources/testing_labs.md
  python3 scripts/validate_md.py resources/        # validate a directory

Exit codes:
  0 — all valid
  1 — validation errors found
  2 — file/parse error

Rules checked:
  - Required fields: slug, location (city+state), access_level
  - Slug format: lowercase letters, numbers, hyphens only; min 3 chars
  - Access level: must be L0–L4
  - No duplicate slugs within the file
  - Website/URL format if provided
  - No obviously placeholder values (e.g. "your-slug-here")
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

# ── Regexes ────────────────────────────────────────────────────────────────────

SLUG_RE     = re.compile(r"^[a-z0-9][a-z0-9\-]{1,}[a-z0-9]$")
SECTION_RE  = re.compile(r"^### (.+)", re.MULTILINE)
ROW_RE      = re.compile(r"^\|\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|", re.MULTILINE)
SLUG_CODE   = re.compile(r"`([^`]+)`")
ACCESS_RE   = re.compile(r"L([0-4])")
URL_RE      = re.compile(r"^https?://\S+$")
PLACEHOLDER = re.compile(r"your[- ]|example\.com|todo|tbd|placeholder|xxx", re.IGNORECASE)

# ── Helpers ────────────────────────────────────────────────────────────────────

class Error:
    def __init__(self, section: str, msg: str):
        self.section = section
        self.msg = msg

    def __str__(self) -> str:
        return f"  [{self.section}] {self.msg}"


def parse_rows(block: str) -> dict[str, str]:
    result: dict[str, str] = {}
    for m in ROW_RE.finditer(block):
        key = m.group(1).strip().lower().replace(" ", "_")
        val = m.group(2).strip()
        code_m = SLUG_CODE.match(val)
        if code_m:
            val = code_m.group(1)
        result[key] = val
    return result


def validate_file(path: Path) -> list[Error]:
    try:
        content = path.read_text(encoding="utf-8")
    except OSError as e:
        return [Error("file", f"Cannot read: {e}")]

    errors: list[Error] = []
    sections = SECTION_RE.split(content)
    # sections[0] = preamble, then alternating name/block
    seen_slugs: set[str] = set()

    for i in range(1, len(sections), 2):
        name  = sections[i].strip()
        block = sections[i + 1] if i + 1 < len(sections) else ""
        rows  = parse_rows(block)

        # ── Slug ──────────────────────────────────────────────────────────────
        slug = rows.get("slug", "").strip().lower()
        if not slug:
            errors.append(Error(name, "Missing required field: slug"))
        elif not SLUG_RE.match(slug):
            errors.append(Error(name, f"Invalid slug format: '{slug}' (use lowercase letters, numbers, hyphens; min 3 chars)"))
        elif slug in seen_slugs:
            errors.append(Error(name, f"Duplicate slug: '{slug}'"))
        elif PLACEHOLDER.search(slug):
            errors.append(Error(name, f"Slug looks like a placeholder: '{slug}'"))
        else:
            seen_slugs.add(slug)

        # ── Location ─────────────────────────────────────────────────────────
        location = rows.get("location", "")
        if not location or "," not in location:
            errors.append(Error(name, "Missing or invalid 'location' (expected: City, State)"))
        else:
            city, _, state = location.partition(",")
            if not city.strip():
                errors.append(Error(name, "Location: city is empty"))
            if not state.strip():
                errors.append(Error(name, "Location: state is empty"))

        # ── Access level ──────────────────────────────────────────────────────
        access = rows.get("access", rows.get("access_level", ""))
        if not access:
            errors.append(Error(name, "Missing required field: access"))
        elif not ACCESS_RE.search(access):
            errors.append(Error(name, f"Invalid access level: '{access}' (must contain L0–L4)"))

        # ── Optional URL fields ───────────────────────────────────────────────
        for field in ("website",):
            val = rows.get(field, "")
            if val and val != "—" and not URL_RE.match(val):
                errors.append(Error(name, f"'{field}' is not a valid URL: '{val}'"))

        # ── Placeholder detection ────────────────────────────────────────────
        for field in ("website", "email"):
            val = rows.get(field, "")
            if val and PLACEHOLDER.search(val):
                errors.append(Error(name, f"'{field}' looks like a placeholder: '{val}'"))

    return errors


# ── Main ───────────────────────────────────────────────────────────────────────

def collect_files(targets: list[str]) -> list[Path]:
    files: list[Path] = []
    if not targets:
        here = Path(__file__).parent.parent
        res_dir = here / "resources"
        fund_dir = here / "funding"
        for d in (res_dir, fund_dir):
            if d.exists():
                files.extend(p for p in sorted(d.glob("*.md")) if p.name != "README.md")
        return files

    for t in targets:
        p = Path(t)
        if p.is_dir():
            files.extend(sorted(p.glob("*.md")))
        elif p.is_file():
            files.append(p)
        else:
            print(f"Warning: not found: {t}", file=sys.stderr)
    return files


def main() -> None:
    targets = sys.argv[1:]
    files   = collect_files(targets)

    if not files:
        print("No Markdown files to validate.")
        sys.exit(0)

    total_errors = 0
    for f in files:
        errs = validate_file(f)
        if errs:
            print(f"\n[FAIL] {f.relative_to(f.parent.parent) if f.parent.name else f}:")
            for e in errs:
                print(e)
            total_errors += len(errs)
        else:
            print(f"[PASS] {f.name}")

    print()
    if total_errors:
        print(f"Found {total_errors} error(s). Fix before opening a PR.")
        sys.exit(1)
    else:
        print("All files valid.")
        sys.exit(0)


if __name__ == "__main__":
    main()
