---
name: dfm-review
version: 1.0.0
description: Design for Manufacturability review — identify issues before sending to production
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
tags:
  - dfm
  - manufacturing
  - design-review
  - pcb
  - mechanical
security_status: verified
verified_by: maintainer
last_reviewed: 2025-05-07
---

# DFM Review — Design for Manufacturability

## When to use
Use before sending a design to manufacturing to catch issues that increase cost, reduce yield,
or cause production delays. Works for PCBs, mechanical parts, injection moulded parts, and
sheet metal. Outputs an actionable checklist with severity ratings.

## Prompt template

```
Review the following design for manufacturability issues.
Design type: [PCB / injection-moulded / sheet-metal / machined / 3d-printed / casting]
Target manufacturing location: [India / China / both]
Production volume: [prototype / low <100 / medium 100-10k / high 10k+]
Manufacturing process: [specify if known]

Design description / attached files:
[PASTE DESIGN DESCRIPTION, DIMENSIONS, MATERIAL SPECS, OR DESCRIBE KEY FEATURES]

Perform a DFM review covering:

**Geometry & tolerances:**
- Are tolerances achievable with standard tooling? Flag anything tighter than standard.
- Are there features that require special tooling (thin walls, deep holes, undercuts)?
- Are draft angles correct for the process (injection moulding: ≥1°, casting: ≥2°)?
- Are fillets/radii consistent and within tool capability?

**Material & process fit:**
- Is the specified material appropriate for the process?
- Are there material substitutions that reduce cost without compromising function?
- Any material/process compatibility issues (e.g., certain resins + certain additives)?

**Assembly & handling:**
- Can the part be assembled without special fixtures?
- Are there features that prevent self-location during assembly?
- Are fastener/insert positions accessible with standard tools?
- Can the part be inspected with standard gauges?

**Cost drivers:**
- What are the top 3 features driving up unit cost?
- Are there equivalent design alternatives that reduce cost >20%?

**For PCBs specifically:**
- Minimum trace/space within fab capability?
- Via sizes and aspect ratios within standard capability?
- Component placement clearances for pick-and-place?
- Fiducial markers present?
- Panelisation opportunities?
- Copper pour/thermal relief correct?
- Silkscreen over pads?

Output format:
| Issue | Severity | Description | Suggested fix |
(Severity: CRITICAL=blocks production / HIGH=significant cost impact / MEDIUM=should fix / LOW=nice-to-have)

Then summarise: "Ready to manufacture" / "Fix CRITICAL issues first" / "Needs significant rework"

If any labs or fabs are needed for verification, search:
search_resources(type="[testing-lab or pcb-fab]", city="[CITY]", limit=5)
```

## MCP tool calls (conditional)
- `search_resources(type="pcb-fab", ...)` — if PCB DFM and fab needed
- `search_resources(type="testing-lab", ...)` — if physical validation needed

## Severity definitions

| Level | Meaning | Action |
|-------|---------|--------|
| CRITICAL | Will cause manufacturing failure or zero yield | Must fix before proceeding |
| HIGH | Will significantly increase cost (>30%) or cause frequent rejects | Fix before production order |
| MEDIUM | Will mildly increase cost or complicate assembly | Fix before volume ramp |
| LOW | Optimisation opportunity | Fix when convenient |

## PCB-specific DFM checklist

```
Electrical:
□ All net connections verified in schematic
□ Power/ground planes have adequate copper weight
□ Bypass caps placed <3mm from IC power pins
□ High-current traces sized for current (>1A: use PCB trace width calculator)
□ Differential pairs routed with matched length (±2mil for USB/LVDS)

Physical:
□ Min trace: ≥4mil (0.1mm) for standard fab; ≥3mil for advanced
□ Min space: ≥4mil between copper features
□ Drill size: ≥0.2mm (standard); 0.15mm (advanced)
□ Aspect ratio: ≤8:1 (hole depth:diameter) for standard plated through holes
□ Annular ring: ≥4mil on each side
□ Board edge clearance: ≥0.3mm from copper to edge

Assembly:
□ Component footprints match land pattern standard (IPC-7351)
□ Courtyard overlap check (no component overlaps)
□ No SMD pads under IC body without thermal vias
□ All pads accessible for AOI (avoid under BGA without X-ray plan)
□ THT component lead length trimmed in BOM (protruding height)
□ Fiducials: 3 minimum on each side with SMD components
□ Polarity markings clear on silkscreen (capacitors, diodes, connectors)
□ Reference designators not covered by components
```

## Example

Input: "Injection moulded ABS enclosure, 150x80x40mm, 500 units, wall thickness 1.5mm, internal clips for PCB retention"

Output:
| Issue | Severity | Description | Suggested fix |
|-------|----------|-------------|---------------|
| Wall thickness 1.5mm | HIGH | Too thin for ABS; sink marks likely, warpage risk | Increase to 2.0–2.5mm or rib structure |
| Internal clips | MEDIUM | Clips create undercuts requiring side-action tooling | Use snap-fit geometry with pull direction in mind |
| No draft angle specified | HIGH | ABS needs ≥1° draft on all vertical walls | Add 1–2° draft to all vertical faces |

Verdict: Fix CRITICAL/HIGH issues before ordering tooling.

## Notes
- DFM requirements differ between India, China, and Western fabs — ask your fab for their design rules
- Send DFM questions to the fab early (before final design) — most fabs offer free DFM reviews
- PCB fab DFM is best done with Gerbers in hand; schematic-level review catches fewer issues
- For injection moulding: tooling cost (₹3–30L) means DFM mistakes are very expensive
