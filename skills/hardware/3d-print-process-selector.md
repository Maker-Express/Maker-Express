---
name: 3d-print-process-selector
version: 1.0.0
description: Select the optimal 3D printing process and material for a given part — FDM, SLA, SLS, MJF, DMLS
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - 3d-printing
  - additive-manufacturing
  - prototyping
  - materials
security_status: verified
verified_by: maintainer
last_reviewed: 2025-05-07
---

# 3D Print Process Selector

## When to use
Use when choosing between 3D printing technologies for a part. The skill evaluates functional
requirements, surface finish, mechanical properties, volume, and cost to recommend the right
process, then finds service providers in India.

## Prompt template

```
I need to 3D print the following part:
- Part description: [WHAT IT IS AND DOES]
- Function: [structural / cosmetic / functional prototype / end-use / jig-fixture]
- Critical mechanical properties: [strength / flexibility / heat-resistance / chemical-resistance / none]
- Accuracy required: [±0.1mm / ±0.3mm / ±0.5mm / cosmetic only]
- Surface finish: [rough ok / medium / smooth / production-quality]
- Size (approx LxWxH mm): [DIMENSIONS]
- Quantity: [1 / 2-10 / 10-100 / 100+]
- Budget: [very-low / low / medium / high / price-not-a-concern]
- Timeline: [same-day / 2-3 days / 1 week / flexible]
- Special: [food-safe / biocompatible / ESD-safe / transparent / flexible / none]

Step 1 — Recommend process:
Evaluate each process against requirements:
- FDM: fastest/cheapest, functional but rough, layer lines visible, many materials
- SLA/DLP: smooth surface, moderate strength, brittle, good for detail/cosmetic
- SLS (Nylon): no support needed, strong, good for functional parts, grainy surface
- MJF (HP): like SLS but smoother, faster, good for production qty
- DMLS/SLM: metal (Ti, SS, Al), strongest, most expensive, for extreme loads/heat
- PolyJet: multi-material, very smooth, good for overmolds/flexible parts

Step 2 — Recommend material(s):
For the recommended process, suggest 2–3 material options with tradeoffs.

Step 3 — Find service bureaus in India:
search_resources(type="3d-printing", city="[PREFERRED_CITY]", limit=10)
search_resources(type="prototyping-lab", city="[PREFERRED_CITY]", limit=5)
For results with relevant capability, call get_resource for full details.

Present:
- Recommended process (with reasoning)
- Material shortlist (pros/cons each)
- Design tips for the recommended process
- Vendor shortlist with capabilities, location, turnaround estimate
```

## MCP tool calls
1. `search_resources(type="3d-printing", city="[CITY]", limit=10)`
2. `search_resources(type="prototyping-lab", city="[CITY]", limit=5)`
3. `get_resource(slug="[vendor.slug]")` for top 3

## Process decision matrix

| Requirement | FDM | SLA | SLS | MJF | DMLS |
|-------------|:---:|:---:|:---:|:---:|:----:|
| Lowest cost | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| Smooth surface | ❌ | ✅ | ⚠️ | ✅ | ✅ |
| High strength | ⚠️ | ❌ | ✅ | ✅ | ✅ |
| Complex geometry | ⚠️ | ✅ | ✅ | ✅ | ✅ |
| Flexible parts | ✅ | ❌ | ✅ | ✅ | ❌ |
| Metal parts | ❌ | ❌ | ❌ | ❌ | ✅ |
| Food-safe (with right material) | ✅ | ⚠️ | ❌ | ❌ | ✅ |
| Available in India | ✅ | ✅ | ✅ | ⚠️ | ⚠️ |

## Material quick reference

| Material | Process | Use when |
|----------|---------|---------|
| PLA | FDM | Prototypes, non-structural, indoor |
| PETG | FDM | Light functional, moisture-ok |
| ABS | FDM | Heat resistance, post-process (acetone smooth) |
| ASA | FDM | UV/outdoor resistant |
| TPU | FDM | Flexible, gaskets, grips |
| Nylon PA12 | SLS/FDM | Strong functional parts |
| Standard Resin | SLA | Cosmetic, detail, dental models |
| ABS-like Resin | SLA | Functional prototypes |
| Castable Resin | SLA | Jewelry, lost-wax |
| Nylon PA12 | SLS/MJF | End-use parts, moving components |
| Glass-filled Nylon | SLS | Higher stiffness structural |
| 316L Stainless | DMLS | Corrosion-resistant metal |
| Ti6Al4V | DMLS | Medical, aerospace, high strength:weight |
| AlSi10Mg | DMLS | Lightweight metal, heat sink |

## Example

Input: "Enclosure for electronics, cosmetic quality, 80x60x40mm, 5 units, Bangalore, 1 week"

Recommended: **SLA** (smooth surface for cosmetic, good for small enclosures, 5 units is fine)
Material: Standard/ABS-like resin
Vendors: search Bangalore for SLA-capable 3D printing bureaus
Post-process tip: prime + paint for production-quality look

## Notes
- DFM tip: avoid overhangs >45° without supports (FDM) or design for SLS (no supports needed)
- Wall thickness minimums: FDM ≥1.2mm, SLA ≥0.8mm, SLS ≥0.7mm, DMLS ≥0.3mm
- MJF not widely available in India as of 2025 — mostly Bangalore/Chennai/Mumbai service bureaus
- DMLS widely available; check bureau's material certifications for aerospace/medical
- For functional enclosures: SLS Nylon + post-process painting is often better than SLA for durability
