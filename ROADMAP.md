# Roadmap

Status key: `Live`, `Building`, `Planned`, `Exploring`.

Maker Express and Hardstack share one data, MCP, and skills core. Maker Express is the broad builder-facing surface; Hardstack is the hardtech-facing front door. The roadmap is global, with India-first depth and explicit BRICS expansion.

## Data Coverage

| Status | Item |
|---|---|
| Live | Public resource catalogs across labs, makerspaces, suppliers, consultants, events, grants, and investors. |
| Live | Shared taxonomy for both maker.express and hardstack.xyz. |
| Building | Data quality passes for duplicates, stale URLs, misclassified resource types, and product-page entries. |
| Building | Grants/funding expansion and better funding-first discovery. |
| Planned | China and Russia resource research pipelines, held behind admin feature flags until data quality is sufficient. |
| Planned | Global sourcing routes for Indian builders buying from China/Russia and international buyers sourcing from India. |
| Planned | More source-backed CAD model, open-source tool, fabrication, and testing datasets. |

## MCP Server And API

| Status | Item |
|---|---|
| Live | MCP tools: `search_resources`, `find_labs_for_certification`, `list_grants`, `get_resource_details`, `search_events`, `get_platform_stats`. |
| Live | Skill discovery tools: `list_skills`, `suggest_skills`, `list_github_resources`. |
| Live | Compatibility aliases: `get_resource`, `get_grants`, `list_resource_types`, `list_cities`. |
| Building | API key self-service, usage reporting, and developer account controls. |
| Building | Better staging-to-production gates for search/filter correctness and route reliability. |
| Planned | Vector search and hybrid ranking once cost and observability gates are clean. |
| Planned | Higher-rate developer tier with clearer rate limits and audit logs. |

## Skills Library

| Status | Item |
|---|---|
| Live | 30 first-party hardware skills covering labs, PCB, DFM, CAD, firmware, grants, robotics, field service, sourcing, and compliance. |
| Live | 2 agent skills for resource quality audit and research/contribution loops. |
| Live | 7 curated CAD community skills from `earthtojake/text-to-cad`, with visible attribution and pinned audit metadata. |
| Building | Public validation scripts for frontmatter, tool scope, and prompt-injection patterns. |
| Planned | 100+ skills across PCB, embedded, robotics, manufacturing, materials, testing, IP, and funding. |
| Planned | 1000-skill long-range taxonomy: 10 domains x 10 subdomains x 10 repeatable workflows. |

## GitHub Resources

| Status | Item |
|---|---|
| Live | 50+ curated hardware GitHub repositories and awesome-lists in MCP registry data. |
| Building | Public page and skill integration for curated repos. |
| Planned | Freshness checks for stars, license, archived status, and last meaningful commit. |
| Planned | Attribution-first catalog entries for CAD, mechanical, embedded, robotics, PCB, manufacturing, materials, testing, IP, and business resources. |

## Agent Contribution System

| Status | Item |
|---|---|
| Live | Markdown contribution workflow with validators. |
| Live | Public skills scanner and agent contribution docs. |
| Building | Safer automated data-review patches that never touch production until staging smoke passes. |
| Planned | Contributor attribution and review dashboard. |
| Planned | Auto-merge only for trivially verifiable corrections, such as broken-link replacements with evidence. |

## Platform And Community

| Status | Item |
|---|---|
| Live | Dual-brand public platform: maker.express and hardstack.xyz. |
| Building | Profile, bookmarks, likes, contributions, social links, and onboarding. |
| Building | Community page for maker groups, Reddit/Twitter/X communities, and relevant public forums. |
| Planned | Map-first discovery, proximity-aware search, and source-backed recommendations. |
| Planned | Community review signals with abuse controls. |
| Exploring | Agent-triggered hardware workflows: quote a PCB, prepare certification, compare labs, draft RFQ, and assemble evidence packs. |

## Production Quality Gates

Before promotion to production:

1. Public repo validators pass.
2. MCP build and smoke pass.
3. Web typecheck/build pass on the Ubuntu server.
4. Staging route smoke passes for both brands.
5. Search/filter smoke checks pass for representative cities, categories, modes, and empty-result fallbacks.
6. Production smoke passes after promotion.
7. Logs are collected into an evidence bundle for unresolved errors.

## How To Influence The Roadmap

Open an issue with a specific user problem, source links, and the category affected. High-signal data contributions and reproducible bugs move fastest.

- Maker Express: [https://maker.express](https://maker.express)
- Hardstack: [https://hardstack.xyz](https://hardstack.xyz)
- Issues: [../../issues](../../issues)
- Discussions: [../../discussions](../../discussions)
