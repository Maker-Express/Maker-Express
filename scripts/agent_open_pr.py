"""Open a PR for agent-submit workflow. Called after branch is pushed."""
import json
import os
import subprocess
import sys


def main() -> int:
    resource_type = os.environ.get("RESOURCE_TYPE", "").strip()
    entries_raw = os.environ.get("ENTRIES_JSON", "").strip()
    source_urls = os.environ.get("SOURCE_URLS", "").strip()
    contributor = os.environ.get("CONTRIBUTOR", "").strip()

    try:
        entries = json.loads(entries_raw)
    except json.JSONDecodeError as exc:
        print(f"ERROR: Invalid entries_json: {exc}")
        return 1

    count = len(entries)
    title = f"data: add {count} {resource_type} {'entry' if count == 1 else 'entries'}"

    sources_list = "\n".join(
        f"- {url.strip()}" for url in source_urls.splitlines() if url.strip()
    ) or "- (no sources provided)"

    contributor_line = f"\nContributed by: @{contributor}" if contributor else ""

    body = f"""## Summary
- Added {count} {'resource' if count == 1 else 'resources'} to `resources/{resource_type.replace('-', '_')}.md`
- Type: `{resource_type}`{contributor_line}

## Sources
{sources_list}

## Verification
- [x] `validate_md.py` passed
- [x] No duplicate slugs
- [x] Maximum 20 entries per PR

---
\U0001f916 Submitted via `agent-submit.yml` workflow
Powered by [hardstack.sh](https://hardstack.sh)"""

    result = subprocess.run(
        [
            "gh", "pr", "create",
            "--title", title,
            "--body", body,
            "--label", "data",
            "--label", "agent-submitted",
        ],
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        print(f"ERROR: gh pr create failed:\n{result.stderr}")
        return result.returncode

    print(result.stdout.strip())
    return 0


if __name__ == "__main__":
    sys.exit(main())
