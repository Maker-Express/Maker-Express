# 🧠 Hardware Skills Library

> Reusable AI agent skills for hardware, fabrication, and the Indian maker ecosystem.
> Compatible with Claude Code, OpenAI Codex, Cursor, and any MCP client.

---

## How to use a skill

**Claude Code:**
```bash
# Install the MCP server first (see root README)
# Then in Claude Code:
/skill hardware/find-testing-lab
```

**Any LLM with MCP:**
Open the skill file, copy the prompt template, replace [PLACEHOLDERS] with your context, and send to your LLM with the MCP server active.

**Direct MCP:**
Call the MCP tools listed in the skill's `mcp_tools` frontmatter directly.

---

## Skills index

### 🔬 Hardware domain skills

| Skill | Description | MCP Tools | Security |
|-------|-------------|-----------|----------|
| [find-testing-lab](hardware/find-testing-lab.md) | Find testing labs by cert type + city | search_resources, get_resource | ✅ verified |
| [certification-path-india](hardware/certification-path-india.md) | Product → BIS/WPC/CDSCO path + labs + timeline | search_resources, get_resource | ✅ verified |
| [find-pcb-fab](hardware/find-pcb-fab.md) | Match PCB specs to fabs — layers, volume, turnaround | search_resources, get_resource | ✅ verified |
| [3d-print-process-selector](hardware/3d-print-process-selector.md) | FDM/SLA/SLS/MJF/DMLS selection + material + vendor | search_resources, get_resource | ✅ verified |
| [dfm-review](hardware/dfm-review.md) | Design for Manufacturability review (PCB, injection mould, sheet metal) | search_resources | ✅ verified |
| [pcb-design-review](hardware/pcb-design-review.md) | PCB schematic + layout + SI + safety review | search_resources | ✅ verified |
| [source-components-india](hardware/source-components-india.md) | Find distributors + assess supply chain risk | search_resources, get_resource | ✅ verified |
| [prototype-to-production](hardware/prototype-to-production.md) | EVT→DVT→PVT→cert roadmap with vendors + grants | search_resources, get_resource, get_grants | ✅ verified |

### 🤖 Agent skills

| Skill | Description | Security |
|-------|-------------|----------|
| [research-and-contribute](agents/research-and-contribute.md) | Autonomous loop: find gaps → research → add resources → open PR | ✅ verified |

---

## Security status levels

| Status | Meaning |
|--------|---------|
| `unverified` | Community-submitted, not yet reviewed |
| `community` | Reviewed by community members, no deep audit |
| `verified` | Reviewed by maintainer — safe to use |
| `audited` | Full security audit + automated scan passed |

All submitted skills start as `unverified`. The CI scanner runs automatically on every PR.

---

## Submit a skill

1. Read [SKILL_SPEC.md](SKILL_SPEC.md) for the required format
2. Create `skills/hardware/your-skill.md` or `skills/agents/your-skill.md`
3. Set `security_status: unverified` in frontmatter
4. Validate: `python3 scripts/check_skills.py skills/your-skill.md`
5. Open a PR — the security scanner runs automatically

**Quality bar:** Skills must have a prompt template with `[PLACEHOLDERS]`, a concrete example, and a "When to use" section. See any existing skill for reference.

---

## Roadmap

- [ ] `estimate-bom-cost` — rough BOM costing for Indian market
- [ ] `navigate-bis-certification` — step-by-step BIS/ISI mark process
- [ ] `supply-chain-risk-india` — assess single-source and import risks
- [ ] `export-compliance` — CE, FCC, and export requirements for India-made products
- [ ] `find-incubator-accelerator` — match startup stage to right program
- [ ] `medical-device-pathway` — CDSCO Class A/B/C device pathway
- [ ] `audit-resource-quality` — agent skill to verify existing directory entries

Want to add a skill? Open an issue or PR.
