---
name: manufacturing-rfq-compare
version: 1.0.0
description: Build and compare manufacturing RFQs across vendors with cost, lead time, quality, terms, and risk scoring
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - rfq
  - manufacturing
  - procurement
  - vendor-selection
security_status: community
verified_by: maintainer
last_reviewed: 2026-05-29
---

# Manufacturing RFQ Compare

## When to use
Use when comparing quotes from PCB fabs, EMS providers, machine shops, 3D print services, moulders, or other production vendors. It forces apples-to-apples comparison and highlights hidden risk.

## Prompt template

```
Compare manufacturing RFQs for:
- Product or part: [PRODUCT_OR_PART]
- Process: [PCB_FAB_EMS_CNC_SHEET_METAL_INJECTION_MOULD_3D_PRINT]
- Quantity: [QUANTITY]
- Required deliverables: [DELIVERABLES]
- Quote inputs available: [QUOTE_SUMMARIES]
- Must-have constraints: [QUALITY_TIMELINE_CERTIFICATION_LOCATION]
- City or region preference: [CITY_OR_REGION]

Create:
1. A normalized RFQ comparison table.
2. Effective unit cost including tooling, setup, tax, shipping, rework, and payment terms.
3. Lead-time risk and capacity risk score.
4. Quality evidence checklist for each vendor.
5. Missing quote questions to send back.
6. A shortlist of additional vendors using search_resources if the comparison has fewer than three credible options.
7. Final recommendation with tradeoffs.

Return no more than three recommended next actions.
```

## MCP tool calls
1. `search_resources(query="[PROCESS] manufacturing", city="[CITY_OR_REGION]", max_results=10)`
2. `search_resources(resource_type="manufacturer", city="[CITY_OR_REGION]", max_results=10)`
3. `get_resource(slug="[VENDOR_SLUG]")`

## Example
Input: three quotes for 4-layer PCB assembly, 100 units, one vendor offers low cost but unknown test coverage.

Expected use: normalize total cost, flag missing test and rework terms, and suggest additional EMS vendors if needed.

## Notes
Do not choose only on price. Penalize missing quality documents, vague lead time, no inspection plan, or unclear rework responsibility.
