# Contributing as an AI Agent

This guide is for AI agents contributing autonomously to the hardware ecosystem directory.
The format is simple: append `###` sections to the right `.md` file in `resources/`.

---

## Setup

```bash
git clone https://github.com/makerhub-india/data.git
cd data
```

---

## Step-by-step

### 1. Identify gaps

```python
from pathlib import Path
import re

# Count entries per file
for f in sorted(Path("resources").glob("*.md")):
    if f.name == "README.md":
        continue
    count = len(re.findall(r"^### ", f.read_text(), re.MULTILINE))
    print(f"{count:4d}  {f.name}")

# Find which cities are underrepresented in a specific file
content = Path("resources/testing_lab.md").read_text()
sections = content.split("### ")[1:]
cities = []
for s in sections:
    m = re.search(r"\*\*Location\*\*\s*\|\s*([^|,]+),", s)
    if m:
        cities.append(m.group(1).strip())

from collections import Counter
print(Counter(cities).most_common(20))
```

**Priority gaps (as of 2025):**
- Cities: Jaipur, Lucknow, Indore, Bhopal, Coimbatore, Nashik, Vizag
- Types: biomedical testing, aerospace facilities, defence labs with open tiers

### 2. Research resources

Use web search to find real, verifiable resources. Check:
- Official government sites (csir.res.in, stqc.gov.in, birac.nic.in)
- University lab pages (iit*.ac.in, nit*.ac.in)
- Industry directories (IndiaMARTe, Alibaba India for manufacturers)
- State government MSME portals

Only add resources you can verify exist. Do not fabricate entries.

### 3. Add entries

Append to the correct `resources/<type>.md` file:

```markdown
### Facility Name

| Field | Value |
|-------|-------|
| **Slug** | `facility-name-city` |
| **Location** | City, State |
| **Access** | L1 — Open (fee-based) |
| **Website** | https://verified-url.com |
| **Tags** | tag1, tag2, tag3 |

Brief factual description of what this facility offers and who it serves.

---
```

**Required fields:** Slug, Location, Access
**Slug rules:** lowercase, letters/numbers/hyphens, globally unique, e.g. `csio-chandigarh`

### 4. Validate

```bash
python3 scripts/validate_md.py resources/
```

Fix any errors before proceeding. Common issues:
- Duplicate slug → append city to make unique
- Invalid access level → must be exactly L0–L4 format
- Missing location comma → must be `City, State`

### 5. Open a PR

```bash
git checkout -b add-resources-<city>-<type>
git add resources/
git commit -m "data: add <N> <type> resources in <city>"
gh pr create \
  --title "data: add <N> <type> resources in <city>" \
  --body "$(cat << 'EOF'
## Summary
- Added N resources to resources/<type>.md
- Cities covered: X, Y, Z
- Sources: [list sources]

## Verification
- [ ] All slugs are unique (validate_md.py passed)
- [ ] All websites are reachable
- [ ] Entries are factual with no marketing copy

🤖 Contributed autonomously using the AGENT_CONTRIBUTING.md guide
EOF
)"
```

---

## Rules

1. **Only real resources.** Fabricated entries will be rejected and the contributing account flagged.
2. **One PR per batch.** Group additions by city or type — max ~50 entries per PR.
3. **No private contact info** without public evidence it's the right contact.
4. **Neutral descriptions.** No marketing language, superlatives, or opinions.
5. **Verifiable sources.** Include source URLs in PR description.

---

## What makes a good contribution

✅ Government lab with public-facing services
✅ PCB fab with a working website and clear service list
✅ Testing lab with NABL accreditation or ISO 17025 certification
✅ Makerspace with equipment list and membership info

❌ Generic company that might do hardware work
❌ LinkedIn-only presence (no website)
❌ Entry you cannot verify from a public source
