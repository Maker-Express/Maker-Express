<div align="center">

# ⚡ Hardstack — India's Hardware Ecosystem

**1,100+ verified labs · fabs · makerspaces · grants · certifications**

[![Resources](https://img.shields.io/badge/resources-1100%2B-orange?style=flat-square)](resources/)
[![License: CC BY 4.0](https://img.shields.io/badge/data-CC%20BY%204.0-green?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)
[![CI](https://img.shields.io/github/actions/workflow/status/hardstack-india/data/validate-pr.yml?style=flat-square&label=CI)](https://github.com/hardstack-india/data/actions)

[Browse →](resources/) · [MCP Setup →](#-use-with-ai-agents) · [Contribute →](#-contribute) · [Skills →](skills/) · [Roadmap →](#-roadmap)

</div>

---

## What is this?

The open dataset and tools powering **[hardstack.sh](https://hardstack.sh)** — India's directory for hardware makers.

**Browse on GitHub** → readable Markdown, no tooling needed.  
**Use with AI agents** → MCP server proxies the live API.  
**Contribute** → add resources in 5 minutes, or let your LLM do it.

---

## 🔗 External curated lists

- [awesome-mecheng](https://github.com/m2n037/awesome-mecheng) by @m2n037 — Curated list of mechanical engineering resources (1.6k⭐)

---

## 📂 Browse resources

<details open>
<summary><strong>All resource types (24 categories, 1100+ entries)</strong></summary>

| # | Category | Count | File |
|---|----------|------:|------|
| 🛠️ | Makerspaces | 166+ | [makerspace.md](resources/makerspace.md) |
| 🏭 | Manufacturers / EMS | 133+ | [manufacturer.md](resources/manufacturer.md) |
| 🔭 | Research Labs | 109+ | [research_lab.md](resources/research_lab.md) |
| ⚙️ | Online Tools & Services | 102+ | [online_tool.md](resources/online_tool.md) |
| 📦 | Component Suppliers | 89+ | [component_supplier.md](resources/component_supplier.md) |
| ⚡ | Accelerators | 44+ | [accelerator.md](resources/accelerator.md) |
| 📡 | Laser Scanning | 32+ | [laser_scanning.md](resources/laser_scanning.md) |
| 🟢 | PCB Fabrication | 32+ | [pcb_fab.md](resources/pcb_fab.md) |
| 🔬 | Testing Labs | 66+ | [testing_lab.md](resources/testing_lab.md) |
| 🔩 | Distributors | 47+ | [distributor.md](resources/distributor.md) |
| 🎓 | Prototyping Labs | 27+ | [prototyping_lab.md](resources/prototyping_lab.md) |
| 📋 | Certification Bodies | 11+ | [certification_body.md](resources/certification_body.md) |
| 💰 | Grants & Funding | 25+ | [funding/grants.md](funding/grants.md) |
| | [→ all categories](resources/README.md) | 1100+ | |

</details>

Each resource has: name · slug · city/state · access level · website · tags

---

## 🤖 Use with AI agents

The [MCP server](mcp/) connects any MCP-compatible AI to the live directory.

**Claude Desktop setup** (3 steps):

```bash
# 1. Clone and build
git clone https://github.com/hardstack-india/data && cd data/mcp && npm install && npm run build

# 2. Get a free API key at hardstack.sh/api  (1,000 req/day)

# 3. Add to ~/Library/Application Support/Claude/claude_desktop_config.json
```

```json
{
  "mcpServers": {
    "hardstack": {
      "command": "node",
      "args": ["/path/to/data/mcp/dist/index.js"],
      "env": { "HARDSTACK_API_KEY": "your_key" }
    }
  }
}
```

**What you can ask:**
```
"Find NABL-accredited EMC testing labs in Bangalore"
"What PCB fabs in Mumbai offer same-week turnaround?"
"What government grants exist for biomedical hardware startups?"
"Get full details for stqc-bangalore"
```

**Available tools:** `search_resources` · `get_resource` · `list_resource_types` · `list_cities` · `get_grants`

See [mcp/README.md](mcp/README.md) for Cursor, Continue, and self-hosting setup.

---

## 🧠 Skills library

Hardware-domain skills for Claude Code, Codex, and MCP agents — ready to use, security-verified.

```
skills/
  hardware/
    find-testing-lab.md        ← locate the right lab for your product
    check-certification-path.md ← product → required certs → labs → timeline
    estimate-bom-cost.md       ← rough BOM costing for Indian suppliers
    find-pcb-fab.md            ← find PCB fabs by spec (layer count, qty, turnaround)
    source-components.md       ← find distributors for a component
    navigate-bis-certification.md ← BIS/ISI mark step-by-step
  agents/
    research-and-contribute.md ← full loop: research gaps → add resources → PR
```

Each skill works with **Claude Code** (`/skill hardware/find-testing-lab`) and **OpenAI Codex**.  
Security status shown in [skills/README.md](skills/README.md).

---

## ✍️ Contribute

### In 30 seconds

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/data && cd data

# 2. Add your resource (open the right .md file, append a ### section)
# Template:
### Lab Name
| Field | Value |
|-------|-------|
| **Slug** | `lab-name-city` |
| **Location** | City, State |
| **Access** | L1 — Open (fee-based) |
| **Website** | https://lab.example.com |
| **Tags** | emc, nabl |

One sentence description.
---

# 3. Validate
python3 scripts/validate_md.py resources/

# 4. PR
git checkout -b add-my-lab && git add . && git commit -m "data: add Lab Name" && gh pr create
```

### Contribute with your LLM

Let Claude Code (or any agent) do the research and open the PR for you:

```bash
# With Claude Code (claude.ai/code):
# 1. Install this repo as an MCP server (see above)
# 2. Run: /skill agents/research-and-contribute
# 3. Tell it: "Find testing labs in Jaipur, add them, open a PR"

# With GitHub CLI (any LLM):
gh workflow run agent-submit.yml \
  --repo hardstack-india/data \
  --field resource_type=testing-lab \
  --field entries_json='[{"name":"...","slug":"...","city":"Jaipur","state":"Rajasthan"}]' \
  --field source_urls="https://source.gov.in"
```

**You contribute with your tokens. We maintain the directory.**

### What we need most

| Priority | What | Why |
|----------|------|-----|
| 🔴 High | Testing labs in Jaipur, Lucknow, Indore | Zero coverage |
| 🔴 High | Biomedical testing facilities | High demand, low supply |
| 🟡 Med | Aerospace / DRDO labs with open tiers | Niche but important |
| 🟡 Med | Missing website URLs (~300 entries) | Verification gap |
| 🟢 Low | Coimbatore / Nashik / Vizag coverage | Good-to-have |

---

## 🗺️ Roadmap

| Status | Item |
|--------|------|
| ✅ Done | 1100+ resources, 24 categories |
| ✅ Done | MCP server (search, get, types, cities, grants) |
| ✅ Done | Markdown-first contribution workflow |
| ✅ Done | AI agent contribution guide + auto-validation CI |
| 🚧 Building | Skills library (hardware agent skills) |
| 🚧 Building | Agent auto-PR workflow (no fork needed) |
| 🚧 Building | Public read API (Cloudflare Worker, free tier) |
| 📋 Planned | Skill security scanner (prompt injection detection) |
| 📋 Planned | 7 new Tier-2 cities (full coverage) |
| 📋 Planned | Contributor leaderboard + attribution |
| 📋 Planned | Premium API tier (enriched data, unlimited) |
| 💭 Exploring | maker.express: agent-triggered hardware services |
| 💭 Exploring | Certification path wizard (AI-driven, product → cert → lab) |

---

## 📁 Repo structure

```
data/
├── resources/          ← 24 .md files, one per resource type
├── funding/            ← grants.md — funding opportunities
├── skills/             ← AI agent skills for hardware workflows
├── mcp/                ← MCP server (TypeScript, proxies live API)
├── schema/             ← resource.schema.json (JSON Schema)
├── scripts/            ← validate_md.py, generate_skills_index.py
└── .github/workflows/  ← validate-pr.yml, agent-submit.yml, sync-from-private.yml
```

**Not in this repo:** The web application, search engine, admin system, scrapers, and database are private. The data is open (CC BY 4.0); the platform is not.

---

## License

**Data** (`resources/`, `funding/`): [CC BY 4.0](LICENSE) — use, share, adapt with attribution.  
**Code** (`mcp/`, `scripts/`): MIT.

---

<div align="center">

Built by [Karan Rao](https://samaritan.bio) · Founding sponsors: [Samaritan Bio](https://samaritan.bio) · [Mekuva.com](https://mekuva.com)

[hardstack.sh](https://hardstack.sh) · [API](https://hardstack.sh/api) · [Donate](https://hardstack.sh/donate)

⭐ Star this repo if it saves you time

</div>
