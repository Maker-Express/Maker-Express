<div align="center">

# Maker Express Open Directory

Open hardware ecosystem data, MCP tools, and contribution workflows used by:

**[maker.express](https://maker.express)** · **[hardstack.xyz](https://hardstack.xyz)**

[![Data License: CC BY 4.0](https://img.shields.io/badge/data-CC%20BY%204.0-2f855a?style=flat-square)](LICENSE)
[![Contributions](https://img.shields.io/badge/contributions-welcome-2563eb?style=flat-square)](CONTRIBUTING.md)
[![MCP](https://img.shields.io/badge/MCP-ready-f59e0b?style=flat-square)](mcp/)

[Browse Data](resources/) · [MCP](mcp/) · [Skills](skills/) · [Contribute](#contributing) · [Roadmap](ROADMAP.md)

</div>

---

## Overview

This repository contains the public layer of the Maker Express ecosystem:

- curated hardware resources (labs, manufacturers, suppliers, grants, accelerators, and more)
- MCP server package for AI agents
- reusable hardware skills/prompts
- validation scripts and contribution workflows

The production web apps, internal admin tooling, and private infrastructure live in separate private repositories.

---

## Who This Helps

- hardware founders looking for manufacturing/testing partners
- student makers and research teams
- operators mapping grants, facilities, and service providers
- AI agents that need structured hardware ecosystem data

---

## Repository Layout

```text
public-repo/
├── resources/      # Public resource catalogs by type
├── funding/        # Grant and funding catalogs
├── mcp/            # MCP server package + docs
├── skills/         # Agent-ready hardware skill docs
├── schema/         # Resource schema
├── scripts/        # Validation and maintenance scripts
├── tests/          # Data/script checks
└── README.md
```

---

## Data Model (At a Glance)

Each resource is normalized for search/discovery with fields such as:

- `name`
- `slug`
- `type`
- `city`, `state`, `country`
- `website`
- `categories`
- `tags`
- `access_level`
- `description`

See [schema/resource.schema.json](schema/resource.schema.json) for canonical shape.

---

## Quick Start

```bash
git clone https://github.com/Maker-Express/Maker-Express.git
cd Maker-Express
```

### Validate Resource Files

```bash
python3 scripts/validate_md.py resources/
```

### Work With MCP Package

```bash
cd mcp
npm install
npm run build
```

See [mcp/README.md](mcp/README.md) for Claude/Codex/Cursor setup.

---

## Contributing

Please read:

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [AGENT_CONTRIBUTING.md](AGENT_CONTRIBUTING.md)

Typical flow:

1. fork and branch
2. add/update entries in `resources/` or `funding/`
3. run validators
4. open PR with source references

Contribution quality standards:

- no placeholders
- source-backed entries
- consistent slugs and categories
- valid URLs and metadata

---

## MCP + Skills

This repo ships both:

- **MCP server** for structured search/retrieval
- **skills library** for repeatable hardware workflows (certification, sourcing, lab selection, etc.)

Start from:

- [mcp/README.md](mcp/README.md)
- [skills/README.md](skills/README.md)

---

## Platform Links

- Maker Express: [https://maker.express](https://maker.express)
- Hardstack: [https://hardstack.xyz](https://hardstack.xyz)
- Sponsor: [https://samaritan.bio](https://samaritan.bio)

---

## License

- Data: [CC BY 4.0](LICENSE)
- Code/scripts in this repository: MIT-compatible as documented per package

---

<div align="center">

If this repo helps your build process, star it and share improvements.

</div>
