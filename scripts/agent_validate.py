"""Validate agent-submit workflow inputs. Called from agent-submit.yml."""
import json
import os
import re
import sys

VALID_TYPES = {
    "testing-lab", "pcb-fab", "makerspace", "manufacturer",
    "component-supplier", "distributor", "prototyping-lab",
    "research-lab", "certification-body", "accelerator", "online-tool",
    "laser-scanning", "funding",
}

SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]*[a-z0-9]$")


def main() -> int:
    resource_type = os.environ.get("RESOURCE_TYPE", "").strip()
    entries_raw = os.environ.get("ENTRIES_JSON", "").strip()

    if resource_type not in VALID_TYPES:
        print(f"ERROR: Unknown resource type '{resource_type}'")
        print(f"Valid types: {', '.join(sorted(VALID_TYPES))}")
        return 1

    try:
        entries = json.loads(entries_raw)
    except json.JSONDecodeError as exc:
        print(f"ERROR: Invalid JSON in entries_json: {exc}")
        return 1

    if not isinstance(entries, list) or len(entries) == 0:
        print("ERROR: entries_json must be a non-empty JSON array")
        return 1

    if len(entries) > 20:
        print(f"ERROR: Maximum 20 entries per PR (got {len(entries)})")
        return 1

    errors: list[str] = []
    for i, entry in enumerate(entries):
        for field in ("name", "slug", "city", "state"):
            if not entry.get(field):
                errors.append(f"Entry {i}: missing required field '{field}'")
        slug = entry.get("slug", "")
        if slug and not SLUG_RE.match(slug):
            errors.append(
                f"Entry {i}: slug '{slug}' is invalid — use lowercase letters, digits, and hyphens only"
            )

    if errors:
        print("ERROR: Validation failed:")
        for err in errors:
            print(f"  {err}")
        return 1

    print(f"OK — {len(entries)} entries validated for type '{resource_type}'")
    return 0


if __name__ == "__main__":
    sys.exit(main())
