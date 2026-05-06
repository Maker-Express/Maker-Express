#!/usr/bin/env python3
"""
Validate data/resources.json against the MakerHub India resource schema.

Usage:
    python3 scripts/validate.py                     # validates data/resources.json
    python3 scripts/validate.py path/to/file.json   # validates a specific file
    python3 scripts/validate.py --strict             # also checks optional field quality

Exit codes:
    0 = valid
    1 = validation errors found
    2 = file not found / JSON parse error
"""

from __future__ import annotations
import json
import re
import sys
import argparse
from pathlib import Path
from typing import Any

# ── Constants ─────────────────────────────────────────────────────────────────

VALID_TYPES = {
    "testing-lab", "pcb-fab", "ems", "component-supplier", "makerspace",
    "govt-lab", "research-lab", "tinkering-lab", "consultant",
    "certification-body", "accelerator", "manufacturer", "tool-service",
    "3d-printing", "logistics", "investor", "grant", "co-working",
    "prototyping-lab", "online-tool", "online-store", "distributor",
    "event", "job-board", "community", "laser-scanning", "other",
}

VALID_CATEGORIES = {
    "electronics", "mechanical", "biotech", "materials", "software",
    "robotics", "aerospace", "energy", "chemistry", "textiles",
    "agriculture", "prototyping", "defense", "automotive", "medical", "iot",
}

REQUIRED_FIELDS = {"slug", "name", "type", "city", "state", "description_short", "categories"}
SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]{1,58}[a-z0-9]$")
URL_RE = re.compile(r"^https?://[^\s]+$")

# ── Validators ────────────────────────────────────────────────────────────────

class ValidationError:
    def __init__(self, slug: str, field: str, message: str):
        self.slug = slug
        self.field = field
        self.message = message

    def __str__(self) -> str:
        return f"  [{self.slug}] {self.field}: {self.message}"


def validate_resource(r: Any, index: int, strict: bool) -> list[ValidationError]:
    errors: list[ValidationError] = []
    slug = r.get("slug", f"<index {index}>") if isinstance(r, dict) else f"<index {index}>"

    if not isinstance(r, dict):
        return [ValidationError(slug, "root", "entry is not an object")]

    # Required fields
    for field in REQUIRED_FIELDS:
        if field not in r or r[field] is None or r[field] == "":
            errors.append(ValidationError(slug, field, "required field is missing or empty"))

    # Slug format
    s = str(r.get("slug", ""))
    if s and not SLUG_RE.match(s):
        errors.append(ValidationError(slug, "slug",
            f"must be lowercase alphanumeric + hyphens, 3-60 chars (got: {s!r})"))

    # Type
    t = r.get("type", "")
    if t and t not in VALID_TYPES:
        errors.append(ValidationError(slug, "type",
            f"{t!r} is not a known type. Valid: {sorted(VALID_TYPES)}"))

    # Categories
    cats = r.get("categories", [])
    if not isinstance(cats, list):
        errors.append(ValidationError(slug, "categories", "must be an array"))
    elif not cats:
        errors.append(ValidationError(slug, "categories", "must have at least one category"))
    else:
        for c in cats:
            if c not in VALID_CATEGORIES:
                errors.append(ValidationError(slug, "categories",
                    f"{c!r} is not a known category. Valid: {sorted(VALID_CATEGORIES)}"))

    # Access level
    al = r.get("access_level")
    if al is not None and al not in (0, 1, 2, 3, 4):
        errors.append(ValidationError(slug, "access_level", "must be 0, 1, 2, 3, or 4"))

    # Description length
    desc = str(r.get("description_short", ""))
    if desc and len(desc) > 400:
        errors.append(ValidationError(slug, "description_short",
            f"too long ({len(desc)} chars, max 400)"))

    # URL format (optional but validated if present)
    website = r.get("website")
    if website and not URL_RE.match(str(website)):
        errors.append(ValidationError(slug, "website",
            f"must start with http:// or https:// (got: {website!r})"))

    # Strict-mode checks
    if strict:
        if not r.get("website"):
            errors.append(ValidationError(slug, "website", "[strict] missing website URL"))
        tags = r.get("tags", [])
        if not isinstance(tags, list) or not tags:
            errors.append(ValidationError(slug, "tags", "[strict] should have at least one tag"))

    return errors


def validate_file(path: Path, strict: bool) -> int:
    print(f"Validating {path} …")
    try:
        text = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        print(f"Error: file not found: {path}", file=sys.stderr)
        return 2
    except OSError as e:
        print(f"Error reading file: {e}", file=sys.stderr)
        return 2

    try:
        data = json.loads(text)
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}", file=sys.stderr)
        return 2

    if not isinstance(data, list):
        print("Error: root element must be a JSON array", file=sys.stderr)
        return 2

    # Check duplicates
    seen_slugs: dict[str, int] = {}
    duplicate_errors: list[ValidationError] = []

    all_errors: list[ValidationError] = []

    for i, r in enumerate(data):
        slug = r.get("slug", "") if isinstance(r, dict) else ""
        if slug:
            if slug in seen_slugs:
                duplicate_errors.append(ValidationError(
                    slug, "slug",
                    f"duplicate slug — also appears at index {seen_slugs[slug]}"
                ))
            else:
                seen_slugs[slug] = i
        all_errors.extend(validate_resource(r, i, strict))

    all_errors.extend(duplicate_errors)

    if not all_errors:
        print(f"OK — {len(data)} resources, 0 errors{' (strict mode)' if strict else ''}")
        return 0

    print(f"\nFound {len(all_errors)} error(s) in {len(data)} resources:\n")
    for err in all_errors:
        print(err)
    print(f"\n{len(all_errors)} error(s). Fix them before opening a PR.")
    return 1


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate MakerHub India resources.json")
    parser.add_argument("file", nargs="?", default="data/resources.json",
                        help="Path to the JSON file (default: data/resources.json)")
    parser.add_argument("--strict", action="store_true",
                        help="Also enforce optional field quality checks")
    args = parser.parse_args()

    rc = validate_file(Path(args.file), args.strict)
    sys.exit(rc)


if __name__ == "__main__":
    main()
