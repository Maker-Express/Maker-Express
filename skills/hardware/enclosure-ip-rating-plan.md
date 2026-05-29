---
name: enclosure-ip-rating-plan
version: 1.0.0
description: Plan enclosure sealing, gasket, vent, and test strategy for IP-rated hardware products
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - enclosure
  - ip-rating
  - mechanical
  - testing
security_status: community
verified_by: maintainer
last_reviewed: 2026-05-29
---

# Enclosure IP Rating Plan

## When to use
Use this for outdoor, industrial, medical, or field hardware where dust or water ingress can break the product. It turns vague IP goals into mechanical design requirements and test actions.

## Prompt template

```
Create an enclosure IP-rating plan for:
- Product: [PRODUCT_DESCRIPTION]
- Target rating: [IP_RATING]
- Environment: [INDOOR_OUTDOOR_RAIN_WASHDOWN_DUSTY_OTHER]
- Enclosure process: [INJECTION_MOULD_CNC_SHEET_METAL_3D_PRINT]
- Openings: [CONNECTORS_BUTTONS_DISPLAY_SPEAKERS_VENTS]
- Serviceability requirement: [SEALED_SERVICEABLE_FIELD_OPENABLE]
- City for test/vendor search: [CITY]

Produce:
1. Interpretation of [IP_RATING] as design requirements.
2. Seal architecture: gasket type, compression target, screw spacing, seam strategy.
3. Cable and connector sealing options.
4. Venting and pressure equalisation decision.
5. Prototype test plan before accredited IP testing.
6. Failure mode table for leaks and dust ingress.
7. Vendor or lab shortlist using search_resources for IP rating, environmental testing, and enclosure prototyping.
8. Design release checklist.

Return a table with Feature, Risk, Recommendation, Verification method.
```

## MCP tool calls
1. `search_resources(query="IP rating environmental testing", city="[CITY]", max_results=10)`
2. `search_resources(query="enclosure prototyping gasket", city="[CITY]", max_results=10)`
3. `get_resource(slug="[RESOURCE_SLUG]")`

## Example
Input: outdoor LoRa sensor node targeting IP65, plastic enclosure, two cable glands, field-serviceable battery.

Expected use: propose gasket compression strategy, cable gland checks, pre-test spray/dust screening, and lab shortlist.

## Notes
Do not overpromise IP ratings for 3D printed prototypes. Treat printed enclosures as geometry validation unless the process and seals are proven.
