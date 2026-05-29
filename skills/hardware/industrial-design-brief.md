---
name: industrial-design-brief
version: 1.0.0
description: Turn a hardware product idea into an industrial design brief with users, constraints, CMF, ergonomics, and prototype milestones
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - industrial-design
  - product-design
  - ux
  - prototyping
security_status: community
verified_by: maintainer
last_reviewed: 2026-05-29
---

# Industrial Design Brief

## When to use
Use before hiring a design studio or starting enclosure CAD. It creates a concise brief that aligns user needs, technical constraints, aesthetics, manufacturing path, and prototype milestones.

## Prompt template

```
Create an industrial design brief for:
- Product: [PRODUCT_DESCRIPTION]
- Users and setting: [USERS_CONTEXT]
- Core jobs to be done: [JOBS]
- Internal hardware constraints: [PCB_BATTERY_DISPLAY_SENSORS_CONNECTORS]
- Target manufacturing process: [PROCESS]
- Brand direction: [BRAND_WORDS]
- Ergonomic or clinical constraints: [ERGONOMIC_CONSTRAINTS]
- Prototype stage and deadline: [STAGE_DEADLINE]
- City or remote preference for design help: [CITY_OR_REMOTE]

Produce:
1. Product story in two sentences.
2. User and use-context map.
3. Hard constraints and soft preferences.
4. CMF direction and non-negotiables.
5. Prototype milestones from sketch to looks-like to works-like.
6. Manufacturing assumptions and risks.
7. Design consultant or prototype partner search using search_resources.
8. Brief checklist suitable to send to a studio.

Return a one-page brief plus open questions.
```

## MCP tool calls
1. `search_resources(query="industrial design product design consultant", city="[CITY_OR_REMOTE]", max_results=10)`
2. `search_resources(query="prototype enclosure CAD", city="[CITY_OR_REMOTE]", max_results=10)`
3. `get_resource(slug="[RESOURCE_SLUG]")`

## Example
Input: compact bench-top diagnostic accessory, used by lab technicians, needs clean medical-adjacent visual language.

Expected use: produce a design brief with CMF, ergonomics, enclosure constraints, and consultant shortlist.

## Notes
Separate aesthetic preference from engineering constraint. The brief should help a designer ask better questions, not lock premature styling decisions.
