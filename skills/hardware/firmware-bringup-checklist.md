---
name: firmware-bringup-checklist
version: 1.0.0
description: Plan first-power firmware bring-up for embedded hardware with boot, debug, peripheral, and fault-isolation gates
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - firmware
  - embedded
  - bringup
  - debug
security_status: community
verified_by: maintainer
last_reviewed: 2026-05-29
---

# Firmware Bring-up Checklist

## When to use
Use this before first power-on, first firmware flash, or a board bring-up session. It gives an agent a disciplined sequence for isolating power, clock, boot, debug, and peripheral failures without damaging the board.

## Prompt template

```
Create a firmware bring-up plan for this hardware:
- Product or board: [BOARD_NAME]
- MCU or SoC: [MCU_OR_SOC]
- Power rails: [POWER_RAILS]
- Debug interface: [JTAG_SWD_UART_USB]
- Peripherals to validate first: [PERIPHERAL_LIST]
- Firmware stack: [BAREMETAL_FREERTOS_ZEPHYR_LINUX_OTHER]
- Known risk areas: [RISK_NOTES]
- City for local lab or debug help: [CITY_OR_REMOTE]

Build the plan in this order:
1. Pre-power inspection and current-limit settings.
2. Power rail verification with expected voltage, ripple, and current limits.
3. Clock and reset verification.
4. Bootloader, fuse, strap, and flash checks.
5. Debug attach procedure and fallback attach modes.
6. Minimal firmware image plan.
7. Peripheral validation order from safest to riskiest.
8. Fault isolation tree for no-boot, unstable boot, and peripheral failure.
9. Evidence checklist: captures, logs, register dumps, photos.
10. Escalation: use search_resources to find embedded, PCB, or testing help near [CITY_OR_REMOTE].

Return a table with Gate, Action, Expected result, Failure symptom, Next diagnostic.
```

## MCP tool calls
1. `search_resources(query="embedded firmware debug", city="[CITY_OR_REMOTE]", max_results=10)`
2. `search_resources(query="pcb bringup electronics lab", city="[CITY_OR_REMOTE]", max_results=10)`
3. `get_resource(slug="[SELECTED_RESOURCE_SLUG]")`

## Example
Input: ESP32-S3 board, USB-C power, SWD not available, first flash fails in Bengaluru.

Expected use: create a bring-up sequence that checks 3.3 V current draw, EN/BOOT strapping, USB serial enumeration, flash voltage mode, and local embedded support options.

## Notes
Keep actions reversible. Do not recommend changing fuses, secure boot, or one-time programmable settings until basic boot and debug evidence is collected.
