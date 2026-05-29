---
name: open-source-cad-toolchain
version: 1.0.0
description: Select a free or open-source CAD, CAM, simulation, and documentation toolchain for hardware teams and makers
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - cad
  - open-source
  - tools
  - documentation
security_status: community
verified_by: maintainer
last_reviewed: 2026-05-29
---

# Open-source CAD Toolchain

## When to use
Use when a maker, student, startup, or lab wants to avoid expensive proprietary tooling while still maintaining a production-grade CAD and documentation workflow.

## Prompt template

```
Recommend a free or open-source hardware design toolchain for:
- Project type: [MECHANICAL_PCB_ROBOTICS_ENCLOSURE_FIXTURE]
- Team size: [TEAM_SIZE]
- Skill level: [BEGINNER_INTERMEDIATE_ADVANCED]
- Required outputs: [STEP_STL_GERBER_DXF_DRAWINGS_BOM_DOCS]
- Collaboration needs: [SOLO_GIT_SHARED_DRIVE_CLOUD]
- Operating systems: [WINDOWS_MAC_LINUX]
- Manufacturing path: [3D_PRINT_CNC_PCB_SHEET_METAL]
- City for learning or maker support: [CITY_OR_REMOTE]

Build:
1. Toolchain recommendation by task: CAD, CAM, PCB, simulation, rendering, documentation.
2. File format policy for sharing with vendors.
3. Version-control and release workflow.
4. Known limitations and when to switch to paid tools.
5. Learning plan for the team.
6. Local maker or training support using search_resources.

Return a practical setup plan and first-week checklist.
```

## MCP tool calls
1. `search_resources(query="makerspace CAD training", city="[CITY_OR_REMOTE]", max_results=10)`
2. `search_resources(query="prototyping lab CAD CAM", city="[CITY_OR_REMOTE]", max_results=10)`
3. `get_resource(slug="[RESOURCE_SLUG]")`

## Example
Input: two-person robotics team using Linux and Windows, needs STEP, STL, PCB Gerbers, and Git-based release control.

Expected use: recommend a toolchain, file naming, export formats, and training path.

## Notes
Be explicit about interoperability. The recommended workflow should produce vendor-friendly neutral files even if native project files are open-source-tool specific.
