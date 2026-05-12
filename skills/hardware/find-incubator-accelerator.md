---
name: find-incubator-accelerator
version: 1.0.0
description: Match a hardware startup's stage and domain to the right Indian incubator, accelerator, or government program
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
  - incubator
  - accelerator
  - startup
  - funding
  - government
security_status: unverified
verified_by: ""
last_reviewed: ""
---

# Find Incubator / Accelerator (India)

## When to use
Use this skill when a hardware startup or maker needs to find the right support program for their current stage. Covers government-backed incubators (TIDE 2.0, BIRAC BIG, NIDHI), IIT/IISc TBIs, private accelerators, and corporate programs. Matches product domain, team stage, and geography to concrete programs with application status and eligibility.

## Prompt template

```
You are matching a hardware startup to Indian incubation and acceleration programs.

Startup details:
- Product: [PRODUCT_DESCRIPTION]
- Domain: [HEALTHTECH / AGRITECH / CLEANTECH / DEFENCETECH / CONSUMER_ELECTRONICS / INDUSTRIAL / OTHER]
- Stage: [IDEA / MVP / PROTOTYPE / REVENUE]
- Team: [SOLO_FOUNDER / TEAM_OF_N]
- Location: [CITY, STATE] (or "open to relocate: YES/NO")
- Indian entity: [YES / NO / PLANNED]
- Prior funding: [NONE / BOOTSTRAPPED / ANGEL / SEED]
- Seeking: [LAB_ACCESS / MENTORSHIP / FUNDING / ALL]

== STEP 1: Government programs (high value, apply first) ==

search_resources(type="incubator", limit=20)
search_resources(type="accelerator", limit=20)
get_grants(category="[DOMAIN]")

Priority government programs for hardware:
| Program | Focus | Stage | Funding | Apply at |
|---------|-------|-------|---------|----------|
| BIRAC BIG (₹50L) | Biomedical, healthcare | Idea/MVP | ₹50L grant | birac.nic.in |
| TIDE 2.0 | Technology, IoT, AI | Idea/Proto | Up to ₹75L | tide.stpi.in |
| NIDHI EIR | Deep tech | Idea | ₹30L/year stipend | nstedb.gov.in |
| NIDHI PRAYAS | Hardware proto | Proto | ₹10L proto grant | nstedb.gov.in |
| Startup India Seed Fund | All sectors | MVP | ₹20L | startupindia.gov.in |
| DPIIT recognition | All | Any | Tax benefits | dpiit.gov.in |
| MeitY SAMRIDH | IT/software | Any | ₹40L | samridh.meity.gov.in |
| iCreate | Electronics, IoT | Idea/Proto | Lab + funding | icreateindia.org |

For the given domain and stage, identify the 3 most relevant programs.

== STEP 2: IIT/IISc TBIs (technology incubators) ==

Filter results from Step 1 for university-affiliated TBIs.

Key hardware-friendly TBIs:
- IIT Bombay — SINE (strong in sensors, robotics, medtech)
- IIT Delhi — FITT (electronics, cleantech)
- IIT Madras — IITM Incubation Cell (healthtech, agritech)
- IISc Bangalore — Society for Innovation and Development (deep tech)
- IIT Kharagpur — IIT KGP Foundation (agri, industrial)
- IIT Kanpur — SIIC (space tech, defence)
- NSRCEL IIM Bangalore (social enterprise, cleantech)

For location [CITY/STATE], identify the closest relevant TBI.

== STEP 3: Private accelerators ==

Top Indian hardware accelerators:
| Program | Focus | Duration | Equity | Funding |
|---------|-------|----------|--------|---------|
| iSPIRT (non-equity) | Enterprise SaaS | 6 mo | 0% | None |
| Forge (ITC) | Agritech, cleantech | 6 mo | 5–7% | ₹25L |
| KIIT TBI | Healthcare, IoT | 12 mo | 3–5% | ₹15–30L |
| Indigram Labs (IARI) | Agritech hardware | 12 mo | 0% govt | Lab access |
| HUL Prarambh | FMCG innovation | 6 mo | 0% | ₹5–20L |
| Qualcomm Design in India | Semiconductor | 12 mo | 0% | ₹30L |

For hardware specifically, also check:
search_resources(type="accelerator", city="[CITY]", limit=10)
get_resource(slug="[ACCELERATOR_SLUG]")

== STEP 4: Recommendation ==

Based on the startup's stage, domain, and location, provide:

**Top 3 immediate actions:**
1. [Most accessible program] — apply by [window] — [reason it fits]
2. [Best for their domain] — apply by [window] — [reason]
3. [If no equity preferred] — [government grant path]

**Timeline:**
- Within 1 month: DPIIT recognition (always do this first — unlocks other programs)
- Within 3 months: Apply to [recommended programs]
- Within 6 months: Expected outcome and next decision point

**Avoid:**
- Programs requiring equity if government grant path is available at this stage
- Relocating before validating product-market fit
```

## MCP tool calls
1. `search_resources(type="incubator", limit=20)`
2. `search_resources(type="accelerator", limit=20)`
3. `get_grants(category="[DOMAIN]")`
4. `get_resource(slug="[INCUBATOR_SLUG]")` — for full program details

## Example

Input: "Medical device startup, AI-powered diagnostic device for rural health, prototype working, team of 3, based in Hyderabad, open to Bangalore, no prior funding"

→ `search_resources(type="incubator", limit=20)` → returns 15 incubators
→ `search_resources(type="accelerator", limit=20)` → returns 8 accelerators
→ `get_grants(category="healthcare")` → returns BIRAC BIG, NIDHI PRAYAS, T-Hub

Returns:
- BIRAC BIG: ₹50L grant for biomedical hardware — apply immediately (rolling intake) — strongest fit
- T-Hub Hyderabad: local, free lab access, connects to Telangana government programs
- NIDHI PRAYAS: ₹10L prototype grant through CSIR CCMB Hyderabad (MedTech focus)
- DPIIT recognition: apply first (1 week, free) — unlocks Startup India benefits
- Avoid: private accelerators with equity at this stage when government grant path is clear

## Usage by platform

### Claude Code
```
/skill hardware/find-incubator-accelerator
```
Describe your product domain, current stage, location, and what you need most.

### Codex / OpenAI agents
Load `skills/hardware/find-incubator-accelerator.md` and call with startup context.

### Manual (any LLM)
Copy the prompt template, replace [PLACEHOLDERS], send with MCP server active.

## Notes
- Program cycles change — always verify application windows on official sites
- DPIIT recognition is always the first step — it's free, fast, and a prerequisite for many schemes
- BIRAC and NIDHI programs require Indian entity (Pvt Ltd or LLP) — incorporate before applying
- Many IIT TBIs have a "no equity" cohort for pre-revenue startups — ask specifically
- Government schemes often have state-specific variants (e.g. T-Hub in Telangana, Kerala Startup Mission) — explore state programs in addition to central ones
