# Hardware Skills Library

Reusable AI agent skills for hardware, fabrication, funding, certification, and production workflows. They are designed for Claude Code, OpenAI Codex, Cursor, and MCP-compatible clients.

Current public catalog: 30 hardware skills, 2 agent skills, and 7 curated community CAD skills.

## How To Use

Claude Code or Codex with MCP:

```bash
# Install the MCP server from ../mcp, then use a skill by path.
/skill hardware/find-testing-lab
```

Any LLM with MCP:

1. Open the skill file.
2. Replace every [PLACEHOLDER] in the prompt template.
3. Run the listed MCP tools against the active directory endpoint.
4. Keep generated outputs source-backed and include links where the skill asks for evidence.

Direct MCP:

Call the MCP tools listed in each skill's `mcp_tools` frontmatter. The current server also keeps compatibility aliases for older skills: `get_resource`, `get_grants`, `list_resource_types`, and `list_cities`.

## Hardware Skills

| Skill | Description | MCP Tools | Status |
|---|---|---|---|
| [3d-print-process-selector](skills/hardware/3d-print-process-selector.md) | Select the optimal 3D printing process and material for a given part — FDM, SLA, SLS, MJF, DMLS | search_resources, get_resource | verified |
| [battery-safety-certification](skills/hardware/battery-safety-certification.md) | Map battery-powered product risks to cell, pack, charger, transport, BIS, and export safety requirements | search_resources, get_resource | community |
| [cad-dfm-handoff](skills/hardware/cad-dfm-handoff.md) | Convert CAD concepts into manufacturing-ready DFM handoff packets for CNC, sheet-metal, and injection moulding | search_resources, get_resource | unverified |
| [cad-tolerance-stack-check](skills/hardware/cad-tolerance-stack-check.md) | Review CAD assemblies for tolerance stack-up risk and recommend mitigation before tooling or pilot builds | search_resources, get_resource | unverified |
| [certification-path-india](skills/hardware/certification-path-india.md) | Map any hardware product to its required Indian certifications and the labs/bodies that handle each | search_resources, get_resource | verified |
| [connector-selection-reliability](skills/hardware/connector-selection-reliability.md) | Select reliable connectors for hardware products using current, vibration, mating-cycle, environment, and sourcing constraints | search_resources, get_resource | community |
| [dfm-review](skills/hardware/dfm-review.md) | Design for Manufacturability review — identify issues before sending to production | search_resources | verified |
| [emc-precompliance-plan](skills/hardware/emc-precompliance-plan.md) | Build an EMC pre-compliance plan for electronics before formal lab testing, covering emissions, immunity, ESD, and design fixes | search_resources, get_resource | community |
| [enclosure-ip-rating-plan](skills/hardware/enclosure-ip-rating-plan.md) | Plan enclosure sealing, gasket, vent, and test strategy for IP-rated hardware products | search_resources, get_resource | community |
| [estimate-bom-cost](skills/hardware/estimate-bom-cost.md) | Rough BOM cost estimation for Indian market — component, assembly, and NRE breakdown | search_resources, get_grants | unverified |
| [export-compliance](skills/hardware/export-compliance.md) | Export compliance for India-made hardware — CE, FCC, UKCA marks, dual-use controls, DGFT requirements, and SCOMET classification | search_resources, get_resource | unverified |
| [field-serviceability-review](skills/hardware/field-serviceability-review.md) | Review hardware for maintainability, repair, replacement, diagnostics, spares, and field-service workflows before launch | search_resources, get_resource | community |
| [find-cad-consultant](skills/hardware/find-cad-consultant.md) | Find CAD design consultants and product-design studios by domain, deliverable type, and city | search_resources, get_resource | unverified |
| [find-incubator-accelerator](skills/hardware/find-incubator-accelerator.md) | Match a hardware startup's stage and domain to the right Indian incubator, accelerator, or government program | search_resources, get_resource, get_grants | unverified |
| [find-pcb-fab](skills/hardware/find-pcb-fab.md) | Find PCB fabrication houses in India matched to your board specs and volume | search_resources, get_resource | verified |
| [find-testing-lab](skills/hardware/find-testing-lab.md) | Find the right testing lab for a hardware product given certification type and location | search_resources, get_resource | verified |
| [firmware-bringup-checklist](skills/hardware/firmware-bringup-checklist.md) | Plan first-power firmware bring-up for embedded hardware with boot, debug, peripheral, and fault-isolation gates | search_resources, get_resource | community |
| [grant-application-readiness](skills/hardware/grant-application-readiness.md) | Check whether a hardware startup is ready to apply for grants and prepare a focused evidence pack | search_resources, get_grants | community |
| [industrial-design-brief](skills/hardware/industrial-design-brief.md) | Turn a hardware product idea into an industrial design brief with users, constraints, CMF, ergonomics, and prototype milestones | search_resources, get_resource | community |
| [injection-mould-dfm-gate](skills/hardware/injection-mould-dfm-gate.md) | Review plastic parts before tooling with injection-mould DFM, draft, wall thickness, ribs, bosses, gates, and texture checks | search_resources, get_resource | community |
| [lab-visit-prep](skills/hardware/lab-visit-prep.md) | Prepare for a hardware testing, fabrication, or prototyping lab visit with artifacts, questions, acceptance criteria, and follow-up actions | search_resources, get_resource | community |
| [manufacturing-rfq-compare](skills/hardware/manufacturing-rfq-compare.md) | Build and compare manufacturing RFQs across vendors with cost, lead time, quality, terms, and risk scoring | search_resources, get_resource | community |
| [medical-device-pathway](skills/hardware/medical-device-pathway.md) | CDSCO regulatory pathway for Class A/B/C/D medical devices in India — MDR 2017 classification, registration, testing, and import/manufacturing licence | search_resources, get_resource, get_grants | unverified |
| [navigate-bis-certification](skills/hardware/navigate-bis-certification.md) | Step-by-step BIS/ISI mark and CRS (Compulsory Registration Scheme) process for electronics and electrical products sold in India | search_resources, get_resource | unverified |
| [open-source-cad-toolchain](skills/hardware/open-source-cad-toolchain.md) | Select a free or open-source CAD, CAM, simulation, and documentation toolchain for hardware teams and makers | search_resources, get_resource | community |
| [pcb-design-review](skills/hardware/pcb-design-review.md) | Structured PCB design review covering schematic correctness, layout quality, signal integrity, and manufacturability | search_resources | verified |
| [prototype-to-production](skills/hardware/prototype-to-production.md) | Plan the full journey from prototype to production-ready hardware — phases, milestones, and vendors | search_resources, get_resource, get_grants | verified |
| [robotics-actuator-selection](skills/hardware/robotics-actuator-selection.md) | Select motors, gearboxes, servos, drivers, and local suppliers for robotics and automation projects | search_resources, get_resource | community |
| [source-components-india](skills/hardware/source-components-india.md) | Find component distributors and stockists in India for a given component or BOM | search_resources, get_resource | verified |
| [supply-chain-risk-india](skills/hardware/supply-chain-risk-india.md) | Assess supply chain risks for an Indian hardware product — single-source components, import dependency, lead time exposure, and mitigation strategies | search_resources, get_resource | unverified |

## Agent Skills

| Skill | Description | MCP Tools | Status |
|---|---|---|---|
| [audit-resource-quality](skills/agents/audit-resource-quality.md) | Autonomous audit of existing directory entries — verify websites, flag stale data, identify missing fields, and open correction PRs | search_resources, get_resource, list_resource_types, list_cities | unverified |
| [research-and-contribute](skills/agents/research-and-contribute.md) | Full autonomous loop — research gaps in the directory, find real resources, validate, and open a PR | search_resources, list_cities, list_resource_types | verified |

## Curated Community Skills

These are third-party skills that remain credited to their original author, pinned to a reviewed commit, and listed only after audit metadata is present.

| Skill | Source | License | Audit |
|---|---|---|---|
| Cad | [earthtojake/text-to-cad](https://github.com/earthtojake/text-to-cad) by @earthtojake | MIT | APPROVED |
| Render | [earthtojake/text-to-cad](https://github.com/earthtojake/text-to-cad) by @earthtojake | MIT | APPROVED |
| Sdf | [earthtojake/text-to-cad](https://github.com/earthtojake/text-to-cad) by @earthtojake | MIT | APPROVED |
| Sendcutsend | [earthtojake/text-to-cad](https://github.com/earthtojake/text-to-cad) by @earthtojake | MIT | APPROVED |
| Srdf | [earthtojake/text-to-cad](https://github.com/earthtojake/text-to-cad) by @earthtojake | MIT | APPROVED |
| Step Parts | [earthtojake/text-to-cad](https://github.com/earthtojake/text-to-cad) by @earthtojake | MIT | APPROVED |
| Urdf | [earthtojake/text-to-cad](https://github.com/earthtojake/text-to-cad) by @earthtojake | MIT | APPROVED |

## Security Status

| Status | Meaning |
|---|---|
| `unverified` | Submitted or drafted, not yet maintainer-reviewed. |
| `community` | Maintainer/community-reviewed for basic safety and usefulness. |
| `verified` | Maintainer-reviewed and safe for normal public use. |
| `audited` | Passed deeper automated/security audit. |
| `third-party-verified` | External source is pinned and audit metadata is present. |

Public repo metadata is intentionally compact. Deep audit traces, staging evidence, and private verification notes stay in the private operations repository.

## Submit A Skill

1. Read [SKILL_SPEC.md](SKILL_SPEC.md).
2. Create `skills/hardware/your-skill.md` or `skills/agents/your-skill.md`.
3. Set `security_status: unverified`.
4. Run `python3 scripts/check_skills.py skills/your-skill.md`.
5. Open a PR with source links and a concrete example.

Quality bar: every skill needs frontmatter, a clear "When to use" section, a prompt template with `[PLACEHOLDERS]`, MCP tool calls where useful, and a realistic example.

## Roadmap

The next expansion targets embedded/firmware, PCB review, robotics, manufacturing, materials, IP, testing, global sourcing, and agent orchestration. See [../ROADMAP.md](../ROADMAP.md) and the private launch board for prioritization.
