# Roadmap

> ✅ Live · 🚧 Building · 📋 Planned · 💭 Exploring

---

## Data coverage

| Status | Item |
|--------|------|
| ✅ | 1,100+ resources across 24 categories |
| ✅ | Full coverage: Bangalore, Mumbai, Delhi, Pune, Chennai, Hyderabad |
| ✅ | Grants & government funding schemes |
| 🚧 | Tier-2 city expansion: Jaipur, Lucknow, Indore, Bhopal, Coimbatore, Nashik, Vizag |
| 📋 | Biomedical testing facilities |
| 📋 | Aerospace and DRDO labs with open access tiers |
| 📋 | Missing website URLs (~300 entries need verification) |
| 📋 | Equipment lists per lab |
| 📋 | Certification timeline data |

---

## MCP server & API

| Status | Item |
|--------|------|
| ✅ | MCP server: `search_resources`, `get_resource`, `list_resource_types`, `list_cities`, `get_grants` |
| ✅ | Public REST API (read-only, free tier 1,000 req/day) |
| 🚧 | API key self-registration at hardstack.sh/developers |
| 📋 | Semantic search via pgvector embeddings |
| 📋 | `find_components` tool — Nexar/Mouser component sourcing |
| 📋 | `list_makerspaces_near` tool — PostGIS proximity search |
| 📋 | Premium API tier (higher rate limits, enriched data) |

---

## Skills library

| Status | Item |
|--------|------|
| ✅ | `find-testing-lab` — locate the right lab by cert type and city |
| ✅ | `certification-path-india` — product → BIS/WPC/CDSCO path + timeline |
| ✅ | `find-pcb-fab` — match PCB specs to fabs |
| ✅ | `3d-print-process-selector` — FDM/SLA/SLS/MJF/DMLS selection |
| ✅ | `dfm-review` — Design for Manufacturability review |
| ✅ | `pcb-design-review` — PCB schematic + layout + SI review |
| ✅ | `source-components-india` — find distributors, assess supply risk |
| ✅ | `prototype-to-production` — EVT→DVT→PVT roadmap with vendors + grants |
| ✅ | `research-and-contribute` — autonomous gap research + PR contribution loop |
| ✅ | `estimate-bom-cost` — rough BOM costing for Indian market |
| ✅ | `navigate-bis-certification` — step-by-step BIS/ISI mark process |
| ✅ | `supply-chain-risk-india` — assess single-source and import risks |
| ✅ | `export-compliance` — CE, FCC, and export requirements for India-made products |
| ✅ | `find-incubator-accelerator` — match startup stage to right program |
| ✅ | `medical-device-pathway` — CDSCO Class A/B/C device pathway |
| ✅ | `audit-resource-quality` — agent skill to verify existing entries |

---

## Agent contribution system

| Status | Item |
|--------|------|
| ✅ | Manual PR contribution workflow |
| ✅ | `validate_md.py` local validation script |
| ✅ | CI security scanner for submitted skills |
| 🚧 | `agent-submit.yml` — `workflow_dispatch` for LLM-triggered PRs (no fork needed) |
| 📋 | Contributor attribution + leaderboard |
| 📋 | Auto-merge for trivially verifiable corrections (website URL updates) |

---

## Platform & community

| Status | Item |
|--------|------|
| ✅ | GitHub-browsable Markdown data |
| 📋 | Resource comments/reviews via Giscus |
| 📋 | Map view — labs and fabs near you (Leaflet + OpenStreetMap) |
| 📋 | maker.express — agent-triggered hardware services (print a part, order a PCB) |
| 💭 | Certification path wizard — AI-driven, product → cert → recommended lab |
| 💭 | Supply chain risk dashboard — import dependency tracking |

---

## How to influence the roadmap

Open an issue with the label `roadmap` and describe what you need.  
High-demand items move up. Items backed by data contributions move fastest.

[hardstack.sh](https://hardstack.sh) · [Issues](../../issues) · [Discussions](../../discussions)
