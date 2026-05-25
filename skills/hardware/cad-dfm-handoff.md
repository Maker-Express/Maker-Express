---
name: cad-dfm-handoff
version: 1.0.0
description: Convert CAD concepts into manufacturing-ready DFM handoff packets for CNC, sheet-metal, and injection moulding
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - cad
  - dfm
  - manufacturing
  - handoff
security_status: unverified
verified_by: ""
last_reviewed: ""
---

# CAD DFM Handoff

## When to use
Use this when a design is past ideation and needs a reliable manufacturing handoff. The skill creates a release checklist and pairs it with a service-partner shortlist for execution.

## Prompt template

```
I need to prepare a CAD handoff for manufacturing.

Inputs:
- Product/part name: [PART_NAME]
- Primary process: [CNC / SHEET_METAL / INJECTION_MOULD / 3D_PRINT]
- Quantity band: [PROTO / PILOT / LOW_VOLUME / MASS]
- Material candidates: [MATERIALS]
- Critical features and tolerances: [FEATURES_AND_TOL]
- Surface/finish requirements: [FINISH_REQUIREMENTS]
- City preference: [CITY_OR_REMOTE]

Step 1: generate a DFM handoff checklist:
- geometry sanity
- draft/undercut checks (if moulding)
- bend and tooling rules (if sheet metal)
- machinability and tool access (if CNC)
- tolerance class and inspection notes
- GD&T callouts where needed
- drawing release readiness (title block, revision, units)

Step 2: find execution partners:
search_resources(type="manufacturer", city="[CITY_OR_REMOTE]", limit=20)
search_resources(type="prototyping-lab", city="[CITY_OR_REMOTE]", limit=15)

Step 3: for top options, call:
get_resource(slug="[PARTNER_SLUG]")

Return:
- release gate checklist
- vendor shortlist with fit/risk notes
- first RFQ package checklist
```

## MCP tool calls
1. `search_resources(type="manufacturer", city="[CITY_OR_REMOTE]", limit=20)`
2. `search_resources(type="prototyping-lab", city="[CITY_OR_REMOTE]", limit=15)`
3. `get_resource(slug="[PARTNER_SLUG]")`

## Example

Input: "Injection-moulded ABS enclosure, pilot batch of 500, Pune."

Output:
- DFM gate list with draft, rib thickness, and boss design checks
- RFQ package list including STEP, 2D drawings, tolerance notes, and finish specs
- ranked partner shortlist with lead-time and tooling-risk notes

## Sources and credit
- CAD workflow inspiration: [earthtojake/text-to-cad](https://github.com/earthtojake/text-to-cad)
- DFM/CAD open tooling sources:
  - [FreeCAD/FreeCAD](https://github.com/FreeCAD/FreeCAD)
  - [KiCad/kicad-source-mirror](https://github.com/KiCad/kicad-source-mirror)

## Notes
- Do not release CAD without explicit revision discipline and rollback path.
- Keep one owner for release packet integrity to avoid version drift.
