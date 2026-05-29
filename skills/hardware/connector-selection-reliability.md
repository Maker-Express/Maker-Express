---
name: connector-selection-reliability
version: 1.0.0
description: Select reliable connectors for hardware products using current, vibration, mating-cycle, environment, and sourcing constraints
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - connectors
  - reliability
  - sourcing
  - mechanical
security_status: community
verified_by: maintainer
last_reviewed: 2026-05-29
---

# Connector Selection Reliability

## When to use
Use when a product has cables, board-to-board links, field-service connectors, high current, vibration, ingress risk, or recurring connector failures. It converts use conditions into connector selection criteria.

## Prompt template

```
Recommend connector options for:
- Product: [PRODUCT_DESCRIPTION]
- Interface: [POWER_SIGNAL_RF_BOARD_TO_BOARD_WIRE_TO_BOARD]
- Current and voltage: [CURRENT_VOLTAGE]
- Signal speed or protocol: [PROTOCOL_OR_SPEED]
- Mating cycles: [CYCLES]
- Environment: [INDOOR_OUTDOOR_VIBRATION_DUST_WATER_MEDICAL]
- Size constraints: [MECHANICAL_LIMITS]
- Production volume: [VOLUME]
- City for sourcing help: [CITY_OR_REMOTE]

Evaluate:
1. Required connector class and locking method.
2. Contact plating, current derating, creepage, and strain relief.
3. Vibration and serviceability risks.
4. Alternatives if the preferred connector is unavailable.
5. Assembly and test implications.
6. Sourcing path using search_resources for component suppliers or distributors near [CITY_OR_REMOTE].
7. Validation checklist: pull test, cycle test, thermal rise, ingress, ESD where relevant.

Return: top connector families, rejection criteria, sourcing path, and validation plan.
```

## MCP tool calls
1. `search_resources(resource_type="component-supplier", city="[CITY_OR_REMOTE]", max_results=10)`
2. `search_resources(query="connector distributor", city="[CITY_OR_REMOTE]", max_results=10)`
3. `get_resource(slug="[SUPPLIER_SLUG]")`

## Example
Input: outdoor sensor, 24 V power, RS485, IP65 cable connection, 500 units per year.

Expected use: compare M8/M12, sealed circular, gland plus terminal block, and local sourcing options.

## Notes
Avoid recommending generic jumper or hobby connectors for production equipment unless the use case is explicitly low-risk and internal-only.
