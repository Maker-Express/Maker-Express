---
name: emc-precompliance-plan
version: 1.0.0
description: Build an EMC pre-compliance plan for electronics before formal lab testing, covering emissions, immunity, ESD, and design fixes
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - emc
  - compliance
  - electronics
  - testing
security_status: community
verified_by: maintainer
last_reviewed: 2026-05-29
---

# EMC Pre-compliance Plan

## When to use
Use this before booking expensive formal EMC or safety testing. It helps teams run a practical pre-scan, fix obvious emissions and immunity problems, and arrive at the lab with a stable test article.

## Prompt template

```
Create an EMC pre-compliance plan for:
- Product: [PRODUCT_DESCRIPTION]
- Power input: [MAINS_DC_BATTERY_USB]
- Switching converters and clocks: [FREQUENCIES]
- Cables and external ports: [PORT_LIST]
- Wireless radios: [RADIO_LIST]
- Target market: [INDIA_EU_US_OTHER]
- Planned certification: [BIS_CE_FCC_OTHER]
- City for lab search: [CITY]

Plan these sections:
1. Likely standards and test families.
2. Emissions risk map: clock edges, DC-DC converters, cable antennas, enclosure seams.
3. Immunity and ESD risk map by external port.
4. Low-cost pre-scan setup and required instruments.
5. Design changes to try before lab testing.
6. Formal lab shortlist using search_resources for EMC, NABL, BIS, CE, FCC, or ISO 17025 capability.
7. Evidence pack for the lab: schematics, BOM, layout stackup, firmware mode, cable setup, photos.
8. Pass or rework criteria.

Return: risk table, pre-scan checklist, lab shortlist, and next actions.
```

## MCP tool calls
1. `search_resources(query="EMC NABL ISO 17025", city="[CITY]", max_results=10)`
2. `search_resources(resource_type="testing-lab", city="[CITY]", max_results=10)`
3. `get_resource(slug="[LAB_SLUG]")`

## Example
Input: WiFi sensor gateway with buck converter, USB-C, 12 V input, export to EU and India.

Expected use: identify radiated emissions risks, ESD test setup, pre-scan plan, and labs that can support EMC plus safety testing.

## Notes
Do not claim a product is compliant based on pre-compliance testing. Treat pre-scan as risk reduction before accredited testing.
