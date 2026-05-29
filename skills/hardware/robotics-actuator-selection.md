---
name: robotics-actuator-selection
version: 1.0.0
description: Select motors, gearboxes, servos, drivers, and local suppliers for robotics and automation projects
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
tags:
  - robotics
  - actuators
  - motors
  - controls
security_status: community
verified_by: maintainer
last_reviewed: 2026-05-29
---

# Robotics Actuator Selection

## When to use
Use when choosing motors, servos, gearboxes, linear actuators, or motor drivers for a robot or automation system. It converts motion requirements into a practical actuator shortlist and sourcing plan.

## Prompt template

```
Recommend actuators for this robotics system:
- Robot or mechanism: [ROBOT_DESCRIPTION]
- Axis or joint: [AXIS_DESCRIPTION]
- Payload and speed: [PAYLOAD_SPEED]
- Motion profile: [CONTINUOUS_INTERMITTENT_PRECISION_FAST]
- Required torque or force: [TORQUE_FORCE_IF_KNOWN]
- Position feedback: [NONE_ENCODER_ABSOLUTE_CLOSED_LOOP]
- Power budget: [VOLTAGE_CURRENT]
- Environment: [INDOOR_OUTDOOR_DUST_VIBRATION]
- City for sourcing or fabrication support: [CITY]

Work through:
1. Load and motion assumptions.
2. Motor class choice: DC, BLDC, stepper, servo, linear, harmonic, planetary.
3. Gearbox and feedback requirement.
4. Driver and control interface.
5. Safety, stall, thermal, and holding torque checks.
6. Supplier and fabrication search using search_resources.
7. Test plan for torque, backlash, heat, noise, and repeatability.

Return: ranked actuator options, driver pairing, supplier path, and validation checklist.
```

## MCP tool calls
1. `search_resources(query="robotics motors actuator supplier", city="[CITY]", max_results=10)`
2. `search_resources(resource_type="component-supplier", city="[CITY]", max_results=10)`
3. `get_resource(slug="[SUPPLIER_SLUG]")`

## Example
Input: small mobile robot arm, 1 kg payload, slow precise pick-and-place, 24 V system, Bengaluru sourcing.

Expected use: estimate torque class, compare servos versus steppers, and identify suppliers or prototyping labs.

## Notes
When torque is unknown, request link lengths, payload location, acceleration, duty cycle, and safety factor before final selection.
