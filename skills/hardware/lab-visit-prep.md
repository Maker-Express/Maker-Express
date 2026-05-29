---
name: lab-visit-prep
version: 1.0.0
description: Prepare for a hardware testing, fabrication, or prototyping lab visit with artifacts, questions, acceptance criteria, and follow-up actions
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - labs
  - prototyping
  - testing
  - operations
security_status: community
verified_by: maintainer
last_reviewed: 2026-05-29
---

# Lab Visit Prep

## When to use
Use before visiting a makerspace, test lab, PCB fab, fabrication shop, or incubator facility. It helps teams arrive with the right files, questions, safety context, and acceptance criteria.

## Prompt template

```
Prepare a lab visit plan for:
- Visit purpose: [TESTING_PROTOTYPING_FABRICATION_REVIEW]
- Product or part: [PRODUCT_OR_PART]
- Facility or city: [FACILITY_NAME_OR_CITY]
- Work needed: [WORK_NEEDED]
- Files and artifacts available: [FILES_AVAILABLE]
- Safety concerns: [SAFETY_CONCERNS]
- Decision needed after visit: [DECISION]

Create:
1. Pre-visit checklist: files, samples, fixtures, power supplies, adapters, IDs.
2. Technical questions to ask the facility.
3. Acceptance criteria for the visit.
4. Photos, measurements, and evidence to collect.
5. Follow-up email summary template.
6. If facility is not selected, use search_resources to shortlist alternatives.

Return a concise visit packet and fallback options.
```

## MCP tool calls
1. `search_resources(query="[WORK_NEEDED]", city="[FACILITY_NAME_OR_CITY]", max_results=10)`
2. `get_resource(slug="[FACILITY_SLUG]")`

## Example
Input: visit to a PCB assembly vendor for first pilot run review.

Expected use: prepare Gerbers, BOM, pick-and-place, test plan, sample boards, inspection questions, and follow-up format.

## Notes
Include safety and facility constraints early. Avoid arriving with incomplete files that prevent meaningful technical review.
