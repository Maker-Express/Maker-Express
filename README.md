<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/brand/maker-express/logo-single-light.svg">
  <img src="assets/brand/maker-express/logo-single-dark.svg" alt="Maker Express" width="430">
</picture>
&nbsp;&nbsp;&nbsp;
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/brand/hardstack/logo-single-light.svg">
  <img src="assets/brand/hardstack/logo-single-dark.svg" alt="Hardstack" width="330">
</picture>

# Maker Express + Hardstack Open Core

One hardware ecosystem platform. Two public brands. One shared data, MCP, and skills core.

[![Data License: CC BY 4.0](https://img.shields.io/badge/data-CC%20BY%204.0-2f855a?style=flat-square)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-13%20tools-f59e0b?style=flat-square)](mcp/)
[![Skills](https://img.shields.io/badge/skills-39%20catalogued-0ea5e9?style=flat-square)](skills/)
[![Contributions](https://img.shields.io/badge/contributions-source%20backed-2563eb?style=flat-square)](CONTRIBUTING.md)

[Resources](resources/) · [Funding](funding/) · [MCP](mcp/) · [Skills](skills/) · [Docs](docs/README.md) · [Roadmap](ROADMAP.md) · [Contribute](CONTRIBUTING.md)

</div>

```text
+----------------------+----------------------+
|   MAKER.EXPRESS      |      HARDSTACK       |
|   discover, build    |      hard tech       |
+----------+-----------+-----------+----------+
           shared data + MCP + skills
```

## What This Repo Is

This is the public/open-core surface for the hardware directory:

- public resource and funding catalogs
- MCP server package for AI-agent access
- reusable hardware workflow skills
- curated hardware GitHub resources and attribution metadata
- validators and contribution tools for high-signal public updates

Private runtime, admin tools, secrets, deployment automation, and verification traces stay in [Maker-Express/Main](https://github.com/Maker-Express/Main).

## Live Brands

| Brand | URL | Role | Core |
|---|---|---|---|
| Maker Express | [maker.express](https://maker.express) | broad builder discovery, action, and community | shared |
| Hardstack | [hardstack.xyz](https://hardstack.xyz) | hardtech-focused front door | shared |

The websites can look and speak differently, but they use the same resource database, APIs, MCP tools, and skill catalog.

## Agent Interface

The repo is designed so agents can work with hardware data safely:

| Surface | What It Provides |
|---|---|
| [mcp/](mcp/) | 13 registered MCP tools, including search, grants, stats, skills, and GitHub resources. |
| [skills/](skills/) | 30 first-party hardware skills, 2 agent skills, and 7 curated community CAD skills. |
| [AGENT_CONTRIBUTING.md](AGENT_CONTRIBUTING.md) | Rules for source-backed agent contributions. |
| [schema/](schema/) | Resource schema used by validators and imports. |
| [scripts/](scripts/) | Public validation and maintenance scripts. |

## Quick Check

```bash
git clone https://github.com/Maker-Express/Maker-Express.git
cd Maker-Express
python3 scripts/validate_md.py resources/ funding/
python3 scripts/check_skills.py
```

MCP package:

```bash
cd mcp
npm install
npm run build
npm run smoke
```

## Quality Bar

Contributions should be useful to a real builder, not just fill rows:

1. include source links and evidence
2. avoid placeholders and invented contact details
3. use the existing taxonomy and slug style
4. keep attribution visible for third-party material
5. run validators before opening a PR

## Useful Links

- [Skills index](skills/README.md)
- [MCP setup](mcp/README.md)
- [Repository structure](docs/repository-structure.md)
- [Data model](docs/data-model.md)
- [Verification boundary](docs/skills-verification-boundary.md)
- [Roadmap](ROADMAP.md)

## Sponsors

Core sponsor links:

- [Samaritan Bio](https://samaritan.bio)
- [Mekuva](https://mekuva.com)

## License

- Public data and skill content: [CC BY 4.0](LICENSE)
- MCP and scripts: MIT, as noted in [LICENSE](LICENSE)

<div align="center">

Inspired by makers and doers.

</div>
