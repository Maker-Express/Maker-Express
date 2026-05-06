---
name: find-testing-lab
version: 1.0.0
description: Find the right testing lab for a hardware product given certification type and location
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - testing
  - certification
  - labs
  - nabl
security_status: verified
verified_by: maintainer
last_reviewed: 2025-05-07
---

# Find Testing Lab

## When to use
Use when you need to locate a testing lab for a specific certification or test type.
Works for EMC, safety, environmental, chemical, mechanical, biomedical, and type-approval testing.

## Prompt template

```
I need to find a testing lab in [CITY] (or nearby) for [PRODUCT_TYPE].
The required certification/test is: [CERTIFICATION_OR_TEST_TYPE].

Use the search_resources MCP tool:
1. Search with type="testing-lab", city="[CITY]", tags="[RELEVANT_TAGS]"
2. Also search with type="govt-lab" for the same city (government labs often have NABL accreditation)
3. For the top 3 results, call get_resource to fetch full details

Present results as:
- Lab name
- Location and access level (L0=open, L1=fee-based, L3=needs affiliation)
- Certifications/accreditations held
- Website
- Why it matches the requirement

Sort by: access level (most open first), then by relevance to [CERTIFICATION_OR_TEST_TYPE].
Note if any lab has NABL accreditation (required for test reports accepted by BIS/regulatory bodies).
Note if any lab has ISO 17025 (required for export certification).
```

## MCP tool calls
1. `search_resources(type="testing-lab", city="[CITY]", tags="[TAGS]", limit=10)`
2. `search_resources(type="govt-lab", city="[CITY]", limit=5)`
3. `get_resource(slug="[top_result.slug]")` — repeat for top 3

## Tag reference

| Test/Cert | Tags to use |
|-----------|-------------|
| EMC / RF emissions | `emc, rf, electromagnetic` |
| Product safety (electrical) | `safety, iec62368, iec60950` |
| BIS/ISI mark testing | `bis, nabl, type-approval` |
| Environmental (IP rating, temp, humidity) | `environmental, ip-rating, iec60529` |
| NABL accreditation check | `nabl` |
| Wireless / WPC type approval | `wpc, wireless, dot-approval` |
| CE marking (export to EU) | `ce, european, iso17025` |
| FCC (export to US) | `fcc, us-market` |
| Biomedical / CDSCO | `cdsco, medical, biomedical` |
| Automotive (AIS standards) | `automotive, ais` |

## Example

Input: "EMC testing lab in Bangalore for a WiFi IoT product"

```
search_resources(type="testing-lab", city="Bangalore", tags="emc,nabl", limit=10)
search_resources(type="govt-lab", city="Bangalore", limit=5)
get_resource(slug="stqc-bangalore")
```

Returns: STQC Bangalore (L1, NABL accredited, government, EMC + safety), 2 private labs

## Notes
- STQC (Software Technology Parks of India / DeitY labs) = most cost-effective for BIS testing
- NABL accreditation is non-negotiable for test reports submitted to BIS
- L3+ labs require institutional affiliation — typically need an IIT/NIT/industry letter
- For export certifications (CE, FCC): the lab must also have ISO 17025 *and* be recognised by the relevant foreign body — STQC is recognised for CE
- Turnaround varies: STQC 3–8 weeks, private NABL labs 1–3 weeks
