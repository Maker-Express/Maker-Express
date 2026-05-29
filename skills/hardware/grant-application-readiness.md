---
name: grant-application-readiness
version: 1.0.0
description: Check whether a hardware startup is ready to apply for grants and prepare a focused evidence pack
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_grants
tags:
  - grants
  - funding
  - startup
  - evidence
security_status: community
verified_by: maintainer
last_reviewed: 2026-05-29
---

# Grant Application Readiness

## When to use
Use when a hardware founder is deciding whether to apply for a grant, incubator program, or public funding scheme. It checks fit, evidence, and missing documents before spending time on an application.

## Prompt template

```
Assess grant readiness for:
- Startup or project: [PROJECT_DESCRIPTION]
- Domain: [DOMAIN]
- Stage: [IDEA_PROTOTYPE_PILOT_REVENUE]
- Indian entity status: [REGISTERED_PLANNED_NOT_YET]
- Team profile: [TEAM_SUMMARY]
- Funding sought: [AMOUNT_OR_RANGE]
- Evidence available: [PROTOTYPE_IP_CUSTOMERS_LOI_TEST_DATA]
- Preferred geography or incubator: [CITY_OR_REMOTE]

Do:
1. Identify matching grants or programs using get_grants.
2. Search for incubators or accelerators that fit the domain and stage.
3. Score readiness: eligibility, technical proof, market proof, budget clarity, compliance.
4. List missing documents and evidence.
5. Draft the application evidence pack outline.
6. Recommend apply now, wait and gather evidence, or pursue a different path.

Return a readiness score, top programs, blockers, and a two-week preparation plan.
```

## MCP tool calls
1. `get_grants(category="[DOMAIN]", open_only=true)`
2. `search_resources(query="incubator accelerator [DOMAIN]", city="[CITY_OR_REMOTE]", max_results=10)`

## Example
Input: medtech prototype with early lab tests, no company yet, looking for non-dilutive funding.

Expected use: identify grant paths, readiness blockers, and the minimum evidence pack before applying.

## Notes
Do not fabricate eligibility. If the current data is insufficient, return the questions that must be answered before submission.
