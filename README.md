# MakerHub India — Community Data

> The open dataset powering [makerhub.in](https://makerhub.in) — India's hardware ecosystem directory.

[![Resources](https://img.shields.io/badge/resources-1072%2B-blue)](data/resources.json)
[![License](https://img.shields.io/badge/data%20license-CC%20BY%204.0-green)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Validate](https://github.com/makerhub-india/data/actions/workflows/validate-pr.yml/badge.svg)](https://github.com/makerhub-india/data/actions)

---

## What is this?

MakerHub India cuts the time from hardware idea to manufactured product by 10×.

This repo is the **community data layer**: the structured JSON dataset of 1072+ verified hardware resources across India — testing labs, PCB fabs, makerspaces, government research facilities, contract manufacturers, component suppliers, accelerators, and more.

**The directory is searchable and browsable at → [makerhub.in](https://makerhub.in)**

This repo exists so that:
- **Humans** can add or correct resources via pull requests
- **AI agents** can autonomously research and contribute new entries
- **Developers** can use the dataset in their own projects (CC BY 4.0)
- **MCP clients** can query live data through the [MCP server](mcp/)

---

## Explore the data

```bash
# Count resources by type
cat data/resources.json | python3 -c "
import json, sys, collections
data = json.load(sys.stdin)
counts = collections.Counter(r['type'] for r in data)
for t, n in counts.most_common():
    print(f'{n:4d}  {t}')
"

# Find resources in Bangalore
cat data/resources.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
blr = [r for r in data if 'bangalore' in r.get('city', '').lower()]
print(f'{len(blr)} resources in Bangalore')
for r in blr[:5]: print(f'  {r[\"type\"]:25s} {r[\"name\"]}')
"
```

### Resource types

| Type | Count |
|------|-------|
| Makerspace / FabLab | 166+ |
| Manufacturer | 133+ |
| Research Lab | 109+ |
| Online Tool / Service | 102+ |
| Component Supplier | 89+ |
| Testing Lab | 66+ |
| EMS / Contract Mfg | 37+ |
| PCB Fabrication | 32+ |
| Govt Research Lab | 29+ |
| [+ 15 more types](schema/resource.schema.json) | |

---

## Use with AI agents (MCP)

The [MakerHub MCP server](mcp/) lets any MCP-compatible AI client query the live directory:

```bash
# Install
cd mcp && npm install

# Configure (get a free API key at makerhub.in/api)
export MAKERHUB_API_KEY=your_key_here

# Add to Claude Desktop / Cursor / Continue
# See mcp/README.md for full setup
```

**What agents can do with it:**
- Search resources by type, city, capability
- Look up specific labs and their equipment
- Find certification bodies for a product category
- Get grant/funding opportunities

This lets you build pipelines like:
```
"Find testing labs in Chennai that do EMC testing"
→ MCP tool: search_resources(type=testing-lab, city=Chennai, tags=emc)
→ Returns: 3 verified labs with contact info
```

---

## Contribute

### Add a resource (human)

1. Fork this repo
2. Add your entry to `data/resources.json` following the [schema](schema/resource.schema.json)
3. Run `python3 scripts/validate.py` to check your entry
4. Open a pull request — CI will auto-validate

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

### Add resources (AI agent — autonomous mode)

AI agents can contribute directly using the instructions in [AGENT_CONTRIBUTING.md](AGENT_CONTRIBUTING.md).

The loop:
```
1. Clone this repo
2. Read AGENT_CONTRIBUTING.md
3. Research gaps in data/resources.json (what types/cities are underrepresented?)
4. Add entries following schema/resource.schema.json
5. Run: python3 scripts/validate.py data/resources.json
6. Open a PR with the standard template
```

The GitHub Actions CI will automatically validate your PR. A maintainer reviews and merges.

**You contribute with your tokens. We maintain the directory.**

### What we need most

- Resources in **Tier 2 cities** (Jaipur, Lucknow, Indore, Bhopal, Nashik, Coimbatore)
- **Laser scanning** and metrology services
- **Biomedical** testing labs and prototyping services
- **Aerospace** and defence-adjacent facilities with open-access tiers
- Missing **website URLs** (322 entries need verification)

---

## Data format

Each resource follows this minimal schema:

```json
{
  "slug": "iit-bombay-ncair",
  "name": "IIT Bombay — NCAIR",
  "type": "govt-lab",
  "city": "Mumbai",
  "state": "Maharashtra",
  "description_short": "National Centre for Aerospace Innovation and Research...",
  "website": "https://ncair.iitb.ac.in",
  "tags": ["aerospace", "robotics", "research"],
  "access_level": 1,
  "categories": ["aerospace", "robotics"]
}
```

Full schema: [schema/resource.schema.json](schema/resource.schema.json)

---

## Sync with the live directory

This dataset is synced from the private webapp repo on every release. To get the absolute latest data, use the API:

```bash
# Live search (requires free API key)
curl "https://api.makerhub.in/v1/resources?type=testing-lab&city=Bangalore" \
  -H "X-MakerHub-Key: your_key"

# Get a specific resource
curl "https://api.makerhub.in/v1/resources/iit-bombay-ncair" \
  -H "X-MakerHub-Key: your_key"
```

Get a free API key at [makerhub.in/api](https://makerhub.in/api) — 1,000 requests/day free.

---

## License

**Data:** [Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE)
You're free to use, share, and adapt the data with attribution.

**MCP server code:** MIT

The MakerHub India web application (the search engine, UI, admin system) is proprietary and not included in this repository.

---

## About

MakerHub India is built by [Karan Rao](https://samaritan.bio) at [Samaritan Bio](https://samaritan.bio).

**Founding sponsors:**
- [Samaritan Bio](https://samaritan.bio) — medical-device startup, building next-generation diagnostics
- [Mekuva.com](https://mekuva.com) — India's hardware ecosystem builder

**Support the project:** [makerhub.in/donate](https://makerhub.in/donate)

Star the repo if this is useful. Open issues for incorrect data. PRs for new resources. The community is what makes this directory valuable.
