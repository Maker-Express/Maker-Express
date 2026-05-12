---
name: export-compliance
version: 1.0.0
description: Export compliance for India-made hardware — CE, FCC, UKCA marks, dual-use controls, DGFT requirements, and SCOMET classification
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - export
  - compliance
  - ce-mark
  - fcc
  - scomet
  - regulatory
security_status: unverified
verified_by: ""
last_reviewed: ""
---

# Export Compliance (India-made Hardware)

## When to use
Use this skill when an India-based hardware maker or startup wants to export their product to international markets. Covers CE marking (EU), FCC (USA), UKCA (UK), dual-use export controls (SCOMET), DGFT requirements, and which testing labs in India can produce the necessary test reports. Also covers the India-specific RCMC (Registration Cum Membership Certificate) and LUT/bond for GST-free export.

## Prompt template

```
You are guiding an India-based hardware company through export compliance.

Product: [PRODUCT_DESCRIPTION]
Target export markets: [EU / USA / UK / UAE / ASEAN / OTHER]
Wireless: [YES/NO — if YES: WiFi / BLE / Zigbee / LoRa / Cellular / Satellite]
Mains power: [YES/NO]
End use: [CONSUMER / INDUSTRIAL / DEFENCE / DUAL_USE]
Contains encryption? [YES/NO]
India manufacturer: [YES — has IEC/factory]
Current certifications: [NONE / BIS / ISO_9001 / OTHER]

== STEP 1: Target market requirements ==

For each target market, identify required certifications:

**European Union (CE mark):**
- CE mark is mandatory for most hardware (Low Voltage Directive, EMC Directive, RED for wireless)
- DoC (Declaration of Conformity) + Technical File required
- Notified body required only for Class III medical devices, explosive atmospheres, lifts
- Key directives: LVD (2014/35/EU), EMC (2014/30/EU), RED (2014/53/EU), RoHS (2011/65/EU)
- Testing standards: EN 55032, EN 55035 (EMC), EN 62368-1 (safety), EN 300 328 (WiFi)
- REACH compliance documentation needed for EU (chemical content declaration)

**USA (FCC):**
- FCC ID required for intentional radiators (WiFi, BLE, cellular — anything transmitting)
- FCC SDoC (Supplier's Declaration of Conformity) for unintentional radiators (passives, non-wireless)
- FCC grant from FCC-recognised testing lab required before sale in USA
- Key: FCC 47 CFR Part 15 (unlicensed devices), Part 22/24/27 (cellular)
- California Proposition 65 warning if applicable

**UK (UKCA mark — post-Brexit):**
- UKCA mark replaces CE for products placed on UK market from Jan 2025
- Currently: CE mark still accepted in UK for most products (transition period may extend)
- UK Conformity Assessed: testing to same EN standards, UK approved body for some categories

**UAE / GCC:**
- ESMA (UAE) mark required for many products
- G-Mark (GCC) covers multiple Gulf countries
- Often accept CE as basis but require local registration

search_resources(type="certification-body", limit=10)
search_resources(type="testing-lab", limit=15)

== STEP 2: India-based testing labs for export certifications ==

Find labs with international accreditation for target market testing:
search_resources(type="testing-lab", city="[CITY]", limit=10)

Key India labs for export certs:
- TÜV SÜD India (CE, FCC, UKCA — Bangalore, Mumbai)
- Bureau Veritas India (CE, FCC — Bangalore, Pune)
- Intertek India (CE, FCC, REACH — Bangalore, Chennai)
- SGS India (CE — multiple cities)
- UL India (UL mark, CE — Bangalore, Mumbai)

Confirm each lab is:
- FCC-recognised TCB/lab (for FCC grant)
- ILAC-MRA member (for international acceptance of test reports)
- Accredited to relevant EN/IEC standards

get_resource(slug="[LAB_SLUG]")

== STEP 3: Dual-use and SCOMET controls ==

Check if the product is subject to Indian export controls:

SCOMET (Special Chemicals, Organisms, Materials, Equipment, and Technologies):
- Category 0: Nuclear-related
- Category 1: Toxic chemicals
- Category 2: Micro-organisms
- Category 3: Materials (composites, ceramics)
- **Category 4: Electronics, computers** ← most relevant for hardware
- Category 5: Telecom and information security
- Category 6: Sensors and lasers
- Category 7: Navigation and avionics
- Category 8: Aerospace
- Category 9: Marine
- Category 10: Propulsion

For hardware typically requiring SCOMET check:
- Products with encryption >64-bit (Category 5)
- Products with high-precision GPS/INS (Category 7)
- Thermal imaging / night vision (Category 6)
- RF equipment above certain frequencies/power (Category 5)
- Defence applications (multiple categories)

If SCOMET applies: DGFT export licence required before shipment.
Apply at DGFT portal: dgft.gov.in/IT2/Login.html

== STEP 4: DGFT and customs requirements ==

For exporting from India:
- IEC (Importer Exporter Code): mandatory — apply at dgft.gov.in (2–3 days, ₹500)
- RCMC (Registration Cum Membership Certificate): from Export Promotion Council (EPC)
  - Electronics: ELCINA EPC or CEPC
  - Enables export incentives (MEIS/RoDTEP)
- LUT (Letter of Undertaking) or Bond: for exporting without paying GST upfront
  - File on GST portal before first export shipment
- Shipping bill: filed with customs; AD code required at bank

Applicable export incentive schemes:
- RoDTEP (Remission of Duties and Taxes on Exported Products): replaces MEIS
- EPCG (Export Promotion Capital Goods): duty-free import of capital goods vs. export obligation
- SEZ (Special Economic Zone): if manufacturing in SEZ, simpler export procedure

== STEP 5: Compliance timeline and cost ==

For EU + USA (most common combination):
| Item | Timeline | Cost |
|------|----------|------|
| EMC + safety testing (EN/FCC) | 6–12 weeks | ₹3–15L |
| CE DoC preparation | 2 weeks | ₹50k–2L (consultant) |
| FCC grant | 8–14 weeks | ₹2–8L |
| RoHS/REACH documentation | 2–4 weeks | ₹50k–2L |
| UKCA (if needed) | +2–4 weeks | ₹1–3L additional |
| RCMC + IEC | 1–2 weeks | ₹5–10k |

Total for EU + USA first-time certification: typically ₹8–25L and 3–6 months.

Ongoing costs: re-testing required for significant design changes; annual DoC review recommended.
```

## MCP tool calls
1. `search_resources(type="testing-lab", limit=15)`
2. `search_resources(type="testing-lab", city="[CITY]", limit=10)`
3. `search_resources(type="certification-body", limit=10)`
4. `get_resource(slug="[LAB_SLUG]")`

## Example

Input: "WiFi + BLE enabled smart home switch, 230V mains, India manufactured, want to sell in EU and USA"

→ `search_resources(type="testing-lab", limit=15)` → returns TÜV SÜD India, Bureau Veritas, Intertek
→ `search_resources(type="certification-body", limit=10)` → returns certification bodies

Returns:
- EU: CE mark required (LVD + EMC + RED + RoHS) — EN 62368-1 for safety, EN 55032/35 for EMC, EN 300 328 for WiFi
- FCC: FCC ID required for WiFi module (Part 15B + 15C) — alternatively use FCC-certified module
- No SCOMET control (standard WiFi/BLE at consumer power levels)
- Recommended path: use FCC/CE pre-certified WiFi+BLE module (saves ~₹5L in testing) — only test end product for EMC
- Lab: TÜV SÜD Bangalore or Intertek Bangalore for combined CE+FCC testing
- Timeline: 3–4 months, ₹6–12L
- IEC code + LUT: apply before first export shipment

## Usage by platform

### Claude Code
```
/skill hardware/export-compliance
```
Describe your product, target markets, whether it has wireless, and current certifications.

### Codex / OpenAI agents
Load `skills/hardware/export-compliance.md` and call with product and target market context.

### Manual (any LLM)
Copy the prompt template, replace [PLACEHOLDERS], send with MCP server active.

## Notes
- Using a pre-certified radio module (ESP32, Nordic, Quectel certified variants) can significantly reduce RF testing burden — check module's existing certifications first
- CE is self-declaration for most products — you do not need a Notified Body unless the product falls under specific high-risk directives
- SCOMET classification is the applicant's responsibility — when in doubt, file a DGFT classification request
- For US market: if exporting encryption software/hardware, EAR (Export Administration Regulations) may require a licence or notification to BIS (US Department of Commerce) — separate from FCC
- FCC Supplier's Declaration of Conformity (SDoC) does not require FCC ID and can be done internally for unintentional radiators — check if your product qualifies
