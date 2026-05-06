---
name: find-pcb-fab
version: 1.0.0
description: Find PCB fabrication houses in India matched to your board specs and volume
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - pcb
  - fabrication
  - manufacturing
  - electronics
security_status: verified
verified_by: maintainer
last_reviewed: 2025-05-07
---

# Find PCB Fabrication House

## When to use
Use when selecting a PCB fab for prototype or production runs. Helps match board complexity,
volume, turnaround, and budget to the right vendor in India.

## Prompt template

```
I need a PCB fabrication house for the following specs:
- Board type: [single-layer / 2-layer / 4-layer / 6-layer+ / flex / rigid-flex / HDI]
- Quantity: [PROTOTYPE_QTY] prototypes, expected production: [PRODUCTION_QTY]
- Turnaround needed: [DAYS] days
- Special requirements: [impedance-control / blind-vias / buried-vias / ENIG / heavy-copper / none]
- Location preference: [CITY] or anywhere in India
- Budget sensitivity: [low / medium / high]

Search for PCB fabs:
search_resources(type="pcb-fab", city="[CITY]", limit=10)
Also search: search_resources(type="pcb-fab", limit=20)  — cast wider if city has few results

For each fab returned, call get_resource to check capabilities.

Present a ranked shortlist of 3–5 fabs with:
- Name + location
- Capabilities match (✅ / ⚠️ / ❌ for each requirement)
- Turnaround time
- Approx price range for prototype qty
- Website for quote

Also note:
- Which fabs offer PCB + assembly (SMT/THT) in one place
- Which have AS9100 / ISO 9001 (important for aerospace / medical)
- Which have export experience (useful if you need CE/UL approved fab)
```

## MCP tool calls
1. `search_resources(type="pcb-fab", city="[CITY]", limit=10)`
2. `search_resources(type="pcb-fab", limit=20)` — if city has <3 results
3. `get_resource(slug="[fab.slug]")` for top 3–5 results

## Quick decision guide

| Need | Go to |
|------|-------|
| 1–10 prototypes, fast (2–3 days) | PCBWay / JLCPCB (China, online) — not in this directory |
| 10–100 pcs, India delivery, 5–7 days | Mumbai / Bangalore fabs with online ordering |
| 100–1000 pcs, quality | Established Bangalore or Pune fabs |
| 1000+ pcs, high reliability | ISO-certified fabs in Bangalore / Chennai |
| Medical / aerospace grade | AS9100 certified only |
| Flex / rigid-flex | Very few in India — check Bangalore specifically |
| PCB + SMT assembly combo | Look for "EMS" type or fabs that mention assembly |

## Example

Input: "4-layer board, 50 prototypes, ENIG finish, impedance control, Bangalore preferred, 10-day turnaround"

```
search_resources(type="pcb-fab", city="Bangalore", limit=10)
get_resource(slug="[top-3-results]")
```

Filter for: 4-layer capability, ENIG finish, impedance control in equipment/tags.
Present top 3 with capability match table.

## Notes
- Most India fabs require gerber + drill files; some accept KiCad/Altium native
- Always ask about IPC class: Class 2 (commercial), Class 3 (mil/medical) — costs differ
- For prototypes under 10 pcs, JLCPCB/PCBWay still often faster/cheaper even with shipping
- Turnaround stated by fabs = manufacturing time; add 2–5 days for shipping within India
- IPC-6012 / IPC-A-600 certification of the fab = quality assurance, not just the board
