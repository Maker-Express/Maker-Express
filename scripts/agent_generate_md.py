"""Generate Markdown resource entries for agent-submit workflow."""
import json
import os
import sys
from pathlib import Path

ACCESS_LABELS = {
    0: "L0 — Open (free)",
    1: "L1 — Open (fee-based)",
    2: "L2 — Institutional",
    3: "L3 — Restricted",
    4: "L4 — Clearance required",
}


def render_entry(entry: dict, contributor: str) -> str:
    name = entry["name"]
    slug = entry["slug"]
    city = entry["city"]
    state = entry["state"]
    level = int(entry.get("access_level", 1))

    lines: list[str] = [f"### {name}\n\n", "| Field | Value |\n|-------|-------|\n"]
    lines.append(f"| **Slug** | `{slug}` |\n")
    lines.append(f"| **Location** | {city}, {state} |\n")
    lines.append(f"| **Access** | {ACCESS_LABELS.get(level, str(level))} |\n")

    if entry.get("website"):
        lines.append(f"| **Website** | {entry['website']} |\n")

    if entry.get("tags"):
        tags = entry["tags"] if isinstance(entry["tags"], str) else ", ".join(entry["tags"])
        lines.append(f"| **Tags** | {tags} |\n")

    if contributor:
        lines.append(f"| **Contributed by** | [@{contributor}](https://github.com/{contributor}) |\n")

    lines.append("| **Source** | [hardstack.xyz](https://hardstack.xyz) |\n")

    desc = (entry.get("description_short") or entry.get("description") or "").strip()
    if desc:
        lines.append(f"\n{desc}\n")

    lines.append("\n---\n")
    return "".join(lines)


def main() -> int:
    resource_type = os.environ.get("RESOURCE_TYPE", "").strip()
    entries_raw = os.environ.get("ENTRIES_JSON", "").strip()
    contributor = os.environ.get("CONTRIBUTOR", "").strip()

    try:
        entries = json.loads(entries_raw)
    except json.JSONDecodeError as exc:
        print(f"ERROR: Invalid entries_json: {exc}")
        return 1

    target = Path("resources") / (resource_type.replace("-", "_") + ".md")

    new_content = "\n".join(render_entry(e, contributor) for e in entries)

    if target.exists():
        existing = target.read_text()
        target.write_text(existing.rstrip() + "\n\n" + new_content)
    else:
        title = resource_type.replace("-", " ").title()
        target.write_text(f"# {title}\n\n" + new_content)

    print(f"Wrote {len(entries)} entries to {target}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
