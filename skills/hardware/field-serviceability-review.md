---
name: field-serviceability-review
version: 1.0.0
description: Review hardware for maintainability, repair, replacement, diagnostics, spares, and field-service workflows before launch
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - serviceability
  - reliability
  - operations
  - hardware
security_status: community
verified_by: maintainer
last_reviewed: 2026-05-29
---

# Field Serviceability Review

## When to use
Use before pilot deployment or first customer shipments for equipment that may need repair, calibration, consumable replacement, or diagnostics outside the factory. It reduces downtime and support cost.

## Prompt template

```
Review field serviceability for:
- Product: [PRODUCT_DESCRIPTION]
- Deployment environment: [ENVIRONMENT]
- Expected installed base: [INSTALLED_BASE]
- Critical modules: [MODULE_LIST]
- Consumables or wear parts: [CONSUMABLES]
- Diagnostic interfaces: [DIAGNOSTIC_PORTS_LOGS]
- Service team capability: [IN_HOUSE_PARTNER_CUSTOMER]
- City or region for support partner search: [CITY_OR_REGION]

Assess:
1. Modules that should be replaceable versus factory-only repair.
2. Fastener, connector, seal, and access risks.
3. Built-in diagnostics and log capture requirements.
4. Spare parts kit and minimum stock.
5. Service documentation and training checklist.
6. Warranty and return-material workflow.
7. Local service, fabrication, or testing partners using search_resources.
8. Release blockers for pilot deployment.

Return a serviceability score, issue table, and launch-readiness verdict.
```

## MCP tool calls
1. `search_resources(query="hardware repair service fabrication", city="[CITY_OR_REGION]", max_results=10)`
2. `search_resources(query="testing calibration service", city="[CITY_OR_REGION]", max_results=10)`
3. `get_resource(slug="[RESOURCE_SLUG]")`

## Example
Input: deployed air-quality monitor with fan, filter, battery, and cellular modem in multiple cities.

Expected use: identify replacement modules, service interval, spares, log export, and city-level service partners.

## Notes
If opening the enclosure breaks a seal or calibration state, explicitly mark that action as factory-only unless a validated field procedure exists.
