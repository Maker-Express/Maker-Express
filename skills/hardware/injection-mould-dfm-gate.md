---
name: injection-mould-dfm-gate
version: 1.0.0
description: Review plastic parts before tooling with injection-mould DFM, draft, wall thickness, ribs, bosses, gates, and texture checks
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - injection-moulding
  - dfm
  - plastics
  - tooling
security_status: community
verified_by: maintainer
last_reviewed: 2026-05-29
---

# Injection Mould DFM Gate

## When to use
Use this before sending plastic enclosure or part CAD to a toolmaker. It catches common moulding issues that cause sink marks, warpage, undercuts, tooling cost overruns, and late redesign.

## Prompt template

```
Run an injection-mould DFM gate review for:
- Part or assembly: [PART_NAME]
- Material target: [MATERIAL]
- Size and wall thickness: [SIZE_AND_WALL]
- Cosmetic surfaces: [COSMETIC_AREAS]
- Internal features: [BOSSES_RIBS_SNAP_FITS]
- Expected quantity: [VOLUME]
- Tooling budget and timeline: [BUDGET_TIMELINE]
- City for toolmaker or DFM support: [CITY]

Review:
1. Wall thickness consistency and transition risks.
2. Draft angle by surface and texture requirement.
3. Rib, boss, snap-fit, and screw post geometry.
4. Undercuts, side actions, lifters, and tooling complexity.
5. Gate, ejector, parting line, and weld-line concerns.
6. Material shrinkage, warpage, and tolerance expectations.
7. Prototype-to-tooling evidence needed before release.
8. Toolmaker or DFM consultant search using search_resources near [CITY].

Return: go or no-go verdict, issue table, CAD changes, and RFQ packet checklist.
```

## MCP tool calls
1. `search_resources(query="injection moulding tooling DFM", city="[CITY]", max_results=10)`
2. `search_resources(query="plastic enclosure manufacturer", city="[CITY]", max_results=10)`
3. `get_resource(slug="[RESOURCE_SLUG]")`

## Example
Input: handheld ABS enclosure, two shells, snap fits, screws, light texture, first batch 2000 units.

Expected use: flag draft and boss geometry, propose DFM changes, and build a toolmaker RFQ checklist.

## Notes
If the CAD model is not available, state assumptions clearly and request wall thickness, draft, and section-view information.
