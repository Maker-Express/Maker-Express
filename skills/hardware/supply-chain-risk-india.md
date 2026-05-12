---
name: supply-chain-risk-india
version: 1.0.0
description: Assess supply chain risks for an Indian hardware product — single-source components, import dependency, lead time exposure, and mitigation strategies
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - supply-chain
  - sourcing
  - risk
  - procurement
  - india
security_status: unverified
verified_by: ""
last_reviewed: ""
---

# Supply Chain Risk Assessment (India)

## When to use
Use this skill before finalising a hardware BOM for production in India. It identifies single-source risks, import dependency, lead time exposure, and recommends local alternatives or mitigation strategies. Particularly valuable for products moving from prototype to first production run, or when a component becomes unavailable.

## Prompt template

```
You are assessing supply chain risks for a hardware product being manufactured in India.

Product: [PRODUCT_DESCRIPTION]
BOM summary: [LIST_KEY_COMPONENTS — MCU, sensors, power ICs, connectors, passives]
Current sourcing: [INDIA_LOCAL / IMPORT_CHINA / IMPORT_EUROPE_US / MIXED]
Target annual volume: [QTY]
Production location: [CITY, STATE]

== STEP 1: Component risk classification ==

For each key component in the BOM, classify:

| Component | Part # | Single source? | India-available? | Lead time | Risk level |
|-----------|--------|---------------|-----------------|-----------|------------|

Risk levels:
- 🔴 HIGH: Single-source + import-only + >12 week lead time
- 🟡 MED: Import-only OR single-source OR >8 week lead time
- 🟢 LOW: Multiple sources, locally available, <6 week lead time

Categories driving HIGH risk for Indian hardware:
- Microcontrollers (STM32, NXP, Renesas — semiconductor shortage exposure)
- RF modules (WiFi, BLE — often single-source China IC)
- Displays (TFT/OLED — mostly China-only)
- Specialty sensors (MEMS, IMUs, gas sensors)
- Power management ICs (specific part numbers with long lead times)

== STEP 2: India-available alternatives ==

For each 🔴 HIGH risk component, find:
search_resources(type="component-supplier", limit=10)
search_resources(type="distributor", limit=10)

For India-sourcing options:
- Mouser India / DigiKey India (for most ICs)
- Local distributors (Ravel, Vacker, Arrow India)
- MSME-grade alternatives (check for Indian-designed/manufactured alternatives)

For each high-risk component, provide:
- Primary source (import)
- India-available alternative (if exists, with part compatibility notes)
- Safety stock recommendation (weeks of cover)

== STEP 3: Import dependency analysis ==

Assess overall import exposure:
- Estimate % of BOM value that is import-dependent
- Identify which imports are China-specific vs. diversified
- Flag components subject to import duty changes (check current Basic Customs Duty rates)
- Flag components under PLI (Production Linked Incentive) scheme for domestic substitution

India import risk factors (2024–2025):
- Semiconductor supply: mostly stable but geopolitical risk on China-origin ICs
- GST/customs duty changes: budget announcements can affect landed cost ±10–20%
- FEMA/DGFT restrictions: some components require import licence
- Port clearance: Chennai, JNPT — typical 5–15 day clearance; factor into lead time

== STEP 4: Lead time and safety stock ==

For each high-risk component:
- Current typical lead time (Mouser India / local distributor)
- Recommended safety stock (units) = [daily_usage × lead_time_days × 1.5]
- Reorder point

For the overall production plan at [TARGET_VOLUME]:
- Minimum forward cover needed: [weeks]
- Estimated safety stock value: ₹[amount]
- Recommendation: blanket PO vs. spot buy strategy

== STEP 5: Mitigation recommendations ==

Provide concrete actions:
1. **Dual-source** — components that have a viable second source
2. **Footprint-compatible alternatives** — pin-compatible ICs that can be swapped without PCB respin
3. **Safety stock** — minimum buffer for long lead time items
4. **Design changes** — flag if a BOM revision would significantly reduce risk (e.g. MCU swap)
5. **Local manufacturing** — components where Make-in-India alternatives exist
6. **PLI benefits** — if applicable, list PLI schemes for domestic sourcing incentives

get_resource(slug="[DISTRIBUTOR_SLUG]") — for distributor contact and stocking depth
```

## MCP tool calls
1. `search_resources(type="component-supplier", limit=10)`
2. `search_resources(type="distributor", limit=10)`
3. `get_resource(slug="[SUPPLIER_SLUG]")` — for stocking depth and lead times

## Example

Input: "Industrial IoT gateway, STM32H7 + Quectel EC25 LTE module + Bosch BME688 gas sensor, China-imported currently, 500 units/year, Pune"

→ `search_resources(type="component-supplier", limit=10)` → returns 8 suppliers
→ `search_resources(type="distributor", limit=10)` → returns Mouser India, DigiKey, Arrow India

Returns:
- STM32H7: 🟡 MED — available Mouser India, 6–8 week lead time; dual-source with NXP RT1060 possible (requires firmware port)
- Quectel EC25: 🔴 HIGH — single-source China, 12–16 weeks; alternative: SIMCom SIM7600 (footprint compatible) or local stocking at Ravel Electronics Pune
- BME688: 🟡 MED — Mouser India has stock; recommend 8-week safety buffer at 500 units/year
- Overall import dependency: ~68% of BOM value
- Safety stock recommendation: ₹3.2L at 12-week cover for 500 units/year run rate
- Design recommendation: consider STM32H5 (newer, better availability) on next PCB rev

## Usage by platform

### Claude Code
```
/skill hardware/supply-chain-risk-india
```
Provide BOM summary, current sourcing approach, and production volume.

### Codex / OpenAI agents
Load `skills/hardware/supply-chain-risk-india.md` and call with BOM context.

### Manual (any LLM)
Copy the prompt template, replace [PLACEHOLDERS], send with MCP server active.

## Notes
- Lead times are indicative — always confirm with distributors before committing to a production schedule
- Semiconductor shortage cycles: MCUs and power ICs have historically shown 6–18 month disruptions; plan accordingly
- India-manufactured alternatives are limited today but growing — PLI scheme for semiconductors is driving new domestic supply
- For defence/strategic hardware: additional ITAR/EAR restrictions may apply for US-origin components
- Counterfeit risk is real for some ICs from grey-market sources — use authorised distributor channels only
