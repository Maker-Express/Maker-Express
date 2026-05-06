---
name: certification-path-india
version: 1.1.0
description: Map any hardware product to its required Indian certifications and the labs/bodies that handle each
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - certification
  - bis
  - compliance
  - regulatory
  - india
security_status: verified
verified_by: maintainer
last_reviewed: 2025-05-07
---

# Certification Path — India

## When to use
Use when a hardware founder or engineer needs to understand what certifications are required to
sell a product in India, in what order to get them, and which bodies/labs to approach.

## Prompt template

```
I am building [PRODUCT_DESCRIPTION]. It uses [KEY_TECHNOLOGIES/CONNECTIVITY].
Target market: India (domestic sale). [ALSO_EXPORT: yes/no — markets: COUNTRIES if yes]

Step 1 — Identify mandatory certifications:
Based on the product type, list ALL mandatory Indian certifications:
- BIS/ISI mark (IS standard number if known)
- WPC type approval (if WiFi/BT/Zigbee/cellular/any wireless)
- CDSCO (if medical device — Class A/B/C/D)
- AIS certification (if automotive)
- BEE star rating (if applicable — air conditioners, refrigerators, motors)
- Legal Metrology approval (if has a display showing measurements)
- Any state-level approvals (e.g., drug licence for medical)

Step 2 — Find the right bodies using MCP:
For each mandatory cert, search for the relevant certification body or testing lab:
search_resources(type="certification-body", tags="[CERT_TYPE]", limit=5)
search_resources(type="testing-lab", tags="[CERT_TYPE]", city="[CITY]", limit=5)

Step 3 — Build a timeline:
For each certification, provide:
- Estimated cost range (INR)
- Estimated duration (weeks)
- Prerequisites (what must be done first)
- Key documents required
- Common failure points / gotchas

Step 4 — Present as a structured roadmap:
Show the certs in dependency order (what must come before what).
Highlight the critical path (which cert takes longest / blocks everything else).
```

## MCP tool calls
1. `search_resources(type="certification-body", tags="bis", limit=5)`
2. `search_resources(type="certification-body", tags="wpc", limit=3)`
3. `search_resources(type="testing-lab", tags="bis,nabl", city="[CITY]", limit=5)`
4. `get_resource(slug="[relevant_body.slug]")` for key bodies

## Certification quick reference

| Product type | Mandatory certs | Typical path duration |
|-------------|-----------------|----------------------|
| Consumer electronics (no wireless) | BIS (CRS) | 3–6 months |
| Consumer electronics + WiFi/BT | BIS (CRS) + WPC | 4–8 months |
| Mobile phone / tablet | BIS (CRS) + WPC + ETA | 5–10 months |
| Medical device Class A | CDSCO registration | 2–4 months |
| Medical device Class B | CDSCO + BIS (if electrical) | 4–8 months |
| LED lighting | BIS (CRS) + BEE (if commercial) | 3–5 months |
| Electric vehicle charger | BIS (AIS) + BEE | 6–12 months |
| Industrial equipment | BIS (ISI) + safety testing | 4–9 months |

## Example

Input: "I'm building a WiFi+BLE connected smart home switch. Selling in India."

Output:
1. BIS CRS (IS 13252) — mandatory for all electronics
2. WPC Type Approval — mandatory for WiFi + BLE
3. Sequence: EMC + safety testing → BIS application → WPC application (can run parallel after testing)
4. Timeline: ~5 months, ₹2–5L total
5. Labs: STQC Bangalore (BIS-recognised, NABL), SAI Global (private, faster)
6. Critical path: BIS takes longest — start immediately

## Notes
- CRS = Compulsory Registration Scheme (BIS) — most electronics fall under this
- WPC approval is per frequency band — WiFi 2.4GHz, WiFi 5GHz, BT are separate approvals
- Self-declaration is allowed for some low-risk products under CRS — saves time
- Imported prototypes: apply for ETA (Equipment Type Approval) from WPC before importing
- BIS does NOT accept test reports older than 3 years
