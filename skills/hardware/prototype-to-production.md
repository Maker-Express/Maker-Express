---
name: prototype-to-production
version: 1.0.0
description: Plan the full journey from prototype to production-ready hardware — phases, milestones, and vendors
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
  - get_grants
tags:
  - manufacturing
  - production
  - prototyping
  - planning
  - startup
security_status: verified
verified_by: maintainer
last_reviewed: 2025-05-07
---

# Prototype to Production Planner

## When to use
Use when a hardware startup or maker needs to plan the path from working prototype to
manufactured product. Creates a structured roadmap with phases, go/no-go criteria,
cost estimates, and vendor recommendations using the directory.

## Prompt template

```
Plan the prototype-to-production journey for:
Product: [DESCRIPTION]
Current stage: [idea / breadboard / PCB prototype / EVT / DVT / PVT / in production]
Target volume first batch: [QTY]
Target unit cost: [APPROX TARGET ₹ or $]
Target launch: [MONTH/YEAR or timeline]
Location: [CITY] (for vendor search)
Key concerns: [certification / supply chain / cost / timeline / quality / funding / all]

Build a phased roadmap:

**Phase 1 — Engineering Validation (EVT)**
Goal: Does it work as designed?
Activities: Schematic review, layout review, first PCB spin, bring-up
Output criteria to pass: Core functionality working, major bugs fixed
Typical duration: [based on complexity] weeks
Key vendors needed:
- PCB fab: search_resources(type="pcb-fab", city="[CITY]", limit=5)
- 3D printing (enclosure prototypes): search_resources(type="3d-printing", city="[CITY]", limit=5)

**Phase 2 — Design Validation (DVT)**
Goal: Does the design meet all requirements reliably?
Activities: DFM review, thermal testing, drop/vibration, EMC pre-scan, UI/UX validation
Output criteria to pass: All functional requirements met, design frozen
Key vendors:
- Testing: search_resources(type="testing-lab", city="[CITY]", limit=5)
- DFM: search_resources(type="service-provider", tags="dfm", limit=5)

**Phase 3 — Production Validation (PVT)**
Goal: Can it be manufactured consistently?
Activities: Pilot run (50–200 units), line testing, yield analysis, pack/unpack test
Output criteria to pass: Yield >95%, all test procedures documented
Key vendors:
- EMS/contract manufacturer: search_resources(type="ems", city="[CITY]", limit=5)

**Phase 4 — Certification**
Activities: Based on product type, run required certifications (BIS, WPC, etc.)
search_resources(type="certification-body", limit=10)
Key milestone: Cannot legally sell in India without this

**Phase 5 — Ramp**
Activities: NPI, supply chain lock-in, first production order
Key vendors:
- Components: search_resources(type="component-supplier", limit=10)
- Logistics/warehousing: search_resources(type="logistics", city="[CITY]", limit=5)

**Funding check:**
get_grants(stage="prototype", category="electronics")
(List relevant grants/incentives for this stage)

For each phase, provide:
- Duration estimate
- Cost estimate (₹)
- Top 2 risk factors
- Go/no-go criteria
- Recommended vendors from directory
```

## Example

Input: "IoT air quality sensor, 5 SKUs, prototype working, want to sell in India"

→ `search_resources(type="pcb-fab", city="Bangalore", limit=5)` → returns 4 Bangalore PCB fabs
→ `search_resources(type="testing-lab", city="Bangalore", limit=5)` → returns 6 labs (ETDC, BEL, STQC)
→ `search_resources(type="certification-body", limit=10)` → returns BIS, WPC, BEE
→ `get_grants(stage="prototype", category="electronics")` → returns 3 applicable schemes

Returns:
- EVT: 6–8 weeks, ₹2–5L — use PCBPower or Circuitronics; 3D print enclosure at Workbench Projects
- DVT: 8–12 weeks, ₹5–15L — freeze design at DVT-2; ETDC Bangalore for EMC pre-scan
- WPC type approval: 3–4 months, ₹1–2L — mandatory for WiFi module
- BIS registration (CRS): 2–4 months, ₹50k–1L — mandatory for IoT devices
- PVT at 100 units: Kaynes or Centum EMS; estimated ₹1,800/unit at 500 qty
- Applicable grant: MeitY ESDM incentive — 20% capex subsidy for electronics manufacturing

## MCP tool calls
1. `search_resources(type="pcb-fab", city="[CITY]", limit=5)`
2. `search_resources(type="3d-printing", city="[CITY]", limit=5)`
3. `search_resources(type="testing-lab", city="[CITY]", limit=5)`
4. `search_resources(type="ems", city="[CITY]", limit=5)`
5. `search_resources(type="certification-body", limit=10)`
6. `get_grants(stage="prototype", category="electronics")`

## Typical timelines

| Stage | Simple product | Complex product |
|-------|---------------|-----------------|
| EVT | 4–8 weeks | 8–16 weeks |
| DVT | 4–8 weeks | 8–20 weeks |
| PVT | 4–6 weeks | 6–12 weeks |
| Certification (India) | 3–9 months | 6–18 months |
| **Total (first sale)** | **6–12 months** | **12–24 months** |

## Cost benchmarks (India, 2025)

| Item | Prototype | Small batch (500) | Medium (5000) |
|------|-----------|-------------------|---------------|
| PCB (4-layer, 100cm²) | ₹500–2000/pc | ₹200–500/pc | ₹80–200/pc |
| SMT assembly | ₹500–2000/pc | ₹150–400/pc | ₹60–150/pc |
| Injection mould | ₹3–30L (one-time) | — | — |
| BIS + WPC certification | — | ₹2–8L | — |
| EMS NRE | ₹50k–5L | — | — |

## Notes
- EVT → DVT transition: freeze the design before DVT — changes after cost 3–5× more
- Certification runs in parallel with DVT/PVT where possible (saves 2–4 months)
- Indian EMS landscape: few full-turnkey EMS; often need to manage PCB fab + assembly separately
- PLI (Production Linked Incentive) scheme: check if your product category qualifies — significant incentives for domestic manufacturing
- For hardware startups: BIRAC, DPIIT Startup India, and state government schemes often fund pilot production
