---
name: estimate-bom-cost
version: 1.0.0
description: Rough BOM cost estimation for Indian market — component, assembly, and NRE breakdown
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_grants
tags:
  - bom
  - costing
  - manufacturing
  - sourcing
security_status: unverified
verified_by: ""
last_reviewed: ""
---

# Estimate BOM Cost (India)

## When to use
Use this skill when you need a rough cost estimate for a hardware product's BOM in the Indian market — whether for fundraising, pricing, or go/no-go decisions. It produces component cost estimates using Indian distributor pricing tiers, assembly cost benchmarks, and NRE estimates. Not a substitute for an actual RFQ, but accurate to ±30% for planning.

## Prompt template

```
You are estimating the BOM cost for a hardware product targeting the Indian market.

Product: [PRODUCT_DESCRIPTION]
Key components: [LIST_KEY_COMPONENTS_OR_ICS]
PCB: [LAYER_COUNT]-layer, approximately [BOARD_SIZE_CM2] cm²
Enclosure: [INJECTION_MOULDED / 3D_PRINTED / SHEET_METAL / NONE]
Target volume: [PROTOTYPE_QTY] units (prototype) → [PRODUCTION_QTY] units (production)
Target geography: India (sold in India, manufactured in India where possible)

== STEP 1: Component costs ==

For each key component, estimate Indian market pricing at the target volumes:
- Use Indian distributor pricing tiers (Mouser India, DigiKey India, local distributors)
- Flag components likely to be import-only vs. locally available
- Apply typical import duty + GST where relevant (typically 18–28% on electronics)

Sources to reference:
search_resources(type="component-supplier", limit=10)
search_resources(type="distributor", limit=10)

For each component provide:
| Component | Part | Qty | Unit cost (proto) | Unit cost (prod) | Source risk |
|-----------|------|-----|-------------------|------------------|-------------|

== STEP 2: PCB fabrication + assembly ==

PCB fab cost estimate (India):
- Layer count: [LAYER_COUNT]
- Board area: [BOARD_SIZE_CM2] cm²
- Surface finish: HASL (default) or ENIG (+20%)
- Min trace/space: [STANDARD 0.1mm / FINE 0.075mm]

search_resources(type="pcb-fab", city="[CITY]", limit=5)

Assembly estimate:
- SMT components: [COUNT]
- Through-hole: [COUNT]
- Special processes (BGA, press-fit, RF shielding): [YES/NO]

Provide:
| Item | Prototype (10 pcs) | Small batch (500) | Medium (5000) |
|------|-------------------|-------------------|---------------|
| PCB bare | | | |
| SMT assembly | | | |
| Through-hole | | | |
| Test + QC | | | |

== STEP 3: NRE (one-time costs) ==

Estimate non-recurring engineering costs:
- PCB design (if outsourced): ₹50k–3L depending on complexity
- Enclosure tooling: ₹3–30L for injection mould, ₹0 for 3D print
- Firmware development (if needed): estimate days × rate
- Certification (BIS/WPC/CDSCO): ₹2–20L depending on product type

== STEP 4: Total cost summary ==

Provide:
| Cost element | Prototype | 500 units | 5000 units |
|--------------|-----------|-----------|------------|
| BOM (components) | | | |
| PCB + assembly | | | |
| Enclosure | | | |
| Packaging | | | |
| **Total COGS** | | | |
| NRE (amortised) | | | |
| **Landed cost** | | | |

Suggested retail price (India): 3–5× COGS at prototype stage, 2–3× at volume.

== STEP 5: Risk flags ==

Flag:
- Any component with China-only sourcing
- Components with >12-week lead time
- Items requiring import licence (DGFT)
- Applicable grants: get_grants(category="electronics")
```

## MCP tool calls
1. `search_resources(type="component-supplier", limit=10)`
2. `search_resources(type="distributor", limit=10)`
3. `search_resources(type="pcb-fab", city="[CITY]", limit=5)`
4. `get_grants(category="electronics")`

## Example

Input: "4-layer IoT environmental sensor, STM32 + ESP32-C3, 80cm² PCB, ABS injection-moulded enclosure, 10 prototypes → 1000 production"

→ `search_resources(type="component-supplier", limit=10)` → returns 8 suppliers
→ `search_resources(type="pcb-fab", city="Bangalore", limit=5)` → returns 4 fabs
→ `get_grants(category="electronics")` → returns MeitY ESDM scheme

Returns:
- Component BOM: ~₹850/unit at prototype, ~₹420/unit at 1000 pcs (STM32 + ESP32-C3 dominate)
- PCB + SMT assembly: ₹1,800/pc (proto) → ₹380/pc (1000 pcs) at Bangalore fab
- Enclosure mould: ₹8–15L one-time NRE; ₹180/pc at 1000 pcs
- Total COGS at 1000 pcs: ~₹1,050/unit
- Suggested India retail: ₹2,500–3,500
- Risk: ESP32-C3 — WPC type approval needed (~₹1.5L, 3 months)
- Grant: MeitY ESDM — 20% capex subsidy applicable

## Usage by platform

### Claude Code
```
/skill hardware/estimate-bom-cost
```
Then provide product description, key components, PCB specs, and target volumes.

### Codex / OpenAI agents
Load `skills/hardware/estimate-bom-cost.md` and call with product context.

### Manual (any LLM)
Copy the prompt template, replace [PLACEHOLDERS], send with MCP server active.

## Notes
- Prices are indicative for 2025 Indian market; verify with actual quotes before committing
- GST on electronics components: 18% standard; some categories 5% or 28% — check HSN code
- Import duty: BCD (Basic Customs Duty) varies 0–20% by component category
- For production volumes >5000, consider Taiwan/China fab + India assembly to reduce PCB cost
- BOM cost does not include logistics, warranty reserves, or working capital
