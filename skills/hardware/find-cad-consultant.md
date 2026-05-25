---
name: find-cad-consultant
version: 1.0.0
description: Find CAD design consultants and product-design studios by domain, deliverable type, and city
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
  - industrial-design
  - product-design
  - consulting
security_status: unverified
verified_by: ""
last_reviewed: ""
---

# Find CAD Consultant

## When to use
Use this skill when a team needs external CAD support for mechanical design, enclosure design, or production drawings. It helps shortlist consultants based on domain fit, required CAD stack, and manufacturing handoff quality.

## Prompt template

```
I need help finding CAD consultants.

Project context:
- Product category: [DEVICE_TYPE]
- Domain: [MEDTECH / ROBOTICS / CONSUMER / INDUSTRIAL / OTHER]
- Deliverable needed: [CONCEPT_CAD / PRODUCTION_CAD / DRAWINGS / DFM_REVIEW]
- CAD stack preference: [FUSION360 / SOLIDWORKS / ONESHAPE / FREECAD / NO_PREFERENCE]
- Materials/process: [INJECTION_MOULD / CNC / SHEET_METAL / 3D_PRINT / MIXED]
- City preference: [CITY_OR_REMOTE]
- Timeline: [DAYS_OR_WEEKS]
- Budget level: [LOW / MID / HIGH]

Step 1:
search_resources(type="consultant", city="[CITY_OR_REMOTE]", limit=25)
search_resources(type="prototyping-lab", city="[CITY_OR_REMOTE]", limit=15)

Step 2:
For top candidates, call get_resource(slug="[CANDIDATE_SLUG]") and extract:
- CAD/manufacturing capabilities
- domain fit
- responsiveness signals
- website/contact quality

Step 3:
Return a ranked shortlist with:
- best-fit reason
- risks
- first outreach message template
- interview checklist for CAD quality and handoff quality
```

## MCP tool calls
1. `search_resources(type="consultant", city="[CITY_OR_REMOTE]", limit=25)`
2. `search_resources(type="prototyping-lab", city="[CITY_OR_REMOTE]", limit=15)`
3. `get_resource(slug="[CANDIDATE_SLUG]")` for top candidates

## Example

Input: "Need enclosure CAD + production drawings for a handheld medical scanner in Bengaluru."

Output:
- 5-candidate shortlist
- risk notes around tolerance stack and moldability experience
- interview checklist covering revision speed, drawing standards, and DFM depth

## Sources and credit
- CAD skills inspiration: [earthtojake/text-to-cad](https://github.com/earthtojake/text-to-cad)
- CAD platform source repos:
  - [FreeCAD/FreeCAD](https://github.com/FreeCAD/FreeCAD)
  - [OpenSCAD/openscad](https://github.com/openscad/openscad)

## Notes
- Prefer consultants with demonstrated tolerance and manufacturing handoff experience, not only concept renders.
- Require sample drawing packs before finalizing.
