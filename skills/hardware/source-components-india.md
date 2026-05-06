---
name: source-components-india
version: 1.0.0
description: Find component distributors and stockists in India for a given component or BOM
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - components
  - sourcing
  - bom
  - distributors
  - supply-chain
security_status: verified
verified_by: maintainer
last_reviewed: 2025-05-07
---

# Source Components — India

## When to use
Use when sourcing electronic or mechanical components in India — for prototypes, small batches,
or production. Helps identify authorised distributors, grey-market risks, and alternatives
when parts are unavailable or long lead-time.

## Prompt template

```
I need to source the following component(s) in India:
Component: [PART_NUMBER or DESCRIPTION]
Manufacturer: [MANUFACTURER_NAME if known]
Quantity: [QTY_NEEDED]
Timeline: [WHEN_NEEDED]
Location: [CITY] (or anywhere in India)
Purpose: [prototype / production / repair]

Step 1 — Identify distributor type:
Based on the component type and manufacturer, identify:
- Authorised distributors for [MANUFACTURER] in India (common ones: Mouser, DigiKey, Arrow, 
  Avnet, Farnell, Ruttonsha International, SiliconTech, Digi International resellers, etc.)
- Regional distributors that typically stock this component class
- Online options (robu.in, evelta.com, electronicscomp.com for hobbyist/small qty)

Step 2 — Search MCP for local distributors:
search_resources(type="component-supplier", city="[CITY]", limit=10)
search_resources(type="distributor", city="[CITY]", limit=10)
For top results, call get_resource to check if they stock the relevant category.

Step 3 — Assess supply chain risk:
- Is this component from a single source or multiple manufacturers?
- What is the typical lead time from authorised channel?
- Are there pin-compatible alternatives from other manufacturers?
- Grey market risk: is this a commonly counterfeited component?

Step 4 — Provide alternatives (if applicable):
If [PART_NUMBER] is unavailable or expensive, list 2–3 pin-compatible alternatives with:
- Part number + manufacturer
- Key spec differences (if any)
- Availability in India

Present:
- Primary sourcing path (authorised, recommended)
- Secondary path (alternative if primary unavailable)
- Risk flags (counterfeit risk, long lead time, single source)
- Estimated price range (prototype qty vs production qty)
```

## MCP tool calls
1. `search_resources(type="component-supplier", city="[CITY]", limit=10)`
2. `search_resources(type="distributor", city="[CITY]", limit=10)`
3. `search_resources(type="online-store", limit=5)` — for online options
4. `get_resource(slug="[supplier.slug]")` for top matches

## India sourcing landscape

| Channel | Best for | Lead time | Min order |
|---------|---------|----------|-----------|
| Mouser/DigiKey (US warehouse) | Anything, guaranteed authentic | 3–7 days | $1 |
| Arrow India / Avnet Abacus | TI, ST, NXP, Microchip | 1–4 weeks | 1 reel / MOQ |
| Farnell India (element14) | European brands, Raspberry Pi | 3–7 days | Low |
| Ruttonsha International | Passives, connectors, authorised | 1–5 days | Low |
| SiliconTech | ICs, especially Asian brands | 2–7 days | Low |
| robu.in / evelta.com | Modules, sensors, boards, hobbyist | 2–4 days | 1 unit |
| Ktron India | Industrial, high voltage | 3–7 days | Varies |
| Local grey market (SP Road BLR, Lamington Rd MUM) | Repair, small qty | Same day | 1 unit |

## Counterfeit risk by component type

| High risk | Medium risk | Low risk |
|-----------|-------------|----------|
| Popular MCUs (STM32, ESP32) | Memory (RAM, Flash) | Passives (resistors, caps) |
| Power ICs (LM, L298, etc.) | Op-amps | Connectors (Molex, JST) |
| FPGAs | Linear ICs | PCB blanks |
| Brand-name modules (Arduino clones) | Transistors | Wire, cable |

## Example

Input: "STM32F103C8T6, 50 pcs, Bangalore, for production prototypes"

Primary: Mouser/DigiKey (3–7 days, $0.80–1.20 each, authentic)
Secondary: Arrow India (authorised ST distributor, call for qty pricing)
Local: SP Road, Bangalore (same day, ~₹50–80 each, counterfeit risk HIGH — test before using)
Alternative: STM32F103CBT6 (pin-compatible, 128KB vs 64KB flash, marginal cost increase)
Risk flag: ⚠️ High counterfeit prevalence — buy from authorised channel for production

## Notes
- For production (>1000 units): open an account with Arrow/Avnet/Mouser for better pricing
- Import duty on components: ~18–28% GST + BCD. Factor into landed cost vs local sourcing
- ECCN / export control: some ICs (crypto, ITAR) have import restrictions in India
- Long lead-time ICs: always check Octopart / findchips for global inventory before designing in
- BOM optimisation: prefer components with ≥3 authorised distributors in India
