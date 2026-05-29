---
name: battery-safety-certification
version: 1.0.0
description: Map battery-powered product risks to cell, pack, charger, transport, BIS, and export safety requirements
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - battery
  - safety
  - certification
  - compliance
security_status: community
verified_by: maintainer
last_reviewed: 2026-05-29
---

# Battery Safety Certification

## When to use
Use this when a product contains rechargeable or replaceable batteries and needs safe design, test planning, shipping readiness, or certification guidance. It is useful before choosing cells, chargers, and pack vendors.

## Prompt template

```
Create a battery safety and certification plan for:
- Product: [PRODUCT_DESCRIPTION]
- Battery chemistry: [LI_ION_LFP_NIMH_PRIMARY_OTHER]
- Cell format and capacity: [CELL_FORMAT_CAPACITY]
- Pack configuration: [SERIES_PARALLEL]
- Charging method: [USB_C_DC_ADAPTER_DOCK_SOLAR_OTHER]
- Target market: [INDIA_EU_US_GLOBAL]
- Shipping mode: [AIR_ROAD_SEA]
- City for testing/vendor search: [CITY]

Cover:
1. Main design hazards: overcharge, overdischarge, short, thermal runaway, mechanical abuse.
2. Protection architecture: BMS, pack fuse, NTC, charger IC, enclosure venting, creepage.
3. Test families: cell, pack, charger, product safety, transport.
4. Documentation pack: cell datasheet, MSDS, UN transport summary, schematic, pack drawing.
5. Supplier questions for cell and pack vendors.
6. Lab search using search_resources for battery, safety, environmental, and transport testing near [CITY].
7. Decision table for in-house pack versus certified pack vendor.

Return a concise checklist with must-do, should-do, and optional items.
```

## MCP tool calls
1. `search_resources(query="battery safety testing", city="[CITY]", max_results=10)`
2. `search_resources(query="environmental testing battery transport", city="[CITY]", max_results=10)`
3. `get_resource(slug="[RESOURCE_SLUG]")`

## Example
Input: handheld medical accessory, single-cell Li-ion, USB-C charging, sold in India and EU.

Expected use: flag charger and transport risks, identify required documents, and shortlist labs for safety and environmental testing.

## Notes
Battery safety advice must be conservative. If pack or charger design is uncertain, recommend a certified pack and formal electrical safety review.
