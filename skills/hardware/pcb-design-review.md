---
name: pcb-design-review
version: 1.0.0
description: Structured PCB design review covering schematic correctness, layout quality, signal integrity, and manufacturability
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
tags:
  - pcb
  - design-review
  - signal-integrity
  - electronics
security_status: verified
verified_by: maintainer
last_reviewed: 2025-05-07
---

# PCB Design Review

## When to use
Use before sending PCB files to fabrication. Reviews schematic logic, layout quality, signal
integrity, power integrity, and DFM in a structured pass. Most useful when described in text
or when attaching netlist/BOM details — works with or without the actual Gerber files.

## Prompt template

```
Review this PCB design:
Project: [PROJECT_NAME]
Function: [WHAT THE BOARD DOES]
Key ICs: [LIST MAIN ICs — e.g., STM32F4, TPS65987, W25Q128]
Power rails: [LIST RAILS — e.g., 5V input, 3.3V LDO, 1.8V switcher]
Connectivity: [USB / SPI / I2C / UART / Ethernet / RF — list interfaces]
Layer count: [2 / 4 / 6+]
Fab: [PLANNED FAB + THEIR DESIGN RULES if known]

Design description or areas of concern:
[PASTE RELEVANT CIRCUIT DESCRIPTION, KNOWN ISSUES, OR SPECIFIC AREAS TO REVIEW]

Perform a review across these areas:

**Schematic review:**
- Power tree: is each rail properly decoupled? Are bulk and bypass caps placed?
- Reset circuits: proper RC on MCU reset pins? External reset IC recommended?
- Clock/oscillator: proper load caps calculated? Series termination on clock lines?
- USB: are series resistors on D+/D- (22–33Ω)? ESD protection (TVS)?
- SPI/I2C bus: are pull-up values appropriate for bus speed and capacitance?
- Unused pins: are unused MCU/IC pins properly terminated (not floating)?

**Layout review:**
- Power planes: are there proper ground planes? Any splits that affect return current paths?
- Decoupling placement: are bypass caps within 2mm of IC power pins?
- High-speed signals: are differential pairs length-matched? Are there stubs?
- EMC: are there any antenna-loop structures in the layout? Slots in ground plane?
- Thermal: do power devices have adequate thermal copper area or vias to inner planes?
- Component placement: are sensitive analog parts away from switching regulators?

**Signal integrity flags:**
- What interfaces run above 50MHz? Are they length-matched and impedance-controlled?
- Are termination resistors present on interfaces that require them?
- Any right-angle bends on high-frequency traces?

**Safety / protection:**
- Input protection: TVS/Zener on all external connectors?
- Reverse polarity protection on power input?
- Fuse on main power input?
- ESD on USB/Ethernet/exposed interfaces?

Output format:
For each issue: [Area] | [Severity: CRITICAL/HIGH/MEDIUM/LOW] | [Description] | [Fix]

Also give an overall readiness verdict.
```

## MCP tool calls (conditional)
- `search_resources(type="testing-lab", tags="emc", city="[CITY]", limit=5)` — if EMC pre-scan needed
- `search_resources(type="pcb-fab", city="[CITY]", limit=5)` — if fab recommendation needed

## Common PCB issues (quick reference)

| Issue | Severity | Why it matters |
|-------|----------|---------------|
| Floating GPIO pins | HIGH | Unstable behaviour, increased EMI |
| No decoupling on VCC | CRITICAL | Will fail, oscillations, brownouts |
| Slots in ground plane | HIGH | EMI radiator, signal integrity |
| USB without ESD | HIGH | ESD kills MCU from USB port |
| Crystal without load caps | CRITICAL | Won't oscillate or will be off-frequency |
| Right-angle trace bends | LOW/MED | Reflection at high freq, minor at <1GHz |
| No input fuse | HIGH | Fire/safety risk, compliance failure |
| Silkscreen on pads | HIGH | Soldering defects |
| No fiducials | MEDIUM | Pick-and-place alignment issues |
| Thermal pad without vias | HIGH | Component overheating |

## Example

Input: "4-layer USB-C PD power delivery board with STM32G0 MCU, 5V/20V input, 5V/3A output"

Issues flagged:
| Area | Severity | Issue | Fix |
|------|----------|-------|-----|
| Schematic | CRITICAL | USB-C CC pins: no 5.1kΩ pull-down resistors | Add 5.1kΩ to CC1 and CC2 — required for PD sink operation |
| Layout | HIGH | Switching regulator loop area too large | Move output cap within 5mm of IC |
| Safety | HIGH | No TVS on VBUS | Add bidirectional TVS (e.g., PRTR5V0U2X) |
| Layout | MEDIUM | PGOOD trace runs near noisy switcher output | Re-route or add ferrite |

## Notes
- 4-layer stackup: SIG / GND / PWR / SIG is standard — never put two signal layers adjacent without plane reference
- Impedance control: 50Ω single-ended on 4-layer FR4 ≈ 0.11mm trace width (check with your fab's calculator)
- Pre-compliance EMC scan before formal testing saves money — many fabs/labs in India offer this
- Open-source tools: KiCad DRC catches many issues before this review; run it first
