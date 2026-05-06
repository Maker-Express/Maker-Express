# Contributing to the Hardware Ecosystem Directory

Resources live as **Markdown files** in [`resources/`](resources/) and [`funding/`](funding/).
Each file covers one resource type. You contribute by adding a `###` section.

---

## Quick start (5 minutes)

1. **Fork** this repo and clone it locally
2. **Open** the right file — e.g. `resources/testing_lab.md` for a testing lab
3. **Append** a new `###` section using the template below
4. **Validate**: `python3 scripts/validate_md.py resources/`
5. **Open a PR** — CI validates automatically

---

## Entry format

Every resource is a `###` section with a metadata table:

```markdown
### Name of the Resource

| Field | Value |
|-------|-------|
| **Slug** | `unique-slug-here` |
| **Location** | City, State |
| **Access** | L1 — Open (fee-based) |
| **Website** | https://example.com |
| **Email** | contact@example.com |
| **Equipment** | CNC Mill, Laser Cutter |
| **Certifications** | ISO 17025, NABL |
| **Tags** | emc, nabl, electronics |

One or two sentences describing what this resource offers.

---
```

### Required fields

| Field | Rules |
|-------|-------|
| `Slug` | Lowercase letters, numbers, hyphens only. Min 3 chars. Globally unique. Example: `iit-bombay-ncair` |
| `Location` | `City, State` — comma-separated. Example: `Bangalore, Karnataka` |
| `Access` | `L0 — Open public` / `L1 — Open (fee-based)` / `L2 — Registered / membership` / `L3 — Institutional / referral` / `L4 — Restricted / clearance` |

### Access levels

| Level | Meaning |
|-------|---------|
| L0 | Free, walk-in public access |
| L1 | Open to anyone who pays |
| L2 | Requires membership or registration |
| L3 | Institutional access or referral needed |
| L4 | Restricted: clearance or invite-only |

---

## Which file to edit?

| File | Type |
|------|------|
| `testing_lab.md` | Testing & certification labs |
| `pcb_fab.md` | PCB fabrication |
| `makerspace.md` | Makerspaces / FabLabs |
| `component_supplier.md` | Component suppliers |
| `manufacturer.md` | Contract manufacturers |
| `research_lab.md` | University and government R&D |
| `certification_body.md` | BIS, STQC, CDSCO and similar |
| `incubator.md` / `accelerator.md` | Startup programs |
| `laser_scanning.md` | 3D laser scanning / metrology |
| `govt_lab.md` | Government labs (CSIR, DRDO) |

---

## Slug rules

- Lowercase `a-z`, `0-9`, hyphens only
- Pattern: `org-name-city` or `org-full-name`
- Must be globally unique across all files
- Min 3 chars

Good: `iit-bombay-ncair`, `stqc-bangalore`
Bad: `test-lab-1`, `Lab in Mumbai`

---

## PR checklist

- [ ] Entry is in the correct `.md` file
- [ ] All required fields present (slug, location, access)
- [ ] `python3 scripts/validate_md.py resources/` passes
- [ ] Website URL is reachable (if provided)
- [ ] Description is factual, neutral — no marketing copy
