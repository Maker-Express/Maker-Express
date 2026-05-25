<div align="center">

<img src="assets/brand/maker-express/logo.svg" alt="Maker Express" height="74" />
&nbsp;&nbsp;&nbsp;&nbsp;
<img src="assets/brand/hardstack/logo.svg" alt="Hardstack" height="74" />

# Maker Express + Hardstack Open Core

One platform. Two brand front doors. Same data plane, same MCP layer, same skills system.

[![Data License: CC BY 4.0](https://img.shields.io/badge/data-CC%20BY%204.0-2f855a?style=flat-square)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-ready-f59e0b?style=flat-square)](mcp/)
[![Skills](https://img.shields.io/badge/skills-agentic-0ea5e9?style=flat-square)](skills/)
[![Contributions](https://img.shields.io/badge/contributions-welcome-2563eb?style=flat-square)](CONTRIBUTING.md)

[Resources](resources/) · [Funding](funding/) · [MCP](mcp/) · [Skills](skills/) · [Roadmap](ROADMAP.md) · [Contribute](#contributing)

</div>

```text
███    ███  █████  ██   ██ ███████ ██████      ███████ ██   ██ ██████  ██████  ███████ ███████ ███████
████  ████ ██   ██ ██  ██  ██      ██   ██     ██       ██ ██  ██   ██ ██   ██ ██      ██      ██
██ ████ ██ ███████ █████   █████   ██████      █████     ███   ██████  ██████  █████   ███████ ███████
██  ██  ██ ██   ██ ██  ██  ██      ██   ██     ██       ██ ██  ██      ██   ██ ██           ██      ██
██      ██ ██   ██ ██   ██ ███████ ██   ██     ███████ ██   ██ ██      ██   ██ ███████ ███████ ███████

                                           ×

██   ██  █████  ██████  ██████  ███████ ████████  █████   ██████ ██   ██
██   ██ ██   ██ ██   ██ ██   ██ ██         ██    ██   ██ ██      ██  ██
███████ ███████ ██████  ██   ██ ███████    ██    ███████ ██      █████
██   ██ ██   ██ ██   ██ ██   ██      ██    ██    ██   ██ ██      ██  ██
██   ██ ██   ██ ██   ██ ██████  ███████    ██    ██   ██  ██████ ██   ██
```

## Dual-Brand Model

| Brand | URL | Positioning | Backend |
|---|---|---|---|
| Maker Express | [maker.express](https://maker.express) | discovery + action layer for builders | shared |
| Hardstack | [hardstack.xyz](https://hardstack.xyz) | hardtech-first navigation and identity | shared |

Both brands run on the same core repository and shared infrastructure. Branding is runtime-selected, not forked.

## What Is In This Repo

- public hardware directory data across labs, suppliers, grants, investors, makerspaces, services
- funding catalogs and source-backed grant references
- MCP package for AI-agent retrieval workflows
- skills library for repeatable maker operations
- validators and tests used in CI and agent pipelines

Production web runtime, admin internals, and private ops stay in `Maker-Express/Main` (private).

## Repository Layout

```text
public-repo/
├── assets/brand/   # Maker Express + Hardstack logos used in docs
├── resources/      # Resource catalogs by type
├── funding/        # Grants and funding catalogs
├── mcp/            # MCP package and docs
├── skills/         # Agent workflows and prompts
├── schema/         # Canonical resource schema
├── scripts/        # Validation and maintenance automation
├── tests/          # Data/script tests
└── README.md
```

## MCP + Skills (Core Capability)

This repository is intentionally agent-ready:

- MCP server package for structured retrieval and tool routing
- skills library for sourcing, compliance, prototyping, and data-audit workflows
- contributor automation scripts for validation and PR hygiene

Start here:

- [mcp/README.md](mcp/README.md)
- [skills/README.md](skills/README.md)
- [AGENT_CONTRIBUTING.md](AGENT_CONTRIBUTING.md)

## Quick Start

```bash
git clone https://github.com/Maker-Express/Maker-Express.git
cd Maker-Express
python3 scripts/validate_md.py resources/
python3 scripts/check_skills.py
```

MCP package build:

```bash
cd mcp
npm install
npm run build
```

## Data Contract

Resources are normalized with fields including:

- `name`, `slug`, `type`
- `city`, `state`, `country`
- `categories`, `tags`, `access_level`
- `website`, `description`, `verified`

Canonical schema: [schema/resource.schema.json](schema/resource.schema.json)

## Contributing

Read:

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [AGENT_CONTRIBUTING.md](AGENT_CONTRIBUTING.md)

Contribution expectations:

1. source-backed entries only
2. no placeholders
3. consistent taxonomy and slugs
4. validators/tests passing before PR

## Platform Links

- Maker Express: [https://maker.express](https://maker.express)
- Hardstack: [https://hardstack.xyz](https://hardstack.xyz)
- Sponsor: [https://samaritan.bio](https://samaritan.bio)
- Sponsor: [https://mekuva.com](https://mekuva.com)

## License

- Data: [CC BY 4.0](LICENSE)
- Code/scripts: package-level licensing as documented

<div align="center">

Built for makers, operators, and agent workflows. PRs welcome.

</div>
