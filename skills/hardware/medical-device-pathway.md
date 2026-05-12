---
name: medical-device-pathway
version: 1.0.0
description: CDSCO regulatory pathway for Class A/B/C/D medical devices in India — MDR 2017 classification, registration, testing, and import/manufacturing licence
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
  - medical-device
  - cdsco
  - regulatory
  - compliance
  - india
security_status: unverified
verified_by: ""
last_reviewed: ""
---

# Medical Device Regulatory Pathway (India)

## When to use
Use this skill when developing or importing a medical device for the Indian market. Covers classification under MDR 2017, CDSCO registration process, testing lab identification, clinical evaluation requirements, and timeline + cost estimates for each device class. Also covers the distinction between notified devices (Class A–D under MDR 2017) and non-notified devices, and the path for innovative devices under the new regulatory sandbox.

**Important:** This skill provides regulatory navigation guidance, not legal advice. Engage a CDSCO-registered regulatory consultant for formal submissions.

## Prompt template

```
You are mapping the CDSCO regulatory pathway for a medical device targeting the Indian market.

Device: [DEVICE_DESCRIPTION]
Intended use: [CLINICAL_INTENDED_USE]
Technology: [HARDWARE_DESCRIPTION — sensors, software, connectivity]
Risk level (estimate): [LOW / MEDIUM / HIGH]
Target users: [HEALTHCARE_PROFESSIONAL / PATIENT_SELF_USE]
Is it a software medical device (SaMD)? [YES / NO]
Import or India manufacturing? [IMPORT / MANUFACTURE_INDIA / BOTH]

== STEP 1: Device classification ==

Under Medical Devices Rules (MDR) 2017, classify the device:

**Class A — Low risk**
- Non-invasive, minimal contact (bandages, examination gloves, tongue depressors)
- Reusable surgical instruments
- Example: blood pressure cuff (manual), stethoscope

**Class B — Low-moderate risk**
- Invasive short-term, non-vital
- Example: blood glucose meter, pulse oximeter (consumer-grade), hearing aid

**Class C — Moderate-high risk**
- Implantable, life-supporting short-term
- Example: ventilator, infusion pump, patient monitor (ICU-grade)

**Class D — High risk**
- Implantable + life-supporting (critical/long-term)
- Example: pacemaker, cochlear implant, HIV diagnostic

For the given device, determine:
- MDR 2017 classification (A/B/C/D)
- Whether device is "notified" (on CDSCO notified device list) or not
- If SaMD: additional CDSCO guidance on software classification applies
- If combination product (device + drug): separate pathway

== STEP 2: Registration pathway ==

**For notified devices (most devices with MDR 2017):**

| Class | Registration type | Key requirements |
|-------|------------------|-----------------|
| A | Form MD-3 (self-declaration) | Quality system, labelling compliance |
| B | Form MD-14 (import) / MD-7 (manufacture) | + Performance testing at NABH/NABL lab |
| C | Form MD-14 / MD-7 | + Clinical data, performance testing |
| D | Form MD-14 / MD-7 | + Indian clinical trials may be required |

**For non-notified devices (Class A/B not yet on CDSCO list):**
- May operate without formal registration — but watch for notification updates
- Good practice: file for registration proactively

**Import licence (Form MD-14):**
- Required for all notified imported devices (all classes)
- Apply via SUGAM portal (sugam.gov.in)
- Processing time: 3–9 months depending on class

**Manufacturing licence (Form MD-7):**
- Required for all notified devices manufactured in India
- Requires ISO 13485 QMS (or equivalent) at manufacturing site

== STEP 3: Find testing labs and notified bodies ==

search_resources(type="testing-lab", limit=15)
→ Filter for NABL-accredited, CDSCO-recognised labs

Key labs for medical device testing in India:
- SCTIMST Trivandrum (government, biomedical devices)
- ETDC Bangalore (electronics + medical)
- IIT testing centres (academic, specific modalities)
- SGS India, Bureau Veritas (private, international recognition)
- STQC (IT/electronic medical devices)

For Class C/D devices, international performance testing (IEC 60601 series) at:
- TÜV SÜD India
- Intertek India
- SGS India (with global lab network)

get_resource(slug="[LAB_SLUG]") for full contact and accreditation details

For IVD devices:
- Additional requirements under In-Vitro Diagnostics regulations
- NABL-accredited labs for IVD performance studies

== STEP 4: Clinical evaluation requirements ==

| Class | Clinical evaluation needed? | Indian clinical data? |
|-------|--------------------------|----------------------|
| A | Summary of literature evidence | Usually not required |
| B | + Performance testing data | Usually not required |
| C | + Substantial clinical data | May be required (CDSCO discretion) |
| D | + Full clinical investigation | Often required |

For Class C/D:
- If equivalent device approved in US (FDA 510(k)/PMA) or EU (CE Mark): may use bridging data
- If novel device: CDSCO may require Indian clinical trials
- Clinical trial registration: CTRI (Clinical Trials Registry India)

search_resources(type="research-lab", city="[CITY]", limit=10)
→ For academic partners and clinical investigation sites

== STEP 5: Timeline and cost estimates ==

| Class | Typical timeline | Typical cost |
|-------|-----------------|--------------|
| A | 2–4 months | ₹2–5L |
| B | 4–9 months | ₹5–20L |
| C | 9–18 months | ₹20–80L |
| D | 18–36 months | ₹50–200L+ |

Costs include: testing, registration fees, consultant fees, labelling/documentation.
Exclude: product development, clinical investigation costs.

== STEP 6: Funding and support ==

get_grants(category="healthcare")

Key programs for medical device startups:
- BIRAC BIG scheme: ₹50L for biomedical device development
- BIRAC LEAP: ₹1.5Cr for translational research
- CDSCO Fast Track: for novel devices addressing unmet Indian clinical need
- MedTech Zone (Andhra Pradesh, Gujarat): manufacturing incentives
- DBT PACE: for medical device innovators

Recommended next steps:
1. DPIIT recognition (prerequisite for most grants)
2. Engage CDSCO-registered regulatory consultant
3. Identify testing lab and get quotation
4. Begin ISO 13485 QMS implementation if manufacturing in India
```

## MCP tool calls
1. `search_resources(type="testing-lab", limit=15)`
2. `search_resources(type="certification-body", limit=10)`
3. `search_resources(type="research-lab", city="[CITY]", limit=10)`
4. `get_resource(slug="[LAB_SLUG]")`
5. `get_grants(category="healthcare")`

## Example

Input: "AI-powered portable ECG device for home use, 12-lead, Bluetooth to smartphone app, targeting tier-2 city patients, manufactured in India"

→ `search_resources(type="testing-lab", limit=15)` → returns SCTIMST, ETDC, SGS
→ `search_resources(type="certification-body", limit=10)` → returns CDSCO details
→ `get_grants(category="healthcare")` → returns BIRAC BIG, DBT PACE

Returns:
- Classification: Class C (active diagnostic device, cardiac) under MDR 2017
- Manufacturing licence: Form MD-7 required; ISO 13485 QMS at manufacturing site
- IEC 60601-1 (general safety) + IEC 60601-2-47 (ambulatory ECG) testing required
- SaMD: AI algorithm classification under CDSCO SaMD guidance — submit AI/ML documentation
- Recommended lab: ETDC Bangalore for electronics; SCTIMST for clinical performance
- Timeline: 12–18 months for Class C with manufacturing licence
- Cost estimate: ₹30–60L (testing + registration + consultant + QMS setup)
- BIRAC BIG: eligible — apply while developing (rolling intake)
- WPC approval needed for Bluetooth — coordinate with BIS/certification-path-india skill

## Usage by platform

### Claude Code
```
/skill hardware/medical-device-pathway
```
Describe the device, intended clinical use, and whether you're importing or manufacturing in India.

### Codex / OpenAI agents
Load `skills/hardware/medical-device-pathway.md` and call with device context.

### Manual (any LLM)
Copy the prompt template, replace [PLACEHOLDERS], send with MCP server active.

## Notes
- MDR 2017 is regularly updated — verify current notified device list on CDSCO portal
- SUGAM portal registration is required before any CDSCO application
- "Own account" import (for clinical evaluation purposes) has a separate exemption — investigate before committing to full registration for small import quantities
- Class A devices: many are exempt from licensing — confirm with CDSCO or consultant before starting the full process
- Cybersecurity requirements for connected medical devices are now being enforced — include in testing plan
