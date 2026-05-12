---
name: navigate-bis-certification
version: 1.0.0
description: Step-by-step BIS/ISI mark and CRS (Compulsory Registration Scheme) process for electronics and electrical products sold in India
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - bis
  - certification
  - compliance
  - india
  - regulatory
security_status: unverified
verified_by: ""
last_reviewed: ""
---

# Navigate BIS Certification (India)

## When to use
Use this skill when you need to certify a product for sale in India under BIS (Bureau of Indian Standards). Covers both the ISI mark scheme (IS standards for electrical/electronic goods) and the CRS (Compulsory Registration Scheme) for electronics. The skill maps your product to the right scheme, required IS standard, test parameters, approved labs, and timeline. Invoke before starting any testing to avoid expensive mistakes.

## Prompt template

```
You are guiding a hardware product through BIS certification for the Indian market.

Product: [PRODUCT_DESCRIPTION]
Product category: [CONSUMER_ELECTRONICS / ELECTRICAL_EQUIPMENT / TELECOM / MEDICAL / IT_EQUIPMENT / OTHER]
Wireless: [YES/NO — if YES, specify: WiFi / BLE / Zigbee / LoRa / Cellular / NFC]
Input power: [MAINS_230V / DC_LOW_VOLTAGE / BATTERY]
End user: [CONSUMER / INDUSTRIAL / B2B]

== STEP 1: Identify the right BIS scheme ==

Determine which scheme applies:

**CRS (Compulsory Registration Scheme)** — for electronics/IT products:
- Electronics (Mobile phones, tablets, laptops, power adapters, LED lights, etc.)
- All CRS products must comply before import/sale — self-declaration + BIS registration
- No ISI mark — just a registration number on the product

**ISI Mark Scheme** — for electrical goods:
- Wires/cables, switches, MCBs, transformers, meters, some appliances
- Third-party testing at BIS-notified lab + BIS factory inspection

**Both may apply** — e.g. a smart meter needs both electrical (ISI) and wireless (WPC) certification.

For the given product, identify:
- Which scheme(s) apply
- Applicable IS standard number(s)
- Whether import licence (DGFT) is also required

search_resources(type="certification-body", limit=10)

== STEP 2: Required IS standard and test parameters ==

For each applicable IS standard, list:
- Standard number and title
- Key test clauses (safety, EMC, RF, energy efficiency)
- Whether harmonised with IEC/EN standard (reduces testing burden if IEC tests already done)
- Self-declaration vs. third-party testing requirement

Common standards reference:
| Product type | IS standard | Notes |
|-------------|-------------|-------|
| Mobile/tablet | IS 13252 (Part 1) | Harmonised with IEC 62368-1 |
| Power adapter | IS 13252 (Part 1) + IS 16046 | BEE star rating may also apply |
| LED luminaire | IS 16102 / IS 10322 | |
| IT equipment | IS 13252 (Part 1) | |
| Wireless device | IS 13252 + WPC approval | WPC is separate from BIS |
| Household appliance | IS 302 series | ISI mark required |
| Wires/cables | IS 694 / IS 1554 | ISI mark required |

== STEP 3: Find a BIS-notified testing lab ==

search_resources(type="testing-lab", city="[PREFERRED_CITY]", limit=10)
→ Filter for BIS-notified labs for the relevant IS standard

Key labs for BIS testing:
- STQC (government, BIS-notified for most electronics)
- NABL-accredited private labs (faster, cost-effective)
- ERTL (government, electronics)
- BEL, C-DOT labs (for specific product categories)

For each lab, confirm:
- BIS notification number for the applicable IS standard
- Turnaround time
- Sample requirements (number of units, documentation needed)

== STEP 4: Application process ==

**CRS process (most electronics):**
1. Get products tested at BIS-notified lab → Test report valid 1 year
2. Register on BIS portal (bis.gov.in/online-certification) → Submit test report + declaration
3. BIS reviews and issues Registration Certificate (RC) — typically 30–90 days
4. Affix R-number on product/packaging
5. Annual renewal required

**ISI mark process:**
1. Apply to BIS regional office → Application fee ₹1,000–5,000
2. BIS grants licence to test → Send samples to notified lab
3. Lab submits report to BIS
4. BIS factory inspection (for manufacturing licence)
5. BIS grants licence — annual surveillance audit

**Timeline estimate:**
| Scheme | Best case | Typical | With delays |
|--------|-----------|---------|-------------|
| CRS (electronics) | 2 months | 3–5 months | 6–12 months |
| ISI mark | 4 months | 6–9 months | 12–18 months |

== STEP 5: Cost estimate ==

Provide:
| Item | Typical cost |
|------|-------------|
| Lab testing (CRS, 1 standard) | ₹50,000–2,00,000 |
| Lab testing (ISI, complex) | ₹1,00,000–5,00,000 |
| BIS registration/licence fee | ₹5,000–50,000 |
| BIS annual fee | ₹10,000–30,000/year |
| Factory audit (ISI) | ₹20,000–50,000 |
| Consultant (optional) | ₹50,000–2,00,000 |

== STEP 6: Common failure points ==

Identify risks specific to this product:
- RF emissions (EMC) — most common failure for electronics
- Input voltage range not matching IS standard test conditions
- Documentation gaps (Declaration of Conformity, technical file)
- Component changes after certification require fresh testing
- Import before certification is a legal violation (CRS products)
```

## MCP tool calls
1. `search_resources(type="certification-body", limit=10)`
2. `search_resources(type="testing-lab", city="[CITY]", limit=10)`
3. `get_resource(slug="[LAB_SLUG]")` — get full lab details

## Example

Input: "USB-C 65W GaN power adapter, sold to consumers in India, no wireless"

→ `search_resources(type="certification-body", limit=10)` → returns BIS, STQC, ERTL
→ `search_resources(type="testing-lab", city="Bangalore", limit=10)` → returns STQC Bangalore, CPRI

Returns:
- Scheme: CRS (mandatory) + IS 13252 Part 1 (IEC 62368-1 harmonised) + IS 16046 (efficiency)
- BEE star rating: required for >15W chargers (BEE registration separate)
- Recommended lab: STQC Bangalore — BIS-notified, ₹80k–1.5L for full test, 8–12 week turnaround
- Timeline: 3–5 months for first certification
- Cost: ₹1.5–3L total (testing + registration + BEE)
- Risk: IS 16046 efficiency test often surprises teams using off-the-shelf controllers — validate early

## Usage by platform

### Claude Code
```
/skill hardware/navigate-bis-certification
```
Describe your product, whether it has wireless, power input type, and target market.

### Codex / OpenAI agents
Load `skills/hardware/navigate-bis-certification.md` and call with product specs.

### Manual (any LLM)
Copy the prompt template, replace [PLACEHOLDERS], send with MCP server active.

## Notes
- BIS notification list for labs is maintained at bis.gov.in — verify lab's notification is current before paying
- E-waste rules (E-Waste Management Rules 2022) apply separately — EPR registration needed for most electronics
- Import of CRS-listed products without valid registration is punishable — do not import samples in bulk before certification
- WPC (Wireless Planning and Coordination) approval is separate from BIS and handled by DoT — see `certification-path-india` skill
- Standards are updated periodically — confirm you're testing to the current version
