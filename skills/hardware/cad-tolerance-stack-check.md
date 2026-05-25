---
name: cad-tolerance-stack-check
version: 1.0.0
description: Review CAD assemblies for tolerance stack-up risk and recommend mitigation before tooling or pilot builds
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
  - tolerance
  - assembly
  - quality
security_status: unverified
verified_by: ""
last_reviewed: ""
---

# CAD Tolerance Stack Check

## When to use
Use when an assembly has fit/alignment risk and you want to catch tolerance stack issues before buying tooling or launching pilot runs. This skill helps identify stack-critical dimensions and mitigation options.

## Prompt template

```
Run a CAD tolerance stack check for this assembly:

- Product: [PRODUCT_NAME]
- Assembly type: [ENCLOSURE / MECHANISM / FIXTURE / ELECTROMECHANICAL]
- Critical interfaces: [INTERFACE_LIST]
- Current tolerance assumptions: [TOLERANCE_NOTES]
- Manufacturing process: [CNC / INJECTION_MOULD / SHEET_METAL / MIXED]
- Quantity stage: [PROTO / PILOT / PRODUCTION]
- City preference for review support: [CITY_OR_REMOTE]

Step 1: identify stack-critical dimensions:
- mating geometry
- hole/pin location chain
- datum strategy gaps
- thermal/shrink effects for selected process

Step 2: rate each interface:
- LOW / MEDIUM / HIGH stack risk
- likely failure mode
- detection method
- mitigation option

Step 3: find specialist support for review:
search_resources(type="consultant", city="[CITY_OR_REMOTE]", limit=15)
search_resources(type="manufacturer", city="[CITY_OR_REMOTE]", limit=15)
get_resource(slug="[SPECIALIST_SLUG]") for relevant options

Return:
- top 5 tolerance risks
- mitigation plan with expected impact
- review partner shortlist
```

## MCP tool calls
1. `search_resources(type="consultant", city="[CITY_OR_REMOTE]", limit=15)`
2. `search_resources(type="manufacturer", city="[CITY_OR_REMOTE]", limit=15)`
3. `get_resource(slug="[SPECIALIST_SLUG]")`

## Example

Input: "Portable analyzer enclosure with gasket compression and connector alignment, low-volume production."

Output:
- high-risk stack called out for PCB standoff height and connector datum mismatch
- mitigation with datum restructuring and tolerance redistribution
- shortlist of reviewers with enclosure + tooling experience

## Sources and credit
- Community CAD references: [earthtojake/text-to-cad](https://github.com/earthtojake/text-to-cad)
- CAD/open manufacturing source repos:
  - [FreeCAD/FreeCAD](https://github.com/FreeCAD/FreeCAD)
  - [openscad/openscad](https://github.com/openscad/openscad)

## Notes
- Always link tolerance assumptions to measurement plan and acceptance criteria.
- If stack risk is high, add pre-tooling prototype validation gate.
