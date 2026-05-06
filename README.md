# Community Data — India's Hardware Ecosystem Directory

> The open dataset powering India's hardware ecosystem directory.
> **[→ Browse the directory](https://makerhub.in)** *(domain TBD — see below)*

[![Resources](https://img.shields.io/badge/resources-1100%2B-blue)](resources/)
[![License: CC BY 4.0](https://img.shields.io/badge/data%20license-CC%20BY%204.0-green)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Validate](https://github.com/makerhub-india/data/actions/workflows/validate-pr.yml/badge.svg)](https://github.com/makerhub-india/data/actions)

---

## What is this?

This repo is the **community data layer** for India's hardware ecosystem directory —
1100+ verified resources across India including testing labs, PCB fabs, makerspaces,
government research facilities, contract manufacturers, component suppliers, and more.

**Humans and AI agents can contribute here. The live directory stays up to date.**

This repo exists so that:
- **Makers and researchers** can browse the data directly on GitHub
- **Humans** can add or correct resources via readable Markdown files
- **AI agents** can autonomously research and contribute new entries (see [AGENT_CONTRIBUTING.md](AGENT_CONTRIBUTING.md))
- **Developers** can use the dataset in their own projects (CC BY 4.0)
- **MCP clients** can query the live API through the [MCP server](mcp/)

---

## Browse the data

Resources live in the [`resources/`](resources/) folder as readable Markdown files — one file per category:

| Category | Count | Browse |
|----------|------:|--------|
| 🏭 Manufacturers | 133+ | [resources/manufacturer.md](resources/manufacturer.md) |
| 🛠️ Makerspaces | 166+ | [resources/makerspace.md](resources/makerspace.md) |
| 🔬 Testing Labs | 66+ | [resources/testing_lab.md](resources/testing_lab.md) |
| 🔭 Research Labs | 109+ | [resources/research_lab.md](resources/research_lab.md) |
| 📦 Component Suppliers | 89+ | [resources/component_supplier.md](resources/component_supplier.md) |
| 🟢 PCB Fabrication | 32+ | [resources/pcb_fab.md](resources/pcb_fab.md) |
| 📡 Laser Scanning | 32+ | [resources/laser_scanning.md](resources/laser_scanning.md) |
| 🚀 Accelerators | 44+ | [resources/accelerator.md](resources/accelerator.md) |
| 📋 Certification Bodies | 11+ | [resources/certification_body.md](resources/certification_body.md) |
| [→ All categories](resources/README.md) | 1100+ | |

Funding opportunities: [`funding/grants.md`](funding/grants.md)

---

## Use with AI agents (MCP)

The [MCP server](mcp/) lets any MCP-compatible AI (Claude, Cursor, Continue) query the live directory:

```bash
cd mcp && npm install && npm run build

# Configure your AI client (get a free key at the directory website)
export MAKERHUB_API_KEY=your_key_here
```

**What agents can do with it:**
```
"Find EMC testing labs in Bangalore"
→ search_resources(type=testing-lab, city=Bangalore, tags=emc)

"What grants exist for hardware deeptech startups?"
→ get_grants(stage=early, category=electronics)

"Get full details for STQC Bangalore"
→ get_resource(slug=stqc-bangalore)
```

See [mcp/README.md](mcp/README.md) for full setup.

---

## Contribute

### Add a resource (human)

1. Open the relevant `resources/<type>.md` file
2. Copy an existing `###` entry as your template
3. Fill in the required fields: `slug`, `location`, `access level`
4. Run validation: `python3 scripts/validate_md.py resources/`
5. Open a pull request — CI auto-validates

**See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.**

### Add resources (AI agent — autonomous mode)

AI agents can contribute autonomously using [AGENT_CONTRIBUTING.md](AGENT_CONTRIBUTING.md).

The loop (runs entirely with your LLM + tools):
```
1. Clone this repo
2. Read AGENT_CONTRIBUTING.md for the exact format
3. Identify gaps: which types / cities are underrepresented?
4. Research and add new ### sections to the right .md files
5. Validate: python3 scripts/validate_md.py resources/
6. Open a PR using the template in AGENT_CONTRIBUTING.md
```

**You contribute with your tokens. We review and maintain.**

### What we need most

- Cities: **Jaipur, Lucknow, Indore, Bhopal, Coimbatore, Nashik, Vizag**
- Types: **biomedical testing, aerospace facilities, defence-adjacent labs**
- Data quality: resources missing **website URLs** (~300 entries need verification)

---

## Data format

Each resource is a `###` section in the appropriate Markdown file:

```markdown
### STQC Bangalore

| Field | Value |
|-------|-------|
| **Slug** | `stqc-bangalore` |
| **Location** | Bangalore, Karnataka |
| **Access** | L1 — Open (fee-based) |
| **Website** | https://stqc.gov.in |
| **Tags** | emc, safety, electronics, nabl |

Government testing lab for electronics products — EMC, safety, and environmental testing.

---
```

Required fields: `Slug`, `Location`, `Access`. Full spec in [CONTRIBUTING.md](CONTRIBUTING.md).

JSON Schema reference: [schema/resource.schema.json](schema/resource.schema.json)

---

## API access

For programmatic / live queries (faster than cloning):

```bash
# Search resources (requires free API key)
curl "https://api.makerhub.in/v1/resources?type=testing-lab&city=Bangalore" \
  -H "X-API-Key: your_key"
```

Get a free key at the directory site — 1,000 requests/day free tier.

---

## License

**Data** ([`resources/`](resources/), [`funding/`](funding/)): [CC BY 4.0](LICENSE) — free to use, share, and adapt with attribution.

**MCP server code** ([`mcp/`](mcp/)): MIT.

The web application, admin system, and search engine are proprietary and not in this repository.

---

## About

Built by [Karan Rao](https://samaritan.bio) at [Samaritan Bio](https://samaritan.bio).

Founding sponsors: [Samaritan Bio](https://samaritan.bio) · [Mekuva.com](https://mekuva.com)

Star the repo if this is useful. Open issues for incorrect data. PRs for new resources.
